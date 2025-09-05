"use client";

import { EmptyState } from "@/components/empty-state";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@elevenlabs/ui/components/ai-elements/conversation';
import { Message, MessageContent } from '@elevenlabs/ui/components/ai-elements/message';
import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools
} from "@elevenlabs/ui/components/ai-elements/prompt-input";
import { GlobeIcon, MicIcon, PauseIcon, PlayIcon } from 'lucide-react';
import { useState, useRef } from 'react';

const models = [
  { id: 'eleven_turbo_v2_5', name: 'Eleven Turbo v2.5' },
  { id: 'eleven_turbo_v2', name: 'Eleven Turbo v2' },
  { id: 'eleven_flash_v2_5', name: 'Eleven Flash v2.5' },
  { id: 'eleven_flash_v2', name: 'Eleven Flash v2' },
  { id: 'eleven_multilingual_v2', name: 'Eleven Multilingual v2' },
];

const voices = [
  { id: 'EOII7HhWy1WAdGI3CeWK', name: 'Rachel' }
];

interface AudioMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  audioUrl?: string;
  timestamp: Date;
}

export const AgentPlaygroundTextToSpeech = () => {
  const [text, setText] = useState<string>('');
  const [model, setModel] = useState<string>(models[0].id);
  const [voice, setVoice] = useState<string>(voices[0].id);
  const [messages, setMessages] = useState<AudioMessage[]>([]);
  const [status, setStatus] = useState<'idle' | 'in_progress'>('idle');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;

    const userMessage: AudioMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setStatus('in_progress');
    setText('');

    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, model, voice }),
      });

      if (!response.ok) {
        console.log('Response status:', response.status);
        console.log('Response status text:', response.statusText);
        
        const errorData = await response.json().catch(() => ({ error: 'Failed to generate speech' }));
        console.log('Error data:', errorData);
        
        if (response.status === 429 || errorData.isRetryable) {
          toast.error('Service temporarily unavailable. Please try again in a moment.', {
            action: {
              label: 'Retry',
              onClick: () => handleSubmit(e)
            }
          });
        } else if (response.status === 401) {
          toast.error('API key invalid or missing. Please check your settings.');
        } else if (response.status === 400) {
          toast.error(`Invalid request: ${errorData.error || 'Please check your input'}`);
        } else {
          toast.error(errorData.error || `Error: ${response.statusText}`);
        }
        
        // Add early return to prevent further execution
        setStatus('idle');
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const assistantMessage: AudioMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: `Generated speech for: "${text}"`,
        audioUrl,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      toast.success('Speech generated successfully!');
    } catch (error) {
      console.error('Error generating speech:', error);
      
      // Add error message to conversation for context
      const errorMessage: AudioMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: `⚠️ ${error instanceof Error ? error.message : 'Failed to generate speech'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setStatus('idle');
    }
  };

  const togglePlayAudio = (audioUrl: string, messageId: string) => {
    if (playingId === messageId && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setPlayingId(messageId);
      
      audioRef.current.addEventListener('ended', () => {
        setPlayingId(null);
      });
    }
  };

  return (
    <>
      <div className="relative size-full flex flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2 overflow-auto p-4">
          {messages.length === 0 ? (
            <EmptyState
              message="Generated audio will appear here"
              icon={Icons.textToSpeech}
              className="flex-1"
            />
          ) : (
            <Conversation className="flex-1">
              <ConversationContent>
                {messages.map((message) => (
                  <Message from={message.role} key={message.id}>
                    <MessageContent>
                      <div className="flex flex-col gap-2">
                        <div>{message.text}</div>
                        {message.audioUrl && (
                          <button
                            onClick={() => togglePlayAudio(message.audioUrl!, message.id)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 rounded-md transition-colors w-fit"
                          >
                            {playingId === message.id ? (
                              <>
                                <PauseIcon size={16} />
                                <span>Pause</span>
                              </>
                            ) : (
                              <>
                                <PlayIcon size={16} />
                                <span>Play Audio</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </MessageContent>
                  </Message>
                ))}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          )}
        </div>

        <div className="relative p-4 pt-0">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              onChange={(e) => setText(e.target.value)}
              value={text}
              placeholder="Enter text to convert to speech..."
            />
            <PromptInputToolbar>
              <PromptInputTools>
                <PromptInputButton>
                  <MicIcon size={16} />
                </PromptInputButton>
                <PromptInputButton>
                  <GlobeIcon size={16} />
                  <span>Search</span>
                </PromptInputButton>
                <PromptInputModelSelect
                  onValueChange={(value) => setVoice(value)}
                  value={voice}
                >
                  <PromptInputModelSelectTrigger>
                    <PromptInputModelSelectValue placeholder="Select voice" />
                  </PromptInputModelSelectTrigger>
                  <PromptInputModelSelectContent>
                    {voices.map((v) => (
                      <PromptInputModelSelectItem key={v.id} value={v.id}>
                        {v.name}
                      </PromptInputModelSelectItem>
                    ))}
                  </PromptInputModelSelectContent>
                </PromptInputModelSelect>
                <PromptInputModelSelect
                  onValueChange={(value) => setModel(value)}
                  value={model}
                >
                  <PromptInputModelSelectTrigger>
                    <PromptInputModelSelectValue placeholder="Select model" />
                  </PromptInputModelSelectTrigger>
                  <PromptInputModelSelectContent>
                    {models.map((model) => (
                      <PromptInputModelSelectItem key={model.id} value={model.id}>
                        {model.name}
                      </PromptInputModelSelectItem>
                    ))}
                  </PromptInputModelSelectContent>
                </PromptInputModelSelect>
              </PromptInputTools>
              <PromptInputSubmit disabled={!text} status={status === 'in_progress' ? 'submitted' : 'ready'} />
            </PromptInputToolbar>
          </PromptInput>
        </div>
      </div>
    </>
  );
};