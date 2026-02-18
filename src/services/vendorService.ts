import { mockDb } from './mockDb';
import type { Vendor } from '../types/vendors';
import { generateId } from '../lib/id';

export const vendorService = {
  list(companyId: string): Vendor[] {
    return mockDb.getCompany(companyId).vendors;
  },
  get(companyId: string, id: string) {
    return mockDb.getCompany(companyId).vendors.find((v) => v.id === id) ?? null;
  },
  create(companyId: string, data: Omit<Vendor, 'id' | 'companyId' | 'createdAt'>): Vendor {
    const db = mockDb.getCompany(companyId);
    const vendor: Vendor = {
      ...data,
      id: generateId(),
      companyId,
      createdAt: new Date().toISOString()
    };
    db.vendors.push(vendor);
    return vendor;
  },
  update(
    companyId: string,
    id: string,
    data: Partial<Omit<Vendor, 'id' | 'companyId' | 'createdAt'>>
  ): Vendor | null {
    const db = mockDb.getCompany(companyId);
    const idx = db.vendors.findIndex((v) => v.id === id);
    if (idx === -1) return null;
    const updated = { ...db.vendors[idx], ...data };
    db.vendors[idx] = updated;
    return updated;
  },
  remove(companyId: string, id: string) {
    const db = mockDb.getCompany(companyId);
    db.vendors = db.vendors.filter((v) => v.id !== id);
  }
};

