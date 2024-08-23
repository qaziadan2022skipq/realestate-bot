import { NextResponse } from "next/server";
import OpenAI from "openai/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const thread = await openai.beta.threads.create();
    console.log(thread.id);

    return NextResponse.json(thread.id, { status: 200 });
  } catch (error) {
    console.log("[THREAD_CREATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
