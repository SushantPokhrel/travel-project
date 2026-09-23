import Sidebar from "@/components/Sidebar";
import React from "react";
import { Outlet } from "react-router";

export default function Dashboard() {
  return (
    <section className="flex">
      <Sidebar />
      <main className=" flex-1">
        <Outlet />
      </main>
    </section>
  );
}
