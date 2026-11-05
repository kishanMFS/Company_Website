// 'use client';

import Image from 'next/image';
import Link from 'next/link';
import { fetchApiServer } from '@/hooks/useApi';

import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import type { BlocksContent } from '@strapi/blocks-react-renderer';
import qs from 'qs';

interface About {
  title?: string;
  description?: string;
  mission?: { title: string; description?: string }[];
  vision?: { title: string; description?: string };
  teammember?: {
    title: string;
    description?: string;
    team_members?: TeamMember[];
  };
}

interface TeamMember {
  id: number;
  documentId?: string;
  name: string;
  designation: string | BlocksContent;
  bio: BlocksContent;
  photo: {
    alternativeText?: string;
    url?: string;
  };
}

export default async function AboutPage() {
  const aboutQuery = qs.stringify({
    populate: {
      fields: ['title', 'description'],
      mission: {
        on: {
          'components.mission': {
            populate: {
              fields: ['title', 'description'],
            },
          },
        },
      },
      vision: {
        fields: ['title', 'description'],
      },
      teammember: {
        fields: ['title', 'description'],
        populate: {
          team_members: {
            fields: ['name', 'designation', 'bio'],
            populate: {
              photo: true,
            },
          },
        },
      },
    },
  });

  const { data: aboutResponse, error: aboutError } =
    await fetchApiServer<About>('/api/about', aboutQuery);

  if (aboutError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Failed to load About page data.</p>
      </div>
    );
  }

  // Adjust according to your API response structure
  const about = aboutResponse?.data;
  const members = about?.teammember?.team_members ?? [];
  if (!about) {
    return (
      <main className="mx-auto max-w-3xl py-16">
        <p role="alert" className="text-slate-700 dark:text-slate-200">
          About page content is not available yet.
        </p>
      </main>
    );
  }
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-linear-to-r from-blue-600 to-indigo-700 py-24">
        <div className="container mx-auto px-6 text-center text-white">
          <h1 className="text-5xl font-bold">{about.title}</h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-blue-100">
            {about.description}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border bg-gray-50 p-8 shadow-sm">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              {about.mission?.[0]?.title ?? 'Our mission'}
            </h2>

            <p className="leading-8 text-gray-600">
              {about.mission?.[0]?.description ||
                'Mission will be managed from CMS.'}
            </p>
          </div>

          <div className="rounded-2xl border bg-gray-50 p-8 shadow-sm">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              {about.vision?.title ?? 'Our vision'}
            </h2>

            <p className="leading-8 text-gray-600">
              {about.vision?.description || 'Vision will be managed from CMS.'}
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              {about.teammember?.title ?? 'Meet the team'}
            </h2>

            <p className="mt-3 text-gray-600">
              {about.teammember?.description}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative h-72 w-full">
                  <Image
                    src={
                      member.photo?.url
                        ? `${process.env.NEXT_PUBLIC_BACKEND}${member.photo.url}`
                        : '/placeholder-user.png'
                    }
                    alt={member.photo?.alternativeText ?? `${member.name}`}
                    width="400"
                    height="100"
                    // fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {member.name}
                  </h3>

                  <div className="mt-1 text-sm font-semibold text-blue-600">
                    {/* {member.designation} */}
                    {typeof member.designation === 'string' ? (
                      member.designation
                    ) : (
                      <BlocksRenderer content={member.designation || []} />
                    )}
                  </div>

                  <div className="mt-4 text-sm leading-6 text-gray-600 line-clamp-4">
                    {/* {member.bio} */}
                    <BlocksRenderer content={member.bio || []} />
                  </div>
                  <Link
                    href={`/team/${member.documentId ?? member.id}`}
                    className="mt-5 inline-flex min-h-11 items-center rounded-lg font-semibold text-indigo-800 underline underline-offset-4 hover:text-indigo-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
                  >
                    View {member.name}&apos;s profile
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {members.length === 0 && (
            <div className="mt-10 rounded-xl border border-dashed py-16 text-center text-gray-500">
              No team members found.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
