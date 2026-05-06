import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "../../app/components/home/Hero";

function setReduceMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("Hero", () => {
  beforeEach(() => {
    setReduceMotion(false);
  });

  it("renders the ELLA wordmark and tagline", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("ELLA");
    expect(
      screen.getByText(/warm editorial soft glam · outono 2026/i),
    ).toBeInTheDocument();
  });

  it("renders the video element when motion is allowed", () => {
    setReduceMotion(false);
    render(<Hero />);
    expect(screen.getByTestId("hero-video")).toBeInTheDocument();
  });

  it("hides the video when prefers-reduced-motion is set", () => {
    setReduceMotion(true);
    render(<Hero />);
    expect(screen.queryByTestId("hero-video")).not.toBeInTheDocument();
  });

  it("always renders the still fallback image so the section is never empty", () => {
    render(<Hero />);
    const fallback = document.querySelector('img[aria-hidden="true"]');
    expect(fallback).not.toBeNull();
  });

  it("uses semantic landmark with descriptive aria-label", () => {
    render(<Hero />);
    expect(screen.getByLabelText(/Hero ELLA — warm editorial soft glam/i)).toBeInTheDocument();
  });
});
