import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '../../services/clientService';
import { useSessionStore } from '../../app/store/sessionStore';
import type { Client } from '../../types/clients';

const keys = {
  all: (tenantId: string) => ['clients', tenantId] as const
};

export const useClients = () => {
  const session = useSessionStore((s) => s.session);
  const tenantId = session?.tenantId;
  return useQuery({
    queryKey: tenantId ? keys.all(tenantId) : ['clients'],
    enabled: !!tenantId,
    queryFn: () => clientService.list(tenantId as string)
  });
};

export const useUpsertClient = () => {
  const session = useSessionStore((s) => s.session);
  const queryClient = useQueryClient();
  const tenantId = session?.tenantId as string;

  return useMutation({
    mutationFn: (payload: Partial<Client> & { id?: string }) => {
      if (!payload.id) {
        return clientService.create(tenantId, {
          name: payload.name ?? '',
          taxId: payload.taxId ?? '',
          address: payload.address ?? '',
          phone: payload.phone,
          email: payload.email,
          status: (payload.status as Client['status']) ?? 'active'
        });
      }
      return clientService.update(tenantId, payload.id, payload as Client);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all(tenantId) });
    }
  });
};

