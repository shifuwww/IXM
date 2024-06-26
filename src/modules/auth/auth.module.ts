import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from 'src/common/configs/jwt.config';
import { TokenEntity } from 'src/entities';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { SmtpModule } from 'src/core/smtp/smtp.module';
import SMTP_CONFIG from 'src/common/configs/smtp.config';
import { AuthController } from './auth.controller';
import { AtStrategy, RtStrategy } from './strategies';

@Module({
  imports: [
    TypeOrmModule.forFeature([TokenEntity]),
    JwtModule.registerAsync(jwtConfig),
    SmtpModule.forRootAsync(SMTP_CONFIG.asProvider()),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
})
export class AuthModule {}
