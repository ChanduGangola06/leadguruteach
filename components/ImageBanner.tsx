"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80",
    alt: "Learn from expert trainers at LeadGuruTeach",
    href: "/auth",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80",
    alt: "Join 2 Lakh+ students and grow your career",
    href: "#courses",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1434030216441-b6ab76378458?w=1920&q=80",
    alt: "Master in-demand skills with live trainings",
    href: "/auth",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1516321318423-f06f85b504e3?w=1920&q=80",
    alt: "Earn through our affiliate program",
    href: "#affiliate",
  },
];

const SLIDE_INTERVAL = 3000;

export default function ImageBanner() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = slides[current];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0.6,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0.6,
    }),
  };

  return (
    <section
      className="relative h-[220px] w-full overflow-hidden bg-navy sm:h-[300px] md:h-[360px] lg:h-[420px]"
      aria-label="Promotional banner carousel"
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Link href={slide.href} className="block h-full w-full">
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={current === 0}
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-navy/20" />
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60 md:left-6 md:h-12 md:w-12"
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60 md:right-6 md:h-12 md:w-12"
        aria-label="Next slide"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "h-2.5 w-8 bg-cyan-neon shadow-glow-cyan"
                : "h-2.5 w-2.5 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
