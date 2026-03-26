"use client";

import { useEffect, useRef, useState } from "react";

import { motion, useInView } from "framer-motion";
import Image from "next/image";

type CounterItem = {
  value: number;
  suffix: string;
  label: string;
};

type Props = {
  eyebrow: string;
  title: string;
  flagship: {
    label: string;
    projectName: string;
    projectUrl: string;
    description: string;
    roleTitle: string;
    roleDescription: string;
    technicalScopeLabel: string;
    technicalHighlight: string;
  };
  counters: CounterItem[];
  partners: {
    title: string;
    caption: string;
    items: string[];
  };
  about: {
    title: string;
    description: string;
  };
};

function getPartnerAsset(partner: string) {
  if (partner.includes("PERTAMINA")) {
    return { src: "/partners/pertamina.jpg", alt: "Logo Pertamina" };
  }

  if (partner.includes("DINAS PERHUBUNGAN")) {
    return { src: "/partners/dishub.jpg", alt: "Logo Dinas Perhubungan" };
  }

  if (partner.includes("UIGM")) {
    return { src: "/partners/uigm.png", alt: "Logo UIGM" };
  }

  return null;
}

function AnimatedCounter({ value, suffix, label }: CounterItem) {
  const counterRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(counterRef, { once: true, amount: 0.6 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) {
      return;
    }

    let frameId = 0;
    const durationMs = 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      setCount(Math.floor(value * progress));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [inView, value]);

  return (
    <motion.div
      ref={counterRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45 }}
      className="rounded-xl border border-primary/25 bg-white p-6"
    >
      <p className="font-headline text-4xl font-black tracking-tight text-text drop-shadow-[0_0_16px_rgba(255,107,0,0.35)] md:text-5xl">
        <span className="text-primary">{count}</span>
        {suffix}
      </p>
      <p className="mt-3 text-sm font-semibold leading-relaxed text-text/75">{label}</p>
    </motion.div>
  );
}

export function AchievementsSection({ eyebrow, title, flagship, counters, partners, about }: Props) {
  const marqueeItems = [...partners.items, ...partners.items];

  return (
    <section className="bg-white px-6 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <span className="font-label text-xs uppercase tracking-[0.3em] text-primary">{eyebrow}</span>
        <h2 className="font-headline mt-4 max-w-4xl text-4xl font-black tracking-tight text-text md:text-5xl">{title}</h2>

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
          className="mt-10 rounded-2xl border border-primary/30 bg-surface p-8 shadow-[0_0_0_1px_rgba(255,107,0,0.2),0_18px_40px_rgba(255,107,0,0.12)]"
        >
          <p className="font-label text-xs uppercase tracking-[0.2em] text-primary">{flagship.label}</p>
          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h3 className="font-headline text-2xl font-black tracking-tight text-text md:text-3xl">{flagship.projectName}</h3>
            <a
              href={flagship.projectUrl}
              target="_blank"
              rel="noreferrer"
              className="w-fit rounded-md border border-primary/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary transition hover:bg-primary hover:text-white"
            >
              simkaprovsumsel.com
            </a>
          </div>
          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-text/75 md:text-base">{flagship.description}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="font-label text-[11px] uppercase tracking-[0.18em] text-text/55">{flagship.roleTitle}</p>
              <p className="mt-2 text-sm font-semibold text-text">{flagship.roleDescription}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="font-label text-[11px] uppercase tracking-[0.18em] text-text/55">{flagship.technicalScopeLabel}</p>
              <p className="mt-2 text-sm font-semibold text-text">{flagship.technicalHighlight}</p>
            </div>
          </div>
        </motion.article>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {counters.map((item) => (
            <AnimatedCounter key={item.label} value={item.value} suffix={item.suffix} label={item.label} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-12 rounded-2xl border border-gray-200 bg-surface p-8"
        >
          <h3 className="font-headline text-2xl font-black tracking-tight text-text">{about.title}</h3>
          <p className="mt-4 max-w-5xl text-sm leading-relaxed text-text/75 md:text-base">{about.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h3 className="font-headline text-xl font-black tracking-tight text-text">{partners.title}</h3>
          <p className="mt-2 text-sm text-text/70">{partners.caption}</p>

          <div className="mt-5 overflow-hidden rounded-lg border border-primary/20 bg-surface py-4">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 18, ease: "linear", repeat: Infinity }}
              className="flex w-max gap-3 px-3"
            >
              {marqueeItems.map((partner, index) => (
                (() => {
                  const logo = getPartnerAsset(partner);
                  return (
                    <div
                      key={`${partner}-${index}`}
                      className="flex items-center gap-3 rounded-md border border-primary/25 bg-white px-4 py-2 text-sm font-black uppercase tracking-wide text-text shadow-[0_0_18px_rgba(255,107,0,0.08)]"
                    >
                      <div className="flex h-9 w-14 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-white p-1">
                        {logo ? (
                          <Image
                            src={logo.src}
                            alt={logo.alt}
                            width={56}
                            height={32}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="text-[10px] font-black text-text/70">LOGO</span>
                        )}
                      </div>
                      <span>{partner}</span>
                    </div>
                  );
                })()
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
