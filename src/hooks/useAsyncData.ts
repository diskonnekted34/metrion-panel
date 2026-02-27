/**
 * useAsyncData — thin wrapper over useQuery for service fetches.
 * Returns { data, isLoading, error, retry } with correct typing.
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

interface AsyncDataResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  retry: () => void;
}

export function useAsyncData<T>(
  key: string[],
  fetcher: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">,
): AsyncDataResult<T> {
  const { data, isLoading, error, refetch } = useQuery<T, Error>({
    queryKey: key,
    queryFn: fetcher,
    staleTime: 2 * 60 * 1000,
    ...options,
  });

  return {
    data,
    isLoading,
    error: error ?? null,
    retry: () => { refetch(); },
  };
}
