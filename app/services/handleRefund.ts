import createLogService from "./logs/createLogService";
import { LOG_TYPES } from "../types/enums";

const handleRefund = async (
  question: string,
  aiAnswer: string,
  sessionId: string
): Promise<string> => {
  let adjustedAiAnswer = aiAnswer;

  adjustedAiAnswer = `Sorry to hear that — I can't issue refunds directly, but I can definitely pass this to our support team to sort it out. <br/>Before I do that, I just need a few details from you: <ol><li>The <b>email address</b> you'd like us to reply to.</li><li>The <b>email linked to your Cognito account</b> (if it's different)</li><li>your <b>invoice number</b> — that'll be in your confirmation email and looks like this: 'COG-12345'</li></ol>`;

  createLogService(
    process.env.LOG_API_URL as string,
    question,
    aiAnswer,
    sessionId,
    LOG_TYPES.REFUND
  );
  return adjustedAiAnswer;
};

export default handleRefund;
