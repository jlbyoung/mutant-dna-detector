import { isMutant } from "@/lib/domain/isMutant";
import { validateDna, InvalidDnaError } from "@/lib/domain/validateDna";
import { hashDna } from "@/lib/infra/hash";
import { recordDna } from "@/lib/infra/repository";

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const dna = (body as { dna?: unknown })?.dna;

  try {
    validateDna(dna);
  } catch (e) {
    if (e instanceof InvalidDnaError) {
      return Response.json({ error: e.message }, { status: 400 });
    }
    throw e;
  }

  const mutant = isMutant(dna);
  await recordDna(hashDna(dna), mutant);

  return new Response(null, { status: mutant ? 200 : 403 });
}
