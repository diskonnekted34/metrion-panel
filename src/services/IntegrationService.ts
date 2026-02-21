/**
 * IntegrationService — Data Access Layer
 *
 * Provides both sync and async methods.
 */

import { integrations, type Integration } from "@/data/integrations";
import { techConnectors, type TechConnector } from "@/data/techIntegrations";

export const IntegrationService = {
  // Sync methods (existing consumers)
  getAllBusinessIntegrations(): Integration[] {
    return integrations;
  },

  getBusinessIntegrationById(id: string): Integration | undefined {
    return integrations.find(i => i.id === id);
  },

  getAllTechConnectors(): TechConnector[] {
    return techConnectors;
  },

  getTechConnectorById(id: string): TechConnector | undefined {
    return techConnectors.find(c => c.id === id);
  },

  // Async methods (future API replacement)
  async fetchAllBusinessIntegrations(): Promise<Integration[]> {
    return Promise.resolve(integrations);
  },

  async fetchBusinessIntegrationById(id: string): Promise<Integration | undefined> {
    return Promise.resolve(integrations.find(i => i.id === id));
  },

  async fetchAllTechConnectors(): Promise<TechConnector[]> {
    return Promise.resolve(techConnectors);
  },

  async fetchTechConnectorById(id: string): Promise<TechConnector | undefined> {
    return Promise.resolve(techConnectors.find(c => c.id === id));
  },
};
