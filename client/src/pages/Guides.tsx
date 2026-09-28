import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  Star,
  MapPin,
  Sparkles,
  Search,
  Compass,
  Mail,
  Award,
  CheckCircle2,
  UserCheck,
  X,
} from "lucide-react";
import { Card, CardContent } from "../../@/components/ui/card";
import { Badge } from "../../@/components/ui/badge";
import Button from "@/components/Button";
import { fetchData, postData } from "@/lib/api";
import { useStore } from "@/store/useStore";
import { useNavigate } from "react-router";

export interface GuideUser {
  id?: string;
  _id?: string;
  username: string;
  email: string;
  role: string;
  phone?: string;
  profileImg?: string | { url: string };
  citizenshipDoc?: { url: string };
  location?: string;
  rating?: number;
  reviewCount?: number;
  experienceYears?: number;
  languages?: string[];
  specialties?: string[];
  bio?: string;
  pricePerDay?: number;
}

const MOCK_GUIDES: GuideUser[] = [
  {
    _id: "demo-guide-1",
    username: "Aarav Sharma",
    email: "aarav.guide@example.com",
    role: "guide",
    phone: "+977 9841234567",
    profileImg:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    location: "Kathmandu & Everest Region",
    rating: 4.9,
    reviewCount: 48,
    experienceYears: 6,
    languages: ["English", "Nepali", "Hindi"],
    specialties: ["High-altitude Trekking", "Cultural Heritage", "Photography"],
    bio: "Certified high-altitude trekking guide with over 6 years of experience leading Everest and Annapurna circuits.",
    pricePerDay: 45,
  },
  {
    _id: "demo-guide-2",
    username: "Pasang Sherpa",
    email: "pasang.sherpa@example.com",
    role: "guide",
    phone: "+977 9801987654",
    profileImg:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    location: "Solukhumbu / Lukla",
    rating: 5.0,
    reviewCount: 62,
    experienceYears: 9,
    languages: ["English", "Sherpa", "Nepali"],
    specialties: ["Peak Climbing", "Mountaineering", "Wilderness Survival"],
    bio: "Licensed mountain expedition lead specializing in safe summit climbs and authentic Himalayan cultural journeys.",
    pricePerDay: 60,
  },
  {
    _id: "demo-guide-3",
    username: "Sunita Gurung",
    email: "sunita.g@example.com",
    role: "guide",
    phone: "+977 9812345678",
    profileImg:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    location: "Pokhara & Annapurna",
    rating: 4.8,
    reviewCount: 34,
    experienceYears: 4,
    languages: ["English", "French", "Nepali"],
    specialties: ["Eco-Tours", "Bird Watching", "Mardi Himal Trek"],
    bio: "Passionate environmentalist and trekking specialist sharing the biodiversity and hidden trails around Pokhara valley.",
    pricePerDay: 38,
  },
];

