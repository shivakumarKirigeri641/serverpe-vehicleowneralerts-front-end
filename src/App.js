import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Plans = lazy(() => import("./pages/Plans"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Feedback = lazy(() => import("./pages/Feedback"));
const ScanPage = lazy(() => import("./pages/ScanPage"));
const Subscribe = lazy(() => import("./pages/Subscribe"));
const Login = lazy(() => import("./pages/Login"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Dashboard
const DashboardLayout = lazy(() => import("./pages/dashboard/DashboardLayout"));
const DashboardHome = lazy(() => import("./pages/dashboard/DashboardHome"));
const Alerts = lazy(() => import("./pages/dashboard/Alerts"));
const DashboardPlans = lazy(() => import("./pages/dashboard/DashboardPlans"));
const Stickers = lazy(() => import("./pages/dashboard/Stickers"));
const Renewals = lazy(() => import("./pages/dashboard/Renewals"));
const Profile = lazy(() => import("./pages/dashboard/Profile"));
const Help = lazy(() => import("./pages/dashboard/Help"));

const AppLayout = () => {
  const location = useLocation();
  const isScanPage = location.pathname.startsWith("/scan/");
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isAuthPage = ["/login", "/subscribe"].includes(location.pathname);
  const hideNavFooter = isScanPage || isDashboard || isAuthPage;

  return (
    <>
      {!hideNavFooter && <Navbar />}
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/scan/:qrcodeNumber" element={<ScanPage />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />

          {/* Protected Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="plans" element={<DashboardPlans />} />
            <Route path="stickers" element={<Stickers />} />
            <Route path="renewals" element={<Renewals />} />
            <Route path="profile" element={<Profile />} />
            <Route path="help" element={<Help />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {!hideNavFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <AppLayout />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "12px",
                background: "#1e1b4b",
                color: "#fff",
                fontSize: "14px",
              },
              success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
              error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
            }}
          />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
