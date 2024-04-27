import { registerAs } from '@nestjs/config';
import { SmtpOptions } from 'src/core/smtp/smtp.config';

export default registerAs('SMTP_CONFIG', (): SmtpOptions => {
  return {
    from: process.env.SMTP_FROM,
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    send: process.env.SMTP_SEND,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_APP_PASSWORD,
    },
  };
});
