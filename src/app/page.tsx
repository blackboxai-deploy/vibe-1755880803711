'use client';

import { ChatInterface } from '@/components/ChatInterface';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">AI Chat Assistant</h1>
        <p className="text-gray-600">
          Powered by Claude Sonnet 4 - Your intelligent conversation partner
        </p>
      </div>
      <ChatInterface />
    </div>
  );
}