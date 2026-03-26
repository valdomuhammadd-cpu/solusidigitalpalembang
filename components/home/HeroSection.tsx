"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type Props = {
  headline: string;
  subHeadline: string;
  primaryCta: string;
  mascotAlt: string;
};

export function HeroSection({ headline, subHeadline, primaryCta, mascotAlt }: Props) {
  return (
    <section className="bg-mesh-light relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-28">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative mb-10"
      >
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
          <Image
            src="/logo.jpeg"
            alt={mascotAlt}
            width={260}
            height={260}
            className="mx-auto h-48 w-48 object-contain drop-shadow-[0_20px_40px_rgba(255,107,0,0.28)] md:h-64 md:w-64"
            priority
          />
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="font-headline text-glow max-w-5xl text-center text-4xl font-black uppercase tracking-tight text-text md:text-7xl"
      >
        {headline}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="font-label mt-4 text-center text-sm font-bold uppercase tracking-[0.3em] text-text/60 md:text-lg"
      >
        {subHeadline}
      </motion.p>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mt-10 rounded-lg bg-primary px-8 py-4 font-headline text-sm font-bold uppercase tracking-[0.25em] text-white shadow-orange transition hover:scale-[1.02]"
      >
        {primaryCta}
      </motion.button>
    </section>
  );
}
