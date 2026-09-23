import { useStore } from "@/store/useStore";
import React from "react";
import { Navigate, Outlet } from "react-router";
import { Spinner } from "../../@/components/ui/spinner";

export default function PublicRoutes() {
  const userLoader = useStore((state) => state.userLoader);
  const user = useStore((state) => state.user);
  if (userLoader) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }
  if (!user) return <Outlet />;
  if (user?.role == "pending") return <Navigate to="/onboarding" />;

  return (
    <Navigate
      to={`/dashboard/${user?.username.split(" ").join("")}/${user?.id}`}
    />
  );
}
