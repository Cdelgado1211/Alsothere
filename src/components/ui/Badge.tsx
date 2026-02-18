import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const Badge = ({ children, variant = 'default' }: Props) => {
  const variants: Record<string, string> = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-50 text-emerald-600',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-red-50 text-red-600'
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${variants[variant]}`}>
      {children}
    </span>
  );
};
