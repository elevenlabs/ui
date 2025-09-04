"use client";

import { ConversationBar } from "@/components/conversation-bar";
import { EmptyState } from "@/components/empty-state";
import { Icons } from "@/components/icons";

export const AgentPlaygroundConversation = () => {
  return (
    <>
      <div className="@container/main flex flex-1 flex-col gap-2 overflow-auto">
        <EmptyState
          icon={Icons.orb}
          message="Conversation will appear here"
          className="flex-1"
        />
      </div>
      <div className="relative">
        <ConversationBar />
      </div>
    </>
  );
};
