import { integrations, type Integration } from "@/data/integrations";
import { techConnectors, type TechConnector } from "@/data/techIntegrations";

export const IntegrationService = {
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
};
