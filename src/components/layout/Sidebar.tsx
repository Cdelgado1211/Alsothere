import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard' },
  { to: '/app/clients', label: 'Clientes' },
  { to: '/app/vendors', label: 'Proveedores' },
  { to: '/app/invoices', label: 'Facturas (Ventas)' },
  { to: '/app/bills', label: 'Facturas Proveedor' },
  { to: '/app/bank-accounts', label: 'Cuentas Bancarias' },
  { to: '/app/audit', label: 'Auditoría' }
];

export const Sidebar = () => {
  return (
    <aside className="flex w-64 flex-col border-r border-slate-200 bg-brand-600/95 p-4 text-white shadow-lg">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold text-brand-600">
          AT
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-wide">AlsoThere</span>
          <span className="text-xs text-brand-100">Tech Partner 3.0</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 text-sm">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'flex items-center rounded-lg px-3 py-2 transition-colors',
                isActive
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-brand-50/80 hover:bg-white/10 hover:text-white'
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
