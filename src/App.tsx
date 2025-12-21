import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SubscriptionGuard } from "@/components/SubscriptionGuard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Pricing from "./pages/Pricing";
import PaymentSuccess from "./pages/PaymentSuccess";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Scanner from "./pages/Scanner";
import Leads from "./pages/Leads";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/onboarding" element={<SubscriptionGuard><Onboarding /></SubscriptionGuard>} />
            <Route path="/dashboard" element={<SubscriptionGuard><Dashboard /></SubscriptionGuard>} />
            <Route path="/scanner" element={<SubscriptionGuard><Scanner /></SubscriptionGuard>} />
            <Route path="/leads" element={<SubscriptionGuard><Leads /></SubscriptionGuard>} />
            <Route path="/settings" element={<SubscriptionGuard><Settings /></SubscriptionGuard>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;