"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  progress: number;
  className?: string;
  label?: string;
}

export function ProgressBar({ progress, className, label }: ProgressBarProps) {
  const boundedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-text">{label}</span>
          <span className="text-sm font-medium text-text">{Math.round(boundedProgress)}%</span>
        </div>
      )}
      <div className="h-4 w-full bg-surface rounded-full border-2 border-border overflow-hidden neo-brutalist-shadow-sm">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${boundedProgress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
