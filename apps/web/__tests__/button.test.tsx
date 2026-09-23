import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  test("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  test("disables button when disabled prop is passed", () => {
    render(<Button disabled>Disabled Action</Button>);
    expect(screen.getByRole("button", { name: /disabled action/i })).toBeDisabled();
  });

  test("shows loading state and disables button", () => {
    render(<Button isLoading>Saving</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});

