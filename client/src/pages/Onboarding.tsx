import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { Checkbox } from "../../@/components/ui/checkbox";
import { Button } from "../../@/components/ui/button";
import { Input } from "../../@/components/ui/input";
import { Label } from "../../@/components/ui/label";
export default function Onboarding() {
  const user = useStore((state) => state.user);
  const [role, setRole] = useState<"tourist" | "guide" | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [identityDoc, setIdentityDoc] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !phoneNumber) return;
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("role", role);
    formData.append("phoneNumber", phoneNumber);
    if (role === "guide") {
      if (identityDoc) {
        formData.append("identityDocument", identityDoc);
      }
      if (photo) {
        formData.append("photo", photo);
      }
    }
    try {
      console.log("Submitting onboarding setup:", Object.fromEntries(formData));
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 font-sans">
      <div className="w-full max-w-lg rounded-xl border p-8 shadow-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Complete Your Profile
          </h1>{" "}
          <p className="mt-2 text-sm">
            {" "}
            Welcome, {user?.username || "Explorer"}! Choose your pathway to
            continue.{" "}
          </p>{" "}
        </div>{" "}
        <form onSubmit={handleSubmit} className="space-y-6">
          {" "}
          {/* Account Role Selection */}{" "}
          <div className="space-y-3">
            {" "}
            <Label className="text-sm font-medium">
              {" "}
              I want to join as a:{" "}
            </Label>{" "}
            <div className="grid grid-cols-2 gap-4">
              {" "}
              {/* Tourist Choice */}{" "}
              <div
                onClick={() => setRole("tourist")}
                className={`flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-all ${role === "tourist" ? "border-primary" : ""}`}
              >
                {" "}
                <Checkbox
                  id="tourist"
                  checked={role === "tourist"}
                  onCheckedChange={() => setRole("tourist")}
                />{" "}
                <label
                  htmlFor="tourist"
                  className="cursor-pointer select-none text-sm font-medium"
                >
                  {" "}
                  Tourist{" "}
                </label>{" "}
              </div>{" "}
              {/* Guide Choice */}{" "}
              <div
                onClick={() => setRole("guide")}
                className={`flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-all ${role === "guide" ? "border-primary" : ""}`}
              >
                {" "}
                <Checkbox
                  id="guide"
                  checked={role === "guide"}
                  onCheckedChange={() => setRole("guide")}
                />{" "}
                <label
                  htmlFor="guide"
                  className="cursor-pointer select-none text-sm font-medium"
                >
                  {" "}
                  Guide{" "}
                </label>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Conditional Field Layout */}{" "}
          {role && (
            <div className="animate-in fade-in space-y-4 border-t pt-4 duration-200">
              {" "}
              {/* Shared Field: Phone Number */}{" "}
              <div className="space-y-2">
                {" "}
                <Label htmlFor="phone">Phone Number</Label>{" "}
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />{" "}
              </div>{" "}
              {/* Guide Specific Fields */}{" "}
              {role === "guide" && (
                <div className="animate-in slide-in-from-top-2 space-y-4 pt-2 duration-300">
                  {" "}
                  {/* Identity Document Upload */}{" "}
                  <div className="space-y-2">
                    {" "}
                    <Label htmlFor="identityDocument">
                      {" "}
                      Citizenship / Identity Document{" "}
                    </Label>{" "}
                    <Input
                      id="identityDocument"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) =>
                        setIdentityDoc(e.target.files?.[0] || null)
                      }
                      required
                    />{" "}
                    <p className="text-xs">
                      {" "}
                      Upload a clean PDF or photo image file.{" "}
                    </p>{" "}
                  </div>{" "}
                  {/* Photo Profile Field */}{" "}
                  <div className="space-y-2">
                    {" "}
                    <Label htmlFor="photo">
                      {" "}
                      Professional Headshot Photo{" "}
                    </Label>{" "}
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                      required
                    />{" "}
                  </div>{" "}
                </div>
              )}{" "}
            </div>
          )}{" "}
          {/* Submit Actions */}{" "}
          <Button
            type="submit"
            disabled={!role || isSubmitting}
            className="w-full py-6 text-base font-semibold"
          >
            {" "}
            {isSubmitting ? "Saving Profile..." : "Complete Setup"}{" "}
          </Button>{" "}
        </form>{" "}
      </div>
    </div>
  );
}
