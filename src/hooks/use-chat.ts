'use client';

import { useState, useCallback, useEffect } from 'react';
import { Message, ChatState } from '@/lib/types';

const DEFAULT_SYSTEM_PROMPT = "You are a helpful, knowledgeable, and friendly AI assistant. Provide clear, accurate, and engaging responses while being concise and informative.";

export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
  });

  // Load system prompt from localStorage on mount
  useEffect(() => {
    const savedPrompt = localStorage.getItem('chat-system-prompt');
    if (savedPrompt) {
      setState(prev => ({ ...prev, systemPrompt: savedPrompt }));
    }
  }, []);

  const updateSystemPrompt = useCallback((prompt: string) => {
    setState(prev => ({ ...prev, systemPrompt: prompt }));
    localStorage.setItem('chat-system-prompt', prompt);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || state.isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...state.messages, userMessage],
          systemPrompt: state.systemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  }, [state.messages, state.systemPrompt, state.isLoading]);

  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, messages: [], error: null }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    systemPrompt: state.systemPrompt,
    sendMessage,
    updateSystemPrompt,
    clearMessages,
    clearError,
  };
}