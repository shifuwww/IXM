import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { config } from '@vue-email/compiler';
import { createTransport, Transporter } from 'nodemailer';

import { join } from 'path';
import { SMTP_OPTIONS, SmtpOptions } from './smtp.config';

interface Result {
  html: string;
  text: string;
}

const vueEmail = config(join(__dirname, './templates'));

@Injectable()
export class SmtpService implements OnModuleInit {
  transport: Transporter;
  private _Logger = new Logger(SmtpService.name);

  constructor(
    @Inject(SMTP_OPTIONS) private readonly smtpOptions: SmtpOptions,
  ) {}

  onModuleInit() {
    this.transport = createTransport({
      host: this.smtpOptions.host,
      port: this.smtpOptions.port,
      auth: {
        user: this.smtpOptions.auth.user,
        pass: this.smtpOptions.auth.pass,
      },
    });
  }

  public async sendConfirmation(to: string, code: string) {
    try {
      const template = await vueEmail.render('ConfirmEmail.vue', {
        props: { code },
      });

      return this.send(to, template);
    } catch (err) {
      this._Logger.error(err);
      throw err;
    }
  }

  public async sendResetPassword(to: string, url: string) {
    try {
      const template = await vueEmail.render('ResetPassword.vue', {
        props: { url },
      });

      return this.send(to, template);
    } catch (err) {
      this._Logger.error(err);
      throw err;
    }
  }

  private async send(to: string, template: Result) {
    await this.transport.sendMail({
      from: `<${this.smtpOptions.from}>`,
      to,
      subject: 'Subject',
      ...template,
    });
  }
}
