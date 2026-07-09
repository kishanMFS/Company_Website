'use client';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
// import Image from 'next/image';

import { useApi } from '../hooks/useApi';
import { BlogPost, CompanySettings, Service } from '../types/strapi';
import QueryString from 'qs';
import qs from 'qs';

export default function HomePage() {
  const homePageQuery = qs.stringify({
    populate: {
      blocks: {
        on: {
          'layout.hero-section': {
            populate: {
              fields: ['title', 'subtitle'],
              services: {
                fields: ['title', 'description'],
                populate: {
                  services: {
                    fields: ['title', 'description', 'price'],
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const {
    data: settingsResponse,
    isLoading: loadingSettings,
    error: settingsError,
  } = useApi<CompanySettings>('/api/home-page', homePageQuery);

  const {
    data: servicesResponse,
    isLoading: loadingServices,
    error: servicesError,
  } = useApi<Service>('/api/services?populate=*');

  const {
    data: postsResponse,
    isLoading: loadingPosts,
    error: postsError,
  } = useApi<BlogPost>('/api/blog-posts?populate=*');

  const settings = settingsResponse?.data?.[0];
  const services = servicesResponse?.data?.slice(0, 3) ?? [];
  const posts = postsResponse?.data?.slice(0, 3) ?? [];

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-10 py-6 sm:py-8 lg:py-10">
      <section className="overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-xl sm:p-10 lg:p-14">
        {loadingSettings ? (
          <div className="h-20 animate-pulse rounded-xl bg-white/10" />
        ) : settingsError ? (
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold sm:text-4xl">
              We build modern digital experiences.
            </h1>
            <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
              A polished company website powered by Strapi and Next.js.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* {settings?.companyLogo?.url && (
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND}${settings.companyLogo.url}`}
                alt={settings.companyLogo.alternativeText ?? 'Company Logo'}
                width={Math.round((settings.companyLogo.width ?? 180) / 90)}
                height={Math.round((settings.companyLogo.height ?? 180) / 90)}
                priority
                // unoptimized
              />
            )} */}
            <h1 className="text-3xl font-semibold sm:text-4xl">
              {settings?.companyName ?? 'company name'}
            </h1>
            <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
              {settings?.subtitle ??
                'A company website powered by Strapi and Next.js.'}
            </p>
          </div>
        )}
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Services
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Highlighted Services
            </h2>
          </div>
        </div>

        {loadingServices ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="h-36 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        ) : servicesError ? (
          <p className="text-sm text-slate-600">
            Services are temporarily unavailable.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {service.title ?? 'Service'}
                </h3>
                <div className="mt-3 text-sm leading-6 text-slate-600">
                  <BlocksRenderer
                    content={service.description ?? 'description area'}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Blog
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            Featured Blog Posts
          </h2>
        </div>

        {loadingPosts ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {[1, 2, 3].map((p) => (
              <div
                key={p}
                className="h-32 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        ) : postsError ? (
          <p className="text-sm text-slate-600">
            Blog posts are temporarily unavailable.
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">
                  Article
                </p>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">
                  {post.title ?? 'Untitled Post'}
                </h3>
                <div className="mt-3 text-sm leading-6 text-slate-600">
                  <BlocksRenderer content={post.content} />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
