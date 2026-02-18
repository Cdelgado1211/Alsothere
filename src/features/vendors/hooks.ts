import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { vendorService } from '../../services/vendorService';
import { useSessionStore } from '../../app/store/sessionStore';
import type { Vendor } from '../../types/vendors';

const keys = {
  all: (tenantId: string) => ['vendors', tenantId] as const
};

export const useVendors = () => {
  const session = useSessionStore((s) => s.session);
  const tenantId = session?.tenantId;
  return useQuery({
    queryKey: tenantId ? keys.all(tenantId) : ['vendors'],
    enabled: !!tenantId,
    queryFn: () => vendorService.list(tenantId as string)
  });
};

export const useUpsertVendor = () => {
  const session = useSessionStore((s) => s.session);
  const queryClient = useQueryClient();
  const tenantId = session?.tenantId as string;

  return useMutation({
    mutationFn: (payload: Partial<Vendor> & { id?: string }) => {
      if (!payload.id) {
        return vendorService.create(tenantId, {
          name: payload.name ?? '',
          taxId: payload.taxId ?? '',
          address: payload.address ?? '',
          phone: payload.phone,
          email: payload.email,
          status: (payload.status as Vendor['status']) ?? 'active'
        });
      }
      return vendorService.update(tenantId, payload.id, payload as Vendor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all(tenantId) });
    }
  });
};
