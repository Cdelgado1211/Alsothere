import { mockDb } from './mockDb';
import type { BankAccount, BankMovement } from '../types/bankAccounts';
import type { MovementType } from '../types/bankAccounts';
import { generateId } from '../lib/id';
import { auditService } from './auditService';

export const bankAccountService = {
  list(companyId: string): BankAccount[] {
    return mockDb.getCompany(companyId).bankAccounts;
  },
  get(companyId: string, id: string) {
    return mockDb.getCompany(companyId).bankAccounts.find((a) => a.id === id) ?? null;
  },
  create(
    companyId: string,
    data: Omit<BankAccount, 'id' | 'companyId' | 'balance'>
  ): BankAccount {
    const db = mockDb.getCompany(companyId);
    const account: BankAccount = {
      ...data,
      id: generateId(),
      companyId,
      balance: 0
    };
    db.bankAccounts.push(account);
    return account;
  },
  update(
    companyId: string,
    id: string,
    data: Partial<Omit<BankAccount, 'id' | 'companyId' | 'balance'>>
  ): BankAccount | null {
    const db = mockDb.getCompany(companyId);
    const idx = db.bankAccounts.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    const updated = { ...db.bankAccounts[idx], ...data };
    db.bankAccounts[idx] = updated;
    return updated;
  },
  remove(companyId: string, id: string) {
    const db = mockDb.getCompany(companyId);
    db.bankAccounts = db.bankAccounts.filter((a) => a.id !== id);
  },
  recordMovement(
    companyId: string,
    params: {
      bankAccountId: string;
      type: MovementType;
      referenceType: 'customerInvoice' | 'vendorBill';
      referenceId: string;
      amount: number;
    }
  ): BankMovement | null {
    const db = mockDb.getCompany(companyId);
    const account = db.bankAccounts.find((a) => a.id === params.bankAccountId);
    if (!account) return null;

    const amountSigned = params.type === 'income' ? params.amount : -params.amount;
    const newBalance = account.balance + amountSigned;
    account.balance = newBalance;

    const movement: BankMovement = {
      id: generateId(),
      companyId,
      bankAccountId: account.id,
      date: new Date().toISOString(),
      type: params.type,
      referenceType: params.referenceType,
      referenceId: params.referenceId,
      amount: params.amount,
      resultingBalance: newBalance
    };
    db.movements.push(movement);

    auditService.log(companyId, {
      action: 'bank_movement_created',
      entityId: movement.id,
      entityType: 'bankMovement',
      message: `Movimiento bancario ${params.type} por ${params.amount}`
    });

    return movement;
  },
  listMovements(companyId: string, bankAccountId: string): BankMovement[] {
    const db = mockDb.getCompany(companyId);
    return db.movements.filter((m) => m.bankAccountId === bankAccountId);
  }
};

