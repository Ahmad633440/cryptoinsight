"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";

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
          flex-1 flex flex-col
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-64"}
        `}
      >
        {children}
      </div>
    </>
  );
}
