"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />
      <div
        className={`
          flex-1 flex flex-col w-full min-w-0
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-64"}
        `}
      >
        {children}
        <Footer />
      </div>
    </>
  );
}
