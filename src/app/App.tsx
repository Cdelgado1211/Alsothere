import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/LoginPage';
import { ForgotPasswordPage } from '../features/auth/ForgotPasswordPage';
import { RegisterCompanyPage } from '../features/auth/RegisterCompanyPage';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { ClientsListPage } from '../features/clients/ClientsListPage';
import { ClientDetailPage } from '../features/clients/ClientDetailPage';
import { VendorsListPage } from '../features/vendors/VendorsListPage';
import { VendorDetailPage } from '../features/vendors/VendorDetailPage';
import { InvoicesListPage } from '../features/invoices/InvoicesListPage';
import { InvoiceDetailPage } from '../features/invoices/InvoiceDetailPage';
import { InvoiceNewPage } from '../features/invoices/InvoiceNewPage';
import { BillsListPage } from '../features/bills/BillsListPage';
import { BillDetailPage } from '../features/bills/BillDetailPage';
import { BillNewPage } from '../features/bills/BillNewPage';
import { BankAccountsListPage } from '../features/bankAccounts/BankAccountsListPage';
import { BankAccountDetailPage } from '../features/bankAccounts/BankAccountDetailPage';
import { AuditLogPage } from '../features/audit/AuditLogPage';
import { RequireAuth } from './RequireAuth';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/register-company" element={<RegisterCompanyPage />} />

      <Route
        path="/app"
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="clients" element={<ClientsListPage />} />
        <Route path="clients/:id" element={<ClientDetailPage />} />
        <Route path="vendors" element={<VendorsListPage />} />
        <Route path="vendors/:id" element={<VendorDetailPage />} />
        <Route path="invoices" element={<InvoicesListPage />} />
        <Route path="invoices/new" element={<InvoiceNewPage />} />
        <Route path="invoices/:id" element={<InvoiceDetailPage />} />
        <Route path="bills" element={<BillsListPage />} />
        <Route path="bills/new" element={<BillNewPage />} />
        <Route path="bills/:id" element={<BillDetailPage />} />
        <Route path="bank-accounts" element={<BankAccountsListPage />} />
        <Route path="bank-accounts/:id" element={<BankAccountDetailPage />} />
        <Route path="audit" element={<AuditLogPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  );
};

export default App;

