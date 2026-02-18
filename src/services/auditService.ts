import type { AuditLogEntry, AuditAction } from '../types/audit';
import { mockDb } from './mockDb';
import { generateId } from '../lib/id';

export const auditService = {
  log(companyId: string, entry: Omit<AuditLogEntry, 'id' | 'createdAt' | 'companyId'>) {
    const db = mockDb.getCompany(companyId);
    const auditEntry: AuditLogEntry = {
      id: generateId(),
      companyId,
      createdAt: new Date().toISOString(),
      ...entry
    };
    db.audit.push(auditEntry);
    return auditEntry;
  },
  list(companyId: string): AuditLogEntry[] {
    const db = mockDb.getCompany(companyId);
    return [...db.audit].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  }
};

export const logInvoiceAction = (
  companyId: string,
  action: AuditAction,
  invoiceId: string,
  message: string
) => {
  return auditService.log(companyId, {
    action,
    entityId: invoiceId,
    entityType: 'invoice',
    message
  });
};

export const logBillAction = (
  companyId: string,
  action: AuditAction,
  billId: string,
  message: string
) => {
  return auditService.log(companyId, {
    action,
    entityId: billId,
    entityType: 'bill',
    message
  });
};

