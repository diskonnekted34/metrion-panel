/**
 * useMe — lightweight hook to fetch the current authenticated user.
 * Calls GET /auth/me and returns user, tenant, active seat.
 */

import { useQuery } from "@tanstack/react-query";
import { apiGet, ApiError } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { getAccessToken } from "@/lib/authSession";
import type { MeResponse } from "@/contracts/v1/auth";
import type { ApiResponse } from "@/contracts/v1/api";

export function useMe() {
  const hasToken = !!getAccessToken();

  const { data, isLoading, error, refetch } = useQuery<MeResponse, ApiError>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await apiGet<ApiResponse<MeResponse>>(API_ROUTES.auth.me);
      return res.data;
    },
    enabled: hasToken,
    staleTime: 5 * 60 * 1000, // 5 min
    retry: false,
  });

  return {
    user: data?.user ?? null,
    tenant: data?.tenant ?? null,
    activeSeat: data?.seat ?? null,
    membership: data?.membership ?? null,
    isLoading: hasToken && isLoading,
    isAuthenticated: !!data?.user,
    error,
    refetch,
  };
}
