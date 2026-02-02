import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  tip?: string;
}

function Spinner({ className, tip, ...props }: SpinnerProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2',
        className
      )}
      {...props}
    >
      <Loader2 className='text-shadcn-primary h-8 w-8 animate-spin' />
      {tip ? (
        <span className='text-muted-foreground text-sm'>{tip}</span>
      ) : null}
    </div>
  );
}

export { Spinner };
