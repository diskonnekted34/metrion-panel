/**
 * AppProviders — composes all global providers.
 * Order matters: Auth wraps everything that needs user state.
 */
import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { RBACProvider } from "@/contexts/RBACContext";
import { PackProvider } from "@/contexts/PackContext";
import { IntegrationProvider } from "@/contexts/IntegrationContext";
import { ActionModeProvider } from "@/contexts/ActionModeContext";
import { TenantProvider } from "@/core/store/TenantContext";
import { OKRProvider } from "@/core/store/OKRContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthorizationProvider } from "@/contexts/AuthorizationContext";
import { queryClient } from "@/lib/queryClient";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <AuthorizationProvider>
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
              </AuthorizationProvider>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </TooltipProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
