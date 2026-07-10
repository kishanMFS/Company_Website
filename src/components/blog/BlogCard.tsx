import {
  BlocksRenderer,
  type BlocksContent,
} from '@strapi/blocks-react-renderer';
import Link from 'next/link';
import Image from 'next/image';
import { truncateBlocks } from '../../lib/utils';

interface StrapiImage {
  url: string;
  alternativeText?: string | null;
}
export interface Blog {
  description: BlocksContent;
  date: string;
  slug: string;
  title: string;
  author: string;
  publishedAt: string;
  category: string;
  image?: StrapiImage | null;
  content: string;
}

export default function BlogCard({ blog }: { blog: Blog }) {
  return (
    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">
      {blog?.image?.url && (
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND}${blog.image.url}`}
          alt={blog.image.alternativeText ?? 'Company Logo'}
          width="100"
          height="100"
          className="h-56 w-full object-cover"
          priority
          // unoptimized
        />
      )}

      <div className="p-6">
        <h2 className="mt-4 text-2xl font-bold text-gray-900">{blog.title}</h2>
        <div className="mt-2 flex gap-4 text-sm text-gray-500">
          <span>{blog.author}</span> <span>{blog.date}</span>
        </div>
        <div className="mt-4 text-gray-600">
          <BlocksRenderer
            content={truncateBlocks(
              blog.description ?? 'description area',
              150
            )}
          />
        </div>
        <Link
          href={`/blog/${blog.slug}`}
          className="mt-6 inline-flex rounded-lg bg-indigo-600 px-5 py-2 text-white transition hover:bg-indigo-700"
        >
          Read Article {'>>'}
        </Link>
      </div>
    </article>
  );
}
