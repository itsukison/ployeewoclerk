"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const logos = [
  "/M&CoLOGO.png",
  "/Accenture-logo.jpg",
  "/RecruitLogo.jpg",
  "/P&GLogo.jpg",
  "/MSLogo.jpg",
  "/BDLogo.png",
  "/SMBCLogo.png",
];

export default function LogoSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!sliderRef.current || !barRef.current || !circleRef.current) return;

    const barHeight = 80; // 5rem in px
    const circleDiameter = 56; // 3.5rem in px
    const margin = 16; // 1rem in px

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sliderRef.current,
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
    });

    tl.to(sliderRef.current, { x: "50vw", ease: "none" }, 0)
      .to(barRef.current, { width: "50vw", ease: "none" }, 0)
      .to(
        circleRef.current,
        {
          left: `calc(50vw - 1rem - 3.5rem)`, // barWidth - margin - circleDiameter
          ease: "none",
        },
        0
      );

    // Set initial bar width and circle position
    if (barRef.current) {
      barRef.current.style.width = "0rem";
    }
    if (circleRef.current) {
      circleRef.current.style.left = "calc(0rem - 1rem - 3.5rem)";
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      tl.kill();
    };
  }, []);

  return (
    <div className="w-full overflow-x-hidden py-12 bg-white flex items-center justify-center relative">
      {/* Horizontal Bar (chasing rectangle) */}
      <div
        ref={barRef}
        className="absolute left-0 h-20 z-0"
        style={{
          background: "#9fe870",
          borderTopRightRadius: 40,
          borderBottomRightRadius: 40,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: 0,
          minWidth: 0,
        }}
      />
      {/* Circle with Arrow (fully inside the bar, equal margin) */}
      <div
        ref={circleRef}
        className="absolute z-10 flex items-center justify-center"
        style={{
          top: "50%",
          height: "3.5rem",
          width: "3.5rem",
          borderRadius: "50%",
          background: "#163300",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          transform: "translateY(-50%)",
          // left is set/animated by GSAP
        }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 5l6 5-6 5"
            stroke="#9fe870"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {/* Logos */}
      <div
        ref={sliderRef}
        className="flex gap-12 items-center w-max -ml-65 relative z-10"
        style={{ willChange: "transform" }}
      >
        {logos.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Logo ${i + 1}`}
            className="h-20 w-auto object-contain"
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}
