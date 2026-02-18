import type { SelectHTMLAttributes } from 'react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = ({ label, error, className = '', children, ...rest }: Props) => {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-700">
      {label && <span>{label}</span>}
      <select
        className={`h-9 rounded-lg border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 ${
          error ? 'border-red-500' : 'border-slate-300'
        } ${className}`}
        {...rest}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  );
};
