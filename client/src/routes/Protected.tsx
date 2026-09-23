import { useStore } from "@/store/useStore";
import React from "react";
import { Navigate, Outlet } from "react-router";
import { Spinner } from "../../@/components/ui/spinner";
export default function ProtectedRoutes() {
  const user = useStore((state) => state.user);
  const userLoader = useStore((state) => state.userLoader);
  if (userLoader) {
    return <Spinner />;
  }
  if (!user) {
    return <Navigate to="/auth" />;
  }
  return <Outlet />;
}
