import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
}

interface StatCardsProps {
  stats: StatCardProps[];
}

export default function StatCards({ stats }: StatCardsProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={stat.label} hover className={`p-5 animate-fade-up delay-${i + 1}`}>
          <div className="flex items-start justify-between mb-3">
            <span className="text-zinc-500">{stat.icon}</span>
            <Badge variant={stat.positive ? "green" : "red"}>
              {stat.change}
            </Badge>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
          <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
        </Card>
      ))}
    </section>
  );
}
