export interface Blogs {
  title: string;
  description: string;
}

export default function BlogHeader({ blogs }: { blogs: Blogs }) {
  console.log(blogs);
  return (
    <section className="bg-linear-to-r from-indigo-600 to-blue-600 py-24 text-white">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h1 className="text-5xl font-bold"> {blogs.title} </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-indigo-100">
          {blogs.description}
        </p>
      </div>
    </section>
  );
}
