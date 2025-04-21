import { Suspense } from 'react';
import DebateClient from './DebateClient';

export default function DebatePage() {
  return (
    <Suspense fallback={<div>Loading debate...</div>}>
      <DebateClient />
    </Suspense>
  );
}
