import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = '', ...rest }: Props) => {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-200">
      {label && <span>{label}</span>}
      <input
        className={`h-9 rounded-lg border bg-slate-900 px-3 text-sm text-slate-50 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 ${
          error ? 'border-red-500' : 'border-slate-700'
        } ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  );
};

