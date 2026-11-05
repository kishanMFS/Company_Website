'use client';

import { useRef, type FormEvent } from 'react';
import { useApiMutation } from '@/hooks/useApi';

interface ContactFormProps {
  className?: string;
}

interface ContactSubmission {
  name: string;
  email: string;
  message: string;
}

interface ContactSubmissionPayload {
  data: ContactSubmission;
}

interface ContactSubmissionResponse {
  data: {
    id: number;
    documentId?: string;
    name: string;
    email: string;
    message: string;
  };
}

export default function ContactForm({ className = '' }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const {
    mutateAsync: submitContact,
    isPending,
    isSuccess,
    error,
    reset,
  } = useApiMutation<ContactSubmissionResponse, ContactSubmissionPayload>(
    '/api/contact-details'
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    reset();

    const formData = new FormData(event.currentTarget);
    const submission: ContactSubmissionPayload = {
      data: {
        name: String(formData.get('name') ?? ''),
        email: String(formData.get('email') ?? ''),
        message: String(formData.get('message') ?? ''),
      },
    };

    try {
      await submitContact(submission);
      formRef.current?.reset();
    } catch {
      // The mutation error is rendered below for assistive technology and users.
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`space-y-5 ${className}`}
      aria-busy={isPending}
    >
      <div>
        <label
          htmlFor="contact-name"
          className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100"
        >
          Name <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={120}
          className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-400"
        />
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100"
        >
          Email address <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-400"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100"
        >
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          maxLength={5000}
          rows={6}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-400"
        />
      </div>

      {isSuccess && (
        <p
          role="status"
          aria-live="polite"
          className="rounded-lg bg-emerald-50 p-4 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
        >
          Your message has been sent.
        </p>
      )}
      {error && (
        <p
          role="alert"
          aria-live="assertive"
          className="rounded-lg bg-red-50 p-4 text-red-900 dark:bg-red-950 dark:text-red-100"
        >
          {error.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-12 items-center justify-center rounded-lg bg-indigo-700 px-6 py-3 font-semibold text-white transition hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
