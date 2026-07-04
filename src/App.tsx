import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SubscriptionProvider } from "@/hooks/useSubscription";
import { Loader2 } from "lucide-react";
import Index from "./pages/Index";

// Code-split every non-landing route so first-paint on / doesn't ship them.
const Auth = lazy(() => import("./pages/Auth"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Scanner = lazy(() => import("./pages/Scanner"));
const Leads = lazy(() => import("./pages/Leads"));
const Settings = lazy(() => import("./pages/Settings"));
const Alternatives = lazy(() => import("./pages/Alternatives"));
const AlternativeDetail = lazy(() => import("./pages/AlternativeDetail"));
const Glossary = lazy(() => import("./pages/Glossary"));
const GlossaryTerm = lazy(() => import("./pages/GlossaryTerm"));
const NotFound = lazy(() => import("./pages/NotFound"));
const FeatureDetail = lazy(() => import("./pages/FeatureDetail"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const UseCaseDetail = lazy(() => import("./pages/UseCaseDetail"));
const OAuthConsent = lazy(() => import("./pages/OAuthConsent"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SubscriptionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<RouteFallback />}>
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
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/use-cases/:slug" element={<UseCaseDetail />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </SubscriptionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
