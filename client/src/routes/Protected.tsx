import { useStore } from "@/store/useStore";
import React from "react";
import { Navigate, Outlet,useLocation } from "react-router";
import { Spinner } from "../../@/components/ui/spinner";
export default function ProtectedRoutes() {
  const user = useStore((state) => state.user);
  const userLoader = useStore((state) => state.userLoader);
  const location = useLocation()
  if (userLoader) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <Spinner /> Loading...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/auth" replace/>;
  }
  if (user.role === "pending" && location.pathname.startsWith("/dashboard")) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
