
import * as React from "react";
import { Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "./pages/layout/AuthLayout";
import DashboardLayout from "./pages/layout/DashboardLayout";

// Auth check component
const AuthCheck = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // This is a placeholder for actual auth check logic
    const isAuthenticated = localStorage.getItem('supabase.auth.token') !== null;
    const isAuthRoute = ['/login', '/signup', '/reset-password', '/verify-email'].includes(location.pathname);
    
    if (!isAuthenticated && !isAuthRoute && !location.pathname.startsWith('/')) {
      navigate('/login', { replace: true });
    }
  }, [navigate, location]);

  return <>{children}</>;
};

// Eagerly load only the most critical pages
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";

// Use React.lazy for all other pages
const Signup = React.lazy(() => import('./pages/auth/Signup'));
const ResetPassword = React.lazy(() => import('./pages/auth/ResetPassword'));
const VerifyEmail = React.lazy(() => import('./pages/auth/VerifyEmail'));
const Dashboard = React.lazy(() => import('./pages/dashboard'));
const Generate = React.lazy(() => import('./pages/dashboard/generate'));
const Enhance = React.lazy(() => import('./pages/dashboard/enhance'));
const BatchQueue = React.lazy(() => import('./pages/dashboard/batch'));
const Videos = React.lazy(() => import('./pages/dashboard/videos'));
const Stats = React.lazy(() => import('./pages/dashboard/stats'));
const Settings = React.lazy(() => import('./pages/dashboard/settings'));
const Pricing = React.lazy(() => import('./pages/Pricing'));
const Checkout = React.lazy(() => import('./pages/Checkout'));

// Create QueryClient with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen bg-aurora-black flex items-center justify-center">
    <div className="animate-spin-slow">
      <img
        src="/lovable-uploads/90dade48-0a3d-4761-bf1d-ff00f22a3a23.png"
        alt="Loading..."
        className="w-16 h-16"
        loading="eager"
      />
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            } />
            <Route path="/signup" element={
              <AuthLayout>
                <Signup />
              </AuthLayout>
            } />
            <Route path="/reset-password" element={
              <AuthLayout>
                <ResetPassword />
              </AuthLayout>
            } />
            <Route path="/verify-email" element={
              <AuthLayout>
                <VerifyEmail />
              </AuthLayout>
            } />
            <Route path="/pricing" element={<Pricing />} />

            {/* Protected dashboard routes */}
            <Route path="/dashboard" element={
              <AuthLayout requireAuth>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </AuthLayout>
            } />
            <Route path="/dashboard/generate" element={
              <AuthLayout requireAuth>
                <DashboardLayout>
                  <Generate />
                </DashboardLayout>
              </AuthLayout>
            } />
            <Route path="/dashboard/enhance" element={
              <AuthLayout requireAuth>
                <DashboardLayout>
                  <Enhance />
                </DashboardLayout>
              </AuthLayout>
            } />
            <Route path="/dashboard/batch" element={
              <AuthLayout requireAuth>
                <DashboardLayout>
                  <BatchQueue />
                </DashboardLayout>
              </AuthLayout>
            } />
            <Route path="/dashboard/videos" element={
              <AuthLayout requireAuth>
                <DashboardLayout>
                  <Videos />
                </DashboardLayout>
              </AuthLayout>
            } />
            <Route path="/dashboard/stats" element={
              <AuthLayout requireAuth>
                <DashboardLayout>
                  <Stats />
                </DashboardLayout>
              </AuthLayout>
            } />
            <Route path="/dashboard/settings" element={
              <AuthLayout requireAuth>
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              </AuthLayout>
            } />
            <Route path="/checkout" element={
              <AuthLayout requireAuth>
                <Checkout />
              </AuthLayout>
            } />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
