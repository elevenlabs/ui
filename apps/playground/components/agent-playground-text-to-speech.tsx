"use client";

import { EmptyState } from "@/components/empty-state";
import { Icons } from "@/components/icons";
import { useChat } from '@elevenlabs/react';
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
import { Response } from '@elevenlabs/ui/components/ai-elements/response';
import { GlobeIcon, MicIcon } from 'lucide-react';
import { useState } from 'react';

  const models = [
    { id: 'gpt-4o', name: 'GPT-4o' },
    { id: 'claude-opus-4-20250514', name: 'Claude 4 Opus' },
  ];

export const AgentPlaygroundTextToSpeech = () => {
  const [text, setText] = useState<string>('');
  const [model, setModel] = useState<string>(models[0].id);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(
      { text: text },
      {
        body: {
          model: model,
        },
      },
    );
    setText('');
  };

  const { messages, status, sendMessage } = useChat();
  return (
    <>
      <div className="relative size-full flex flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2 overflow-auto p-4">
          {messages.length === 0 ? (
            <EmptyState
              message="Audio will appear here"
              icon={Icons.textToSpeech}
              className="flex-1"
            />
          ) : (
            <Conversation className="flex-1">
              <ConversationContent>
                {messages.map((message) => (
                  <Message from={message.role} key={message.id}>
                    <MessageContent>
                      {message.parts.map((part, i) => {
                        switch (part.type) {
                          case 'text':
                            return (
                              <Response key={`${message.id}-${i}`}>
                                {part.text}
                              </Response>
                            );
                          default:
                            return null;
                        }
                      })}
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
                  onValueChange={(value) => {
                    setModel(value);
                  }}
                  value={model}
                >
                  <PromptInputModelSelectTrigger>
                    <PromptInputModelSelectValue />
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
              <PromptInputSubmit disabled={!text} status={status} />
            </PromptInputToolbar>
          </PromptInput>
        </div>
      </div>
    </>
  );
};
