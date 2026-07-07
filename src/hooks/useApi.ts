import { useQuery } from '@tanstack/react-query';
import { fetchFromStrapi } from '../lib/api';
import { StrapiResponse } from '../types/strapi';

export function useApi<T = unknown>(path: string, enabled = true) {
  return useQuery<StrapiResponse<T>, Error>({
    queryKey: ['strapi', path],
    queryFn: () => fetchFromStrapi<T>(path),
    enabled,
    retry: false,
  });
}