import type { EntityStatus } from './common';

export interface Client {
  id: string;
  companyId: string;
  name: string;
  taxId: string;
  address: string;
  phone?: string;
  email?: string;
  status: EntityStatus;
  createdAt: string;
}

