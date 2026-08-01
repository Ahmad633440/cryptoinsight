import React from "react";
import Badge from "@/components/ui/Badge";
import ComparisonFeed from "@/components/comparison/ComparisonFeed";

export const metadata = {
  title: "Historical Comparison - CryptoInsight",
  description: "Compare current crypto alerts with historical events using vector search similarity.",
};

export default function ComparisonPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800 pb-12">
        <div className="space-y-4">
         
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
            Historical <span className="text-gradient">Comparison</span>
          </h1>
          <p className="text-zinc-500 max-w-xl text-lg font-medium leading-relaxed">
            Semantically align current news alerts with historical market events to examine past price correlations.
          </p>
        </div>
      </header>

      {/* Comparison Feed */}
      <main>
        <ComparisonFeed />
      </main>
    </div>
  );
}

