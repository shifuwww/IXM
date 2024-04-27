import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from 'src/entities';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { RedisClientService } from 'src/core/redis-client/redis-client.service';
import { SmtpService } from 'src/core/smtp/smtp.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly repository: Repository<TokenEntity>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly redisService: RedisClientService,
    private readonly smtpService: SmtpService,
  ) {}
}
