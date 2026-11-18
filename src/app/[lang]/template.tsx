"use client";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Soft entrance for every page change. */
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <>
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-linear-to-r from-[#0fd6f5] via-[#7eeafc] to-[#0fd6f5]"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{ scaleX: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.3, delay: 0.7 } }}
        />
      )}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
