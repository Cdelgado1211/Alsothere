import { useSessionStore } from '../../app/store/sessionStore';
import { Select } from '../../components/ui/Select';

export const TenantSwitcher = () => {
  const session = useSessionStore((s) => s.session);
  const tenants = useSessionStore((s) => s.tenants);
  const switchTenant = useSessionStore((s) => s.switchTenant);

  if (!session) return null;

  return (
    <Select
      value={session.tenantId}
      onChange={(e) => switchTenant(e.target.value)}
      className="min-w-[180px]"
    >
      {tenants.map((tenant) => (
        <option key={tenant.id} value={tenant.id}>
          {tenant.name}
        </option>
      ))}
    </Select>
  );
};

