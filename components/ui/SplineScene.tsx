"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { SPLINE_SCENE_URL } from "@/lib/data";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-purple-vibrant" />
        <p className="text-sm text-slate-600">Loading 3D scene...</p>
      </div>
    </div>
  ),
});

interface SplineSceneProps {
  className?: string;
  scene?: string;
}

export default function SplineScene({
  className = "h-full w-full",
  scene = SPLINE_SCENE_URL,
}: SplineSceneProps) {
  return (
    <div className={className}>
      <Spline scene={scene} />
    </div>
  );
}
