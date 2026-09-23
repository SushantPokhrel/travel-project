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
export default function AppRoutes() {
  return (
    <>
      <BrowserRouter>
        <Nav />
        <main className="py-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<PublicRoutes />}>
              <Route path="/auth" element={<Auth />} />
            </Route>
            <Route element={<ProtectedRoutes />}>
                <Route path="/onboarding" element={<Onboarding />} />
              <Route element={<OnboardingRoute />}>
                <Route path="/dashboard" element={<Dashboard />}>
                  <Route index element={<DashboardRedirect />} />
                  <Route
                    path=":username/:userid"
                    element={<DashboardIndex />}
                  />
                  <Route path="settings" element={<DashboardSettings />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </main>
      </BrowserRouter>
    </>
  );
}
