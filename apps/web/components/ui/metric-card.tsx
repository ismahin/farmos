import * as React from "react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: {
    value: string | number;
    trend: "up" | "down" | "neutral";
    label?: string;
  };
  subtitle?: string;
  icon?: React.ReactNode;
  status?: "normal" | "warning" | "critical" | "info";
  className?: string;
  onClick?: () => void;
}

export function MetricCard({
  title,
  value,
  unit,
  change,
  subtitle,
  icon,
  status = "normal",
  className,
  onClick,
}: MetricCardProps) {
  const statusBorder = {
    normal: "border-slate-200 hover:border-slate-300",
    warning: "border-amber-300 bg-amber-50/20",
    critical: "border-rose-300 bg-rose-50/20",
    info: "border-blue-300 bg-blue-50/20",
  }[status];

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border bg-white p-5 shadow-xs transition-all",
        statusBorder,
        onClick && "cursor-pointer hover:shadow-md active:scale-[0.99]",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </p>
        {icon && <div className="text-slate-400 shrink-0">{icon}</div>}
      </div>

      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {unit && <span className="text-xs font-medium text-slate-500">{unit}</span>}
      </div>

      {(change || subtitle) && (
        <div className="mt-2.5 flex items-center gap-2 text-xs">
          {change && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-medium",
                change.trend === "up" && "text-emerald-600",
                change.trend === "down" && "text-rose-600",
                change.trend === "neutral" && "text-slate-500"
              )}
            >
              {change.trend === "up" && <ArrowUp className="h-3 w-3" />}
              {change.trend === "down" && <ArrowDown className="h-3 w-3" />}
              {change.trend === "neutral" && <Minus className="h-3 w-3" />}
              {change.value}
            </span>
          )}
          {subtitle && (
            <span className="text-slate-500 truncate">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}

