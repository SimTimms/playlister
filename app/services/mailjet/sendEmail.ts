import Mailjet from 'node-mailjet';
import { MailjetSendEmail } from '../../types/';

const sendEmail = ({
  subject,
  htmlMessage,
  message,
  recipientEmail,
  recipientName,
  senderEmail,
  senderName,
  mailjetKey,
  mailjetSecret,
}: MailjetSendEmail): void => {
  setImmediate(async () => {
    try {
      const mailjet = Mailjet.apiConnect(mailjetKey || '', mailjetSecret || '');
      await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: { Email: senderEmail, Name: senderName },
            To: [{ Email: recipientEmail, Name: recipientName }],
            Subject: subject,
            TextPart: message,
            HTMLPart: htmlMessage,
          },
        ],
      });
      console.log('Email Sent');
    } catch (error) {
      console.warn('Failed to send email', error);
    }
  });
};

export default sendEmail;
