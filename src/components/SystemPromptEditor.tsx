'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface SystemPromptEditorProps {
  systemPrompt: string;
  onUpdateSystemPrompt: (prompt: string) => void;
}

export function SystemPromptEditor({ systemPrompt, onUpdateSystemPrompt }: SystemPromptEditorProps) {
  const [tempPrompt, setTempPrompt] = useState(systemPrompt);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onUpdateSystemPrompt(tempPrompt);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempPrompt(systemPrompt);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="mb-4"
          onClick={() => setTempPrompt(systemPrompt)}
        >
          Customize AI Behavior
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>System Prompt Editor</DialogTitle>
          <DialogDescription>
            Customize how the AI behaves and responds to your messages. This prompt defines the AI's personality, knowledge, and communication style.
          </DialogDescription>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current System Prompt</CardTitle>
            <CardDescription>
              Edit the prompt below to change how the AI interacts with you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={tempPrompt}
              onChange={(e) => setTempPrompt(e.target.value)}
              placeholder="Enter your custom system prompt..."
              className="min-h-32"
              rows={6}
            />
            <div className="text-sm text-gray-600">
              <strong>Tip:</strong> Be specific about the AI's role, tone, and expertise areas. 
              For example: "You are a coding expert who explains complex concepts simply."
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}