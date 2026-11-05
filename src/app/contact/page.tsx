import qs from 'qs';
import { fetchApiServer } from '@/hooks/useApi';
import ContactForm from './ContactForm';

interface ContactPageContent {
  title?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export default async function ContactPage() {
  const contactQuery = qs.stringify(
    {
      fields: ['title', 'description', 'phone', 'email', 'address'],
      populate: {
        contactDetail: {
          populate: {
            contact_details: true,
          },
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  const { data, error } = await fetchApiServer<ContactPageContent>(
    '/api/contact',
    contactQuery
  );
  const contact = data?.data;
  return (
    <main className="mx-auto max-w-7xl">
      <section className="rounded-3xl bg-linear-to-br from-indigo-800 via-indigo-700 to-blue-700 px-6 py-16 text-center text-white sm:px-10 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-100">
          Get in touch
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          {contact?.title || 'Let’s start a conversation'}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-indigo-50">
          {contact?.description ||
            'Tell us a little about what you need. Our team will be in touch.'}
        </p>
      </section>

      <section
        aria-labelledby="contact-form-heading"
        className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[0.8fr_1.2fr]"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-700 dark:text-indigo-500">
            Contact
          </p>
          <h2
            id="contact-form-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-400"
          >
            How can we help?
          </h2>
          <p className="mt-4 max-w-md leading-7 text-slate-600 dark:text-slate-400">
            Share your question or project details using the form. Fields marked
            with an asterisk are required.
          </p>
          {error && (
            <p
              role="status"
              className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100"
            >
              Contact details could not be loaded from the CMS. The message form
              is still available.
            </p>
          )}
          {(contact?.email || contact?.phone || contact?.address) && (
            <address className="mt-8 space-y-3 not-italic text-slate-700 dark:text-slate-400">
              {contact.email && (
                <p>
                  Email:{' '}
                  <a
                    className="font-medium text-indigo-800 underline underline-offset-4 hover:text-indigo-950 dark:text-indigo-300 dark:hover:text-indigo-200"
                    href={`mailto:${contact.email}`}
                  >
                    {contact.email}
                  </a>
                </p>
              )}
              {contact.phone && (
                <p>
                  Phone:{' '}
                  <a
                    className="font-medium text-indigo-800 underline underline-offset-4 hover:text-indigo-950 dark:text-indigo-300 dark:hover:text-indigo-200"
                    href={`tel:${contact.phone}`}
                  >
                    {contact.phone}
                  </a>
                </p>
              )}
              {contact.address && <p>{contact.address}</p>}
            </address>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-700 dark:bg-slate-900">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
