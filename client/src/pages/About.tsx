import { ArrowRight, CheckCircle, Compass, MapPin, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "../../@/components/ui/badge";
import { Card, CardContent } from "../../@/components/ui/card";
import Button from "@/components/Button";

const highlights = [
  {
    icon: Compass,
    title: "Personalized travel planning",
    description:
      "Travelers can share where they want to go, what they want to experience, and how much they want to spend, then connect with the right local guide for their trip.",
  },
  {
    icon: ShieldCheck,
    title: "Verified and trusted guides",
    description:
      "Every local expert is part of a safer, more transparent ecosystem where identity checks and profile verification help build confidence before booking.",
  },
  {
    icon: MapPin,
    title: "Authentic Nepal experiences",
    description:
      "From hidden cultural gems to iconic treks, the platform helps visitors discover experiences that feel real, local, and unforgettable.",
  },
];

const values = [
  "Trusted guide verification",
  "Safe and transparent trip matching",
  "Local experiences with real cultural value",
  "Simple communication from inquiry to booking",
];

export default function About() {
  return (
    <div className="w-full min-h-screen bg-body-bg px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-12">
        <section className="overflow-hidden rounded-3xl border border-gray-1 bg-surface shadow-sm">
          <div className="grid gap-10 px-6 py-8 md:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-12 lg:py-12">
            <div className="space-y-6">
              <Badge className="border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                About GuideNepal
              </Badge>

              <div className="space-y-4">
                <h1 className="text-3xl font-extrabold tracking-tight text-text-header sm:text-4xl lg:text-5xl">
                  A smarter way to <span className="text-primary">explore Nepal</span>
                </h1>
                <p className="max-w-2xl text-base leading-8 text-text-muted">
                  GuideNepal is a travel platform designed to help tourists and local guides connect in a more simple, secure, and meaningful way. Instead of scattered messages and uncertain recommendations, travelers can share their needs and receive offers from verified professionals who know the region best.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button href="/guides" className="bg-primary text-primary-foreground px-6 py-3 text-sm font-medium">
                  Explore guides
                </Button>
                <Button href="/auth" className="bg-surface border border-gray-1 px-6 py-3 text-sm font-medium text-text-header hover:bg-gray-1/50">
                  Join now
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-1 bg-body-bg p-6 shadow-inner">
              <div className="space-y-5">
                <div className="flex items-center justify-between rounded-xl border border-gray-1 bg-surface p-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Travelers</p>
                    <p className="mt-1 text-2xl font-bold text-text-header">10k+</p>
                  </div>
                  <Users className="h-10 w-10 rounded-xl bg-primary/10 p-2 text-primary" />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-gray-1 bg-surface p-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Verified guides</p>
                    <p className="mt-1 text-2xl font-bold text-text-header">500+</p>
                  </div>
                  <ShieldCheck className="h-10 w-10 rounded-xl bg-primary/10 p-2 text-primary" />
                </div>

                <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm leading-7 text-text-muted">
                  “We are building a travel experience where trust, culture, and convenience meet in one place.”
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="border border-gray-1 bg-surface shadow-sm">
              <CardContent className="space-y-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-text-header">{title}</h2>
                <p className="text-sm leading-7 text-text-muted">{description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-8 rounded-3xl border border-gray-1 bg-surface p-6 shadow-sm lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Our mission</p>
            <h2 className="text-3xl font-bold text-text-header">Making travel more trusted, local, and personal.</h2>
            <p className="text-base leading-8 text-text-muted">
              Nepal is rich in stories, landscapes, and culture. We created GuideNepal to make it easier for visitors to discover quality local expertise while giving skilled guides a fair platform to showcase their work and build long-term trust with travelers.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-1 bg-body-bg p-6">
            <ul className="space-y-4">
              {values.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl border border-gray-1 bg-surface p-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm leading-7 text-text-muted">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-3xl border border-primary/20 bg-primary/5 p-6 text-center shadow-sm lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Why it matters</p>
          <h2 className="mt-3 text-3xl font-bold text-text-header">Travel should feel safe, authentic, and unforgettable.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-text-muted">
            GuideNepal brings together tourism, trust, and local knowledge in one place so every trip can be better planned, more meaningful, and more memorable.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              See how it works
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
