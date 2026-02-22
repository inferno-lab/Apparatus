import * as React from 'react';
import { cn } from './cn';

export interface PageShellProps extends React.HTMLAttributes<HTMLDivElement> {
  backdrop?: boolean;
}

export function PageShell({ className, backdrop = true, children, ...props }: PageShellProps) {
  return (
    <div
      className={cn(
        'relative isolate space-y-6 overflow-hidden rounded-sm pb-2 animate-in fade-in duration-500',
        className
      )}
      {...props}
    >
      {backdrop && (
        <>
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_0%,rgba(56,160,255,0.14),transparent_42%),radial-gradient(circle_at_88%_80%,rgba(56,160,255,0.08),transparent_38%)]" />
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_3px,rgba(5,9,20,0.55)_4px)]" />
        </>
      )}
      {children}
    </div>
  );
}