export default function Guides() {
  const user = useStore((state) => state.user);
  const navigate = useNavigate();
  const [guides, setGuides] = useState<GuideUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGuide, setSelectedGuide] = useState<GuideUser | null>(null);
  const [privateMessage, setPrivateMessage] = useState("");
  const [isSubmittingPrivate, setIsSubmittingPrivate] = useState(false);
  const [privateForm, setPrivateForm] = useState<{
    destination: string;
    startDate: string;
    endDate: string;
    travelers: number | "";
    budget: string;
    details: string;
  }>({
    destination: "",
    startDate: "",
    endDate: "",
    travelers: "",
    budget: "",
    details: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function getGuides() {
      try {
        setLoading(true);
        // GET /users endpoint via helper
        const response = await fetchData<{
          guides: GuideUser[];
          message: string;
        }>("/travel/guides");

        const fetchedUsers = response.guides || [];
        console.log(fetchedUsers);

        // Filter only users with "guide" role from API
        const apiGuides = fetchedUsers;
        console.log(apiGuides);
        // Combine API guides with Mock guides (avoiding duplicates)
        const combinedGuides = [...apiGuides];

        MOCK_GUIDES.forEach((mock) => {
          if (!combinedGuides.some((g) => g.email === mock.email)) {
            combinedGuides.push(mock);
          }
        });

        if (isMounted) {
          setGuides(combinedGuides);
          setError(null);
        }
      } catch (err: any) {
        console.error("Failed to fetch guides:", err);
        if (isMounted) {
          // Fallback to demo mock data if API fails or user is unauthenticated
          setGuides(MOCK_GUIDES);
          setError("Showing sample guides due to a connection error.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    getGuides();

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper function to safely extract image string
  const getProfileImageUrl = (guide: GuideUser): string => {
    if (typeof guide.profileImg === "string") return guide.profileImg;
    if (guide.profileImg?.url) return guide.profileImg.url;
    return "";
  };

  // Filtered list based on search bar
  const filteredGuides = guides.filter((guide) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = guide.username?.toLowerCase().includes(query);
    const locationMatch = guide.location?.toLowerCase().includes(query);
    const specMatch = guide.specialties?.some((s) =>
      s.toLowerCase().includes(query),
    );
    return nameMatch || locationMatch || specMatch;
  });

  const openPrivateRequest = (guide: GuideUser) => {
    if (user?.role !== "tourist") {
      navigate("/auth");
      return;
    }
    setPrivateMessage("");
    setSelectedGuide(guide);
  };

  const closePrivateRequest = () => {
    if (isSubmittingPrivate) return;
    setSelectedGuide(null);
  };

  const submitPrivateRequest = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const guideId = selectedGuide?.id || selectedGuide?._id;
    if (!guideId || guideId.startsWith("demo-")) {
      setPrivateMessage("This sample guide is not available for booking yet.");
      return;
    }

    setIsSubmittingPrivate(true);
    setPrivateMessage("");
    try {
      await postData("/travel/private-requests", {
        guide: guideId,
        ...privateForm,
        budget: privateForm.budget ? Number(privateForm.budget) : undefined,
      });
      setPrivateMessage("Private request sent to this guide.");
      setPrivateForm({
        destination: "",
        startDate: "",
        endDate: "",
        travelers: "",
        budget: "",
        details: "",
      });
      window.setTimeout(() => setSelectedGuide(null), 1200);
    } catch (error) {
      setPrivateMessage(
        error instanceof Error
          ? error.message
          : "Could not send private request.",
      );
    } finally {
      setIsSubmittingPrivate(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-body-bg py-12 px-4 sm:px-6 lg:px-8 font-sans text-text-para">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* --- HEADER SECTION --- */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Badge className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 mr-1 inline" />
            Verified Local Experts
          </Badge>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-header tracking-tight">
            Find Your <span className="text-primary">Tour Guide</span>
          </h2>

          <p className="text-text-muted text-base leading-relaxed">
            Browse our directory of admin-verified local leaders ready to make
            your destination unforgettable.
          </p>

          {/* Search Filter Bar */}
          <div className="pt-2 relative max-w-md mx-auto">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-text-muted pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, region, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-1 bg-surface text-text-header text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-text-muted/60"
              />
            </div>
          </div>
        </div>

        {/* --- LOADING / ERROR STATES --- */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3 text-text-muted">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Fetching verified guides...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-2 text-xs text-text-muted bg-surface border border-gray-1 rounded-lg max-w-md mx-auto">
            {error}
          </div>
        )}

        {/* --- GUIDES GRID --- */}
        {!loading && (
          <>
            {filteredGuides.length === 0 ? (
              <div className="text-center py-16 bg-surface border border-gray-1 rounded-2xl space-y-3">
                <Compass className="w-10 h-10 text-text-muted/50 mx-auto" />
                <h3 className="text-base font-semibold text-text-header">
                  No Guides Found
                </h3>
                <p className="text-xs text-text-muted max-w-xs mx-auto">
                  We couldn't find any guides matching "{searchQuery}". Try
                  searching for another keyword.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGuides.map((guide) => {
                  const imgUrl = getProfileImageUrl(guide);
                  const guideId = guide.id || guide._id;

                  return (
                    <Card
                      key={guideId}
                      className="relative group border border-gray-1 bg-surface shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden flex flex-col justify-between"
                    >
                      {/* Top Decorative Accent */}
                      <div className="h-1.5 w-full bg-primary" />

                      <CardContent className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Guide Profile Header */}
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <div className="w-16 h-16 rounded-full border-2 border-primary/30 bg-body-bg overflow-hidden flex items-center justify-center text-primary font-bold text-xl uppercase shadow-sm">
                                {imgUrl ? (
                                  <img
                                    src={imgUrl}
                                    alt={guide.username}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  guide.username?.charAt(0) || "G"
                                )}
                              </div>
                              <div
                                title="Verified Guide"
                                className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1 rounded-full shadow-sm"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h3 className="font-bold text-lg text-text-header truncate group-hover:text-primary transition-colors">
                                  {guide.username}
                                </h3>
                              </div>

                              <div className="flex items-center gap-1.5 text-xs text-text-muted mt-0.5">
                                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                                <span className="truncate">
                                  {guide.location || "Nepal Region"}
                                </span>
                              </div>

                              {/* Rating & Review Summary */}
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-1 text-xs font-semibold text-text-header bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                                  <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                                  <span>
                                    {guide.rating
                                      ? guide.rating.toFixed(1)
                                      : "5.0"}
                                  </span>
                                </div>
                                <span className="text-xs text-text-muted">
                                  ({guide.reviewCount || 12} reviews)
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Bio */}
                          <p className="text-xs text-text-muted leading-relaxed mt-4 line-clamp-3">
                            {guide.bio ||
                              "Licensed local tour guide committed to bringing you safe, authentic, and memorable travel experiences across iconic routes."}
                          </p>

                          {/* Key Attributes / Tags */}
                          <div className="mt-4 space-y-2">
                            {guide.specialties &&
                              guide.specialties.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {guide.specialties.map((spec, i) => (
                                    <Badge
                                      key={i}
                                      className="bg-body-bg text-text-header border border-gray-1 text-[11px] font-normal px-2 py-0.5"
                                    >
                                      {spec}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                            <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-gray-1">
                              <span className="flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 text-primary" />
                                {guide.experienceYears || 3}+ Years Exp.
                              </span>
                              {guide.pricePerDay && (
                                <span className="font-bold text-text-header">
                                  NPR {guide.pricePerDay}{" "}
                                  <span className="text-[10px] font-normal text-text-muted">
                                    / day
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Action Footer */}
                        <div className="pt-4 border-t border-gray-1 space-y-2">
                          <Button
                            onClick={() => openPrivateRequest(guide)}
                            className="w-full bg-primary hover:opacity-90 text-primary-foreground font-medium py-2 rounded-xl shadow-sm text-xs transition-all flex items-center justify-center gap-2"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            Book Travel with this Guide
                          </Button>

                          <div className="flex items-center justify-between text-[11px] text-text-muted px-1 pt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-primary" />
                              <span className="truncate max-w-35">
                                {guide.email}
                              </span>
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-primary" />
                              Identity Verified
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* --- FOOTER BANNER --- */}
        <div className="relative overflow-hidden rounded-2xl bg-surface border border-gray-1 p-8 text-text-para shadow-md">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl font-bold text-text-header flex items-center justify-center md:justify-start gap-2">
                <Award className="w-5 h-5 text-primary" />
                Are You a Licensed Local Guide?
              </h3>
              <p className="text-text-muted text-sm max-w-2xl leading-relaxed">
                Join our growing network of certified leads. Complete your
                verification onboarding to start receiving direct tourist
                booking requests today.
              </p>
            </div>

            <Button className="bg-primary hover:opacity-90 text-primary-foreground font-medium px-6 py-3 rounded-xl shadow-sm transition-all flex items-center gap-2 whitespace-nowrap text-sm">
              Register as Guide
            </Button>
          </div>
        </div>

        {selectedGuide && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 px-4 py-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="private-request-title"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closePrivateRequest();
            }}
          >
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-1 bg-surface p-6 shadow-xl sm:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Private travel request
                  </p>
                  <h2
                    id="private-request-title"
                    className="mt-2 text-2xl font-bold text-text-header"
                  >
                    Requesting travel with {selectedGuide.username}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-text-muted">
                    Only this guide will see your request. If they reject it, it
                    will become a public travel request for other guides.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closePrivateRequest}
                  className="rounded-lg p-2 text-text-muted hover:bg-body-bg hover:text-text-header"
                  aria-label="Close private travel request"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={submitPrivateRequest}
                className="grid gap-3 md:grid-cols-2"
              >
                <input
                  required
                  className="rounded-md border bg-body-bg p-2.5 text-sm"
                  placeholder="Destination"
                  value={privateForm.destination}
                  onChange={(event) =>
                    setPrivateForm({
                      ...privateForm,
                      destination: event.target.value,
                    })
                  }
                />
                <input
                  required
                  type="number"
                  min="1"
                  className="rounded-md border bg-body-bg p-2.5 text-sm"
                  placeholder="Number of travelers"
                  value={privateForm.travelers}
                  onChange={(event) =>
                    setPrivateForm({
                      ...privateForm,
                      travelers: event.target.value
                        ? Number(event.target.value)
                        : "",
                    })
                  }
                />
                <label className="text-sm text-text-muted">
                  Start date
                  <input
                    required
                    type="date"
                    className="mt-1.5 w-full rounded-md border bg-body-bg p-2.5 text-sm text-text-header"
                    value={privateForm.startDate}
                    onChange={(event) =>
                      setPrivateForm({
                        ...privateForm,
                        startDate: event.target.value,
                      })
                    }
                  />
                </label>
                <label className="text-sm text-text-muted">
                  End date
                  <input
                    required
                    type="date"
                    className="mt-1.5 w-full rounded-md border bg-body-bg p-2.5 text-sm text-text-header"
                    value={privateForm.endDate}
                    onChange={(event) =>
                      setPrivateForm({
                        ...privateForm,
                        endDate: event.target.value,
                      })
                    }
                  />
                </label>
                <input
                  type="number"
                  min="0"
                  className="rounded-md border bg-body-bg p-2.5 text-sm"
                  placeholder="Budget in NPR (optional)"
                  value={privateForm.budget}
                  onChange={(event) =>
                    setPrivateForm({
                      ...privateForm,
                      budget: event.target.value,
                    })
                  }
                />
                <input
                  className="rounded-md border bg-body-bg p-2.5 text-sm"
                  placeholder="Trip details"
                  value={privateForm.details}
                  onChange={(event) =>
                    setPrivateForm({
                      ...privateForm,
                      details: event.target.value,
                    })
                  }
                />
                <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                  <Button type="submit" disabled={isSubmittingPrivate}>
                    {isSubmittingPrivate
                      ? "Sending..."
                      : "Send private request"}
                  </Button>
                  {privateMessage && (
                    <p className="text-sm text-text-muted" role="status">
                      {privateMessage}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
