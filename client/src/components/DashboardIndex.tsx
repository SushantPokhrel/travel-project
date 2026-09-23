import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  MapPin,
  Edit3,
  CheckCircle2,
  Clock,
  Award,
  FileText,
  Camera,
  Compass,
} from "lucide-react";
import Button from "@/components/Button";
import { Badge } from "../../@/components/ui/badge"; // or your UI library badge
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../@/components/ui/card";

export default function DashboardIndex() {
  const user = useStore((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200">
            Admin
          </Badge>
        );
      case "guide":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
            Tour Guide
          </Badge>
        );
      case "tourist":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
            Explorer / Tourist
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">
            Pending Setup
          </Badge>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8 font-sans">
      {/* --- HERO / BANNER SECTION --- */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute left-1/3 bottom-0 h-48 w-48 rounded-full bg-blue-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            {/* Avatar Profile Picture */}
            <div className="relative group">
              <div className="h-28 w-28 rounded-full border-4 border-white/20 bg-slate-800 flex items-center justify-center overflow-hidden shadow-inner text-3xl font-bold uppercase tracking-wider text-indigo-300">
                {user ? (
                  <img
                    src={user.profileImg}
                    alt={user.username}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <button
                title="Change Photo"
                className="absolute bottom-0 right-0 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-md transition-all duration-200 hover:scale-105"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  {user?.username}
                </h1>
                {getRoleBadge(user?.role || "")}
              </div>
              <p className="text-slate-300 text-sm max-w-lg leading-relaxed">
                {
                  "Welcome to your personal dashboard. Manage your account settings and preferences here."
                }
              </p>

              <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-slate-400 pt-2 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {"Location not set"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  Joined {"Recently"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {isEditing ? "Cancel Editing" : "Edit Profile"}
          </Button>
        </div>
      </div>

      {/* --- STATS / QUICK HIGHLIGHTS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Account Status
            </p>
            <p className="text-base font-semibold text-foreground">
              Verified & Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Identity Document
            </p>
            <p className="text-base font-semibold text-foreground">Approved</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Path
            </p>
            <p className="text-base font-semibold capitalize text-foreground">
              {user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* --- DETAILED PROFILE CONTENT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Details Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                Personal Information
              </h3>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Full Name
                </p>
                <p className="text-sm font-medium text-foreground">
                  {user?.username}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Email Address
                </p>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Phone Number
                </p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">
                    {user?.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  User ID
                </p>
                <p className="text-sm font-mono text-muted-foreground">
                  {user?.id}
                </p>
              </div>
            </div>
          </div>

          {/* Guide Specific Section (Conditional Example) */}
          {user?.role === "guide" && (
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  Guide Verification & Documents
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium">
                        Citizenship / Identity Document
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Verified on Jan 15, 2024
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700">
                    Verified
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Settings / Status Panel */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-lg">Account Security</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm border-b pb-3">
                <span className="text-muted-foreground">Password</span>
                <button className="text-indigo-600 hover:underline font-medium text-xs">
                  Change
                </button>
              </div>
              <div className="flex justify-between items-center text-sm border-b pb-3">
                <span className="text-muted-foreground">Two-Factor Auth</span>
                <span className="text-xs text-amber-600 font-medium">
                  Disabled
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
