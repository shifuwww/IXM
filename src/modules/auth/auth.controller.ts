import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto, SignUpRequestDto, SingResponseDto } from './dto';
import { Response, Request } from 'express';
import { RT_AUTH_COOKIE_NAME } from 'src/common/const/auth';
import { RtGuard } from './guards';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @ApiOperation({ summary: 'Sign in' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    type: SignUpRequestDto,
  })
  @Post('sign-in')
  public async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.service.signIn(dto);
    await this.service.setCookie(response, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @ApiResponse({
    status: 204,
  })
  @ApiCookieAuth()
  @ApiOperation({ summary: 'user logout' })
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const token = req.cookies[RT_AUTH_COOKIE_NAME];
    await this.service.setCookie(res, null);
    return this.service.logout(token);
  }

  @ApiResponse({
    status: 200,
  })
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Refresh tokens' })
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  public async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SingResponseDto> {
    const token = req.cookies[RT_AUTH_COOKIE_NAME];
    const tokens = await this.service.refresh(token);
    await this.service.setCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @ApiOperation({ summary: 'Sign up request' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
  })
  @Post('sign-up-request')
  public async signUpRequest(@Body() dto: SignUpRequestDto) {
    return await this.service.signUpRequest(dto);
  }

  @ApiOperation({ summary: 'Sign up' })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    type: SignUpRequestDto,
  })
  @Post('sign-up')
  public async signUp(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SingResponseDto> {
    const tokens = await this.service.signUp(dto);
    await this.service.setCookie(response, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }
}
