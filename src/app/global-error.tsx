// app/global-error.tsx
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h1>A critical system error occurred.</h1>
        <button onClick={() => reset()}>Retry Application</button>
      </body>
    </html>
  );
}
