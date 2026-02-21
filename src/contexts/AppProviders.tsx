/**
 * AppProviders
 *
 * Composes all global providers into a single wrapper component.
 * This keeps App.tsx clean and makes it trivial to add/remove/reorder
 * providers without touching routing logic.
 */

import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { RBACProvider } from "@/contexts/RBACContext";
import { PackProvider } from "@/contexts/PackContext";
import { IntegrationProvider } from "@/contexts/IntegrationContext";
import { ActionModeProvider } from "@/contexts/ActionModeContext";
import { TenantProvider } from "@/core/store/TenantContext";
import { OKRProvider } from "@/core/store/OKRContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <ThemeProvider>
            <RBACProvider>
              <TenantProvider>
                <PackProvider>
                  <IntegrationProvider>
                    <OKRProvider>
                      <ActionModeProvider>
                        {children}
                      </ActionModeProvider>
                    </OKRProvider>
                  </IntegrationProvider>
                </PackProvider>
              </TenantProvider>
            </RBACProvider>
          </ThemeProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
