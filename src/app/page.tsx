import { BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer';
// import Image from 'next/image';
import { truncateBlocks } from '../lib/utils';

import { useApiServer } from '../hooks/useApi';
import { CompanyHomepage } from '../types/strapi';
import qs from 'qs';
import { Key } from 'react';

export default async function HomePage() {
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
              blogpost: {
                fields: ['title', 'description'],
                populate: {
                  blog_posts: {
                    fields: ['title', 'description'],
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
    data: homepageResponse,
    // isLoading: loadingHomepage,
    error: homepageError,
  } = await useApiServer<CompanyHomepage>('/api/home-page', homePageQuery);

  const homepage = homepageResponse?.data.blocks[0];

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-10 py-6 sm:py-8 lg:py-10">
      <section className="overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-xl sm:p-10 lg:p-14">
        {homepageError ? (
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
              {homepage.title ?? 'company name'}
            </h1>
            <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
              {homepage.subtitle ??
                'A company website powered by Strapi and Next.js.'}
            </p>
          </div>
        )}
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              {homepage.services[0].title}
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              {homepage.services[0].description}
            </h2>
          </div>
        </div>

        {homepageError ? (
          <p className="text-sm text-slate-600">
            Services are temporarily unavailable.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {homepage.services[0].services.map(
              (service: { id: Key; title: string; description: string }) => (
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
              )
            )}
          </div>
        )}
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            {homepage.blogpost[0].title}
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            {homepage.blogpost[0].description}
          </h2>
        </div>

        {homepageError ? (
          <p className="text-sm text-slate-600">
            Blog posts are temporarily unavailable.
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {homepage.blogpost[0].blog_posts.map(
              (post: {
                id: Key;
                title: string;
                description: BlocksContent;
              }) => (
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
                    <BlocksRenderer
                      content={truncateBlocks(post.description, 150)}
                    />
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}
