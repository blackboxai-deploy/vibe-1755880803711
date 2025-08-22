'use client';

import { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/use-chat';
import { MessageBubble } from '@/components/MessageBubble';
import { ChatInput } from '@/components/ChatInput';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { SystemPromptEditor } from '@/components/SystemPromptEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ChatInterface() {
  const {
    messages,
    isLoading,
    error,
    systemPrompt,
    sendMessage,
    updateSystemPrompt,
    clearMessages,
    clearError,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <Card className="w-full h-[600px] flex flex-col shadow-lg">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <SystemPromptEditor
              systemPrompt={systemPrompt}
              onUpdateSystemPrompt={updateSystemPrompt}
            />
            {messages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearMessages}
              >
                Clear Chat
              </Button>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {messages.length} messages
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
                <Button
                  variant="link"
                  size="sm"
                  className="ml-2 text-red-600 p-0 h-auto"
                  onClick={clearError}
                >
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {messages.length === 0 && !isLoading && (
            <div className="text-center text-gray-500 mt-8">
              <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
              <p className="text-sm">
                Ask me anything! I'm here to help with questions, tasks, or just have a chat.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isLoading && <LoadingIndicator />}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
}