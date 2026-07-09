import { useQuery } from '@tanstack/react-query';
import { fetchFromStrapi } from '../lib/api';
import { StrapiResponse } from '../types/strapi';

export function useApiClient<T = unknown>(path: string, queryString: string, enabled = true) {
  return useQuery<StrapiResponse<T>, Error>({
    queryKey: ['strapi', path],
    queryFn: () => fetchFromStrapi<T>(path, queryString),
    enabled,
    retry: false,
  });
}

export async function useApiServer<T = unknown> (
  path: string,
  queryString: string
): Promise<{
  data: StrapiResponse<T> | null;
  error: Error | null;
}> {
  try {
    const data = await fetchFromStrapi<T>(path, queryString);
// console.dir(data)
    return {
      data,
      error: null,
    };
  } catch (err) {
    // console.dir(err.message)
    return {
      data: null,
      error: err as Error,
    };
  }
}