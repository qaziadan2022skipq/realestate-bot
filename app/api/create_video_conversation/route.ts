import { createConversationOptions } from "@/lib/utils";
import axios from "axios";
import { NextResponse } from "next/server";

const API_KEY = process.env.TAVUS_API_KEY;

export async function POST(req: Request) {
  try {
    if (!API_KEY) {
      return new NextResponse("TAVUS API key is Invalid", { status: 500 });
    }

    const options = {
      method: "POST",
      headers: {
        "x-api-key": "0a97f1ee09d04f85b871bfd8dbf2a02e",
        "Content-Type": "application/json",
      },
      body: '{"persona_id":"pd85ee04","replica_id":"r637f47b21","conversational_context":"You’re about to speak to a member of StudyRealEstate. The member is either a real estate student, licensed registrant, team leader, or vendor serving the real estate industry. Each member is here to learn, grow, and succeed in their respective roles, and they’re looking for friendly, knowledgeable guidance to help them on their journey. When you first meet the member, ask their name and say it back to them in a friendly welcome message. Avoid commenting on their appearance or surroundings as it can come off creepy. Simply answer honestly if they ask if you can hear and see them, and reassure them that you are there to help them with any real estate questions they may have."}',
    };

    const response = await fetch(
      "https://tavusapi.com/v2/conversations",
      options
    );
    const data = await response.json();
    console.log(data)
    return NextResponse.json({data:data}, { status: 200 });
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
