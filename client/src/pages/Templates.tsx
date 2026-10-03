import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, MapPin, ShieldCheck, Users, X } from "lucide-react";
import { Badge } from "../../@/components/ui/badge";
import { Card, CardContent } from "../../@/components/ui/card";
import Button from "@/components/Button";
import { fetchData, postData } from "@/lib/api";
import { useStore } from "@/store/useStore";
import { useNavigate } from "react-router";

type Guide = {
  _id?: string;
  id?: string;
  username: string;
  location?: string;
  profileImg?: string | { url: string };
  guideProfile?: {
    location?: string;
    specialties?: string[];
  };
};

type TravelTemplate = {
  title: string;
  region: string;
  duration: string;
  description: string;
  image: string;
  keywords: string[];
};

type BookingForm = {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number | "";
  budget: string;
  details: string;
};

const TEMPLATES: TravelTemplate[] = [
  {
    title: "Everest Base Camp Trek",
    region: "Khumbu, Solukhumbu",
    duration: "14 days",
    description:
      "Walk through Sherpa villages, high mountain passes, and the legendary trail to Everest Base Camp.",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=900",
    keywords: ["everest", "khumbu", "trekking", "mountain"],
  },
  {
    title: "Kathmandu Valley Heritage Tour",
    region: "Kathmandu, Bhaktapur & Patan",
    duration: "4 days",
    description:
      "Discover living temples, ancient courtyards, local food, and the stories behind the valley's heritage.",
    image:
      "https://tourpokhara.com/wp-content/uploads/2023/09/Boudhanath-Stupa-Kathmandu-Nepal.jpg",
    keywords: ["kathmandu", "heritage", "culture", "patan", "bhaktapur"],
  },
  {
    title: "Chitwan National Park Safari",
    region: "Chitwan, Terai",
    duration: "3 days",
    description:
      "Pair jungle safaris with canoe rides and Tharu culture in Nepal's wild and welcoming lowlands.",
    image:
      "https://images.unsplash.com/photo-1535338454770-8be927b5a00b?auto=format&fit=crop&q=80&w=900",
    keywords: ["chitwan", "safari", "wildlife", "nature", "bird"],
  },
  {
    title: "Pokhara Lakes & Annapurna Views",
    region: "Pokhara, Gandaki",
    duration: "5 days",
    description:
      "Slow down beside Phewa Lake, chase sunrise viewpoints, and explore the foothills of Annapurna.",
    image:
      "https://admin.buddhaair.com/photos/3/Adventurous%20activities.jpg",
    keywords: ["pokhara", "annapurna", "mardi", "lake", "trekking"],
  },
];

const getImageUrl = (guide: Guide) =>
  typeof guide.profileImg === "string"
    ? guide.profileImg
    : guide.profileImg?.url || "";

