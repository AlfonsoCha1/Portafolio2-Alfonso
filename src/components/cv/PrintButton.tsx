'use client';

import { Printer } from 'lucide-react';

export function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="btn btn-ghost h-10 min-h-0 px-3 text-sm">
      <Printer className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}
