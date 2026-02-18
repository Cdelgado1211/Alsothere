import { create } from 'zustand';
import type { Session, User } from '../../types/auth';
import type { Tenant } from '../../types/tenants';

interface SessionState {
  session: Session | null;
  tenants: Tenant[];
  setSession: (session: Session | null) => void;
  setTenants: (tenants: Tenant[]) => void;
  switchTenant: (tenantId: string) => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  session: null,
  tenants: [
    { id: 'tenant-1', name: 'Also There Alpha' },
    { id: 'tenant-2', name: 'Also There Beta' }
  ],
  setSession: (session) => set({ session }),
  setTenants: (tenants) => set({ tenants }),
  switchTenant: (tenantId) => {
    const { session, tenants } = get();
    if (!session) return;
    const tenant = tenants.find((t) => t.id === tenantId);
    if (!tenant) return;
    set({
      session: { ...session, tenantId: tenant.id, companyName: tenant.name }
    });
  }
}));

export const mockLogin = (email: string): Session => {
  const user: User = {
    id: 'user-1',
    name: 'Demo User',
    email
  };
  const tenantId = 'tenant-1';
  return {
    user,
    tenantId,
    companyName: 'Also There Alpha'
  };
};

