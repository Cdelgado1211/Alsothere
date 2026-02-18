import { mockDb } from './mockDb';
import type { Invoice, InvoiceItem } from '../types/invoices';
import { calculateInvoiceTotals, generateInvoiceNumber } from '../lib/invoice';
import { generateId } from '../lib/id';
import { bankAccountService } from './bankAccountService';
import { logInvoiceAction } from './auditService';

export const invoiceService = {
  list(companyId: string): Invoice[] {
    return mockDb.getCompany(companyId).invoices;
  },
  get(companyId: string, id: string) {
    return mockDb.getCompany(companyId).invoices.find((i) => i.id === id) ?? null;
  },
  create(
    companyId: string,
    data: Omit<Invoice, 'id' | 'companyId' | 'subtotal' | 'taxes' | 'total' | 'invoiceNumber'>
  ): Invoice {
    const db = mockDb.getCompany(companyId);
    db.invoiceSequence += 1;
    const invoiceNumber = generateInvoiceNumber(db.invoiceSequence);
    const totals = calculateInvoiceTotals(data.items);
    const invoice: Invoice = {
      ...data,
      id: generateId(),
      companyId,
      invoiceNumber,
      subtotal: totals.subtotal,
      taxes: totals.taxes,
      total: totals.total
    };
    db.invoices.push(invoice);
    logInvoiceAction(companyId, 'invoice_created', invoice.id, `Factura ${invoiceNumber} creada`);
    return invoice;
  },
  update(
    companyId: string,
    id: string,
    data: Partial<Omit<Invoice, 'id' | 'companyId' | 'invoiceNumber'>>
  ): Invoice | null {
    const db = mockDb.getCompany(companyId);
    const idx = db.invoices.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    const current = db.invoices[idx];
    if (current.status === 'paid' || current.status === 'void') {
      return current;
    }
    let updated: Invoice = { ...current, ...data };
    if (data.items) {
      const totals = calculateInvoiceTotals(data.items as InvoiceItem[]);
      updated = { ...updated, ...totals };
    }
    db.invoices[idx] = updated;
    logInvoiceAction(companyId, 'invoice_updated', updated.id, 'Factura actualizada');
    return updated;
  },
  void(companyId: string, id: string): Invoice | null {
    const db = mockDb.getCompany(companyId);
    const idx = db.invoices.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    const current = db.invoices[idx];
    const updated: Invoice = { ...current, status: 'void' };
    db.invoices[idx] = updated;
    logInvoiceAction(companyId, 'invoice_voided', updated.id, 'Factura anulada');
    return updated;
  },
  markAsPaid(
    companyId: string,
    id: string,
    bankAccountId: string
  ): { invoice: Invoice; movementId: string } | null {
    const db = mockDb.getCompany(companyId);
    const idx = db.invoices.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    const current = db.invoices[idx];
    if (current.status === 'paid' || current.status === 'void') {
      return { invoice: current, movementId: '' };
    }

    const movement = bankAccountService.recordMovement(companyId, {
      bankAccountId,
      type: 'income',
      referenceType: 'customerInvoice',
      referenceId: current.id,
      amount: current.total
    });

    const updated: Invoice = { ...current, status: 'paid' };
    db.invoices[idx] = updated;
    logInvoiceAction(
      companyId,
      'invoice_paid',
      updated.id,
      `Factura pagada y registrada en cuenta ${bankAccountId}`
    );

    return { invoice: updated, movementId: movement?.id ?? '' };
  }
};

