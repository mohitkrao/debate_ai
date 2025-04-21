'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {useToast} from '@/hooks/use-toast';
import {useRouter} from 'next/navigation';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Switch} from '@/components/ui/switch';

const formSchema = z.object({
  topic: z.string().min(2, {
    message: 'Topic must be at least 2 characters.',
  }),
  stance: z.enum(['for', 'against'], {
    required_error: 'Please select a stance.',
  }),
  expertiseLevel: z.enum(['school', 'undergraduate', 'graduate', 'phd'], {
    required_error: 'Please select an expertise level.',
  }),
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    required_error: 'Please select a difficulty.',
  }),
});

export function DebateSetupForm() {
  const [isJudgeMode, setIsJudgeMode] = useState(false);
  const router = useRouter();
  const {toast} = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      stance: 'for',
      expertiseLevel: 'school',
      difficulty: 'easy',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: 'Debate setup',
      description: 'Debate is being setup with the provided inputs',
    });

    router.push(
      `/debate?topic=${values.topic}&stance=${values.stance}&expertiseLevel=${values.expertiseLevel}&difficulty=${values.difficulty}&isJudgeMode=${isJudgeMode}`
    );
  }

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Debate Setup</CardTitle>
        <CardDescription>Enter the details for your debate.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="topic"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="Debate Topic" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stance"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Stance</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a stance" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="for">For</SelectItem>
                      <SelectItem value="against">Against</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expertiseLevel"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Expertise Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select expertise level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="school">School</SelectItem>
                      <SelectItem value="undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="flex items-center space-x-2">
              <Label htmlFor="judge-mode">AI Judge Mode</Label>
              <Switch
                id="judge-mode"
                checked={isJudgeMode}
                onCheckedChange={setIsJudgeMode}
              />
            </div>

            <Button type="submit">Start Debate</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
