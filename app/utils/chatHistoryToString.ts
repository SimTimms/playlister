import { ChatHistory } from '../types/';
const chatHistoryToString = (chatHistory: ChatHistory[]): string => {
  const chatMessages = [];
  for (const chat of chatHistory) {
    const { logMessage, aiResponse } = chat;
    const message = `User: ${logMessage}\nBot: ${aiResponse}\n`;
    chatMessages.push(message);
  }
  return chatMessages.join('\n');
};

export default chatHistoryToString;
