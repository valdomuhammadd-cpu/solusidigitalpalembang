"use client";

import { useEffect } from "react";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import Image from "next/image";

type ServiceCaseStudy = {
  id: string;
  title: string;
  headline: string;
  summary: string;
  imagePath: string;
  imageAlt: string;
  nodeLabel: string;
  projectsLabel: string;
  projects: string[];
  stackLabel: string;
  stack: string[];
  impactLabel: string;
  impact: string;
};

type Props = {
  data: ServiceCaseStudy | null;
  closeLabel: string;
  onClose: () => void;
};

const slideInDown: Variants = {
  hidden: { opacity: 0, y: -28, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: "easeOut" as const } },
  exit: { opacity: 0, y: 22, scale: 0.98, transition: { duration: 0.2, ease: "easeIn" as const } },
};

export function ServiceModal({ data, closeLabel, onClose }: Props) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {data ? (
        <motion.div
          key={data.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 px-4 py-8"
          onClick={onClose}
        >
          <motion.article
            variants={slideInDown}
            initial="hidden"
            animate="show"
            exit="exit"
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-primary/35 bg-[#0E1014] p-7 text-white shadow-[0_20px_80px_rgba(0,0,0,0.6)] md:p-9"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,107,0,0.18),transparent_45%)]" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-label text-xs uppercase tracking-[0.2em] text-primary">{data.title}</p>
                  <h3 className="font-headline mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">{data.headline}</h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-primary/40 px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary transition hover:bg-primary hover:text-white"
                >
                  {closeLabel}
                </button>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-white/80 md:text-base">{data.summary}</p>

              <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_1.8fr]">
                <div className="rounded-xl border border-primary/35 bg-black/30 p-4">
                  <p className="font-label text-[11px] uppercase tracking-[0.18em] text-white/55">{data.nodeLabel}</p>
                  <div className="relative mt-3 h-40 overflow-hidden rounded-lg border border-primary/20 bg-[#12161D]">
                    <Image src={data.imagePath} alt={data.imageAlt} fill className="object-cover" />

                    <motion.div
                      className="pointer-events-none absolute left-0 right-0 h-12 bg-gradient-to-b from-transparent via-primary/35 to-transparent"
                      animate={{ y: ["-130%", "220%"] }}
                      transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                    />
                    <motion.div
                      className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                      animate={{ x: ["-20%", "260%"] }}
                      transition={{ duration: 2.8, ease: "linear", repeat: Infinity }}
                    />
                    <motion.div
                      className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_2px,transparent_5px)]"
                      animate={{ opacity: [0.35, 0.55, 0.35] }}
                      transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="font-label text-[11px] uppercase tracking-[0.18em] text-white/55">{data.projectsLabel}</p>
                    <ul className="mt-3 space-y-2 text-sm font-semibold text-white/90">
                      {data.projects.map((project) => (
                        <li key={project}>- {project}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="font-label text-[11px] uppercase tracking-[0.18em] text-white/55">{data.stackLabel}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {data.stack.map((tech) => (
                        <span key={tech} className="rounded-full border border-primary/35 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-sm font-semibold leading-relaxed text-white/80">
                      <span className="text-primary">{data.impactLabel}: </span>
                      {data.impact}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export type { ServiceCaseStudy };
