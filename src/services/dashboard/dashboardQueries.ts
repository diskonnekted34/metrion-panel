/**
 * React Query hooks for the Merkez / Command Center dashboard.
 */
import { useQuery } from "@tanstack/react-query";
import type { TimeRange, CompanySnapshot } from "@/types/dashboard";
import { getCompanySnapshot } from "@/mocks/dashboardMock";

export function useCompanySnapshotQuery(range: TimeRange) {
  return useQuery<CompanySnapshot>({
    queryKey: ["companySnapshot", range],
    queryFn: async () => getCompanySnapshot(range),
    refetchInterval: 30_000,
    placeholderData: (prev) => prev, // keep previous data while refetching
  });
}
