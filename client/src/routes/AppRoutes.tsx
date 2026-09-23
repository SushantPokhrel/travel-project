import { BrowserRouter, Route, Routes } from "react-router";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Nav from "@/components/Nav";
import Dashboard from "@/pages/Dashboard";
import DashboardIndex from "@/components/DashboardIndex";
import DashboardSettings from "@/components/DashboardSettings";
import PublicRoutes from "./Public";
import DashboardRedirect from "@/components/DashboardRedirect";
import ProtectedRoutes from "./Protected";
import OnboardingRoute from "./OnboardingRoute";
import Onboarding from "@/pages/Onboarding";
import HowItWorks from "@/pages/HowItWorks";
import Guides from "@/pages/Guides";
import TravelDesk from "@/pages/TravelDesk";
import AdminManageUsers from "@/pages/AdminManageUsers";
import AdminVerifications from "@/pages/AdminVerifications";
export default function AppRoutes() {
  return (
    <>
      <BrowserRouter>
        <Nav />
        <main className="py-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/guides" element={<Guides />} />
            <Route element={<PublicRoutes />}>
              <Route path="/auth" element={<Auth />} />
            </Route>
            <Route element={<ProtectedRoutes />}>
              <Route element={<OnboardingRoute />}>
                <Route path="/onboarding" element={<Onboarding />} />
              </Route>

              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<DashboardRedirect />} />
                <Route path=":username/:userid" element={<DashboardIndex />} />
                <Route path="settings" element={<DashboardSettings />} />
                <Route path="travel-desk" element={<TravelDesk />} />
                <Route path="manage-users" element={<AdminManageUsers />} />
                <Route path="verifications" element={<AdminVerifications />} />
              </Route>
            </Route>
          </Routes>
        </main>
      </BrowserRouter>
    </>
  );
}
