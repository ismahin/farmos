"use client";

import * as React from "react";
import {
  AlertCircle,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Feather,
  Filter,
  PackageOpen,
  Plus,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { FastLogModal } from "@/components/shell/fast-log-modal";
import { useShell } from "@/components/shell";
import { mockAlerts, mockTasks } from "@/mocks/tasks";
import { FarmTask } from "@/types";

export default function TodayPage() {
  const { currentFarm, currentUser } = useShell();
  const [filter, setFilter] = React.useState<"ALL" | "MINE" | "PRODUCTION" | "STOCK">(
    "ALL"
  );
  const [fastLogAction, setFastLogAction] = React.useState<"mortality" | "feed" | "weight" | null>(
    null
  );

  const filteredTasks = React.useMemo(() => {
    return mockTasks.filter((t) => {
      if (filter === "MINE") return t.assignedTo.includes(currentUser.name);
      if (filter === "PRODUCTION") return t.category === "PRODUCTION" || t.category === "HEALTH";
      if (filter === "STOCK") return t.category === "STOCK";
      return true;
    });
  }, [filter, currentUser.name]);

  const pendingTasks = filteredTasks.filter((t) => t.status !== "COMPLETED");
  const completedTasks = filteredTasks.filter((t) => t.status === "COMPLETED");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Today&apos;s Field & Operational Routines
            </h1>
            <Badge variant="primary">Tuesday, Sept 22</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational task board for{" "}
            <span className="font-semibold text-slate-700">{currentFarm.name}</span> •
            Logged as{" "}
            <span className="font-semibold text-emerald-700">
              {currentUser.name} ({currentUser.roleTitle})
            </span>
          </p>
        </div>

        {/* Rapid Field Log Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            onClick={() => setFastLogAction("mortality")}
            className="bg-slate-800 hover:bg-slate-900 text-white"
          >
            <Feather className="h-4 w-4 mr-1.5" />
            Record Mortality
          </Button>
          <Button
            size="sm"
            onClick={() => setFastLogAction("feed")}
            variant="outline"
          >
            <PackageOpen className="h-4 w-4 mr-1.5" />
            Issue Feed
          </Button>
          <Button
            size="sm"
            onClick={() => setFastLogAction("weight")}
            variant="outline"
          >
            <Scale className="h-4 w-4 mr-1.5" />
            Sample Weights
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5">
          {(
            [
              ["ALL", "All Operations"],
              ["MINE", `My Tasks (${currentUser.name})`],
              ["PRODUCTION", "Flocks & Health"],
              ["STOCK", "Feed & Inventory"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === key
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500 hidden sm:inline-block">
          Showing {filteredTasks.length} tasks
        </span>
      </div>

      {/* Active Operational Alerts Banner */}
      <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900">
              Shift Notice: House 03 Temperature Spike Follow-up
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              Verify ventilation fan bank 2 airflow and drinker lines during afternoon rounds.
              Ascites mortality was elevated to 14 birds this morning.
            </p>
          </div>
        </div>
      </div>

      {/* Task Sections: In Progress & Pending */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-600" />
            Pending & Due Today ({pendingTasks.length})
          </h3>

          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-shadow hover:shadow-md"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">
                      {task.title}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        task.priority === "CRITICAL"
                          ? "bg-rose-100 text-rose-800"
                          : task.priority === "HIGH"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                      {task.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {task.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span>
                      Location:{" "}
                      <strong className="text-slate-700">{task.relatedLocation}</strong>
                    </span>
                    <span>
                      Assigned:{" "}
                      <strong className="text-slate-700">{task.assignedTo}</strong>
                    </span>
                    <span>
                      Due:{" "}
                      <strong className="text-slate-700">
                        {task.dueTime || task.dueDate}
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    onClick={() => {
                      if (task.category === "PRODUCTION") setFastLogAction("mortality");
                      else if (task.category === "STOCK") setFastLogAction("feed");
                      else setFastLogAction("weight");
                    }}
                  >
                    Quick Log
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Work History */}
        {completedTasks.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Completed Today ({completedTasks.length})
            </h3>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs opacity-80"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-700 line-through">
                      {task.title}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {task.relatedLocation} • Completed by {task.assignedTo}
                    </p>
                  </div>
                  <Badge variant="success">Completed</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contextual Fast Log Modal */}
      {fastLogAction && (
        <FastLogModal
          isOpen={true}
          defaultAction={fastLogAction}
          onClose={() => setFastLogAction(null)}
        />
      )}
    </div>
  );
}

