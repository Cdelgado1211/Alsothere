import type { ReactNode } from 'react';
import { Button } from './Button';

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ open, title, onClose, children }: Props) => {
  if (!open) return null;
  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 px-4"
    >
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-card">
        <header className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Cerrar">
            ✕
          </Button>
        </header>
        <div className="space-y-4 text-sm text-slate-100">{children}</div>
      </div>
    </div>
  );
};

