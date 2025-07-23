// src/services/event.api.ts
import apiClient from '@/lib/api/clients';
import {
  EventBase,
  CreateEventPayload,
  UpdateEventPayload,
} from '@/types/event';

class EventApi {
  private basePath = '/events';

  async getEventsByPeermallId(peermallId: string): Promise<EventBase[]> {
    const response = await apiClient.get(
      `${this.basePath}/peermall/${peermallId}`
    );
    return response.data.data;
  }

  async createEvent(eventData: CreateEventPayload): Promise<EventBase> {
    const response = await apiClient.post(`${this.basePath}/create`, eventData);

    console.log(response);

    return response.data.data;
  }

  async getEventById(eventId: string): Promise<EventBase> {
    const response = await apiClient.get(`${this.basePath}/${eventId}`);
    return response.data.data;
  }

  async updateEvent(
    eventId: string,
    eventData: UpdateEventPayload
  ): Promise<EventBase> {
    const response = await apiClient.patch(
      `${this.basePath}/${eventId}`,
      eventData
    );
    return response.data.data;
  }

  async deleteEvent(eventId: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${eventId}`);
  }
}

export const eventApi = new EventApi();
