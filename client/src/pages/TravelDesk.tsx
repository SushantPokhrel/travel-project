import { useEffect, useState, type FormEvent } from "react";
import { Check, Search, Star, ShieldCheck } from "lucide-react";
import { useStore } from "@/store/useStore";
import { fetchData, patchData, postData } from "@/lib/api";
import Button from "@/components/Button";

type Guide = {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  guideProfile?: {
    bio?: string;
    location?: string;
    rating?: number;
    reviewCount?: number;
    verificationStatus?: string;
  };
};
type Request = {
  _id: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget?: number;
  details?: string;
  status: string;
  tourist?: Guide;
};
type Offer = {
  _id: string;
  price: number;
  message?: string;
  status: string;
  guide?: Guide;
  request?: Request;
};
type Booking = {
  _id: string;
  amount: number;
  status: string;
  paymentStatus: string;
  request?: Request;
  guide?: Guide;
};

const call = async <T,>(
  path: string,
  method: "GET" | "POST",
  body?: unknown,
) => (method === "GET" ? fetchData<T>(path) : postData<unknown, T>(path, body));

export default function TravelDesk() {
  const user = useStore((state) => state.user);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [verifications, setVerifications] = useState<Guide[]>([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [requestForm, setRequestForm] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 1,
    budget: "",
    details: "",
  });
  const [profileForm, setProfileForm] = useState({
    bio: "",
    location: "",
    languages: "English, Nepali",
    specialties: "",
    pricePerDay: "",
  });
  const [offerPrices, setOfferPrices] = useState<Record<string, string>>({});

  const refresh = async () => {
    try {
      if (user?.role === "tourist") {
        const [guideData, requestData, offerData, bookingData] =
          await Promise.all([
            call<{ guides: Guide[] }>("/travel/guides", "GET"),
            call<{ requests: Request[] }>("/travel/requests", "GET"),
            call<{ offers: Offer[] }>("/travel/offers", "GET"),
            call<{ bookings: Booking[] }>("/travel/bookings", "GET"),
          ]);
        setGuides(guideData.guides);
        setRequests(requestData.requests);
        setOffers(offerData.offers);
        setBookings(bookingData.bookings);
      } else if (user?.role === "guide") {
        const [requestData, offerData, bookingData] = await Promise.all([
          call<{ requests: Request[] }>("/travel/requests", "GET"),
          call<{ offers: Offer[] }>("/travel/offers", "GET"),
          call<{ bookings: Booking[] }>("/travel/bookings", "GET"),
        ]);
        setRequests(requestData.requests);
        setOffers(offerData.offers);
        setBookings(bookingData.bookings);
      } else if (user?.role === "admin") {
        const data = await call<{ guides: Guide[] }>(
          "/admin/verifications",
          "GET",
        );
        setVerifications(data.guides);
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not load travel data",
      );
    }
  };

  useEffect(() => {
    refresh();
  }, [user?.role]);
  const run = async (action: () => Promise<void>) => {
    try {
      setMessage("");
      await action();
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Action failed");
    }
  };

  const createRequest = (event: FormEvent) => {
    event.preventDefault();
    return run(async () => {
      await call("/travel/requests", "POST", {
        ...requestForm,
        budget: requestForm.budget ? Number(requestForm.budget) : undefined,
      });
      setRequestForm({
        destination: "",
        startDate: "",
        endDate: "",
        travelers: 1,
        budget: "",
        details: "",
      });
      setMessage("Travel request posted");
    });
  };
  const saveProfile = (event: FormEvent) => {
    event.preventDefault();
    return run(async () => {
      await call("/travel/guide-profile", "POST", {
        ...profileForm,
        languages: profileForm.languages
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        specialties: profileForm.specialties
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        pricePerDay: Number(profileForm.pricePerDay),
      });
      setMessage("Profile submitted for admin verification");
    });
  };

  if (!user) return null;
  const filteredGuides = guides.filter((guide) =>
    `${guide.username} ${guide.email} ${guide.guideProfile?.location || ""} ${guide.guideProfile?.bio || ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <div>
        <p className="text-sm font-medium text-primary">Travel Desk</p>
        <h1 className="text-3xl font-bold">Make the next trip happen</h1>
        <p className="mt-1 text-muted-foreground">
          Your travel workflow, from first search to final review.
        </p>
      </div>
      {message && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
          {message}
        </div>
      )}

      {user.role === "tourist" && (
        <>
          <section className="space-y-4 rounded-xl border bg-card p-5">
            <div className="flex items-center gap-2">
              <Search size={18} />
              <h2 className="text-lg font-semibold">
                1. Find a verified guide
              </h2>
            </div>
            <input
              className="w-full rounded-md border bg-background p-2"
              placeholder="Search by name, region, or bio"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className="grid gap-3 md:grid-cols-3">
              {filteredGuides.map((guide) => (
                <div
                  className="rounded-lg border p-4"
                  key={guide._id || guide.id}
                >
                  <h3 className="font-semibold">{guide.username}</h3>
                  <p className="text-sm text-muted-foreground">
                    {guide.guideProfile?.location || "Nepal"}
                  </p>
                  <p className="mt-2 text-sm">
                    {guide.guideProfile?.bio || "Verified local guide"}
                  </p>
                  <p className="mt-2 flex items-center gap-1 text-sm">
                    <Star size={14} className="fill-current" />{" "}
                    {(guide.guideProfile?.rating || 0).toFixed(1)} (
                    {guide.guideProfile?.reviewCount || 0})
                  </p>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 text-lg font-semibold">
              2. Post a travel request
            </h2>
            <form
              onSubmit={createRequest}
              className="grid gap-3 md:grid-cols-2"
            >
              <input
                required
                className="rounded-md border bg-background p-2"
                placeholder="Destination"
                value={requestForm.destination}
                onChange={(e) =>
                  setRequestForm({
                    ...requestForm,
                    destination: e.target.value,
                  })
                }
              />
              <input
                required
                type="number"
                min="1"
                className="rounded-md border bg-background p-2"
                placeholder="Travelers"
                value={requestForm.travelers}
                onChange={(e) =>
                  setRequestForm({
                    ...requestForm,
                    travelers: Number(e.target.value),
                  })
                }
              />
              <input
                required
                type="date"
                className="rounded-md border bg-background p-2"
                value={requestForm.startDate}
                onChange={(e) =>
                  setRequestForm({ ...requestForm, startDate: e.target.value })
                }
              />
              <input
                required
                type="date"
                className="rounded-md border bg-background p-2"
                value={requestForm.endDate}
                onChange={(e) =>
                  setRequestForm({ ...requestForm, endDate: e.target.value })
                }
              />
              <input
                type="number"
                min="0"
                className="rounded-md border bg-background p-2"
                placeholder="Budget"
                value={requestForm.budget}
                onChange={(e) =>
                  setRequestForm({ ...requestForm, budget: e.target.value })
                }
              />
              <input
                className="rounded-md border bg-background p-2"
                placeholder="Trip details"
                value={requestForm.details}
                onChange={(e) =>
                  setRequestForm({ ...requestForm, details: e.target.value })
                }
              />
              <Button type="submit">Post request</Button>
            </form>
          </section>
          <section className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 text-lg font-semibold">
              3. Offers and bookings
            </h2>
            {offers.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Offers from guides will appear here.
              </p>
            )}
            {offers.map((offer) => (
              <div
                className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
                key={offer._id}
              >
                <span>
                  <b>{offer.guide?.username}</b> offered ${offer.price} for{" "}
                  {offer.request?.destination}
                </span>
                {offer.status === "pending" && (
                  <Button
                    onClick={() =>
                      run(async () => {
                        await call(
                          `/travel/offers/${offer._id}/accept`,
                          "POST",
                        );
                        setMessage(
                          "Offer accepted. Complete mock payment below.",
                        );
                      })
                    }
                  >
                    Accept offer
                  </Button>
                )}
              </div>
            ))}
            {bookings.map((booking) => (
              <div
                className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
                key={booking._id}
              >
                <span>
                  {booking.request?.destination}:{" "}
                  <b>{booking.status.replace("_", " ")}</b>
                </span>
                {booking.status === "awaiting_payment" && (
                  <Button
                    onClick={() =>
                      run(async () => {
                        await call(
                          `/travel/bookings/${booking._id}/pay`,
                          "POST",
                        );
                        setMessage("Mock payment complete; booking confirmed.");
                      })
                    }
                  >
                    Pay securely (mock)
                  </Button>
                )}
                {booking.status === "completed" && (
                  <Button
                    onClick={() => {
                      const rating = window.prompt(
                        "Rate this trip from 1 to 5",
                      );
                      if (rating)
                        run(async () => {
                          await call(
                            `/travel/bookings/${booking._id}/review`,
                            "POST",
                            { rating: Number(rating), comment: "Great trip" },
                          );
                          setMessage(
                            "Review submitted and guide rating updated.",
                          );
                        });
                    }}
                  >
                    Leave review
                  </Button>
                )}
              </div>
            ))}
          </section>
        </>
      )}

      {user.role === "guide" && (
        <>
          <section className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 text-lg font-semibold">
              1. Create or update your guide profile
            </h2>
            <form onSubmit={saveProfile} className="grid gap-3 md:grid-cols-2">
              <input
                required
                className="rounded-md border bg-background p-2"
                placeholder="Location"
                value={profileForm.location}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, location: e.target.value })
                }
              />
              <input
                required
                type="number"
                min="0"
                className="rounded-md border bg-background p-2"
                placeholder="Price per day"
                value={profileForm.pricePerDay}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    pricePerDay: e.target.value,
                  })
                }
              />
              <input
                className="rounded-md border bg-background p-2"
                placeholder="Languages, comma separated"
                value={profileForm.languages}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, languages: e.target.value })
                }
              />
              <input
                className="rounded-md border bg-background p-2"
                placeholder="Specialties, comma separated"
                value={profileForm.specialties}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    specialties: e.target.value,
                  })
                }
              />
              <textarea
                className="rounded-md border bg-background p-2 md:col-span-2"
                placeholder="Short bio"
                value={profileForm.bio}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, bio: e.target.value })
                }
              />
              <Button type="submit">Submit profile</Button>
            </form>
          </section>
          <section className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 text-lg font-semibold">
              2. Open travel requests
            </h2>
            {requests.map((request) => (
              <div
                className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
                key={request._id}
              >
                <span>
                  <b>{request.destination}</b> · {request.travelers} traveler(s)
                  · {request.startDate.slice(0, 10)}
                </span>
                <div className="flex gap-2">
                  <input
                    className="w-28 rounded-md border bg-background p-2"
                    type="number"
                    min="0"
                    placeholder="Your price"
                    value={offerPrices[request._id] || ""}
                    onChange={(e) =>
                      setOfferPrices({
                        ...offerPrices,
                        [request._id]: e.target.value,
                      })
                    }
                  />
                  <Button
                    onClick={() =>
                      run(async () => {
                        await call(
                          `/travel/requests/${request._id}/offers`,
                          "POST",
                          { price: Number(offerPrices[request._id]) },
                        );
                        setMessage("Offer submitted");
                      })
                    }
                  >
                    Send offer
                  </Button>
                </div>
              </div>
            ))}
          </section>
          <section className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 text-lg font-semibold">3. Confirmed trips</h2>
            {bookings.map((booking) => (
              <div
                className="mb-3 flex items-center justify-between rounded-lg border p-3"
                key={booking._id}
              >
                <span>
                  {booking.request?.destination} · {booking.status}
                </span>
                {booking.status === "confirmed" && (
                  <Button
                    onClick={() =>
                      run(async () => {
                        await call(
                          `/travel/bookings/${booking._id}/complete`,
                          "POST",
                        );
                        setMessage("Trip marked completed");
                      })
                    }
                  >
                    Mark completed
                  </Button>
                )}
              </div>
            ))}
          </section>
        </>
      )}

      {user.role === "admin" && (
        <section className="rounded-xl border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <ShieldCheck size={18} /> Guide verification queue
          </h2>
          {verifications.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No pending guide profiles.
            </p>
          )}
          {verifications.map((guide) => (
            <div
              className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
              key={guide._id}
            >
              <span>
                <b>{guide.username}</b> · {guide.guideProfile?.location}
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    run(async () => {
                      await patchData(`/admin/verifications/${guide._id}`, {
                        status: "verified",
                      });
                      setMessage("Guide verified");
                    })
                  }
                >
                  <Check size={16} /> Verify
                </Button>
                <Button
                  onClick={() =>
                    run(async () => {
                      await patchData(`/admin/verifications/${guide._id}`, {
                        status: "rejected",
                      });
                      setMessage("Guide rejected");
                    })
                  }
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
