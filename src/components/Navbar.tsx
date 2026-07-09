import Link from 'next/link';
import qs from 'qs';

import { Global } from '../types/strapi';
import { useApiServer } from '@/hooks/useApi';

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
  } = await useApiServer<Global>('/api/global', layoutQuery);

  const header = globalResponse?.data?.header;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {globalError ? (
          <div className="space-y-2">{globalError.message}</div>
        ) : (
          <>
            <Link
              href={header.companyname.url || ''}
              className="text-xl font-semibold tracking-tight text-slate-900"
            >
              {header.companyname.title}
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
              {header.navigations.map(
                (link: { url: string; title: string }) => (
                  <Link
                    key={link.url}
                    href={link.url}
                    className="text-sm font-medium text-slate-700 transition hover:text-slate-900"
                  >
                    {link.title}
                  </Link>
                )
              )}
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
              >
                Get in touch
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
