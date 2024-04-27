import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity, UserEntity } from 'src/entities';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { RedisClientService } from 'src/core/redis-client/redis-client.service';
import { SmtpService } from 'src/core/smtp/smtp.service';
import * as crypto from 'crypto';
import { SignInDto, SignUpDto, SignUpRequestDto } from './dto';
import {
  RT_AUTH_COOKIE_NAME,
  SIGN_UP_TTL_SECONDS,
} from 'src/common/const/auth';
import { generateCode } from 'src/common/utils/generate-code';
import { IAtJwt, ISign, ISignData } from 'src/common/interfaces/auth';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(TokenEntity)
    private readonly repository: Repository<TokenEntity>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly redisService: RedisClientService,
    private readonly smtpService: SmtpService,
    private readonly configService: ConfigService,
  ) {}

  public async refresh(refreshToken: string): Promise<ISign> {
    try {
      const payload: IAtJwt = await this.jwtService.verifyAsync(refreshToken);

      const token = await this.repository.findOne({
        where: { token: refreshToken },
      });

      if (!token) {
        throw new ForbiddenException('Access Denied');
      }

      const [at, rt] = await Promise.all([
        await this.jwtService.signAsync(payload, {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: `${this.configService.get<string>('JWT_ACCESS_TOKEN_TTL')}s`,
        }),
        await this.jwtService.signAsync(payload, {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: `${this.configService.get<string>(
            'JWT_REFRESH_TOKEN_TTL',
          )}s`,
        }),
      ]);

      await this.repository.update({ token: refreshToken }, { token: rt });

      return { accessToken: at, refreshToken: rt };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async signIn(signInDto: SignInDto): Promise<ISign> {
    const { email, password } = signInDto;
    try {
      const user = await this.userService.getUserByEmail(email);

      if (!user) {
        throw new NotFoundException(`User with email: ${email} does not exist`);
      }

      const isPasswordMatches = await this.compare(password, user.password);

      if (!isPasswordMatches) {
        throw new UnauthorizedException('Password or email is incorrect');
      }

      return await this.getTokens(user);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async logout(refreshToken: string): Promise<void> {
    try {
      await this.repository.delete({ token: refreshToken });
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async signUp(signUpDto: SignUpDto): Promise<ISign> {
    const { email } = signUpDto;
    try {
      if (await this.userService.getUserByEmail(email)) {
        throw new ConflictException(`User with email:${email} already exists`);
      }
      const request = await this.redisService.get<ISignData>(email);

      if (!request) {
        throw new NotFoundException(
          'Your sign up request is not valid anymore',
        );
      }

      if (request.code !== signUpDto.code) {
        throw new ConflictException('Code is not valid!');
      }

      const password = await this.hashPassword(request.password);

      const user = await this.userService.createUser({ email, password });
      const tokens = await this.getTokens(user);

      return tokens;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async signUpRequest(signUpRequestDto: SignUpRequestDto) {
    const { email, password } = signUpRequestDto;
    try {
      if (await this.userService.getUserByEmail(email)) {
        throw new ConflictException(`User with email:${email} already exists`);
      }
      const request = await this.redisService.get<ISignData>(email);

      if (!request) {
        const code = generateCode();

        await this.redisService.set(
          email,
          {
            code,
            password,
            timeToSend: Date.now(),
          },
          SIGN_UP_TTL_SECONDS,
        );

        await this.smtpService.sendConfirmation(email, code);
      } else {
        const timeDifference = Math.floor(
          (Date.now() - request.timeToSend) / 1000,
        );

        if (timeDifference < 60) {
          throw new ConflictException(
            `You can resend message after ${60 - timeDifference}s`,
          );
        }
        const code = generateCode();

        await this.redisService.set(
          email,
          {
            code,
            password,
            timeToSend: Date.now(),
          },
          SIGN_UP_TTL_SECONDS,
        );

        await this.smtpService.sendConfirmation(email, code);
      }
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  private async getTokens(user: UserEntity): Promise<ISign> {
    const jwtPayload: IAtJwt = {
      sub: user.id,
      email: user.email,
    };

    try {
      const [at, rt] = await Promise.all([
        await this.jwtService.signAsync(jwtPayload, {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: `${this.configService.get<string>('JWT_ACCESS_TOKEN_TTL')}s`,
        }),
        await this.jwtService.signAsync(jwtPayload, {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: `${this.configService.get<string>(
            'JWT_REFRESH_TOKEN_TTL',
          )}s`,
        }),
      ]);

      return {
        accessToken: at,
        refreshToken: rt,
      };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  private async hashPassword(target: string): Promise<string> {
    try {
      const salt = await this.generateSalt();
      const hash = await this.hashWithSalt(target, salt);

      return `${salt}:${hash}`;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  private async generateSalt(): Promise<string> {
    return crypto.randomBytes(10).toString('hex');
  }

  private async hashWithSalt(hash: string, salt: string): Promise<string> {
    const _hash = crypto.createHmac('sha256', salt);
    _hash.update(hash);
    return _hash.digest('hex');
  }

  private async compare(target: string, hash: string): Promise<boolean> {
    const [salt, storedHash] = hash.split(':');

    const hashOfInput = await this.hashWithSalt(target, salt);

    return hashOfInput === storedHash;
  }

  public async setCookie(response: Response, token: string | null) {
    response.cookie(RT_AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      expires: token
        ? new Date(
            Date.now() +
              +this.configService.get('JWT_REFRESH_TOKEN_TTL') * 1000,
          )
        : new Date(Date.now() - 1000),
      path: '/',
    });
  }
}
