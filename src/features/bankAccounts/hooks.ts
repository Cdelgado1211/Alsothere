import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSessionStore } from '../../app/store/sessionStore';
import { bankAccountService } from '../../services/bankAccountService';
import type { BankAccount } from '../../types/bankAccounts';

const keys = {
  all: (tenantId: string) => ['bankAccounts', tenantId] as const
};

export const useBankAccounts = () => {
  const session = useSessionStore((s) => s.session);
  const tenantId = session?.tenantId;
  return useQuery({
    queryKey: tenantId ? keys.all(tenantId) : ['bankAccounts'],
    enabled: !!tenantId,
    queryFn: () => bankAccountService.list(tenantId as string)
  });
};

export const useCreateBankAccount = () => {
  const session = useSessionStore((s) => s.session);
  const queryClient = useQueryClient();
  const tenantId = session?.tenantId as string;

  return useMutation({
    mutationFn: (payload: Omit<BankAccount, 'id' | 'companyId' | 'balance'>) =>
      bankAccountService.create(tenantId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all(tenantId) });
    }
  });
};
