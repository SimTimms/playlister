export type ChatHistory = {
  _id: string;
  logMessage: string;
  aiResponse: string;
  sessionId: string;
  logType: string;
  createdAt: string;
  updatedAt: string;
};

export type MailjetSendEmail = {
  subject: string;
  htmlMessage: string;
  message: string;
  recipientEmail: string;
  recipientName: string;
  senderEmail: string;
  senderName: string;
  mailjetKey: string;
  mailjetSecret: string;
};
