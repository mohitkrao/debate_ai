'use client';

import {useState, useEffect, useRef} from 'react';
import {useSearchParams} from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Switch} from '@/components/ui/switch';
import {Label} from '@/components/ui/label';
import {aiJudgeMode} from '@/ai/flows/ai-judge-mode';
import {generateDebateResponse} from '@/ai/flows/generate-debate-response';
import {useToast} from '@/hooks/use-toast';

interface ChatMessage {
  text: string;
  isUser: boolean;
}

export default function DebateClient() {
  const searchParams = useSearchParams();
  const topic = searchParams.get('topic') || 'Default Topic';
  const stance = searchParams.get('stance') || 'for';
  const expertiseLevel = searchParams.get('expertiseLevel') || 'Beginner';
  const difficulty = searchParams.get('difficulty') || 'Easy';
    const isJudgeModeParam = searchParams.get('isJudgeMode') === 'true';

  const [isJudgeMode, setIsJudgeMode] = useState(isJudgeModeParam);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const chatDisplayRef = useRef<HTMLDivElement>(null);
  const {toast} = useToast();

  useEffect(() => {
    chatDisplayRef.current?.scrollTo({
      top: chatDisplayRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [chatMessages]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMessage: ChatMessage = {text: userInput, isUser: true};
    setChatMessages(prev => [...prev, userMessage]);
    setUserInput('');

    try {
      let aiResponseText: string;

         if (isJudgeMode) {
        const res = await aiJudgeMode({
          topic,
          stance,
          expertiseLevel,
          difficulty,
          userInput,
        });
        aiResponseText = res.judgeResponse;
      } else {
        const res = await generateDebateResponse({
          topic,
          stance,
          expertiseLevel,
          difficulty,
          userInput,
        });
        aiResponseText = res.response;
      }

      setChatMessages(prev => [...prev, {text: aiResponseText, isUser: false}]);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: `Failed to generate AI response: ${err.message}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Card className="m-4 flex-grow">
        <CardHeader>
          <CardTitle>Debate: {topic}</CardTitle>
          <CardDescription>
            Stance: {stance}, Expertise: {expertiseLevel}, Difficulty: {difficulty}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col h-full">
           <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="judge-mode">AI Judge Mode</Label>
              <Switch
                id="judge-mode"
                checked={isJudgeMode}
                onCheckedChange={setIsJudgeMode}
              />
            </div>
          </div>
          <div
            ref={chatDisplayRef}
            className="flex-grow overflow-y-auto mb-4 p-2 border rounded"
          >
            {chatMessages.map((message, i) => (
              <div
                key={i}
                className={`mb-2 p-2 rounded-md ${
                  message.isUser ? 'bg-secondary text-secondary-foreground self-end' : 'bg-muted text-muted-foreground self-start'
                } break-words`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="flex items-center">
            <Input
              placeholder="Enter your response"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              className="flex-grow mr-2"
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
