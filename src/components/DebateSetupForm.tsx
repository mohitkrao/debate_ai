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
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {useToast} from '@/hooks/use-toast';
import {useRouter} from 'next/navigation';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';

const formSchema = z.object({
  topic: z.string().min(2, {
    message: 'Topic must be at least 2 characters.',
  }),
  stance: z.enum(['for', 'against'], {
    required_error: 'Please select a stance.',
  }),
  expertiseLevel: z.string().min(2, {
    message: 'Expertise level must be at least 2 characters.',
  }),
  difficulty: z.string().min(2, {
    message: 'Difficulty must be at least 2 characters.',
  }),
  userInput: z.string().optional(),
});

export function DebateSetupForm() {
  const [isJudgeMode, setIsJudgeMode] = useState(false); // Tracks if Judge Mode is toggled
  const router = useRouter();
  const {toast} = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      stance: 'for',
      expertiseLevel: '',
      difficulty: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: 'Debate setup',
      description: 'Debate is being setup with the provided inputs',
    });
    // add logic to navigate to debate page
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
                  <FormControl>
                    <Input placeholder="Expertise Level" {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Input placeholder="Difficulty" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Start Debate</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
