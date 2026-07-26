import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { Navigation } from './components/Navigation';
import { OfflineBanner } from './components/OfflineBanner';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

// Lazy-load pages for code splitting
const DashboardHome = lazy(() => import('./pages/DashboardHome').then(m => ({ default: m.DashboardHome })));
const AssetInventoryMap = lazy(() => import('./pages/AssetInventoryMap').then(m => ({ default: m.AssetInventoryMap })));
const AdvertiserDashboard = lazy(() => import('./pages/AdvertiserDashboard').then(m => ({ default: m.AdvertiserDashboard })));
const VendorDashboard = lazy(() => import('./pages/VendorDashboard').then(m => ({ default: m.VendorDashboard })));
const ShopkeeperPwaDashboard = lazy(() => import('./pages/ShopkeeperPwaDashboard').then(m => ({ default: m.ShopkeeperPwaDashboard })));
const CreatorDashboard = lazy(() => import('./pages/CreatorDashboard').then(m => ({ default: m.CreatorDashboard })));
const AdminControlPortal = lazy(() => import('./pages/AdminControlPortal').then(m => ({ default: m.AdminControlPortal })));

const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      <p className="text-sm text-slate-400 font-medium">Loading…</p>
    </div>
  </div>
);

/** Redirect to /login if not authenticated, show loading spinner while checking session */
const RequireAuth: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <AppLayout />;
};

/** Redirect to / if already authenticated (for login/signup pages) */
const GuestOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return <>{children}</>;
};

const AppLayout: React.FC = () => (
  <div className="min-h-dvh flex flex-col lg:flex-row bg-slate-950 text-slate-100 font-sans transition-colors duration-300">
    <OfflineBanner />
    <Navigation />

    <main className="flex-1 min-w-0 pb-20 lg:pb-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </div>
    </main>
  </div>
);

const App: React.FC = () => (
  <ThemeProvider>
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Guest-only routes */}
            <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
            <Route path="/signup" element={<GuestOnly><SignupPage /></GuestOnly>} />

            {/* Protected routes — require real session */}
            <Route element={<RequireAuth />}>
              <Route index element={<Suspense fallback={<PageLoader />}><DashboardHome /></Suspense>} />
              <Route path="explore" element={<Suspense fallback={<PageLoader />}><AssetInventoryMap /></Suspense>} />
              <Route path="planner" element={<Suspense fallback={<PageLoader />}><AdvertiserDashboard /></Suspense>} />
              <Route path="owner" element={<Suspense fallback={<PageLoader />}><VendorDashboard /></Suspense>} />
              <Route path="earner" element={<Suspense fallback={<PageLoader />}><ShopkeeperPwaDashboard /></Suspense>} />
              <Route path="creator" element={<Suspense fallback={<PageLoader />}><CreatorDashboard /></Suspense>} />
              <Route path="admin" element={<Suspense fallback={<PageLoader />}><AdminControlPortal /></Suspense>} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
