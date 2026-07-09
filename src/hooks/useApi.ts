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

export function useApiServer<T = unknown> (path: string, queryString: string) {
  return fetchFromStrapi<T>(path, queryString);
}