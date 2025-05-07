import vellumChatResponse from "../vellum/vellumChatResponse";

const getAiAnswer = async (question: string): Promise<string> => {
  const aiAnswer = await vellumChatResponse(question).catch((error) => {
    console.error("Error in vellumChatResponse:", error);
    return "";
  });

  const reducedAnswer =
    aiAnswer.length > 0 && typeof aiAnswer[0] !== "string"
      ? String(aiAnswer[0].value)
      : "";

  return reducedAnswer;
};

export default getAiAnswer;
