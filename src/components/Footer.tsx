import Link from 'next/link';

import qs from 'qs';

import { Global } from '../types/strapi';
import { fetchApiServer } from '@/hooks/useApi';

async function Footer() {
  const layoutQuery = qs.stringify({
    populate: {
      fields: ['title', 'description'],

      footer: {
        populate: {
          fields: ['title', 'description', 'pagetitle', 'resourcestitle'],
          pages: {
            fields: ['title', 'url'],
          },
          resources: {
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

  const footer = globalResponse?.data?.footer;

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
      {globalError ? (
        <div className="space-y-2">{globalError.message}</div>
      ) : footer ? (
        <>
          <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-4">
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {footer.title || 'Company'}
              </p>
              <p className="max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
                {footer.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 dark:text-slate-100">
                  {footer.pagetitle}
                </p>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {(footer.pages ?? []).map((page) => (
                    <li key={page.id}>
                      <Link
                        href={page.url}
                        className="transition hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:hover:text-white"
                      >
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 dark:text-slate-100">
                  {footer.resourcestitle}
                </p>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {(footer.resources ?? []).map((resource) => (
                    <li key={resource.id}>
                      <Link
                        href={resource.url}
                        className="transition hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:hover:text-white"
                      >
                        {resource.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50 py-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} DAM
            </p>
          </div>
        </>
      ) : (
        <p role="status" className="px-4 py-8 text-center text-sm">
          Footer content is not available.
        </p>
      )}
    </footer>
  );
}

export default Footer;
