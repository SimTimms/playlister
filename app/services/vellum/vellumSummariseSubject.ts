import vellumClient from "./vellumClient";
import { Vellum } from "vellum-ai";

async function vellumSummariseSubject(conversationSummary: string) {
  const vellumClientInstance = await vellumClient(
    process.env.VELLUM_API_KEY as string
  );

  const workflowDeploymentName = "chat-bot-email-subject";
  const releaseTag = "LATEST";
  const inputs: Vellum.WorkflowRequestInputRequest[] = [
    {
      type: "STRING",
      name: "subject",
      value: conversationSummary,
    },
  ];

  // setup the workflow
  const request: Vellum.ExecuteWorkflowRequest = {
    workflowDeploymentName,
    releaseTag,
    inputs,
  };

  // execute the workflow
  const result = await vellumClientInstance.executeWorkflow(request);

  if (result.data.state === "REJECTED") {
    console.warn("Vellum rejected this workflow");
    return [];
  }

  return result.data.outputs;
}

export default vellumSummariseSubject;
