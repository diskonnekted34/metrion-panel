/**
 * Event Bus (Outbox Pattern - Frontend Simulation)
 * Centralized event emission, processing, and correlation.
 */

import { DomainEvent, EventType, EventStatus } from "../types/infrastructure";

type EventHandler = (event: DomainEvent) => void;

class EventBus {
  private events: DomainEvent[] = [];
  private handlers: Map<EventType, EventHandler[]> = new Map();
  private idCounter = 0;

  /** Emit a domain event */
  emit(
    tenantId: string,
    eventType: EventType,
    entityType: string,
    entityId: string,
    payload: Record<string, unknown>,
    correlationId?: string,
    causationId?: string
  ): DomainEvent {
    const event: DomainEvent = {
      id: `evt_${++this.idCounter}_${Date.now()}`,
      tenant_id: tenantId,
      event_type: eventType,
      entity_type: entityType,
      entity_id: entityId,
      payload,
      status: "pending" as EventStatus,
      correlation_id: correlationId,
      causation_id: causationId,
      created_at: new Date().toISOString(),
    };

    this.events.push(event);
    this.process(event);
    return event;
  }

  /** Register handler for an event type */
  on(eventType: EventType, handler: EventHandler): () => void {
    const handlers = this.handlers.get(eventType) || [];
    handlers.push(handler);
    this.handlers.set(eventType, handlers);
    return () => {
      const idx = handlers.indexOf(handler);
      if (idx >= 0) handlers.splice(idx, 1);
    };
  }

  /** Process an event through registered handlers */
  private process(event: DomainEvent): void {
    const handlers = this.handlers.get(event.event_type) || [];
    try {
      handlers.forEach(h => h(event));
      event.status = "processed";
      event.processed_at = new Date().toISOString();
    } catch {
      event.status = "failed";
    }
  }

  /** Query events */
  getEvents(tenantId: string, filters?: {
    event_type?: EventType;
    entity_type?: string;
    entity_id?: string;
    status?: EventStatus;
    limit?: number;
  }): DomainEvent[] {
    let result = this.events.filter(e => e.tenant_id === tenantId);
    if (filters?.event_type) result = result.filter(e => e.event_type === filters.event_type);
    if (filters?.entity_type) result = result.filter(e => e.entity_type === filters.entity_type);
    if (filters?.entity_id) result = result.filter(e => e.entity_id === filters.entity_id);
    if (filters?.status) result = result.filter(e => e.status === filters.status);
    if (filters?.limit) result = result.slice(-filters.limit);
    return result;
  }

  /** Get full event log count */
  count(tenantId: string): number {
    return this.events.filter(e => e.tenant_id === tenantId).length;
  }
}

/** Singleton event bus instance */
export const eventBus = new EventBus();
