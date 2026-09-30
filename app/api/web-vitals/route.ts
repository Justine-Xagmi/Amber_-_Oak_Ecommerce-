import { NextResponse } from "next/server";

export const runtime = "edge";

interface WebVitalPayload {
  name: string;
  value: number;
  id: string;
  rating: "good" | "needs-improvement" | "poor";
  navigationType?: string;
  path: string;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as WebVitalPayload;

    // No PII is collected — just metric name/value/rating and the path.
    // Swap this for a write to your metrics provider (Datadog, Axiom,
    // a Vercel Analytics ingest, a database) in a production deployment.
    console.log(`[web-vitals] ${payload.name}=${payload.value.toFixed(2)} (${payload.rating}) on ${payload.path}`);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
