import Link from 'next/link';
import qs from 'qs';

import { Global } from '../types/strapi';
import { fetchApiServer } from '@/hooks/useApi';
import ThemeToggle from './ThemeToggle';

async function Navbar() {
  const layoutQuery = qs.stringify({
    populate: {
      fields: ['title', 'description'],
      header: {
        // fields: ['title', 'description'],
        populate: {
          companyname: {
            fields: ['title', 'url'],
          },
          navigations: {
            fields: ['title', 'url'],
          },
        },
      },
    },
  });

  const {
    data: globalResponse,
    // isLoading: loadingGlobal,
    error: globalError,
  } = await fetchApiServer<Global>('/api/global', layoutQuery);

  const header = globalResponse?.data?.header;
  const companyName = header?.companyname;
  const navigations = header?.navigations ?? [];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {globalError ? (
          <div className="space-y-2">{globalError.message}</div>
        ) : companyName ? (
          <>
            <Link
              href={companyName.url || '/'}
              className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
            >
              {companyName.title || 'Company'}
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
              {navigations.map((link: { url: string; title: string }) => (
                <Link
                  key={link.url}
                  href={link.url}
                  className="text-sm font-medium text-slate-700 transition hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 dark:text-slate-300 dark:hover:text-white"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {/* <Link
                href="/contact"
                className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
              >
                Get in touch
              </Link> */}
            </div>
          </>
        ) : (
          <p
            role="status"
            className="text-sm text-slate-700 dark:text-slate-200"
          >
            Navigation is not available.
          </p>
        )}
      </div>
    </header>
  );
}

export default Navbar;
