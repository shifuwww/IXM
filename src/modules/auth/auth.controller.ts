import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto, SignUpRequestDto, SingResponseDto } from './dto';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @ApiOperation({ summary: 'Sign up request' })
  @HttpCode(HttpStatus.OK)
  @Post('sign-up-request')
  public async signUpRequest(@Body() dto: SignUpRequestDto) {
    return await this.service.signUpRequest(dto);
  }

  @ApiOperation({ summary: 'Sign up' })
  @HttpCode(HttpStatus.CREATED)
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
