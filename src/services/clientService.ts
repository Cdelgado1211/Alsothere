import { mockDb } from './mockDb';
import type { Client } from '../types/clients';
import { generateId } from '../lib/id';

export const clientService = {
  list(companyId: string): Client[] {
    return mockDb.getCompany(companyId).clients;
  },
  get(companyId: string, id: string) {
    return mockDb.getCompany(companyId).clients.find((c) => c.id === id) ?? null;
  },
  create(companyId: string, data: Omit<Client, 'id' | 'companyId' | 'createdAt'>): Client {
    const db = mockDb.getCompany(companyId);
    const client: Client = {
      ...data,
      id: generateId(),
      companyId,
      createdAt: new Date().toISOString()
    };
    db.clients.push(client);
    return client;
  },
  update(
    companyId: string,
    id: string,
    data: Partial<Omit<Client, 'id' | 'companyId' | 'createdAt'>>
  ): Client | null {
    const db = mockDb.getCompany(companyId);
    const idx = db.clients.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    const updated = { ...db.clients[idx], ...data };
    db.clients[idx] = updated;
    return updated;
  },
  remove(companyId: string, id: string) {
    const db = mockDb.getCompany(companyId);
    db.clients = db.clients.filter((c) => c.id !== id);
  }
};

