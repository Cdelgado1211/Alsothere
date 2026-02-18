import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSessionStore } from '../../app/store/sessionStore';
import { invoiceService } from '../../services/invoiceService';
import type { Invoice } from '../../types/invoices';

const keys = {
  all: (tenantId: string) => ['invoices', tenantId] as const
};

export const useInvoices = () => {
  const session = useSessionStore((s) => s.session);
  const tenantId = session?.tenantId;
  return useQuery({
    queryKey: tenantId ? keys.all(tenantId) : ['invoices'],
    enabled: !!tenantId,
    queryFn: () => invoiceService.list(tenantId as string)
  });
};

export const useMarkInvoicePaid = () => {
  const session = useSessionStore((s) => s.session);
  const tenantId = session?.tenantId as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; bankAccountId: string }) =>
      invoiceService.markAsPaid(tenantId, params.id, params.bankAccountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all(tenantId) });
    }
  });
};

export const useCreateInvoice = () => {
  const session = useSessionStore((s) => s.session);
  const tenantId = session?.tenantId as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<Invoice, 'id' | 'companyId' | 'invoiceNumber' | 'subtotal' | 'taxes' | 'total'>) =>
      invoiceService.create(tenantId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all(tenantId) });
    }
  });
};

