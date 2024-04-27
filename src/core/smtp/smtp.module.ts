import { DynamicModule, Module } from '@nestjs/common';
import { SmtpService } from './smtp.service';
import { SMTP_OPTIONS, SmtpAsyncOptions } from './smtp.config';

@Module({})
export class SmtpModule {
  static forRootAsync(options: SmtpAsyncOptions): DynamicModule {
    return {
      module: SmtpModule,
      imports: options.imports,
      providers: [
        {
          provide: SMTP_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        SmtpService,
      ],
      exports: [SmtpService],
    };
  }
}
