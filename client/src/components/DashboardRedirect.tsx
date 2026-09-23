import { useStore } from "@/store/useStore";
import React from "react";
import { Navigate } from "react-router";

export default function DashboardRedirect() {
  const user = useStore((state) => state.user);

  return (
    <Navigate
      to={`/dashboard/${user?.username.split(" ").join("")}/${user?.id}`}
    />
  );
}
