"use client";

import { motion } from "framer-motion";

const href =
  "https://wa.me/6289515640808?text=Halo%20Valdo,%20saya%20tertarik%20konsultasi%20mengenai%20layanan%20Solusi%20Digital%20Palembang...";

export function WhatsAppFAB() {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Open WhatsApp consultation"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-6 right-6 z-[70] inline-flex items-center justify-center rounded-full border border-emerald-300 bg-emerald-500 p-4 text-white shadow-[0_14px_40px_rgba(16,185,129,0.35)]"
    >
      <motion.span
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full border border-emerald-200/70"
      />
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
        <path
          d="M12.04 2C6.56 2 2.1 6.47 2.1 11.95C2.1 13.7 2.56 15.39 3.44 16.87L2 22L7.27 20.62C8.69 21.4 10.29 21.82 11.95 21.82H12.04C17.52 21.82 21.99 17.35 21.99 11.87C21.99 6.38 17.52 2 12.04 2Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M8.17 7.92C8.4 7.47 8.64 7.46 8.86 7.46C9.03 7.46 9.24 7.46 9.45 7.47C9.63 7.48 9.87 7.4 10.1 7.95C10.33 8.5 10.9 9.85 10.95 9.97C11 10.09 11.03 10.23 10.94 10.37C10.86 10.51 10.82 10.6 10.67 10.77C10.52 10.94 10.35 11.15 10.23 11.27C10.08 11.42 9.93 11.58 10.1 11.88C10.26 12.18 10.84 13.1 11.68 13.85C12.76 14.82 13.67 15.13 13.97 15.25C14.27 15.37 14.45 15.35 14.58 15.2C14.72 15.05 15.16 14.55 15.33 14.3C15.5 14.05 15.67 14.09 15.9 14.17C16.13 14.25 17.36 14.86 17.61 14.98C17.87 15.1 18.03 15.16 18.08 15.24C18.13 15.32 18.13 15.72 17.9 16.17C17.67 16.62 16.54 17.03 16.08 17.09C15.63 17.15 15.07 17.18 13.29 16.44C11.51 15.7 10.32 14.37 9.28 13.23C8.23 12.08 7.36 10.16 7.36 8.95C7.36 7.73 7.93 8.37 8.17 7.92Z"
          fill="currentColor"
        />
      </svg>
    </motion.a>
  );
}
