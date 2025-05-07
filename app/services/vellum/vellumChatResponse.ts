import vellumClient from './vellumClient';
import { Vellum } from 'vellum-ai';

async function vellumChatResponse(question: string): Promise<any[]> {
  const vellumClientInstance = await vellumClient(
    process.env.VELLUM_API_KEY as string
  );

  // configurable parameters
  const workflowDeploymentName = 'chatbot-workflow';
  const releaseTag = 'LATEST';
  const inputs: Vellum.WorkflowRequestInputRequest[] = [
    {
      type: 'STRING',
      name: 'question',
      value: question,
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

  if (result.data.state === 'REJECTED') {
    console.warn('Vellum rejected this workflow', result.data);
    return [];
  }

  return result.data.outputs;
}

export default vellumChatResponse;
