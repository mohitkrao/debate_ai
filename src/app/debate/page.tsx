import { Suspense } from 'react';
import DebateClient from '@/hooks/DebateClient';

export default function DebatePage() {
  return (
    <Suspense fallback={<div>Loading debate...</div>}>
      <DebateClient />
    </Suspense>
  );
}
