'use client';

import { useApiClient } from '@/hooks/useApi';
import BlogCard from '../../components/blog/BlogCard';
import BlogHero from '../../components/blog/BlogHero';
import qs from 'qs';

export interface Blog {
  slug: string;
  title: string;
  author: string;
  publishedAt: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
}

export default function BlogPage() {
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

  const blogs = blogResponse?.data.blog[0];

  return (
    <main className="bg-gray-50">
      {loadingBlog ? <></> : <BlogHero blogs={blogs} />}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-3xl font-bold"> Latest Articles </h2>
          <span className="text-gray-500">
            {blogs && <span>{blogs.blog_posts?.length} Articles</span>}
          </span>
        </div>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {loadingBlog ? (
            <>Loading Articles...</>
          ) : blogError ? (
            <p className="text-red-500">{blogError.message}</p>
          ) : blogs ? (
            blogs.blog_posts?.map((blog) => (
              <BlogCard key={blog.slug} blog={blog} />
            ))
          ) : (
            <>No Article available</>
          )}
        </div>
      </section>
    </main>
  );
}
