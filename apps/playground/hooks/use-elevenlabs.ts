"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

interface ElevenLabsUser {
  subscription: {
    tier: string;
    character_count: number;
    character_limit: number;
  };
  user: {
    email: string;
    is_onboarding_completed: boolean;
  };
  xi_api_key: string;
}

export function useElevenLabs() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<ElevenLabsUser | null>(null);

  const makeRequest = useCallback(async (path: string, options?: RequestInit) => {
    const response = await fetch(`/api/elevenlabs/${path}`, {
      ...options,
      headers: {
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "API request failed");
    }

    return response.json();
  }, []);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const userData = await makeRequest("v1/user");
      setUser(userData);
      return userData;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch user");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [makeRequest]);

  const checkApiKey = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/elevenlabs/auth");
      const data = await response.json();
      return data.hasApiKey;
    } catch (error) {
      console.error("Failed to check API key:", error);
      return false;
    }
  }, []);

  return {
    user,
    loading,
    fetchUser,
    checkApiKey,
    makeRequest,
  };
}