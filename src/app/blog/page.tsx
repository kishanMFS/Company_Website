'use client';

import { useApiClient } from '@/hooks/useApi';
import BlogCard, { type BlogPost } from '../../components/blog/BlogCard';
import BlogHero from '../../components/blog/BlogHero';
import qs from 'qs';
import { useMemo, useState } from 'react';
import type { BlocksContent } from '@strapi/blocks-react-renderer';

interface BlogSection {
  title: string;
  description: string;
  blog_posts?: BlogPost[];
}

interface Blog {
  blog?: BlogSection[];
}

export default function BlogPage() {
  const [search, setSearch] = useState('');
  const blogQuery = qs.stringify({
    populate: {
      blog: {
        fields: ['title', 'description'],
        populate: {
          blog_posts: {
            fields: ['title', 'slug', 'author', 'date', 'description'],
            populate: {
              image: true,
            },
          },
        },
      },
    },
  });

  const {
    data: blogResponse,
    isLoading: loadingBlog,
    error: blogError,
  } = useApiClient<Blog>('/api/blog', blogQuery);

  const blogs = blogResponse?.data.blog?.[0];
  const filteredPosts = useMemo(() => {
    const posts = blogs?.blog_posts ?? [];
    const normalizedSearch = search.trim().toLocaleLowerCase();

    if (!normalizedSearch) {
      return posts;
    }

    return posts.filter((post) =>
      JSON.stringify(post).toLocaleLowerCase().includes(normalizedSearch)
    );
  }, [blogs, search]);

  return (
    <main className="bg-gray-50">
      {loadingBlog ? (
        <p role="status" className="sr-only">
          Loading blog articles…
        </p>
      ) : blogs ? (
        <BlogHero blogs={blogs} />
      ) : (
        <section className="bg-linear-to-r from-indigo-600 to-blue-600 py-20 text-center text-white">
          <h1 className="text-4xl font-bold">Insights</h1>
          <p className="mt-4">Ideas and updates from our team.</p>
        </section>
      )}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:color-emerald-950">
              Latest Articles
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {filteredPosts.length}{' '}
              {filteredPosts.length === 1 ? 'article' : 'articles'}
            </p>
          </div>
          <div className="w-full sm:max-w-sm">
            <label
              htmlFor="blog-search"
              className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-950"
            >
              Search articles
            </label>
            <input
              id="blog-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by keyword"
              className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:border-slate-600 light:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-400"
            />
          </div>
        </div>
        <div
          className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
          aria-live="polite"
          aria-busy={loadingBlog}
        >
          {loadingBlog ? (
            <p role="status">Loading articles…</p>
          ) : blogError ? (
            <p role="alert" className="text-red-800 dark:text-red-200">
              {blogError.message}
            </p>
          ) : filteredPosts.length ? (
            filteredPosts.map((blog) => (
              <BlogCard key={blog.slug} blog={blog} />
            ))
          ) : (
            <p className="text-slate-700 dark:text-slate-200">
              {search.trim()
                ? 'No articles match your search.'
                : 'No articles are available yet.'}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
