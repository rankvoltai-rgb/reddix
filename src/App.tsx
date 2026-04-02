import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SubscriptionProvider } from "@/hooks/useSubscription";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Scanner from "./pages/Scanner";
import Leads from "./pages/Leads";
import Settings from "./pages/Settings";
import Alternatives from "./pages/Alternatives";
import AlternativeDetail from "./pages/AlternativeDetail";
import Glossary from "./pages/Glossary";
import GlossaryTerm from "./pages/GlossaryTerm";
import NotFound from "./pages/NotFound";
import FeatureDetail from "./pages/FeatureDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SubscriptionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/setup" element={<Navigate to="/onboarding" replace />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/subscribe" element={<Navigate to="/onboarding" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scanner" element={<Scanner />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/alternatives" element={<Alternatives />} />
              <Route path="/alternatives/:slug" element={<AlternativeDetail />} />
              <Route path="/glossary" element={<Glossary />} />
              <Route path="/glossary/:slug" element={<GlossaryTerm />} />
              <Route path="/features/:slug" element={<FeatureDetail />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SubscriptionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
