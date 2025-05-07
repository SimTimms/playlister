import vellumClient from "./vellumClient";
import { Vellum } from "vellum-ai";

async function vellumHandleRefund(userMessage: string): Promise<any[]> {
  const vellumClientInstance = await vellumClient(
    process.env.VELLUM_API_KEY as string
  );

  // configurable parameters
  const workflowDeploymentName = "handle-refund";
  const releaseTag = "LATEST";
  const inputs: Vellum.WorkflowRequestInputRequest[] = [
    {
      type: "STRING",
      name: "user-input",
      value: userMessage,
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

export default vellumHandleRefund;
