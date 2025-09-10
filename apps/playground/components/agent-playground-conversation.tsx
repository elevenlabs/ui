'use client';

import { getAgent } from '@/app/actions/get-agent';
import { AgentPlaygroundWrapper } from '@/components/agent-playground-wrapper';
import { AgentSelector } from '@/components/agent-selector';
import { ConversationBar } from '@/components/conversation-bar';
import { EmptyState } from '@/components/empty-state';
import { Icons } from '@/components/icons';
import { PageHeader } from '@/components/page-header';
import { ViewLogsButton } from '@/components/view-logs-button';
import { ElevenLabs } from '@elevenlabs/elevenlabs-js';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const NotFoundIcon = ({ className }: { className?: string }) => (
  <Image
    src="/assets/icons/not-found.svg"
    alt="No agent selected"
    width={24}
    height={24}
    className={className}
  />
);

export const AgentPlaygroundConversation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentFromUrl = searchParams.get('agent');

  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(
    agentFromUrl,
  );
  const [selectedAgent, setSelectedAgent] =
    useState<ElevenLabs.GetAgentResponseModel | null>(null);
  const [isLoadingAgent, setIsLoadingAgent] = useState(!!agentFromUrl);

  const fetchAgentDetails = async (agentId: string) => {
    try {
      setIsLoadingAgent(true);
      const agent = await getAgent(agentId);
      setSelectedAgent(agent);
      return agent;
    } catch {
      setSelectedAgent(null);
      return null;
    } finally {
      setIsLoadingAgent(false);
    }
  };

  useEffect(() => {
    if (agentFromUrl && !selectedAgent) {
      fetchAgentDetails(agentFromUrl);
    }
  }, [agentFromUrl]);

  const updateUrl = (agentId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    agentId ? params.set('agent', agentId) : params.delete('agent');
    router.push(`?${params.toString()}`);
  };

  const handleAgentSelect = async (agentId: string | null) => {
    setSelectedAgentId(agentId);
    updateUrl(agentId);

    if (agentId) {
      await fetchAgentDetails(agentId);
    } else {
      setSelectedAgent(null);
    }
  };

  return (
    <div className="relative flex flex-col h-[calc(100vh-var(--header-height))]">
      <div className="flex flex-col flex-1 bg-background md:rounded-xl md:overflow-hidden md:mb-2">
        <PageHeader>
          <AgentSelector
            value={selectedAgentId || undefined}
            onSelect={handleAgentSelect}
            className="w-[300px]"
            isLoading={isLoadingAgent}
            selectedAgentName={selectedAgent?.name}
          />
          <div className="ml-auto flex items-center gap-2">
            <ViewLogsButton />
          </div>
        </PageHeader>
        <div className="flex flex-col flex-1 overflow-hidden">
          <AgentPlaygroundWrapper>
            {selectedAgentId ? (
              <>
                <div className="@container/main flex flex-1 flex-col gap-2 overflow-auto">
                  <EmptyState
                    icon={Icons.orb}
                    message="Start a conversation with your agent"
                    className="flex-1"
                  />
                </div>
                <div className="relative">
                  {/* <ConversationBar1 /> */}
                  <ConversationBar />
                </div>
              </>
            ) : (
              <EmptyState
                icon={NotFoundIcon}
                message="Select an agent to start"
                className="flex-1"
              />
            )}
          </AgentPlaygroundWrapper>
        </div>
      </div>
    </div>
  );
};
