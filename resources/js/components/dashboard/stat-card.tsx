import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, description, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("bg-card border border-border rounded-xl p-6 flex flex-col transition-all hover:border-black/20 dark:hover:border-white/20", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-muted-foreground font-medium text-sm">{title}</h3>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-semibold tracking-tight text-foreground">{value}</span>
        {trend && (
          <span className={cn("text-sm font-medium", trend.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-destructive")}>
            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
          </span>
        )}
      </div>
      {description && <p className="text-muted-foreground text-sm mt-1">{description}</p>}
    </div>
  );
}
