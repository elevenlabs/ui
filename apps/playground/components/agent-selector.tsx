'use client';

import {
  AlertCircleIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  Loader2Icon,
  SearchIcon,
} from 'lucide-react';
import * as React from 'react';

import { listAgents } from '@/app/actions/list-agents';
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '@elevenlabs/ui/components/button';
import { ElevenLabs } from '@elevenlabs/elevenlabs-js';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@elevenlabs/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@elevenlabs/ui/components/popover';
import { cn } from '@elevenlabs/ui/lib/utils';
import { Loader } from '@elevenlabs/ui/components/ai-elements/loader';

interface AgentSelectorProps {
  value?: string;
  onSelect?: (agentId: string | null) => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
  selectedAgentName?: string;
}

export function AgentSelector({
  value,
  onSelect,
  placeholder = 'Select an agent',
  className,
  isLoading = false,
  selectedAgentName,
}: AgentSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [agents, setAgents] = React.useState<
    ElevenLabs.AgentSummaryResponseModel[]
  >([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [hasMore, setHasMore] = React.useState(false);
  const [nextCursor, setNextCursor] = React.useState<string | undefined>();

  React.useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await listAgents({
          search: debouncedSearch,
          pageSize: 20,
        });

        setAgents(response.agents || []);
        setHasMore(response.hasMore || false);
        setNextCursor(response.nextCursor || undefined);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load agents');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [debouncedSearch]);

  const selectedAgent = agents.find(agent => agent.agentId === value);
  const displayName = selectedAgent?.name || selectedAgentName;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={isLoading}
          className={cn(
            'justify-between',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <div className="flex items-center gap-2 truncate">
            {isLoading ? (
              <>
                <Loader size={16} />
                <span>Loading...</span>
              </>
            ) : displayName ? (
              <span className="truncate">{displayName}</span>
            ) : value ? (
              <span className="truncate">Agent ID: {value}</span>
            ) : (
              <span>{placeholder}</span>
            )}
          </div>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              placeholder="Search agents"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <CommandList className="max-h-[400px]">
            {loading && (
              <div className="flex items-center justify-center py-6">
                <Loader2Icon className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Loading agents...
                </span>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center py-6 px-4">
                <AlertCircleIcon className="h-4 w-4 text-destructive" />
                <span className="ml-2 text-sm text-destructive">{error}</span>
              </div>
            )}

            {!loading && !error && agents.length === 0 && (
              <CommandEmpty>No agents found</CommandEmpty>
            )}

            {!loading && !error && agents.length > 0 && (
              <CommandGroup>
                {agents.map(agent => (
                  <CommandItem
                    key={agent.agentId}
                    value={agent.agentId}
                    onSelect={() => {
                      const newValue =
                        agent.agentId === value ? null : agent.agentId;
                      onSelect?.(newValue);
                      setOpen(false);
                    }}
                    className="flex flex-col items-start gap-1 px-4 py-3"
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium truncate">
                            {agent.name}
                          </span>
                          {agent.accessInfo?.creatorName && (
                            <span className="text-xs text-muted-foreground truncate">
                              by {agent.accessInfo.creatorName}
                            </span>
                          )}
                        </div>
                      </div>
                      <CheckIcon
                        className={cn(
                          'h-4 w-4 ml-2 shrink-0',
                          value === agent.agentId ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {hasMore && !loading && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={async () => {
                      if (!nextCursor || loadingMore) return;

                      setLoadingMore(true);
                      try {
                        const response = await listAgents({
                          search: debouncedSearch,
                          cursor: nextCursor,
                          pageSize: 20,
                        });

                        setAgents(prev => [...prev, ...response.agents]);
                        setHasMore(response.hasMore || false);
                        setNextCursor(response.nextCursor || undefined);
                      } catch (err) {
                        setError(
                          err instanceof Error
                            ? err.message
                            : 'Failed to load more agents',
                        );
                      } finally {
                        setLoadingMore(false);
                      }
                    }}
                    className="justify-center text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {loadingMore ? (
                      <div className="flex items-center gap-2">
                        <Loader2Icon className="h-3 w-3 animate-spin" />
                        Loading...
                      </div>
                    ) : (
                      'Load more agents'
                    )}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
