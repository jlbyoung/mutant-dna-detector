import { getStats } from "@/lib/infra/repository";

export async function GET(): Promise<Response> {
  return Response.json(await getStats());
}
