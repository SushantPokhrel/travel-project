import React, { useState } from "react";
import {
  UserPlus,
  Search,
  Send,
  CheckCircle,
  CreditCard,
  Star,
  ShieldCheck,
  Briefcase,
  Sparkles,
  ArrowRight,
  Compass,
  Award,
} from "lucide-react";
import { Card, CardContent } from "../../@/components/ui/card";
import { Badge } from "../../@/components/ui/badge";
import Button from "@/components/Button";
import { useStore } from "@/store/useStore";

export default function HowItWorks() {
  const User = useStore((state) => state.user);
  const [activeRole, setActiveRole] = useState(User?.role || "tourist");

  const touristSteps = [
    {
      step: "01",
      title: "Register & Search",
      description:
        "Sign up as an explorer and search verified local guides tailored to your destination and preferences.",
      icon: Search,
      badge: "Step 1",
      highlight: "Find top-rated local guides",
    },
    {
      step: "02",
      title: "Post Travel Request",
      description:
        "Share your travel dates, budget, and custom trip details with our network of experienced guides.",
      icon: Send,
      badge: "Step 2",
      highlight: "Receive tailored offers",
    },
    {
      step: "03",
      title: "Accept Offer & Pay",
      description:
        "Review custom offers from guides, select the best fit, and complete secure mock checkout.",
      icon: CreditCard,
      badge: "Step 3",
      highlight: "Instant booking confirmation",
    },
    {
      step: "04",
      title: "Trip & Review",
      description:
        "Enjoy your guided adventure! Once completed, rate your guide to help build our trusted community.",
      icon: Star,
      badge: "Step 4",
      highlight: "Leave verified ratings",
    },
  ];

  const guideSteps = [
    {
      step: "01",
      title: "Register & Profile Setup",
      description:
        "Sign up as a guide, upload your headshot, and submit identity verification documents for safety.",
      icon: UserPlus,
      badge: "Step 1",
      highlight: "Fast onboarding setup",
    },
    {
      step: "02",
      title: "Get Verified by Admin",
      description:
        "Our admin team reviews and verifies your profile credentials to give you a trusted badge.",
      icon: ShieldCheck,
      badge: "Step 2",
      highlight: "Official verification badge",
    },
    {
      step: "03",
      title: "View Requests & Offer",
      description:
        "Browse tourist travel requests, negotiate itineraries, and submit competitive custom offers.",
      icon: Briefcase,
      badge: "Step 3",
      highlight: "Direct traveler engagement",
    },
    {
      step: "04",
      title: "Guide, Complete & Earn",
      description:
        "Deliver an amazing experience, mark the trip complete, get paid, and boost your public rating.",
      icon: Award,
      badge: "Step 4",
      highlight: "Build your guide reputation",
    },
  ];

  const currentSteps = activeRole === "tourist" ? touristSteps : guideSteps;

  return (
    <div className="w-full min-h-screen bg-body-bg py-16 px-4 sm:px-6 lg:px-8 font-sans text-text-para">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* --- HEADER SECTION --- */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Badge className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 mr-1 inline" />
            Seamless Journey
          </Badge>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-header tracking-tight">
            How <span className="text-primary">It Works</span>
          </h2>

          <p className="text-text-muted text-base leading-relaxed">
            Connecting passionate explorers with verified local experts in just
            a few simple steps.
          </p>

          {/* Role Switcher Tabs */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex p-1.5 bg-surface border border-gray-1 rounded-xl">
              <button
                onClick={() => setActiveRole("tourist")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeRole === "tourist"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-text-muted hover:text-text-header hover:bg-body-bg"
                }`}
              >
                <Compass className="w-4 h-4" />
                For Tourists
              </button>

              <button
                onClick={() => setActiveRole("guide")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeRole === "guide"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-text-muted hover:text-text-header hover:bg-body-bg"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                For Tour Guides
              </button>
            </div>
          </div>
        </div>

        {/* --- STEP FLOW GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {currentSteps.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                className="relative group border border-gray-1 bg-surface shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                {/* Top Accent Bar */}
                <div className="h-1.5 w-full bg-primary" />

                <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Step Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-extrabold text-text-muted/40 tracking-wider">
                        {item.step}
                      </span>
                      <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs font-semibold px-2.5 py-0.5">
                        {item.badge}
                      </Badge>
                    </div>

                    {/* Icon Container */}
                    <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm mb-4">
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg font-bold text-text-header group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-text-muted mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Highlight pill footer */}
                  <div className="pt-4 border-t border-gray-1 mt-4">
                    <span className="inline-flex items-center text-xs font-medium text-text-muted gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-primary" />
                      {item.highlight}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* --- MVP WORKFLOW LIFECYCLE SUMMARY BANNER --- */}
        <div className="relative overflow-hidden rounded-2xl bg-surface border border-gray-1 p-8 text-text-para shadow-md">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl font-bold text-text-header flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                End-to-End Verified Booking Pipeline
              </h3>
              <p className="text-text-muted text-sm max-w-2xl leading-relaxed">
                From admin-verified identity checks to escrow mock payments and
                real-time review updates, our platform ensures safety,
                transparency, and trust every step of the way.
              </p>
            </div>

            <Button className="bg-primary hover:opacity-90 text-primary-foreground font-medium px-6 py-3 rounded-xl shadow-sm transition-all flex items-center gap-2 whitespace-nowrap">
              Start Exploring
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}