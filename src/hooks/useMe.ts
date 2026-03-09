/**
 * useMe — lightweight hook to get the current authenticated user's profile.
 * Fetches from the profiles table using the Supabase session.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
}

export function useMe() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data as Profile;
    },
    enabled: isAuthenticated && !!user?.id,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    user: user ?? null,
    profile: profile ?? null,
    isLoading: authLoading || (isAuthenticated && isLoading),
    isAuthenticated,
    error,
    refetch,
  };
}
