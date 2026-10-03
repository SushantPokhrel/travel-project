import { useStore } from "@/store/useStore";
import { Navigate, Outlet } from "react-router";

export default function AdminRoutes() {
  const user = useStore((state) => state.user);
  if (user?.role != "admin") return <Navigate to="/dashboard" />;
  return <Outlet />;
}
