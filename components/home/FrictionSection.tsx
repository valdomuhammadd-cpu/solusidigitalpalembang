"use client";

import { motion } from "framer-motion";

type FrictionItem = {
  title: string;
  description: string;
};

type Props = {
  items: FrictionItem[];
  bridge: string;
};

export function FrictionSection({ items, bridge }: Props) {
  return (
    <section className="bg-white px-6 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: index * 0.14, duration: 0.55, ease: "easeOut" }}
              className="rounded-xl border border-gray-200 bg-surface p-7"
            >
              <motion.div
                initial={{ filter: "grayscale(1)", opacity: 0.6 }}
                whileInView={{ filter: "grayscale(1)", opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                  <path d="M12 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                </svg>
              </motion.div>
              <h3 className="font-headline text-2xl font-black tracking-tight text-text">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text/70">{item.description}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.65, delay: 0.25 }}
          className="mt-10 rounded-2xl border border-primary/25 bg-primary/10 p-8 text-center"
        >
          <p className="font-headline text-xl font-black leading-tight text-primary md:text-3xl">{bridge}</p>
        </motion.div>
      </div>
    </section>
  );
}
