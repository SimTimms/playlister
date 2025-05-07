import { VellumClient } from "vellum-ai";

let vellumClientInstance: VellumClient | null = null;

async function vellumClient(apiKey: string): Promise<VellumClient> {
  if (!apiKey) {
    throw new Error("API Key is not defined");
  }
  if (!vellumClientInstance) {
    vellumClientInstance = new VellumClient({
      apiKey,
    });
  }

  return vellumClientInstance; // Return the Vellum client instance
}

export default vellumClient;
