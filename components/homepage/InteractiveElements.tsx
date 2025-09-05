"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function InteractiveElements() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/interview/new");
  };

  const handleClick2 = () => {
    router.push("/interview");
  };

  useEffect(() => {
    // Add click handlers to buttons in StaticContent
    const heroMobileButton = document.getElementById("hero-mobile-button");
    const heroDesktopButton = document.getElementById("hero-desktop-button");
    const transformationButton = document.getElementById(
      "transformation-button"
    );
    const comparisonButton = document.getElementById("comparison-button");
    const footerButton = document.getElementById("footer-button");

    if (heroMobileButton) {
      heroMobileButton.addEventListener("click", handleClick);
    }
    if (heroDesktopButton) {
      heroDesktopButton.addEventListener("click", handleClick);
    }
    if (transformationButton) {
      transformationButton.addEventListener("click", handleClick);
    }
    if (comparisonButton) {
      comparisonButton.addEventListener("click", handleClick);
    }
    if (footerButton) {
      footerButton.addEventListener("click", handleClick);
    }

    // Cleanup event listeners
    return () => {
      if (heroMobileButton) {
        heroMobileButton.removeEventListener("click", handleClick);
      }
      if (heroDesktopButton) {
        heroDesktopButton.removeEventListener("click", handleClick);
      }
      if (transformationButton) {
        transformationButton.removeEventListener("click", handleClick);
      }
      if (comparisonButton) {
        comparisonButton.removeEventListener("click", handleClick);
      }
      if (footerButton) {
        footerButton.removeEventListener("click", handleClick);
      }
    };
  }, [handleClick]);

  return null;
}
