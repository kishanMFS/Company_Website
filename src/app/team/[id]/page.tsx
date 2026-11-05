import {
  BlocksRenderer,
  type BlocksContent,
} from '@strapi/blocks-react-renderer';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import qs from 'qs';

import { fetchApiServer } from '@/hooks/useApi';

interface TeamImage {
  url?: string | null;
  alternativeText?: string | null;
  data?: {
    attributes?: {
      url?: string | null;
      alternativeText?: string | null;
    } | null;
  } | null;
}

interface TeamMember {
  id: number;
  documentId?: string;
  name: string;
  designation?: string | BlocksContent | null;
  bio?: BlocksContent | null;
  photo?: TeamImage | null;
}

interface AboutContent {
  teammember?: {
    team_members?: TeamMember[];
  };
}

interface TeamPageProps {
  params: Promise<{ id: string }>;
}

function getImageDetails(image?: TeamImage | null) {
  const media = image?.data?.attributes ?? image;
  return {
    url: media?.url,
    alt: media?.alternativeText,
  };
}

export default async function TeamMemberPage({ params }: TeamPageProps) {
  const { id } = await params;
  const query = qs.stringify({
    populate: {
      teammember: {
        populate: {
          team_members: {
            fields: ['name', 'designation', 'bio'],
            populate: {
              photo: {
                fields: ['url', 'alternativeText'],
              },
            },
          },
        },
      },
    },
  });
  const { data, error } = await fetchApiServer<AboutContent>(
    '/api/about',
    query
  );

  if (error) {
    return (
      <div className="mx-auto max-w-3xl py-16">
        <p role="alert" className="text-red-800 dark:text-red-200">
          Team member details could not be loaded. {error.message}
        </p>
        <Link
          href="/about"
          className="mt-6 inline-flex min-h-11 items-center rounded-lg font-semibold text-indigo-800 underline underline-offset-4 dark:text-indigo-300"
        >
          Back to About
        </Link>
      </div>
    );
  }

  const members = data?.data?.teammember?.team_members ?? [];
  const member = members.find(
    (candidate) => String(candidate.id) === id || candidate.documentId === id
  );

  if (!member) {
    notFound();
  }

  const image = getImageDetails(member.photo);

  return (
    <main className="mx-auto max-w-5xl py-8 sm:py-14">
      <Link
        href="/about"
        className="inline-flex min-h-11 items-center rounded-lg font-semibold text-indigo-800 underline underline-offset-4 hover:text-indigo-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
      >
        Back to About
      </Link>
      <article className="mt-8 grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid-cols-[minmax(16rem,0.8fr)_1.2fr] dark:border-slate-700 dark:bg-slate-900">
        {image.url ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND ?? 'http://localhost:1377'}${image.url}`}
            alt={
              image.alt ||
              `${member.name}, ${typeof member.designation === 'string' ? member.designation : 'team member'}`
            }
            width={900}
            height={1100}
            unoptimized
            className="h-full min-h-80 w-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex min-h-80 items-center justify-center bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            Team member
          </div>
        )}
        <div className="p-7 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-700 dark:text-indigo-300">
            Meet the team
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
            {member.name}
          </h1>
          {member.designation && (
            <div className="mt-3 text-lg font-medium text-slate-700 dark:text-slate-200">
              {typeof member.designation === 'string' ? (
                member.designation
              ) : (
                <BlocksRenderer content={member.designation} />
              )}
            </div>
          )}
          {member.bio && (
            <div className="prose prose-slate mt-7 max-w-none leading-7 text-slate-700 dark:prose-invert dark:text-slate-200">
              <BlocksRenderer content={member.bio} />
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
