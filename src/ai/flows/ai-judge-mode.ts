'use server';
/**
 * @fileOverview A AI Judge mode to provide constructive criticism and improve argumentation skills.
 *
 * - aiJudgeMode - A function that handles the AI judge mode.
 * - AiJudgeModeInput - The input type for the aiJudgeMode function.
 * - AiJudgeModeOutput - The return type for the aiJudgeMode function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AiJudgeModeInputSchema = z.object({
  topic: z.string().describe('The topic for debate.'),
  stance: z.string().describe('The stance of the user (for/against).'),
  expertiseLevel: z.string().describe('The expertise level of the user (high school, college, phd, etc.).'),
  difficulty: z.string().describe('The difficulty of the debate.'),
  userInput: z.string().describe('The user input in the debate.'),
});
export type AiJudgeModeInput = z.infer<typeof AiJudgeModeInputSchema>;

const AiJudgeModeOutputSchema = z.object({
  judgeResponse: z.string().describe('The response from the AI judge, including questions and feedback.'),
});
export type AiJudgeModeOutput = z.infer<typeof AiJudgeModeOutputSchema>;

export async function aiJudgeMode(input: AiJudgeModeInput): Promise<AiJudgeModeOutput> {
  return aiJudgeModeFlow(input);
}

const askQuestionTool = ai.defineTool({
  name: 'askQuestion',
  description: 'Asks a question to the user based on their input, topic, and stance in the debate.',
  inputSchema: z.object({
    topic: z.string().describe('The topic for debate.'),
    stance: z.string().describe('The stance of the user (for/against).'),
    expertiseLevel: z.string().describe('The expertise level of the user.'),
    difficulty: z.string().describe('The difficulty of the debate.'),
    userInput: z.string().describe('The user input in the debate.'),
  }),
  outputSchema: z.string(),
},
async input => {
  return `What are your thoughts on this user input: ${input.userInput} for debate with topic ${input.topic}, stance ${input.stance}, expertise level ${input.expertiseLevel} and difficulty ${input.difficulty}?`;
});

const giveFeedbackTool = ai.defineTool({
  name: 'giveFeedback',
  description: 'Provides constructive feedback to the user based on their input, topic, and stance in the debate.',
  inputSchema: z.object({
    topic: z.string().describe('The topic for debate.'),
    stance: z.string().describe('The stance of the user (for/against).'),
    expertiseLevel: z.string().describe('The expertise level of the user.'),
    difficulty: z.string().describe('The difficulty of the debate.'),
    userInput: z.string().describe('The user input in the debate.'),
  }),
  outputSchema: z.string(),
},
async input => {
  return `Feedback on user input: ${input.userInput} for debate with topic ${input.topic}, stance ${input.stance}, expertise level ${input.expertiseLevel} and difficulty ${input.difficulty}.`;
});

const prompt = ai.definePrompt({
  name: 'aiJudgeModePrompt',
  tools: [askQuestionTool, giveFeedbackTool],
  input: {
    schema: z.object({
      topic: z.string().describe('The topic for debate.'),
      stance: z.string().describe('The stance of the user (for/against).'),
      expertiseLevel: z.string().describe('The expertise level of the user (high school, college, phd, etc.).'),
      difficulty: z.string().describe('The difficulty of the debate.'),
      userInput: z.string().describe('The user input in the debate.'),
    }),
  },
  output: {
    schema: z.object({
      judgeResponse: z.string().describe('The response from the AI judge, including questions and feedback.'),
    }),
  },
  prompt: `You are acting as a judge in a debate. The user will provide their input, and you will either ask a question to challenge their argument or provide constructive feedback to help them improve. You can use the askQuestion and giveFeedback tools as needed, or respond directly with no tools. Debate Topic: {{{topic}}}, User Stance: {{{stance}}}, User Expertise Level: {{{expertiseLevel}}}, Debate Difficulty: {{{difficulty}}}, User Input: {{{userInput}}}`,
});

const aiJudgeModeFlow = ai.defineFlow<
  typeof AiJudgeModeInputSchema,
  typeof AiJudgeModeOutputSchema
>({
  name: 'aiJudgeModeFlow',
  inputSchema: AiJudgeModeInputSchema,
  outputSchema: AiJudgeModeOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});

