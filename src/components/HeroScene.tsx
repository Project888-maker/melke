"use client";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { LoopVideo } from "./LoopVideo";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Layered home hero: the night house drifts slowly behind, Draft stands in
 * front and moves a little faster on scroll, which gives the scene depth.
 * An optional video loop replaces the still when one is provided.
 */
export function HeroScene({ image, figure, video }: { image: string; figure?: string; video?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const bgY = useTransform(p, [0, 1], ["0%", "14%"]);
  const bgScale = useTransform(p, [0, 1], [1.04, 1.12]);
  const figY = useTransform(p, [0, 1], ["0%", "-7%"]);
  return (
    <div ref={ref} aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease }}
      >
        <motion.div className="absolute inset-0" style={reduce ? undefined : { y: bgY, scale: bgScale }}>
          {video ? (
            <LoopVideo src={video} poster={image} className="size-full object-cover object-[72%_center] opacity-55 lg:opacity-100" />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={image} alt="" fetchPriority="high" className="size-full object-cover object-[72%_center] opacity-55 lg:opacity-100" />
          )}
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-linear-to-r from-[#07111b] via-[#07111b]/85 to-[#07111b]/20 lg:via-[#07111b]/55 lg:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#07111b] to-transparent" />
      {figure && (
        <motion.div
          className="absolute bottom-0 right-[1%] hidden h-[93%] lg:block xl:right-[4%]"
          initial={reduce ? false : { opacity: 0, x: 60, y: 30 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.3, delay: 0.35, ease }}
        >
          <motion.div className="h-full" style={reduce ? undefined : { y: figY }}>
            <span className="absolute inset-x-[8%] bottom-[-6%] h-[38%] rounded-[50%] bg-cyan/25 blur-3xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={figure} alt="" className="relative h-full w-auto max-w-none object-contain object-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
