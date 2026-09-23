import React from "react";
import { render, screen } from "@testing-library/react";
import { MetricCard } from "@/components/ui/metric-card";

describe("MetricCard Component", () => {
  test("renders metric title, value, and unit", () => {
    render(
      <MetricCard
        title="Live Birds"
        value="9,820"
        unit="birds"
        subtitle="House 03"
      />
    );
    expect(screen.getByText("Live Birds")).toBeInTheDocument();
    expect(screen.getByText("9,820")).toBeInTheDocument();
    expect(screen.getByText("birds")).toBeInTheDocument();
    expect(screen.getByText("House 03")).toBeInTheDocument();
  });

  test("renders change trend when provided", () => {
    render(
      <MetricCard
        title="FCR"
        value="1.42"
        change={{ value: "+0.02 vs target", trend: "up" }}
      />
    );
    expect(screen.getByText("+0.02 vs target")).toBeInTheDocument();
  });
});

