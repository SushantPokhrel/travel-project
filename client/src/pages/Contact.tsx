import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Link } from "react-router";
import Button from "@/components/Button";

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@guidenepal.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+977-9800000000",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "Kathmandu, Nepal",
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-body-bg px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-gray-1 bg-surface p-6 shadow-sm lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Contact us</p>
            <h1 className="text-3xl font-bold tracking-tight text-text-header sm:text-4xl">
              We’re here to help you plan your next Nepal adventure.
            </h1>
            <p className="text-base leading-8 text-text-muted">
              Whether you’re a traveler looking for a trusted guide or a local expert ready to share your region, we’d love to hear from you. Reach out and we’ll help connect you with the right people and experiences.
            </p>

            <div className="space-y-4">
              {contactDetails.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4 rounded-2xl border border-gray-1 bg-body-bg p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-text-muted">{label}</p>
                    <p className="mt-1 text-base font-medium text-text-header">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-1 bg-body-bg p-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-text-header">Send a message</h2>
              <p className="text-sm leading-7 text-text-muted">
                Let us know what kind of trip, guide, or support you need.
              </p>

              <div className="space-y-3">
                <input
                  className="w-full rounded-xl border border-gray-1 bg-surface px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Your name"
                />
                <input
                  className="w-full rounded-xl border border-gray-1 bg-surface px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Your email"
                  type="email"
                />
                <textarea
                  rows={5}
                  className="w-full rounded-xl border border-gray-1 bg-surface px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="How can we help?"
                />
              </div>

              <Button className="mt-2 w-full justify-center bg-primary text-primary-foreground px-6 py-3 text-sm font-medium">
                <Send className="h-4 w-4" />
                Send message
              </Button>

              <p className="text-xs text-text-muted">
                Looking for a trip guide? <Link to="/guides" className="font-medium text-primary">Browse local guides</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
