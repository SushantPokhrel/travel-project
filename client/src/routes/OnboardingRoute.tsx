import React from "react";
import { Navigate, Outlet } from "react-router";
import { useStore } from "@/store/useStore";

export default function OnboardingRoute() {
  const user = useStore((state) => state.user);
  console.log(user?.role);
  const sanitizedUsername = user?.username?.split(" ").join("");

  if (user?.role === "pending") return <Outlet />;
  return (
    <Navigate to={`/dashboard/${sanitizedUsername}/${user?.id}`} replace />
  );
}
