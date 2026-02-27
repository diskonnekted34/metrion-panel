/**
 * Branding — single source of truth for product identity.
 * All UI components must read from here; never hardcode product names.
 */
export const BRAND = {
  name: "Metrion",
  mark: "®",
  mobileShort: "M",
  copyright: `© ${new Date().getFullYear()} Metrion. All rights reserved.`,
  /** Where logo click navigates for authenticated users */
  dashboardPath: "/dashboard",
  /** Where logo click navigates for unauthenticated users */
  publicPath: "/",
} as const;
