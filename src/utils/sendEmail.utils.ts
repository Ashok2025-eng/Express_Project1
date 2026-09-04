import { MailOptions } from "nodemailer/lib/json-transport";
import ENV_CONFIG from "../config/env.config";
import transporter from "../config/nodemailer.config";

interface IMailOption {
  to: string | string[];
  subject: string;
  html: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: any[];
}

export const sendEmail = async ({
  to,
  subject,
  html,
  cc,
  bcc,
  attachments,
}: IMailOption) => {
  try {
    const options: MailOptions = {
      from: ENV_CONFIG.SMTP_MAIL_FROM,
      to,
      subject,
      //   text:''
      html,
    };

    if (cc) {
      options["cc"] = cc;
    }

    if (bcc) {
      options["bcc"] = bcc;
    }
    if (attachments) {
      options["attachments"] = attachments;
    }

    await transporter.sendMail(options);

    console.log("mail sent");
  } catch (error) {
    console.log(error);
  }
};
