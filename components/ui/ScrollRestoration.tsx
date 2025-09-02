"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ScrollRestoration = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top immediately on route change
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });

      // Also set document scroll position for any edge cases
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Immediate scroll restoration
    scrollToTop();

    // Also handle browser back/forward navigation
    const handlePopState = () => {
      scrollToTop();
    };

    window.addEventListener("popstate", handlePopState);

    // Cleanup event listener
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pathname]);

  // Also disable browser's scroll restoration
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  return null;
};

export default ScrollRestoration;
