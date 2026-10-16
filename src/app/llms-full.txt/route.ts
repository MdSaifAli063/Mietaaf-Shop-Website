import { llmsFullReference, llmsResponse } from "@/lib/llm-reference";

export const revalidate = 300;

export async function GET() {
  return llmsResponse(await llmsFullReference());
}
