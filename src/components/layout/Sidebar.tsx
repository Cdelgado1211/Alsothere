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
    <aside className="flex w-64 flex-col border-r border-slate-200 bg-brand-600 p-4 text-brand-50 shadow-lg">
      <div className="mb-8 flex items-center justify-center">
        <div className="flex items-center justify-center rounded-xl bg-white px-3 py-2 shadow-md">
          <img
            src="https://images.email-platform.com/venturestars/alsothere_logo.png"
            alt="Also There"
            className="h-7 w-auto"
          />
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
