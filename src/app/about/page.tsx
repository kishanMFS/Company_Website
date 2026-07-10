// 'use client';

import Image from 'next/image';
import { useApiServer } from '@/hooks/useApi';

import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import type { BlocksContent } from '@strapi/blocks-react-renderer';
import qs from 'qs';

interface About {
  mission: string;
  vision: string;
}

interface TeamMember {
  id: number;
  name: string;
  designation: string;
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

  const {
    data: aboutResponse,
    isLoading: loadingAbout,
    error: aboutError,
  } = await useApiServer<About>('/api/about', aboutQuery);
  console.log(aboutError);
  console.log(aboutResponse);
  if (loadingAbout) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  if (aboutError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Failed to load About page data.</p>
      </div>
    );
  }

  // Adjust according to your API response structure
  const about = aboutResponse?.data;
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
              {about.mission[0].title}
            </h2>

            <p className="leading-8 text-gray-600">
              {about?.mission[0].description ||
                'Mission will be managed from CMS.'}
            </p>
          </div>

          <div className="rounded-2xl border bg-gray-50 p-8 shadow-sm">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              {about.vision.title}
            </h2>

            <p className="leading-8 text-gray-600">
              {about?.vision.description || 'Vision will be managed from CMS.'}
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              {about.teammember.title}
            </h2>

            <p className="mt-3 text-gray-600">{about.teammember.description}</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {about.teammember?.team_members.map((member: TeamMember) => (
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
                    alt={member.photo?.alternativeText}
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
                    <BlocksRenderer content={member.designation || []} />
                  </div>

                  <div className="mt-4 text-sm leading-6 text-gray-600 line-clamp-4">
                    {/* {member.bio} */}
                    <BlocksRenderer content={member.bio || []} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {about?.length === 0 && (
            <div className="mt-10 rounded-xl border border-dashed py-16 text-center text-gray-500">
              No team members found.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
