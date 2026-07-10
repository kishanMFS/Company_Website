'use client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useApiClient } from '@/hooks/useApi';
import qs from 'qs';
import * as React from 'react';
import { useParams } from 'next/navigation';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';

interface Props {
  params: { slug: string };
}

export interface Blog {
  image: any;
  date: string;
  description: string;
  slug: string;
  title: string;
  author: string;
  publishedAt: string;
  category: string;
  content: string;
}

export default function BlogDetails() {
  const params = useParams();
  const slug = params.slug as string;

  const blogPostQuery = qs.stringify({
    // fields: ['title', 'slug', 'author', 'date', 'description'],
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      image: true,
    },
  });

  const {
    data: blogPostResponse,
    isLoading: loadingBlogPost,
    error: blogPostError,
  } = useApiClient<Blog>('/api/blog-posts', blogPostQuery);

  const blog = blogPostResponse?.data?.find((blog) => blog.slug === slug);

  return (
    <main className="bg-gray-50">
      {loadingBlogPost ? (
        <>Loading Blog '{slug}' ...</>
      ) : blogPostError ? (
        <p className="text-red-500">{blogPostError.message}</p>
      ) : blog ? (
        <div>
          <div className="relative h-112.5">
            {blog?.image?.url && (
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND}${blog.image.url}`}
                alt={blog.image.alternativeText ?? 'blog Logo'}
                width="2000"
                height="1000"
                className="h-full w-full object-cover"
                priority
                // unoptimized
              />
            )}
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 flex items-center">
              <div className="mx-auto max-w-5xl px-6 text-white">
                {/* <span className="rounded-full bg-indigo-500 px-4 py-2 text-sm">
                  {blog.category}
                </span> */}
                <h1 className="mt-6 text-5xl font-bold"> {blog.title} </h1>
                <div className="mt-5 flex gap-6 text-indigo-100">
                  <span>{blog.author}</span> <span>{blog.date}</span>
                </div>
              </div>
            </div>
          </div>
          <section className="mx-auto max-w-4xl px-6 py-20">
            <article className="prose prose-lg max-w-none whitespace-pre-line rounded-2xl bg-white p-10 shadow">
              <BlocksRenderer
                content={blog.description ?? 'description area'}
              />
            </article>
            <div className="mt-12">
              <Link
                href="/blog"
                className="rounded-lg bg-indigo-600 px-6 py-3 text-white transition hover:bg-indigo-700"
              >
                {'<-'} Back to Blogs
              </Link>
            </div>
          </section>
        </div>
      ) : (
        <>Blog Not Found</>
      )}
    </main>
  );
}
