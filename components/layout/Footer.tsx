"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  dict: {
    brand: string;
    footer: {
      copy: string;
      links: string[];
      contact: {
        emailLabel: string;
        emailValue: string;
        copyLabel: string;
        copiedLabel: string;
        instagramLabel: string;
        instagramValue: string;
        instagramUrl: string;
        addressLabel: string;
        addressValue: string;
      };
    };
  };
};

export function Footer({ dict }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(dict.footer.contact.emailValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-6 py-10 md:flex-row md:px-8">
        <div>
          <h3 className="font-headline text-lg font-black tracking-tight text-text">{dict.brand}</h3>
          <p className="mt-2 max-w-md text-sm text-text/60">{dict.footer.copy}</p>

          <div className="mt-5 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                href={`mailto:${dict.footer.contact.emailValue}`}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-text/70 hover:border-primary hover:text-primary"
              >
                {dict.footer.contact.emailLabel}: {dict.footer.contact.emailValue}
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyEmail}
                type="button"
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-text/70 hover:border-primary hover:text-primary"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M5 15V6C5 4.9 5.9 4 7 4H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {copied ? dict.footer.contact.copiedLabel : dict.footer.contact.copyLabel}
              </motion.button>
            </div>
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              href={dict.footer.contact.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-text/70 hover:border-primary hover:text-primary"
            >
              {dict.footer.contact.instagramLabel}: {dict.footer.contact.instagramValue}
            </motion.a>
            <p className="text-xs font-semibold uppercase tracking-wide text-text/60">
              {dict.footer.contact.addressLabel}: {dict.footer.contact.addressValue}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-text/70">
          {dict.footer.links.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
