import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSessionStore } from '../../app/store/sessionStore';
import { billService } from '../../services/billService';

const keys = {
  all: (tenantId: string) => ['bills', tenantId] as const
};

export const useBills = () => {
  const session = useSessionStore((s) => s.session);
  const tenantId = session?.tenantId;
  return useQuery({
    queryKey: tenantId ? keys.all(tenantId) : ['bills'],
    enabled: !!tenantId,
    queryFn: () => billService.list(tenantId as string)
  });
};

export const useRegisterBillPayment = () => {
  const session = useSessionStore((s) => s.session);
  const tenantId = session?.tenantId as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; bankAccountId: string }) =>
      billService.registerPayment(tenantId, params.id, params.bankAccountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all(tenantId) });
    }
  });
};