const guideMatchesTemplate = (guide: Guide, template: TravelTemplate) => {
  const profileText = [
    guide.location,
    guide.guideProfile?.location,
    ...(guide.guideProfile?.specialties || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return template.keywords.some((keyword) => profileText.includes(keyword));
};

export default function Templates() {
  const user = useStore((state) => state.user);
  const navigate = useNavigate();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [guideLoadError, setGuideLoadError] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<TravelTemplate | null>(null);
  const [selectedGuideId, setSelectedGuideId] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 1,
    budget: "",
    details: "",
  });

  useEffect(() => {
    fetchData<{ guides: Guide[] }>("/travel/guides")
      .then((data) => setGuides(data.guides || []))
      .catch(() => {
        setGuides([]);
        setGuideLoadError("Could not load the verified guide list.");
      })
      .finally(() => setLoading(false));
  }, []);

  const openBooking = (template: TravelTemplate) => {
    if (user?.role !== "tourist") {
      navigate("/auth");
      return;
    }

    setBookingMessage("");
    setBookingSubmitted(false);
    setSelectedGuideId("");
    setBookingForm({
      destination: template.region,
      startDate: "",
      endDate: "",
      travelers: 1,
      budget: "",
      details: `${template.title}. ${template.description}`,
    });
    setSelectedTemplate(template);
  };

  const closeBooking = () => {
    if (isSubmittingBooking) return;
    setSelectedTemplate(null);
  };

  const submitBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmittingBooking(true);
    setBookingMessage("");

    const payload = {
      ...bookingForm,
      budget: bookingForm.budget ? Number(bookingForm.budget) : undefined,
    };

    try {
      if (selectedGuideId) {
        await postData("/travel/private-requests", {
          ...payload,
          guide: selectedGuideId,
        });
        setBookingMessage("Your request has been sent to the selected guide.");
      } else {
        await postData("/travel/requests", payload);
        setBookingMessage(
          "Your travel request is posted for available guides to respond.",
        );
      }
      setBookingSubmitted(true);
    } catch (error) {
      setBookingMessage(
        error instanceof Error ? error.message : "Could not submit your request.",
      );
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const matchingBookingGuides = selectedTemplate
    ? guides.filter((guide) => guideMatchesTemplate(guide, selectedTemplate))
    : [];
  const bookingGuides = matchingBookingGuides.length
    ? matchingBookingGuides
    : guides;

  return (
    <div className="min-h-screen bg-body-bg px-4 py-10 text-text-para sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="max-w-2xl">
          <Badge className="mb-4 border border-primary/20 bg-primary/10 px-3 py-1 text-xs uppercase tracking-wider text-primary">
            Top templates
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-header sm:text-4xl">
            Start with a place worth remembering.
          </h1>
          <p className="mt-3 text-base leading-relaxed text-text-muted">
            Pick a popular Nepal experience and connect with a verified local
            guide who will make your travel worth.
          </p>
        </header>

        <section
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
          aria-label="Nepal travel templates"
        >
          {TEMPLATES.map((template) => {
            const matchedGuides = guides.filter((guide) =>
              guideMatchesTemplate(guide, template),
            );
            const availableGuides = matchedGuides.length
              ? matchedGuides
              : guides.slice(0, 3);

            return (
              <Card
                key={template.title}
                className="group overflow-hidden rounded-2xl border border-gray-1 bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={template.image}
                    alt={template.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3 text-white">
                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-medium text-white/85">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="uppercase tracking-wide text-white/65">
                          Destination:
                        </span>{" "}
                        {template.region}
                      </p>
                      <h2 className="mt-1 text-xl font-bold">
                        {template.title}
                      </h2>
                    </div>
                    <span className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                      {template.duration}
                    </span>
                  </div>
                </div>

                <CardContent className="space-y-5 p-5">
                  <p className="text-sm leading-relaxed text-text-muted">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between border-t border-gray-1 pt-4">
                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-text-header">
                        <Users className="h-3.5 w-3.5 text-primary" />
                        {loading
                          ? "Finding guides..."
                          : `${availableGuides.length} guide${availableGuides.length === 1 ? "" : "s"} available`}
                      </p>
                      {!loading && availableGuides.length > 0 && (
                        <div className="mt-2 flex -space-x-2">
                          {availableGuides.slice(0, 3).map((guide) => (
                            <div
                              key={guide._id || guide.id || guide.username}
                              className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-surface bg-body-bg text-xs font-bold text-primary"
                              title={guide.username}
                            >
                              {getImageUrl(guide) ? (
                                <img
                                  src={getImageUrl(guide)}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                guide.username.charAt(0)
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <a
                      href="/guides"
                      className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    >
                      View guides <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Admin-verified local experts
                  </div>
                  <Button
                    className="w-full rounded-xl py-3 text-sm font-semibold"
                    onClick={() => openBooking(template)}
                  >
                    Book this trip
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </div>
      {selectedTemplate && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="template-booking-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeBooking();
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-1 bg-surface p-6 shadow-xl sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Trip booking
                </p>
                <h2
                  id="template-booking-title"
                  className="mt-2 text-2xl font-bold text-text-header"
                >
                  Book {selectedTemplate.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-text-muted">
                  Share your trip details, then choose a guide or leave it open
                  for available guides to respond.
                </p>
              </div>
              <button
                type="button"
                onClick={closeBooking}
                className="rounded-lg p-2 text-text-muted hover:bg-body-bg hover:text-text-header"
                aria-label="Close booking form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submitBooking} className="grid gap-3 md:grid-cols-2">
              <label className="text-sm text-text-muted md:col-span-2">
                Destination
                <input
                  required
                  className="mt-1.5 w-full rounded-md border bg-body-bg p-2.5 text-sm text-text-header"
                  value={bookingForm.destination}
                  onChange={(event) =>
                    setBookingForm({
                      ...bookingForm,
                      destination: event.target.value,
                    })
                  }
                />
              </label>
              <label className="text-sm text-text-muted">
                Start date
                <input
                  required
                  type="date"
                  className="mt-1.5 w-full rounded-md border bg-body-bg p-2.5 text-sm text-text-header"
                  value={bookingForm.startDate}
                  onChange={(event) =>
                    setBookingForm({
                      ...bookingForm,
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
                  min={bookingForm.startDate}
                  className="mt-1.5 w-full rounded-md border bg-body-bg p-2.5 text-sm text-text-header"
                  value={bookingForm.endDate}
                  onChange={(event) =>
                    setBookingForm({
                      ...bookingForm,
                      endDate: event.target.value,
                    })
                  }
                />
              </label>
              <label className="text-sm text-text-muted">
                Number of travelers
                <input
                  required
                  type="number"
                  min="1"
                  className="mt-1.5 w-full rounded-md border bg-body-bg p-2.5 text-sm text-text-header"
                  value={bookingForm.travelers}
                  onChange={(event) =>
                    setBookingForm({
                      ...bookingForm,
                      travelers: event.target.value
                        ? Number(event.target.value)
                        : "",
                    })
                  }
                />
              </label>
              <label className="text-sm text-text-muted">
                Budget in NPR (optional)
                <input
                  type="number"
                  min="0"
                  className="mt-1.5 w-full rounded-md border bg-body-bg p-2.5 text-sm text-text-header"
                  value={bookingForm.budget}
                  onChange={(event) =>
                    setBookingForm({
                      ...bookingForm,
                      budget: event.target.value,
                    })
                  }
                />
              </label>
              <label className="text-sm text-text-muted md:col-span-2">
                Trip details
                <textarea
                  rows={3}
                  className="mt-1.5 w-full rounded-md border bg-body-bg p-2.5 text-sm text-text-header"
                  value={bookingForm.details}
                  onChange={(event) =>
                    setBookingForm({
                      ...bookingForm,
                      details: event.target.value,
                    })
                  }
                />
              </label>
              <label className="text-sm text-text-muted md:col-span-2">
                Choose a verified guide (optional)
                <select
                  className="mt-1.5 w-full rounded-md border bg-body-bg p-2.5 text-sm text-text-header"
                  value={selectedGuideId}
                  onChange={(event) => setSelectedGuideId(event.target.value)}
                  disabled={loading}
                >
                  <option value="">
                    {loading
                        ? "Loading guides..."
                        : "No preference — let available guides respond"}
                    </option>
                    {bookingGuides.map((guide) => {
                      const guideId = guide._id || guide.id;
                      return guideId ? (
                        <option key={guideId} value={guideId}>
                          {guide.username}
                          {guide.guideProfile?.location
                            ? ` — ${guide.guideProfile.location}`
                            : ""}
                        </option>
                      ) : null;
                    })}
                </select>
              </label>
              {guideLoadError && (
                <p className="text-sm text-text-muted md:col-span-2" role="status">
                    {guideLoadError} You can still submit a request for available
                    guides to respond.
                </p>
              )}
              {bookingMessage && (
                <p
                  className="text-sm text-text-muted md:col-span-2"
                  role="status"
                >
                  {bookingMessage}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 pt-2 md:col-span-2">
                <Button
                  type="submit"
                  disabled={isSubmittingBooking || loading || bookingSubmitted}
                  className="rounded-xl px-6"
                >
                  {isSubmittingBooking
                    ? "Submitting..."
                    : bookingSubmitted
                      ? "Request submitted"
                      : "Submit trip request"}
                </Button>
                {bookingMessage && !isSubmittingBooking && (
                  <Button
                    className="rounded-xl border border-gray-1 bg-surface px-6 text-text-header hover:bg-body-bg"
                    onClick={closeBooking}
                  >
                    Close
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
