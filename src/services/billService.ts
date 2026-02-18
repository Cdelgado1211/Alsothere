import { mockDb } from './mockDb';
import type { Bill } from '../types/bills';
import { generateId } from '../lib/id';
import { bankAccountService } from './bankAccountService';
import { logBillAction } from './auditService';

export const billService = {
  list(companyId: string): Bill[] {
    return mockDb.getCompany(companyId).bills;
  },
  get(companyId: string, id: string) {
    return mockDb.getCompany(companyId).bills.find((b) => b.id === id) ?? null;
  },
  create(companyId: string, data: Omit<Bill, 'id' | 'companyId'>): Bill {
    const db = mockDb.getCompany(companyId);
    const bill: Bill = {
      ...data,
      id: generateId(),
      companyId
    };
    db.bills.push(bill);
    logBillAction(companyId, 'bill_created', bill.id, 'Factura de proveedor creada');
    return bill;
  },
  update(
    companyId: string,
    id: string,
    data: Partial<Omit<Bill, 'id' | 'companyId'>>
  ): Bill | null {
    const db = mockDb.getCompany(companyId);
    const idx = db.bills.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    const current = db.bills[idx];
    if (current.status === 'paid' || current.status === 'void') return current;
    const updated: Bill = { ...current, ...data };
    db.bills[idx] = updated;
    logBillAction(companyId, 'bill_updated', updated.id, 'Factura de proveedor actualizada');
    return updated;
  },
  void(companyId: string, id: string): Bill | null {
    const db = mockDb.getCompany(companyId);
    const idx = db.bills.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    const current = db.bills[idx];
    const updated: Bill = { ...current, status: 'void' };
    db.bills[idx] = updated;
    logBillAction(companyId, 'bill_voided', updated.id, 'Factura de proveedor anulada');
    return updated;
  },
  registerPayment(
    companyId: string,
    id: string,
    bankAccountId: string
  ): { bill: Bill; movementId: string } | null {
    const db = mockDb.getCompany(companyId);
    const idx = db.bills.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    const current = db.bills[idx];
    if (current.status === 'paid' || current.status === 'void') {
      return { bill: current, movementId: '' };
    }

    const movement = bankAccountService.recordMovement(companyId, {
      bankAccountId,
      type: 'expense',
      referenceType: 'vendorBill',
      referenceId: current.id,
      amount: current.total
    });

    const updated: Bill = { ...current, status: 'paid' };
    db.bills[idx] = updated;
    logBillAction(
      companyId,
      'bill_paid',
      updated.id,
      `Factura de proveedor pagada con cuenta ${bankAccountId}`
    );
    return { bill: updated, movementId: movement?.id ?? '' };
  }
};

