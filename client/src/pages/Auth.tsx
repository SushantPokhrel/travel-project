import { Link, useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import guideNepalLogo from "@/assets/guideNepal_logo.jpg";
import { postData } from "@/lib/api";
import type { CredentialResponseType, LoginResponseType } from "@/lib/types";
import { useStore } from "@/store/useStore";
import { Spinner } from "../../@/components/ui/spinner";

export default function Auth() {
  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();
  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponseType,
  ) => {
    try {
      const userData = await postData<
        CredentialResponseType,
        LoginResponseType
      >("/auth/google/sign-in", credentialResponse);
      setUser(userData?.user);
      toast.success(userData?.message || "Signed in successfully!");
      return userData?.user.role === "pending"
        ? navigate("/onboarding")
        : navigate(`/dashboard`);
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Failed to authenticate. Please try again.");
    }
  };

  const handleGoogleError = () => {
    console.error("Login Failed");
    toast.error("Google sign-in failed. Please try again!");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-body-bg py-12 px-5 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-surface text-text-para p-8 shadow-sm text-center flex flex-col items-center">
        {/* Logo */}
        <Link to="/" className="flex gap-2.5 items-center justify-center">
          <img
            src={guideNepalLogo}
            className="h-10 aspect-square rounded-full object-cover"
            alt="Guide Nepal Logo"
          />
          <h1 className="font-semibold text-lg">
            <span className="text-primary">Guide</span>
            <span className="text-secondary">Nepal</span>
          </h1>
        </Link>

        {/* Heading & Subtitle */}
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-text-header tracking-tight">
            Welcome to Guide Nepal
          </h2>
          <p className="text-sm text-text-muted">
            Sign in or create an account with your Google profile to continue.
          </p>
        </div>

        {/* Google Authentication Container */}
        <div className="w-full flex justify-center py-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            shape="pill"
            theme="outline"
          />
        </div>

        <p className="text-xs text-text-muted">
          By continuing, you agree to Guide Nepal's Terms of Service and Privacy
          Policy.
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}
