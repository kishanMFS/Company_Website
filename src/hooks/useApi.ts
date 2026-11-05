import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchFromStrapi, postToApi } from '../lib/api';
import { StrapiResponse } from '../types/strapi';

export function useApiClient<T = unknown>(
  path: string,
  queryString: string,
  enabled = true
) {
  return useQuery<StrapiResponse<T>, Error>({
    queryKey: ['strapi', path],
    queryFn: () => fetchFromStrapi<T>(path, queryString),
    enabled,
    retry: false,
  });
}

export function useApiMutation<TResponse = unknown, TBody = unknown>(
  path: string
) {
  return useMutation<TResponse, Error, TBody>({
    mutationKey: ['api', path],
    mutationFn: (body) => postToApi<TResponse, TBody>(path, body),
  });
}

export async function fetchApiServer<T = unknown>(
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
