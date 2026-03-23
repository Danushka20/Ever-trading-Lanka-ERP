import { Routes, Route, Navigate } from "react-router-dom"
import MainLayout from "@/layout/MainLayout"
import ProtectedRoute from "@/components/ProtectedRoute"

// Pages
import Dashboard from "@/pages/dashboard/Dashboard"
import Items from "@/pages/inventory/Items"
import StockReport from "@/pages/inventory/StockReport"
// POS page removed per request
import SalesList from "@/pages/sales/SalesList"
import CreateInvoice from "@/pages/sales/CreateInvoice"
import InvoiceList from "@/pages/sales/InvoiceList"
import PrintInvoice from "@/pages/sales/PrintInvoice"

// Sales Area & Target
import SalesAreaList from "@/pages/sales-area/SalesAreaList"
import AddSalesArea from "@/pages/sales-area/AddSalesArea"
import AddSalesTarget from "@/pages/sales-target/AddSalesTarget"
import SalesTargetReport from "@/pages/sales-target/SalesTargetReport"

// Stock
import StockList from "@/pages/stock/StockList"
import StockSummary from "@/pages/stock/StockSummary"

import PurchaseCreate from "@/pages/purchase/PurchaseCreate"
import PurchaseList from "@/pages/purchase/PurchaseList"
import TrialBalance from "@/pages/finance/TrialBalance"
import IncomeStatement from "@/pages/finance/IncomeStatement"
import BankAccounts from "@/pages/bank/BankAccounts"
import BankTransactions from "@/pages/bank/BankTransactions"
import SalesReport from "@/pages/reports/SalesReport"
import ProfitReport from "@/pages/reports/ProfitReport"
import Dealers from "@/pages/dealers/Dealers"
import Suppliers from "@/pages/suppliers/Suppliers"
import Users from "@/pages/users/Users"
import Roles from "@/pages/users/Roles"
import { Settings } from "@/pages/Settings"

// Auth
import Login from "@/pages/Login"
import ForgotPassword from "@/pages/ForgotPassword"

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Inventory */}
          <Route path="/inventory/items" element={<Items />} />
          <Route path="/inventory/stock-report" element={<StockReport />} />
          
          {/* Sales */}
          {/* POS route removed */}
          <Route path="/sales/list" element={<SalesList />} />
          <Route path="/sales/create-invoice" element={<CreateInvoice />} />
          <Route path="/sales/invoice-list" element={<InvoiceList />} />
          <Route path="/sales/print-invoice/:id" element={<PrintInvoice />} />

          {/* Sales Area */}
          <Route path="/sales-area/list" element={<SalesAreaList />} />
          <Route path="/sales-area/add" element={<AddSalesArea />} />
          <Route path="/sales-area/edit/:id" element={<AddSalesArea />} />

          {/* Sales Target */}
          <Route path="/sales-target/add" element={<AddSalesTarget />} />
          <Route path="/sales-target/report" element={<SalesTargetReport />} />

          {/* Stock */}
          <Route path="/stock/list" element={<StockList />} />
          <Route path="/stock/summary" element={<StockSummary />} />
          
          {/* Purchase */}
          <Route path="/purchase/create" element={<PurchaseCreate />} />
          <Route path="/purchase/list" element={<PurchaseList />} />
          
          {/* Finance */}
          <Route path="/finance/trial-balance" element={<TrialBalance />} />
          <Route path="/finance/income-statement" element={<IncomeStatement />} />
          
          {/* Bank */}
          <Route path="/bank/accounts" element={<BankAccounts />} />
          <Route path="/bank/transactions" element={<BankTransactions />} />
          
          {/* Reports */}
          <Route path="/reports/sales" element={<SalesReport />} />
          <Route path="/reports/profit" element={<ProfitReport />} />
          
          {/* Others */}
          <Route path="/dealers" element={<Dealers />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/roles" element={<Roles />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
