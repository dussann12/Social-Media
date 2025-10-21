import { Injectable } from "@nestjs/common"
import { MailerService } from "@nestjs-modules/mailer"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}
    
    public async sendVerificationEmail(email: string, code: string): Promise<void> {
  await this.mailerService.sendMail({
    to: email,
    subject: 'Verify your email',
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <b>${code}</b></p>`,

        })

        .then(() => {})
        .catch(() => {});
    }

}
