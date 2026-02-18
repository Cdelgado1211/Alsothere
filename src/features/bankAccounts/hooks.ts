import { useQuery } from '@tanstack/react-query';
import { useSessionStore } from '../../app/store/sessionStore';
import { bankAccountService } from '../../services/bankAccountService';

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

