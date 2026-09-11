"use client";

import PartnerCard from "./PartnerCard";
import { partnerStats } from "@/lib/data";
import { partnerLogos } from "@/lib/assets";
import { useEffect, useMemo, useRef, useState } from "react";

export default function PartnersSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(2);
  const [isPaused, setIsPaused] = useState(false);

  /* -------------------------------------------------------
     SECTION VISIBILITY
  ------------------------------------------------------- */
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  /* -------------------------------------------------------
     RESPONSIVE VISIBLE CARD COUNT

     Mobile  → 2
     Tablet  → 4
     Desktop → 8
  ------------------------------------------------------- */
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(8);
      } else if (window.innerWidth >= 768) {
        setVisibleCount(4);
      } else {
        setVisibleCount(2);
      }
    };

    updateVisibleCount();

    window.addEventListener("resize", updateVisibleCount);

    return () => {
      window.removeEventListener("resize", updateVisibleCount);
    };
  }, []);

  /* -------------------------------------------------------
     GROUP PARTNERS INTO SLIDES

     Desktop → 8 per slide
     Tablet  → 4 per slide
     Mobile  → 2 per slide
  ------------------------------------------------------- */
  const slides = useMemo(() => {
    const grouped = [];

    for (let i = 0; i < partnerLogos.length; i += visibleCount) {
      grouped.push(partnerLogos.slice(i, i + visibleCount));
    }

    return grouped;
  }, [visibleCount]);

  const totalSlides = slides.length;

  /* -------------------------------------------------------
     CAROUSEL CONTROLS
  ------------------------------------------------------- */
  const nextSlide = () => {
    setCurrentIndex((prev) => {
      if (totalSlides <= 1) return 0;
      return (prev + 1) % totalSlides;
    });
  };

  const previousSlide = () => {
    setCurrentIndex((prev) => {
      if (totalSlides <= 1) return 0;
      return (prev - 1 + totalSlides) % totalSlides;
    });
  };

  /* -------------------------------------------------------
     RESET WHEN BREAKPOINT CHANGES
  ------------------------------------------------------- */
  useEffect(() => {
    setCurrentIndex(0);
  }, [visibleCount]);

  /* -------------------------------------------------------
     AUTOMATIC SLIDING
  ------------------------------------------------------- */
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */
  return (
    <section
      ref={sectionRef}
      className="bg-midnight-light py-16 md:py-20"
      aria-labelledby="partners-heading"
    >
      <div className="max-w-container mx-auto px-4 md:px-8">

        {/* =================================================
            HEADING
        ================================================= */}
        <div
          className={`transition-all duration-700 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <h2
            id="partners-heading"
            className="text-center text-2xl md:text-[32px] font-bold text-white"
          >
            OUR{" "}
            <span className="text-brand-gold">
              BANKING
            </span>{" "}
            PARTNERS
          </h2>

          <p className="mt-3 text-center text-sm md:text-base text-white/80 max-w-2xl mx-auto">
            We are proud to be associated with India&rsquo;s leading banks and
            NBFCs to offer the best financial solution to our customers.
          </p>
        </div>

        {/* =================================================
            PARTNER CAROUSEL
        ================================================= */}
        <div
          className={`relative mt-10 transition-all duration-700 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
          style={{
            transitionDelay: "150ms",
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >

          {/* =================================================
              LEFT ARROW
              
              Mobile:
              Small button above cards

              Tablet/Desktop:
              Button beside cards
          ================================================= */}
          {totalSlides > 1 && (
            <button
              type="button"
              onClick={previousSlide}
              aria-label="Previous banking partners"
              className="
                group
                absolute
                right-11
                top-[-52px]
                z-20
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                border-white/20
                bg-navy-950/85
                text-white
                shadow-[0_6px_20px_rgba(0,0,0,0.25)]
                backdrop-blur-md
                transition-all
                duration-300
                hover:-translate-x-1
                hover:scale-105
                hover:border-brand-cyan
                hover:bg-brand-cyan
                hover:text-midnight
                hover:shadow-[0_8px_25px_rgba(54,184,240,0.4)]
                focus:outline-none
                focus:ring-2
                focus:ring-brand-cyan

                md:left-3
                md:right-auto
                md:top-1/2
                md:h-12
                md:w-12
                md:-translate-y-1/2
              "
            >
              <span
                aria-hidden="true"
                className="
                  text-[24px]
                  md:text-[30px]
                  font-light
                  leading-none
                  -mt-0.5
                  transition-transform
                  duration-300
                  group-hover:-translate-x-0.5
                "
              >
                ‹
              </span>
            </button>
          )}

          {/* =================================================
              CAROUSEL VIEWPORT
          ================================================= */}
          <div className="overflow-hidden px-2">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {slides.map((slide, slideIndex) => (
                <div
                  key={`partner-slide-${slideIndex}`}
                  className="
                    min-w-full
                    grid
                    grid-cols-2
                    md:grid-cols-4
                    lg:grid-cols-8
                    gap-5
                    md:gap-6
                  "
                >
                  {slide.map((partner, partnerIndex) => (
                    <div
                      key={`${partner.name}-${partnerIndex}`}
                      className={`
                        transition-all
                        duration-700
                        ease-out
                        ${
                          isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                        }
                      `}
                      style={{
                        transitionDelay: isVisible
                          ? `${partnerIndex * 100}ms`
                          : "0ms",
                      }}
                    >
                      <div
                        className="
                          transition-all
                          duration-300
                          ease-out
                          hover:-translate-y-2
                          hover:scale-[1.02]
                          hover:drop-shadow-[0_10px_25px_rgba(54,184,240,0.25)]
                        "
                      >
                        <PartnerCard
                          logo={partner.logo}
                          name={partner.name}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* =================================================
              RIGHT ARROW
              
              Mobile:
              Small button above cards

              Tablet/Desktop:
              Button beside cards
          ================================================= */}
          {totalSlides > 1 && (
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next banking partners"
              className="
                group
                absolute
                right-0
                top-[-52px]
                z-20
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                border-brand-cyan/60
                bg-brand-cyan/90
                text-midnight
                shadow-[0_6px_20px_rgba(0,0,0,0.25)]
                backdrop-blur-md
                transition-all
                duration-300
                hover:translate-x-1
                hover:scale-105
                hover:bg-brand-cyan
                hover:shadow-[0_8px_25px_rgba(54,184,240,0.4)]
                focus:outline-none
                focus:ring-2
                focus:ring-brand-cyan

                md:right-3
                md:top-1/2
                md:h-12
                md:w-12
                md:-translate-y-1/2
              "
            >
              <span
                aria-hidden="true"
                className="
                  text-[24px]
                  md:text-[30px]
                  font-light
                  leading-none
                  -mt-0.5
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                "
              >
                ›
              </span>
            </button>
          )}
        </div>

        {/* =================================================
            CAROUSEL INDICATORS
        ================================================= */}
        {totalSlides > 1 && (
          <div
            className="
              mt-6
              flex
              items-center
              justify-center
              gap-2
            "
            aria-label="Partner carousel navigation"
          >
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to partner slide ${index + 1}`}
                aria-current={
                  currentIndex === index ? "true" : undefined
                }
                className={`
                  h-2.5
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    currentIndex === index
                      ? "w-7 bg-brand-gold"
                      : "w-2.5 bg-white/40 hover:bg-white/70"
                  }
                `}
              />
            ))}
          </div>
        )}

        {/* =================================================
            PARTNER STATISTICS
        ================================================= */}
        <div
          className={`
            mt-10
            rounded-card
            border
            border-brand-cyanCard/60
            bg-navy-950
            px-6
            py-8
            transition-all
            duration-1000
            ease-out
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }
          `}
          style={{
            transitionDelay: isVisible ? "650ms" : "0ms",
          }}
        >
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {partnerStats.map((stat, i) => (
              <div
                key={stat.label}
                className="
                  transition-transform
                  duration-300
                  hover:scale-105
                "
                style={{
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                <dt className="sr-only">
                  {stat.label}
                </dt>

                <dd className="text-xl md:text-2xl font-bold text-brand-gold">
                  {stat.value}
                </dd>

                <p className="mt-1 text-sm md:text-base text-white">
                  {stat.label}
                </p>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-center text-sm md:text-base text-white/80">
            Strong Partners, Stronger Solutions for Your Financial Growth.
          </p>
        </div>
      </div>
    </section>
  );
}