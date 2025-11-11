import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Sales from "./pages/Sales";
import Purchase from "./pages/Purchase";
import Inventory from "./pages/Inventory";
import Accounting from "./pages/Accounting";
import HR from "./pages/HR";
import Projects from "./pages/Projects";
import CRM from "./pages/CRM";
import Parties from "./pages/Parties";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import UserManagement from "./pages/UserManagement";
import Profile from "./pages/Profile";
import DataManagement from "./pages/DataManagement";
import InvoiceTemplates from "./pages/InvoiceTemplates";
import ReorderManagement from "./pages/ReorderManagement";
import BarcodeScanner from "./pages/BarcodeScanner";
import WarehouseTransfers from "./pages/WarehouseTransfers";
import ThreeWayMatching from "./pages/ThreeWayMatching";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
          <Route path="/purchase" element={<ProtectedRoute><Purchase /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
          <Route path="/accounting" element={<ProtectedRoute><Accounting /></ProtectedRoute>} />
          <Route path="/hr" element={<ProtectedRoute><HR /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/crm" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
          <Route path="/parties" element={<ProtectedRoute><Parties /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/user-management" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/data-management" element={<ProtectedRoute><DataManagement /></ProtectedRoute>} />
          <Route path="/invoice-templates" element={<ProtectedRoute><InvoiceTemplates /></ProtectedRoute>} />
          <Route path="/reorder-management" element={<ProtectedRoute><ReorderManagement /></ProtectedRoute>} />
          <Route path="/barcode-scanner" element={<ProtectedRoute><BarcodeScanner /></ProtectedRoute>} />
          <Route path="/warehouse-transfers" element={<ProtectedRoute><WarehouseTransfers /></ProtectedRoute>} />
          <Route path="/three-way-matching" element={<ProtectedRoute><ThreeWayMatching /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
