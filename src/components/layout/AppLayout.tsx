import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="app-scrollbar flex-1 overflow-y-auto bg-slate-50 px-4 py-6 lg:px-8">
          <div className="mx-auto max-w-6xl pb-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
