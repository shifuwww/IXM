import { ConfigModule, ConfigService } from '@nestjs/config';

export const jwtConfig = {
  imports: [ConfigModule.forRoot()],
  useFactory: (configService: ConfigService) => {
    return {
      global: true,
      secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
      secretRefresh: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      accessTokenTtl: configService.get('JWT_ACCESS_TOKEN_TTL') || 600,
      refreshTokenTtl: configService.get('JWT_ACCESS_TOKEN_TTL') || 604800,
    };
  },
  inject: [ConfigService],
};
