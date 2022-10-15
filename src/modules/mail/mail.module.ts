import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MAIL } from 'src/settings';
import { MailService } from './mail.service';
import * as path from 'path';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: MAIL.HOST,
        port: MAIL.PORT,
        secure: false,
        auth: {
          user: MAIL.USER,
          pass: MAIL.PASS
        }
      },
      template: {
        dir: path.resolve(__dirname, '..', '..', 'mail', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true
        }
      }
    })
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
