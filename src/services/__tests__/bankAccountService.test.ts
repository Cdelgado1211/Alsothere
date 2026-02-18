import { bankAccountService } from '../bankAccountService';
import { mockDb } from '../mockDb';

describe('bank account movements', () => {
  it('creates income movement and updates balance', () => {
    const companyId = 'tenant-1';
    const db = mockDb.getCompany(companyId);
    const account = db.bankAccounts[0];
    const initialBalance = account.balance;

    const movement = bankAccountService.recordMovement(companyId, {
      bankAccountId: account.id,
      type: 'income',
      referenceType: 'customerInvoice',
      referenceId: 'inv-1',
      amount: 100
    });

    expect(movement).not.toBeNull();
    const updatedAccount = bankAccountService.get(companyId, account.id);
    expect(updatedAccount?.balance).toBe(initialBalance + 100);
  });
});

