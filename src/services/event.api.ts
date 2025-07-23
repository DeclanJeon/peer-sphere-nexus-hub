// src/services/event.api.ts
import { API_BASE_URL } from '@/lib/api/clients';
import axios from 'axios';
import { Event } from '@/types/event';

class EventApi {
  private api = axios.create({
    baseURL: `${API_BASE_URL}/api/v1/events`,
    withCredentials: true,
  });

  async getEventsByPeermallId(peermallId: string): Promise<Event[]> {
    const response = await this.api.get(`/peermall/${peermallId}`);
    return response.data.data;
  }

  async createEvent(eventData: Omit<Event, 'id'>): Promise<Event> {
    const response = await this.api.post('/create', eventData);
    return response.data.data;
  }

  async getEventById(id: string): Promise<Event> {
    const response = await this.api.get(`/${id}`);
    return response.data.data;
  }

  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
    const response = await this.api.patch(`/${id}`, eventData);
    return response.data.data;
  }

  async deleteEvent(id: string): Promise<void> {
    await this.api.delete(`/${id}`);
  }
}

export const eventApi = new EventApi();
