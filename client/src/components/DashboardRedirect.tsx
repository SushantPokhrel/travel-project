import { useStore } from "@/store/useStore";
import { Navigate } from "react-router";

export default function DashboardRedirect() {
  const user = useStore((state) => state.user);

  if (user?.role === "pending") {
    return <Navigate to="/onboarding" replace />;
  }

  const sanitizedUsername = user?.username?.split(" ").join("") ;
  return (
    <Navigate to={`/dashboard/${sanitizedUsername}/${user?.id}`} replace />
  );
}
