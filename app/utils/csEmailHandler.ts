import sendEmail from '../services/mailjet/sendEmail';
import { MailjetSendEmail } from '../types';
import createHTMLEmail from '../utils/createHTMLEmail';
import vellumSummariseChat from '../services/vellum/vellumSummariseChat';
import vellumSummariseSubject from '../services/vellum/vellumSummariseSubject';
import getChatHistory from '../services/logs/getChatHistory';
import chatHistoryToString from '../utils/chatHistoryToString';
import isValidJSON from './isValidJSON';
export interface EmailInput {
  sessionId: string;
  userEmail?: string;
  cognitoAccountEmail?: string;
  invoiceNumber?: string;
}

const csEmailHandler = async ({
  sessionId,
  userEmail,
  cognitoAccountEmail,
  invoiceNumber,
}: EmailInput) => {
  //Get Chat History
  const chatHistory = await getChatHistory(
    process.env.LOG_API_URL as string,
    sessionId
  );
  const chatHistoryString = chatHistoryToString(chatHistory);

  //Get AI to summarise the chat history and subject
  const aiSummarisedHistory = await vellumSummariseChat(chatHistoryString);

  const aiSummary = aiSummarisedHistory[0].value as string;
  const aiSummarySubject = await vellumSummariseSubject(aiSummary);

  //This check could and should be handled in Vellum, as a fallback if the JSON isn't valid then the email will still send
  let aiSubjectJSON = {
    subject: '',
    tag: '',
    action: '',
  };

  if (!isValidJSON(aiSummarySubject[0].value as string)) {
    aiSubjectJSON = {
      subject: 'INVALID RESPONSE',
      tag: 'INVALID RESPONSE',
      action: 'INVALID RESPONSE',
    };
  } else {
    aiSubjectJSON = JSON.parse(aiSummarySubject[0].value as string);
  }

  const aiSubject = aiSubjectJSON.subject;
  const aiTag = aiSubjectJSON.tag;
  const aiAction = aiSubjectJSON.action;
  const chatHistoryHTML = chatHistoryString.replace(/\n/g, '<br/>');

  // Create the email object
  const csEmail: MailjetSendEmail = {
    subject: `[SUPPORT ESCALATION] - ${aiTag} - ${aiSubject} - from ${userEmail}`,
    htmlMessage: '',
    message: '',
    recipientEmail: process.env.MAILJET_CUSTOMER_SUPPORT_EMAIL as string,
    recipientName: 'Technical Support',
    senderEmail: process.env.MAILJET_SENDER_EMAIL as string,
    senderName: 'noreply@cognitoedu.org',
    mailjetKey: process.env.MAILJET_API_KEY as string,
    mailjetSecret: process.env.MAILJET_API_SECRET as string,
  };

  csEmail.message = `${aiSummary}\n${chatHistoryString}`;
  csEmail.htmlMessage = createHTMLEmail(
    aiSummary,
    chatHistoryHTML,
    aiTag,
    aiAction,
    userEmail || '',
    cognitoAccountEmail || '',
    invoiceNumber || '',
    aiSubject
  );

  // Run email sending asynchronously without blocking the execution
  setImmediate(() => sendEmail(csEmail));
};

export default csEmailHandler;
