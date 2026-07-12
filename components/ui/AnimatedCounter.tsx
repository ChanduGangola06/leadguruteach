"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  display?: string;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  display,
  duration = 2,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(display ?? `${prefix}0${suffix}`);

  useEffect(() => {
    if (!isInView) return;

    if (display) {
      setDisplayValue(display);
      return;
    }

    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        const formatted =
          value >= 1000
            ? `${prefix}${Math.floor(latest).toLocaleString("en-IN")}${suffix}`
            : `${prefix}${Math.floor(latest)}${suffix}`;
        setDisplayValue(formatted);
      },
    });

    return () => controls.stop();
  }, [isInView, value, prefix, suffix, display, duration]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}
