import { useEffect, useState } from "react";
import { Check, ExternalLink, ShieldCheck, X } from "lucide-react";
import Button from "@/components/Button";
import { fetchData, patchData } from "@/lib/api";

type VerificationGuide = {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  isActive: boolean;
  citizenshipDoc?: { url?: string; format?: string; altText?: string };
  profileImg?: { url?: string };
  guideProfile?: {
    bio?: string;
    location?: string;
    verificationStatus?: "not_submitted" | "pending" | "verified" | "rejected";
    rating?: number;
    reviewCount?: number;
  };
};

export default function AdminVerifications() {
  const [guides, setGuides] = useState<VerificationGuide[]>([]);
  const [message, setMessage] = useState("Loading guide profiles...");

  const loadGuides = async () => {
    try {
      const data = await fetchData<{ guides: VerificationGuide[] }>(
        "/admin/verifications",
      );
      setGuides(data.guides);
      setMessage("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not load guide profiles",
      );
    }
  };

  useEffect(() => {
    loadGuides();
  }, []);

  const updateVerification = async (
    guideId: string,
    status: "verified" | "rejected",
  ) => {
    try {
      await patchData(`/admin/verifications/${guideId}`, { status });
      await loadGuides();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not update verification",
      );
    }
  };

  const toggleActive = async (guide: VerificationGuide) => {
    try {
      await patchData(`/admin/users/${guide._id}/active`, {
        isActive: !guide.isActive,
      });
      await loadGuides();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not update account status",
      );
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <header>
        <p className="text-sm font-medium text-primary">Administration</p>
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <ShieldCheck size={28} /> Guide verifications
        </h1>
        <p className="mt-1 text-muted-foreground">
          Review identity documents, approve profiles, and control guide access.
        </p>
      </header>
      {message && (
        <p className="rounded-lg border p-3 text-sm text-muted-foreground">
          {message}
        </p>
      )}
      <div className="space-y-4">
        {guides.map((guide) => {
          const status =
            guide.guideProfile?.verificationStatus || "not_submitted";
          return (
            <article className="rounded-xl border bg-card p-5" key={guide._id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-3">
                  {guide.profileImg?.url ? (
                    <img
                      className="h-14 w-14 rounded-full object-cover"
                      src={guide.profileImg.url}
                      alt={guide.username}
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                      {guide.username.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h2 className="font-semibold">{guide.username}</h2>
                    <p className="text-sm text-muted-foreground">
                      {guide.email} · {guide.phone || "No phone"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {guide.guideProfile?.location || "Location not provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={
                      status === "verified"
                        ? "text-emerald-600"
                        : status === "rejected"
                          ? "text-red-600"
                          : "text-amber-600"
                    }
                  >
                    {status.replace("_", " ")}
                  </span>
                  <span
                    className={
                      guide.isActive ? "text-emerald-600" : "text-red-600"
                    }
                  >
                    {guide.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm">
                {guide.guideProfile?.bio || "No guide bio submitted."}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t pt-4">
                {guide.citizenshipDoc?.url ? (
                  <a
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary underline"
                    href={guide.citizenshipDoc.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink size={15} /> Review identity document
                  </a>
                ) : (
                  <span className="text-sm text-red-600">
                    Identity document missing
                  </span>
                )}
                {status === "pending" && (
                  <>
                    <Button
                      onClick={() => updateVerification(guide._id, "verified")}
                    >
                      <Check size={15} /> Approve
                    </Button>
                    <Button
                      onClick={() => updateVerification(guide._id, "rejected")}
                    >
                      <X size={15} /> Reject
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => toggleActive(guide)}
                  disabled={!guide.isActive && status !== "verified"}
                >
                  {guide.isActive
                    ? "Deactivate guide"
                    : status === "verified"
                      ? "Activate guide"
                      : "Verify before activating"}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
      {!message && guides.length === 0 && (
        <p className="rounded-lg border p-6 text-center text-muted-foreground">
          No guide profiles found.
        </p>
      )}
    </div>
  );
}
