import React from "react";
import { Navigate, Outlet } from "react-router";
import { useStore } from "@/store/useStore";

export default function OnboardingRoute() {
  const user = useStore((state) => state.user);
  if (user?.role === "pending") return <Navigate to="/onboarding" replace/>;
  return <Outlet />;
}
