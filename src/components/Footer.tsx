import Link from 'next/link';

import qs from 'qs';

import { Global } from '../types/strapi';
import { useApiServer } from '@/hooks/useApi';

function Footer() {
  const layoutQuery = qs.stringify({
    populate: {
      fields: ['title', 'description'],

      footer: {
        fields: ['title', 'description', 'pagetitle', 'resourcestitle'],
        populate: {
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
    isLoading: loadingGlobal,
    error: globalError,
  } = useApiServer<Global>('/api/global', layoutQuery);

  const footer = globalResponse?.data?.footer;
  console.dir(footer);
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-700">
      {loadingGlobal ? (
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8 xl:flex-row xl:items-start xl:justify-between">
          <span>loading footer area...</span>
        </div>
      ) : globalError ? (
        <div className="space-y-2"></div>
      ) : (
        <>
          <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-4">
              <p className="text-lg font-semibold text-slate-900">
                Footer Area
              </p>
              <p className="max-w-md text-sm leading-6 text-slate-600">
                Building modern company websites with clean design, strong
                messaging, and fast performance.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">
                  Pages
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>
                    <Link href="/" className="transition hover:text-slate-900">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="transition hover:text-slate-900"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/services"
                      className="transition hover:text-slate-900"
                    >
                      Services
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">
                  Resources
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>
                    <Link
                      href="/blog"
                      className="transition hover:text-slate-900"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="transition hover:text-slate-900"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50 py-5">
            <p className="text-center text-sm text-slate-500">
              © {new Date().getFullYear()} DAM
            </p>
          </div>
        </>
      )}
    </footer>
  );
}

export default Footer;
