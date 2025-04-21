// src/ai/flows/generate-debate-response.ts
'use server';

/**
 * @fileOverview This file defines the Genkit flow for generating debate responses.
 *
 * It takes user input regarding the debate topic, stance, expertise level, and difficulty,
 * and uses an AI model to generate appropriate debate responses.
 *
 * @exports {
 *   generateDebateResponse,
 *   GenerateDebateResponseInput,
 *   GenerateDebateResponseOutput
 * }
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateDebateResponseInputSchema = z.object({
  topic: z.string().describe('The topic of the debate.'),
  stance: z.enum(['for', 'against']).describe('The stance of the user in the debate (for or against).'),
  expertiseLevel: z
    .string()
    .describe('The expertise level of the user (e.g., high school student, college student, PhD).'),
  difficulty: z.string().describe('The difficulty level of the debate.'),
  userInput: z.string().describe('The user input to which the AI should respond'),
});

export type GenerateDebateResponseInput = z.infer<typeof GenerateDebateResponseInputSchema>;

const GenerateDebateResponseOutputSchema = z.object({
  response: z.string().describe('The AI-generated debate response.'),
});

export type GenerateDebateResponseOutput = z.infer<typeof GenerateDebateResponseOutputSchema>;

export async function generateDebateResponse(input: GenerateDebateResponseInput): Promise<GenerateDebateResponseOutput> {
  return generateDebateResponseFlow(input);
}

const generateDebateResponsePrompt = ai.definePrompt({
  name: 'generateDebateResponsePrompt',
  input: {
    schema: z.object({
      topic: z.string().describe('The topic of the debate.'),
      stance: z.enum(['for', 'against']).describe('The stance of the user in the debate (for or against).'),
      expertiseLevel: z
        .string()
        .describe('The expertise level of the user (e.g., high school student, college student, PhD).'),
      difficulty: z.string().describe('The difficulty level of the debate.'),
      userInput: z.string().describe('The user input to which the AI should respond'),
    }),
  },
  output: {
    schema: z.object({
      response: z.string().describe('The AI-generated debate response.'),
    }),
  },
  prompt: `You are an AI debate partner. You will generate a debate response based on the user's input.

  Topic: {{{topic}}}
  Stance: {{{stance}}}
  Expertise Level: {{{expertiseLevel}}}
  Difficulty: {{{difficulty}}}

  User Input: {{{userInput}}}

  Generate a response that is appropriate for the given topic, stance, expertise level, and difficulty. Be persuasive and provide evidence to support your claims.`,
});

const generateDebateResponseFlow = ai.defineFlow<
  typeof GenerateDebateResponseInputSchema,
  typeof GenerateDebateResponseOutputSchema
>(
  {
    name: 'generateDebateResponseFlow',
    inputSchema: GenerateDebateResponseInputSchema,
    outputSchema: GenerateDebateResponseOutputSchema,
  },
  async input => {
    const {output} = await generateDebateResponsePrompt(input);
    return output!;
  }
);
