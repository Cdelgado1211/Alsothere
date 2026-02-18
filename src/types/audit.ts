export type AuditAction =
  | 'invoice_created'
  | 'invoice_updated'
  | 'invoice_voided'
  | 'invoice_paid'
  | 'bill_created'
  | 'bill_updated'
  | 'bill_voided'
  | 'bill_paid'
  | 'bank_movement_created';

export interface AuditLogEntry {
  id: string;
  companyId: string;
  action: AuditAction;
  entityId: string;
  entityType: string;
  message: string;
  createdAt: string;
}

