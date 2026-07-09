import Link from 'next/link';

import qs from 'qs';

import { Global } from '../types/strapi';
import { useApiServer } from '@/hooks/useApi';
import { UrlObject } from 'url';

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
  } = await useApiServer<Global>('/api/global', layoutQuery);

  const footer = globalResponse?.data?.footer;

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-700">
      {globalError ? (
        <div className="space-y-2">{globalError.message}</div>
      ) : (
        <>
          <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-4">
              <p className="text-lg font-semibold text-slate-900">
                {footer.title}
              </p>
              <p className="max-w-md text-sm leading-6 text-slate-600">
                {footer.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">
                  {footer.pagetitle}
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {footer.pages.map(
                    (page: { id: Key; url: UrlObject; title: string }) => (
                      <li key={page.id}>
                        <Link
                          href={page.url}
                          className="transition hover:text-slate-900"
                        >
                          {page.title}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">
                  {footer.resourcestitle}
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {footer.resources.map(
                    (resource: { id: Key; url: UrlObject; title: string }) => (
                      <li key={resource.id}>
                        <Link
                          href={resource.url}
                          className="transition hover:text-slate-900"
                        >
                          {resource.title}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50 py-5">
            <p className="text-center text-sm text-slate-500">
              © {new Date(globalResponse?.data?.createdAt).getFullYear()} DAM
            </p>
          </div>
        </>
      )}
    </footer>
  );
}

export default Footer;
