import { ModuleMetadata } from '@nestjs/common';

export const SMTP_OPTIONS = Symbol('SMTP_OPTIONS');

export interface SmtpOptions {
  from: string;
  host: string;
  port: number;
  send: string;
  auth: {
    user: string;
    pass: string;
  };
}

export interface SmtpAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory: (...args) => Promise<SmtpOptions> | SmtpOptions;
  imports?: any[];
}
