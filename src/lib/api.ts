import { StrapiResponse } from '../types/strapi';

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:1377';

export async function fetchFromStrapi<T>(path: string): Promise<StrapiResponse<T>> {
  const response = await fetch(`${STRAPI_BASE_URL}${path}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }

  return response.json() as Promise<StrapiResponse<T>>;
}
