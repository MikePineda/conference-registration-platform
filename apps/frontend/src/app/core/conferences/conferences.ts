import { Injectable, inject } from '@angular/core';
import { API } from '../api';
import type { Data } from '@api-starter-kit/backend/data';

export interface ConferencePayload {
  name: string;
  description: string | null;
  location: string | null;
  imageUrl: string | null;
  capacity: number;
  startDate: string;
  endDate: string | null;
}

@Injectable({ providedIn: 'root' })
export class Conferences {
  private api = inject(API);

  async list(): Promise<Data.Conference[]> {
    const { data } = await this.api.api.conferences.conferences.index({});
    return data;
  }

  async create(payload: ConferencePayload): Promise<Data.Conference> {
    const { data } = await this.api.api.conferences.conferences.store({ body: payload });
    return data;
  }

  async get(id: number): Promise<Data.Conference> {
    const { data } = await this.api.api.conferences.conferences.show({ params: { id } });
    return data;
  }

  async update(id: number, payload: ConferencePayload): Promise<Data.Conference> {
    const { data } = await this.api.api.conferences.conferences.update({
      params: { id },
      body: payload,
    });
    return data;
  }

  async delete(id: number): Promise<void> {
    await this.api.api.conferences.conferences.destroy({ params: { id } });
  }
}
