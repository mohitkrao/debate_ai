'use client';

import {DebateSetupForm} from '@/components/DebateSetupForm';
import {Toaster} from '@/components/ui/toaster';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">DebateAI</h1>
      <DebateSetupForm />
      <Toaster />
    </div>
  );
}
