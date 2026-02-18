import type { ReactNode } from 'react';

export const Table = ({ children }: { children: ReactNode }) => (
  <div className="app-scrollbar overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
    <table className="min-w-full divide-y divide-slate-200 text-sm">{children}</table>
  </div>
);

export const THead = ({ children }: { children: ReactNode }) => (
  <thead className="bg-slate-100 text-xs uppercase text-slate-500">{children}</thead>
);

export const TBody = ({ children }: { children: ReactNode }) => (
  <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-900">
    {children}
  </tbody>
);

export const TR = ({ children }: { children: ReactNode }) => (
  <tr className="hover:bg-slate-50">{children}</tr>
);

export const TH = ({ children }: { children: ReactNode }) => (
  <th scope="col" className="px-4 py-3 text-left font-semibold">
    {children}
  </th>
);

export const TD = ({ children }: { children: ReactNode }) => (
  <td className="whitespace-nowrap px-4 py-2 align-middle text-sm">{children}</td>
);
