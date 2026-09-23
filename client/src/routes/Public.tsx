import { useStore } from "@/store/useStore";
import React from "react";
import { Navigate, Outlet } from "react-router";

export default function PublicRoutes() {
  const user = useStore((state) => state.user);
  if (user?.email) {
    return <Navigate to={`/dashboard/${user.username.split(" ").join("")}/${user.id}`} />;
  }
  return <Outlet />;
}
