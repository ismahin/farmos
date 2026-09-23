import * as React from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "warning" | "error" | "success";
  title?: string;
  onDismiss?: () => void;
}

export function Alert({
  variant = "info",
  title,
  children,
  className,
  onDismiss,
  ...props
}: AlertProps) {
  const variantStyles = {
    info: "border-blue-200 bg-blue-50/70 text-blue-900",
    warning: "border-amber-200 bg-amber-50/70 text-amber-900",
    error: "border-rose-200 bg-rose-50/70 text-rose-900",
    success: "border-emerald-200 bg-emerald-50/70 text-emerald-900",
  }[variant];

  const Icon = {
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
    success: CheckCircle2,
  }[variant];

  const iconColors = {
    info: "text-blue-600",
    warning: "text-amber-600",
    error: "text-rose-600",
    success: "text-emerald-600",
  }[variant];

  return (
    <div
      role="alert"
      className={cn(
        "relative flex w-full gap-3 rounded-xl border p-4 text-sm shadow-xs",
        variantStyles,
        className
      )}
      {...props}
    >
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", iconColors)} />
      <div className="flex-1">
        {title && <h5 className="font-semibold leading-tight mb-1">{title}</h5>}
        <div className="text-xs leading-relaxed opacity-90">{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-md p-1 opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

