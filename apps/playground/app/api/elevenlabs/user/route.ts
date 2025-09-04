import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decryptApiKey } from "@/lib/crypto";

const COOKIE_NAME = "el_session";

/**
 * GET /api/elevenlabs/user
 * Get ElevenLabs user information using stored API key
 */
export async function GET() {
  try {
    // Get encrypted API key from cookie
    const cookieStore = await cookies();
    const encryptedKey = cookieStore.get(COOKIE_NAME)?.value;

    if (!encryptedKey) {
      return NextResponse.json(
        { error: "No API key configured" },
        { status: 401 }
      );
    }

    // Decrypt the API key
    let apiKey: string;
    try {
      apiKey = await decryptApiKey(encryptedKey);
    } catch (error) {
      console.error("Failed to decrypt API key:", error);
      return NextResponse.json(
        { error: "Failed to decrypt API key" },
        { status: 500 }
      );
    }

    // Fetch user data from ElevenLabs
    const response = await fetch("https://api.elevenlabs.io/v1/user", {
      headers: {
        "xi-api-key": apiKey,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: response.status }
      );
    }

    const userData = await response.json();

    // Return user data (excluding sensitive info)
    return NextResponse.json({
      user_id: userData.user_id,
      first_name: userData.first_name,
      subscription: {
        tier: userData.subscription.tier,
        character_count: userData.subscription.character_count,
        character_limit: userData.subscription.character_limit,
      },
      is_onboarding_completed: userData.is_onboarding_completed,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user information" },
      { status: 500 }
    );
  }
}
