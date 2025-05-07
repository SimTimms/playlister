import createLogService from './logs/createLogService';
import { LOG_TYPES } from '../types/enums';
import csEmailHandler from '../utils/csEmailHandler';

const escalateToHuman = async (
  question: string,
  aiAnswer: string,
  sessionId: string,
  emailAddress?: string
): Promise<string> => {
  let adjustedAiAnswer = aiAnswer;

  await createLogService(
    process.env.LOG_API_URL as string,
    question,
    adjustedAiAnswer,
    sessionId,
    LOG_TYPES.ESCALATE
  );
  console.log('Escalate to Human: ', emailAddress);
  //REQUIRES A CHECK TO SEE IF AN EMAIL HAS ALREADY BEEN SENT - THIS WILL PREVENT THE EMAIL FROM BEING SPAMMED
  if (emailAddress) {
    console.log('Email Address Captured: ', emailAddress);
    try {
      const emailConfig = {
        sessionId: sessionId,
        userEmail: emailAddress,
        cognitoAccountEmail: '',
        invoiceNumber: '',
      };
      setImmediate(() => csEmailHandler(emailConfig));
    } catch (error) {
      return adjustedAiAnswer;
    }
    adjustedAiAnswer =
      'Thank you, we have sent your request and you will hear back soon. ';
  }
  console.log('Email Address NOT Captured: ', emailAddress);

  return adjustedAiAnswer;
};

export default escalateToHuman;
