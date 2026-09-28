import Landing from "@/components/Landing";
import { fetchData } from "@/lib/api";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [requests, setRequests] = useState<TravelRequestType[]>([]);

  useEffect(() => {
    async function getTravelRequests() {
      try {
        const resData = await fetchData<{
          message: string;
          requests: TravelRequestType[];
        }>("/travel/requests");

        setRequests(resData.requests);
      } catch (e) {
        console.error("Could not fetch travel requests:", e);
      }
    }

    getTravelRequests();
  }, []);

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
              Live request examples
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
                  <span className="flex items-center gap-1.5" title={`${formatDate(request.startDate)} - ${formatDate(request.endDate)}`}>
                    <CalendarDays size={14} />
                    {formatDate(request.startDate)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={14} />
                    {request.travelers} traveler{request.travelers > 1 ? "s" : ""}
                  </span>

                  <span className="text-right font-semibold text-foreground">
                    NPR {request.budget}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}