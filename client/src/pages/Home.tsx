import Landing from "@/components/Landing";
import Button from "@/components/Button";
import { fetchData, postData } from "@/lib/api";
import { useStore } from "@/store/useStore";
import { CalendarDays, MapPin, Send, Users } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { Link } from "react-router";

type TouristType = {
  _id: string;
  username: string;
  email: string;
  profileImg?: Record<string, unknown>;
};

type TravelRequestType = {
  id?: string;
  _id?: string;
  tourist: TouristType | string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  details: string;
  status: "open" | "offered" | "booked" | "completed";
};

// Helper function to format MongoDB ISO dates safely
const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC", // Keeps the date aligned with the ISO date stored in MongoDB
  });
};

export default function Home() {
  const user = useStore((state) => state.user);
  const [requests, setRequests] = useState<TravelRequestType[]>([]);
  const [requestForm, setRequestForm] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 1,
    budget: "",
    details: "",
  });
  const [requestMessage, setRequestMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTravelRequests = async () => {
    try {
      const resData = await fetchData<{
        message: string;
        requests: TravelRequestType[];
      }>("/travel/requests");

      setRequests(resData.requests);
    } catch (e) {
      console.error("Could not fetch travel requests:", e);
    }
  };

  useEffect(() => {
    getTravelRequests();
  }, []);

  const submitTravelRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setRequestMessage("");

    try {
      await postData("/travel/requests", {
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
      setRequestMessage("Your travel request is now open for verified guides.");
      await getTravelRequests();
    } catch (error) {
      setRequestMessage(
        error instanceof Error ? error.message : "Could not post your request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Landing />
      <section className="bg-muted/30 px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Travel requests
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Help shape someone's next Nepal story
              </h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Travelers share the trip they have in mind. Verified guides can
                browse open requests and send a personal offer from Travel Desk.
              </p>
            </div>
            <span className="rounded-full border bg-background px-3 py-1 text-sm text-muted-foreground">
              Latest Travel Requests
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {requests.map((request) => (
              <article
                className="flex h-full flex-col rounded-xl border bg-card p-5 shadow-sm"
                key={request._id || request.destination}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={16} className="text-primary" />
                    Nepal
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-primary">
                    {request.status}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-semibold capitalize">
                  {request.destination}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                  {request.details}
                </p>

                <div className="mt-5 grid grid-cols-3 gap-2 border-t pt-4 text-xs text-muted-foreground">
                  {/* Formatted Date Range */}
                  <span
                    className="flex items-center gap-1.5"
                    title={`${formatDate(request.startDate)} - ${formatDate(request.endDate)}`}
                  >
                    <CalendarDays size={14} />
                    {formatDate(request.startDate)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={14} />
                    {request.travelers} traveler
                    {request.travelers > 1 ? "s" : ""}
                  </span>

                  <span className="text-right font-semibold text-foreground">
                    NPR {request.budget}
                  </span>
                </div>
              </article>
            ))}
          </div>

          {user?.role === "tourist" && (
            <div className="mt-10 rounded-2xl border bg-card p-6 shadow-sm lg:p-8">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    Plan your trip
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight">
                    Post a travel request
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Tell verified local guides what you have in mind and let
                    them send you a personal offer.
                  </p>
                </div>
                <Send className="mt-1 h-6 w-6 text-primary" />
              </div>

              <form
                onSubmit={submitTravelRequest}
                className="grid gap-4 md:grid-cols-2"
              >
                <input
                  required
                  className="rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Destination"
                  value={requestForm.destination}
                  onChange={(event) =>
                    setRequestForm({
                      ...requestForm,
                      destination: event.target.value,
                    })
                  }
                />
                <input
                  required
                  type="number"
                  min="1"
                  className="rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Number of travelers"
                  value={requestForm.travelers}
                  onChange={(event) =>
                    setRequestForm({
                      ...requestForm,
                      travelers: Number(event.target.value),
                    })
                  }
                />
                <label className="text-sm text-muted-foreground">
                  Start date
                  <input
                    required
                    type="date"
                    className="mt-1.5 w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    value={requestForm.startDate}
                    onChange={(event) =>
                      setRequestForm({
                        ...requestForm,
                        startDate: event.target.value,
                      })
                    }
                  />
                </label>
                <label className="text-sm text-muted-foreground">
                  End date
                  <input
                    required
                    type="date"
                    className="mt-1.5 w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    value={requestForm.endDate}
                    onChange={(event) =>
                      setRequestForm({
                        ...requestForm,
                        endDate: event.target.value,
                      })
                    }
                  />
                </label>
                <input
                  type="number"
                  min="0"
                  className="rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Budget in NPR (optional)"
                  value={requestForm.budget}
                  onChange={(event) =>
                    setRequestForm({
                      ...requestForm,
                      budget: event.target.value,
                    })
                  }
                />
                <input
                  className="rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Trip details"
                  value={requestForm.details}
                  onChange={(event) =>
                    setRequestForm({
                      ...requestForm,
                      details: event.target.value,
                    })
                  }
                />
                <div className="flex flex-wrap items-center gap-4 md:col-span-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary px-5 py-2.5 text-sm text-white"
                  >
                    {isSubmitting ? "Posting..." : "Post travel request"}
                  </Button>
                  {requestMessage && (
                    <p className="text-sm text-muted-foreground" role="status">
                      {requestMessage}
                    </p>
                  )}
                </div>
              </form>
            </div>
          )}

          {!user && (
            <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
              <h3 className="text-xl font-bold">Have a trip in mind?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Log in as a tourist to post your travel request for verified
                guides.
              </p>
              <Link to="/auth" className="mt-4 inline-block">
                <Button className="bg-primary px-5 py-2.5 text-sm text-white">
                  Log in to post a request
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
