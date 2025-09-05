"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ClientAnimations() {
  // Refs for GSAP animations
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const heroButtonsRef = useRef<HTMLDivElement>(null);

  // Refs for Problem Section animations
  const problemSectionRef = useRef<HTMLElement>(null);
  const problemTextRef = useRef<HTMLDivElement>(null);
  const problemImageRef = useRef<HTMLDivElement>(null);

  // Refs for Speed Comparison Section animations
  const speedSectionRef = useRef<HTMLElement>(null);
  const speedHeaderRef = useRef<HTMLDivElement>(null);
  const keyboardCardRef = useRef<HTMLDivElement>(null);
  const flowCardRef = useRef<HTMLDivElement>(null);

  // GSAP animations
  useEffect(() => {
    // Check if window exists (client-side only)
    if (typeof window === "undefined") return;

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Hero section staggered fade-in
    const heroTl = gsap.timeline();

    // Set initial opacity to 0 for all hero elements
    gsap.set(
      [heroTitleRef.current, heroSubtitleRef.current, heroButtonsRef.current],
      {
        opacity: 0,
        y: 30,
      }
    );

    // Staggered animation sequence for hero
    heroTl
      .to(heroTitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      })
      .to(
        heroSubtitleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .to(
        heroButtonsRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4"
      );

    // Problem section scroll-triggered animations
    if (
      problemSectionRef.current &&
      problemTextRef.current &&
      problemImageRef.current
    ) {
      // Set initial states (removed x animation for image)
      gsap.set(problemTextRef.current, { opacity: 1, y: 10 });
      gsap.set(problemImageRef.current, { opacity: 1 }); // Cube always visible

      // Create scroll-triggered timeline
      const problemTl = gsap.timeline({
        scrollTrigger: {
          trigger: problemSectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // First: Grey background fills the section (this happens naturally with the section)
      // Then: Text and image fade in after more scrolling
      problemTl
        .to(
          problemTextRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          },
          0.3
        )
        .to(
          problemImageRef.current,
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
          },
          0.5
        );
    }

    // Speed Comparison section scroll-triggered animations
    if (
      speedSectionRef.current &&
      speedHeaderRef.current &&
      keyboardCardRef.current &&
      flowCardRef.current
    ) {
      // Set initial states
      gsap.set(speedHeaderRef.current, { opacity: 0, y: 30 });
      gsap.set(keyboardCardRef.current, { opacity: 0, x: -30 });
      gsap.set(flowCardRef.current, { opacity: 0, x: 30 });

      // Create scroll-triggered timeline with faster animations
      const speedTl = gsap.timeline({
        scrollTrigger: {
          trigger: speedSectionRef.current,
          start: "top 90%", // Start earlier
          end: "top 50%", // End earlier for faster completion
          scrub: 0.5, // Reduce scrub for snappier animations
        },
      });

      speedTl
        .to(
          speedHeaderRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          0
        )
        .to(
          keyboardCardRef.current,
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          0.2
        )
        .to(
          flowCardRef.current,
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          0.3
        );
    }

    // Cleanup function to prevent memory leaks and scroll issues
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <>
      {/* Hero Section Animation Refs */}
      <div className="hidden">
        <h1
          ref={heroTitleRef}
          className="text-5xl sm:text-6xl font-bold text-white leading-relaxed text-left"
        >
          面接の不安
          <br />
          <span className="text-[#9fe870]">AI面接官</span>
          <br />
          で潰せ
        </h1>
        <p
          ref={heroSubtitleRef}
          className="text-sm sm:text-base lg:text-xl text-white/80 mobile-mb-large max-w-4xl leading-relaxed text-left"
        >
          プロイーはAI面接官による実践的な面接練習で、次世代の就活・転職活動をサポートします。
        </p>
        <div ref={heroButtonsRef} className="mt-6 sm:mt-8">
          <button className="group relative inline-flex items-center justify-center w-full px-6 sm:px-8 py-3 sm:py-4 bg-[#9fe870] text-[#163300] rounded-full font-semibold text-base sm:text-lg hover:bg-[#8fd960] transition-all duration-300 hover:scale-105 shadow-xl">
            <span className="mr-3">無料で体験する</span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#ff8c5a] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Problem Section Animation Refs */}
      <section ref={problemSectionRef} className="hidden">
        <div
          ref={problemTextRef}
          className="space-y-6 sm:space-y-8 order-2 lg:order-2"
        >
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight text-center lg:text-left">
              AIとのリアルタイム対話で
              <br className="hidden sm:block" />
              <span className="block sm:inline">実践的な面接練習を実現</span>
            </h3>
          </div>
        </div>
        <div
          ref={problemImageRef}
          className="relative flex justify-center items-center min-h-[240px] sm:min-h-[400px] lg:min-h-[600px] order-1 lg:order-1"
        >
          <div className="relative">
            <div className="relative z-10">
              <img
                src="/sound.png"
                alt="AI面接練習システム"
                width={300}
                height={300}
                className="drop-shadow-lg w-full h-auto max-w-[260px] sm:max-w-[400px] lg:max-w-[500px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Speed Comparison Section Animation Refs */}
      <section ref={speedSectionRef} className="hidden">
        <div ref={speedHeaderRef} className="text-center mobile-mb-large">
          <h2 className="mobile-text-heading font-bold text-gray-900 mobile-mb-medium leading-tight max-w-4xl mx-auto">
            従来の面接練習より
            <br />
            <span className="text-[#163300] relative">
              5倍効率的
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-[#9fe870] rounded-full"></div>
            </span>
          </h2>
        </div>
        <div
          ref={keyboardCardRef}
          className="bg-white rounded-3xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-all duration-300"
        >
          <div className="p-8 border-b border-gray-100">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              従来の学習方法
            </h3>
          </div>
        </div>
        <div
          ref={flowCardRef}
          className="bg-white rounded-3xl border-2 border-[#9fe870] overflow-hidden relative"
        >
          <div className="p-8 border-b border-[#9fe870]/20 bg-[#9fe870]/5">
            <h3 className="text-lg sm:text-xl font-bold text-[#163300]">
              AI面接練習
            </h3>
          </div>
        </div>
      </section>
    </>
  );
}
