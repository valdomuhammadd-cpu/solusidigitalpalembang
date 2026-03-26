"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { AnimatePresence, motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";

import { ServiceModal, type ServiceCaseStudy } from "@/components/service/ServiceModal";

type ServiceItem = {
  id: string;
  title: string;
  description: string;
  tags: string[];
};

type Props = {
  eyebrow: string;
  title: string;
  items: ServiceItem[];
  locale: string;
  caseStudies: ServiceCaseStudy[];
  modalCopy: {
    openLabel: string;
    closeLabel: string;
  };
  robotFox?: {
    alt: string;
    statusOnline: string;
    statusStandby: string;
  };
};

export function ServicesBento({ eyebrow, title, items, locale, caseStudies, modalCopy, robotFox }: Props) {
  const foxCopy = robotFox ?? {
    alt: "Robot fox kinetic core",
    statusOnline: "[STATUS: ONLINE]",
    statusStandby: "[STATUS: STANDBY]",
  };
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);

  const foxRef = useRef<HTMLDivElement | null>(null);
  const foxInView = useInView(foxRef, { amount: 0.45 });
  const foxControls = useAnimation();

  useEffect(() => {
    foxControls.start(foxInView ? "inView" : "initial");
  }, [foxControls, foxInView]);

  const activeCase = useMemo(
    () => caseStudies.find((entry) => entry.id === activeCaseId) ?? null,
    [activeCaseId, caseStudies],
  );

  return (
    <section className="bg-gray-50 px-6 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <span className="font-label text-xs uppercase tracking-[0.3em] text-primary">{eyebrow}</span>
        <h2 className="font-headline mt-4 text-4xl font-black tracking-tight text-text md:text-5xl">{title}</h2>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.article
                key={`${locale}-${item.title}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                whileHover={{ y: -8, scale: 1.015 }}
                className="glass-card rounded-xl p-7 shadow-sm transition hover:border-primary hover:shadow-orange"
                role="button"
                tabIndex={0}
                onClick={() => setActiveCaseId(item.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    setActiveCaseId(item.id);
                  }
                }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-label text-xs tracking-[0.2em] text-text/45">{item.id}</span>
                </div>
                <h3 className="font-headline text-xl font-black tracking-tight text-text">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-text/70">{item.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-text/60">
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCaseId(item.id)}
                  className="mt-6 rounded-md border border-primary/35 px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary transition hover:bg-primary hover:text-white"
                >
                  {modalCopy.openLabel}
                </button>
              </motion.article>
            ))}
          </AnimatePresence>

          <motion.article
            ref={foxRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.35 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="glass-card rounded-xl border border-primary/25 bg-white p-7 shadow-sm xl:col-span-2"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-label text-xs tracking-[0.2em] text-text/45">KINETIC CORE</p>
                <p className="mt-2 font-headline text-lg font-black tracking-tight text-primary">{foxInView ? foxCopy.statusOnline : foxCopy.statusStandby}</p>
              </div>

              <motion.div
                animate={foxControls}
                initial="initial"
                whileHover="shake"
                variants={{
                  initial: {
                    filter: "grayscale(100%)",
                    opacity: 0.5,
                    y: 100,
                    scale: 1,
                    rotate: 0,
                  },
                  inView: {
                    filter: "grayscale(0%)",
                    opacity: 1,
                    y: 0,
                    scale: 1.1,
                    rotate: 5,
                    transition: {
                      duration: 0.8,
                      delay: 0.2,
                      ease: "easeOut",
                    },
                  },
                  shake: {
                    x: [0, -2, 2, -2, 2, 0],
                    rotate: [5, 4, 6, 4, 6, 5],
                    transition: {
                      duration: 0.35,
                      repeat: 1,
                    },
                  },
                }}
                className="will-change-transform"
              >
                <Image
                  src="/logo.jpeg"
                  alt={foxCopy.alt}
                  width={150}
                  height={150}
                  className="h-24 w-24 rounded-xl border border-gray-200 object-cover shadow-orange md:h-28 md:w-28"
                />
              </motion.div>
            </div>
          </motion.article>
        </div>

        <ServiceModal data={activeCase} closeLabel={modalCopy.closeLabel} onClose={() => setActiveCaseId(null)} />
      </div>
    </section>
  );
}
