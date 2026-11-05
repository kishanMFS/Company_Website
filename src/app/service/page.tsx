import {
  BlocksRenderer,
  type BlocksContent,
} from '@strapi/blocks-react-renderer';
import Image from 'next/image';
import Link from 'next/link';
import qs from 'qs';

import { fetchApiServer } from '@/hooks/useApi';

interface ServiceImage {
  url?: string | null;
  alternativeText?: string | null;
  data?: {
    attributes?: {
      url?: string | null;
      alternativeText?: string | null;
    } | null;
  } | null;
}

interface Service {
  id: number;
  documentId?: string;
  title: string;
  description?: string | BlocksContent | null;
  price?: string | number | null;
  image?: ServiceImage | null;
}

interface ServiceComponent {
  id: number;
  documentId?: string;
  title: string;
  description?: string;
  pageHeader: string;
}

function getImageDetails(image?: ServiceImage | null) {
  const media = image?.data?.attributes ?? image;
  return {
    url: media?.url,
    alt: media?.alternativeText || 'Service',
  };
}

export default async function ServicesPage() {
  const servicesQuery = qs.stringify({
    fields: ['title', 'description', 'price'],
    populate: {
      image: {
        fields: ['url', 'alternativeText'],
      },
    },
    pagination: {
      pageSize: 100,
    },
  });
  const { data: serviceResponse, error: serviceError } = await fetchApiServer<
    Service[]
  >('/api/services', servicesQuery);
  const services = serviceResponse?.data ?? [];

  const serviceComponentQuery = qs.stringify({
    fields: ['title', 'description', 'pageHeader'],
    pagination: {
      pageSize: 100,
    },
  });
  const { data: serviceComponentResponse, error: serviceComponentError } =
    await fetchApiServer<ServiceComponent>(
      '/api/service-component',
      serviceComponentQuery
    );
  const serviceComponent = serviceComponentResponse?.data;

  return (
    <main className="mx-auto max-w-7xl">
      {serviceComponentError ? (
        <p
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 p-5 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100"
        >
          Service page could not be loaded. {serviceComponentError.message}
        </p>
      ) : (
        <section className="rounded-3xl bg-linear-to-br from-slate-950 via-slate-800 to-indigo-950 px-6 py-16 text-center text-white sm:px-10 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-200">
            {serviceComponent?.pageHeader || 'What we do'}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            {serviceComponent?.title || 'Services built around your goals'}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-200">
            {serviceComponent?.description ||
              'see what is included, and get in touch to find the right fit for your team.'}
          </p>
        </section>
      )}

      <section aria-labelledby="services-heading" className="py-14 sm:py-20">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-700 dark:text-indigo-300">
              Our expertise
            </p>
            <h2
              id="services-heading"
              className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-400"
            >
              How we can help
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {services.length} {services.length === 1 ? 'service' : 'services'}
          </p>
        </div>

        {serviceError ? (
          <p
            role="alert"
            className="rounded-xl border border-red-300 bg-red-50 p-5 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100"
          >
            Services could not be loaded. {serviceError.message}
          </p>
        ) : services.length ? (
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => {
              const image = getImageDetails(service.image);
              return (
                <article
                  key={service.documentId ?? service.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
                >
                  {image.url ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND ?? 'http://localhost:1377'}${image.url}`}
                      alt={image.alt}
                      width={900}
                      height={600}
                      unoptimized
                      className="h-56 w-full object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="flex h-56 items-center justify-center bg-slate-100 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      Service image
                    </div>
                  )}
                  <div className="flex h-full flex-col p-6">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      {service.title}
                    </h3>
                    <div className="mt-3 flex-1 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {Array.isArray(service.description) ? (
                        <BlocksRenderer content={service.description} />
                      ) : (
                        <p>
                          {service.description ||
                            'Contact us to learn more about this service.'}
                        </p>
                      )}
                    </div>
                    <p className="mt-5 border-t border-slate-200 pt-4 text-lg font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100">
                      {service.price !== null &&
                      service.price !== undefined &&
                      String(service.price).trim() !== ''
                        ? `From ${service.price}`
                        : 'Contact us for pricing'}
                    </p>
                    <Link
                      href="/contact"
                      className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
                    >
                      Ask about this service
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-600 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Services are being prepared
            </h3>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Please check back soon or contact us to discuss your needs.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-700 px-5 py-3 font-semibold text-white hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
            >
              Contact us
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
