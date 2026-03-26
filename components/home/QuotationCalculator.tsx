"use client";

import { useEffect, useMemo, useState } from "react";

import { animate, motion, useMotionValue, useMotionValueEvent } from "framer-motion";

type QuotationService = {
  id: string;
  name: string;
  estimate: string;
  startsFrom: number | null;
  custom: boolean;
};

type Props = {
  dict: {
    eyebrow: string;
    title: string;
    description: string;
    nameLabel: string;
    namePlaceholder: string;
    companyLabel: string;
    companyPlaceholder: string;
    timelineLabel: string;
    timelinePlaceholder: string;
    timelineOptions: string[];
    startsFromLabel: string;
    customQuoteLabel: string;
    customQuoteShort: string;
    emptyBudgetLabel: string;
    finalizeButton: string;
    chooseAtLeastOne: string;
    mobileHint: string;
    services: QuotationService[];
  };
};

const WHATSAPP_NUMBER = "6289515640808";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function QuotationCalculator({ dict }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [timeline, setTimeline] = useState("");
  const amount = useMotionValue(0);
  const [animatedTotal, setAnimatedTotal] = useState(0);

  const selectedServices = useMemo(
    () => dict.services.filter((service) => selected.includes(service.id)),
    [dict.services, selected],
  );

  const totalStartsFrom = useMemo(
    () => selectedServices.reduce((acc, service) => acc + (service.startsFrom ?? 0), 0),
    [selectedServices],
  );

  const hasCustom = useMemo(
    () => selectedServices.some((service) => service.custom),
    [selectedServices],
  );

  useEffect(() => {
    const controls = animate(amount, totalStartsFrom, {
      duration: 0.45,
      ease: "easeOut",
    });

    return () => controls.stop();
  }, [amount, totalStartsFrom]);

  useMotionValueEvent(amount, "change", (latest) => {
    setAnimatedTotal(Math.round(latest));
  });

  const budgetText = useMemo(() => {
    if (selectedServices.length === 0) {
      return dict.emptyBudgetLabel;
    }

    if (totalStartsFrom === 0 && hasCustom) {
      return dict.customQuoteLabel;
    }

    if (hasCustom) {
      return `${formatRupiah(animatedTotal)} + ${dict.customQuoteShort}`;
    }

    return `${formatRupiah(animatedTotal)}+`;
  }, [animatedTotal, dict.customQuoteLabel, dict.customQuoteShort, dict.emptyBudgetLabel, hasCustom, selectedServices.length, totalStartsFrom]);

  const whatsappLink = useMemo(() => {
    const cleanName = name.trim() || "Client";
    const cleanCompany = company.trim() || "-";
    const cleanTimeline = timeline || dict.timelinePlaceholder;
    const serviceList = selectedServices.map((service) => service.name).join(", ");
    const budgetSummary =
      selectedServices.length === 0
        ? dict.emptyBudgetLabel
        : totalStartsFrom === 0 && hasCustom
          ? dict.customQuoteLabel
          : hasCustom
            ? `${formatRupiah(totalStartsFrom)} + ${dict.customQuoteShort}`
            : `${formatRupiah(totalStartsFrom)}+`;

    const message = `Halo Solusi Digital Palembang! Saya ${cleanName} dari ${cleanCompany} ingin konsultasi untuk proyek: ${serviceList || "-"}. Estimasi Budget: ${budgetSummary}. Target Timeline: ${cleanTimeline}. Mohon jadwal konsultasi teknisnya.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, [company, dict.customQuoteLabel, dict.customQuoteShort, dict.emptyBudgetLabel, dict.timelinePlaceholder, hasCustom, name, selectedServices, timeline, totalStartsFrom]);

  const toggleService = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <section className="bg-[#0B0E13] px-6 py-20 md:px-8">
      <div className="mx-auto max-w-7xl rounded-2xl border border-primary/35 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,107,0,0.18),0_18px_40px_rgba(0,0,0,0.35)] md:p-10">
        <span className="font-label text-xs uppercase tracking-[0.3em] text-primary">{dict.eyebrow}</span>
        <h2 className="font-headline mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">{dict.title}</h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/75 md:text-base">{dict.description}</p>

        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-white/85" htmlFor="quotation-name">
              {dict.nameLabel}
            </label>
            <input
              id="quotation-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={dict.namePlaceholder}
              className="w-full rounded-lg border border-primary/35 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-white/85" htmlFor="quotation-company">
              {dict.companyLabel}
            </label>
            <input
              id="quotation-company"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder={dict.companyPlaceholder}
              className="w-full rounded-lg border border-primary/35 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-primary"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-white/85" htmlFor="quotation-timeline">
              {dict.timelineLabel}
            </label>
            <select
              id="quotation-timeline"
              value={timeline}
              onChange={(event) => setTimeline(event.target.value)}
              className="w-full rounded-lg border border-primary/35 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-primary"
            >
              <option value="" className="bg-[#11161f] text-white/70">
                {dict.timelinePlaceholder}
              </option>
              {dict.timelineOptions.map((option) => (
                <option key={option} value={option} className="bg-[#11161f] text-white">
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          {dict.services.map((service) => {
            const isActive = selected.includes(service.id);
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => toggleService(service.id)}
                aria-pressed={isActive}
                className={`rounded-xl border p-4 text-left transition ${
                  isActive
                    ? "border-primary bg-primary/12 shadow-[0_0_20px_rgba(255,107,0,0.25)]"
                    : "border-white/15 bg-white/[0.02] hover:border-primary/60"
                }`}
              >
                <p className="font-headline text-lg font-black tracking-tight text-white">{service.name}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary">{service.estimate}</p>
              </button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4 }}
          className="mt-8 flex flex-col gap-4 rounded-xl border border-primary/30 bg-black/35 p-5 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p className="font-label text-[11px] uppercase tracking-[0.2em] text-white/55">{dict.startsFromLabel}</p>
            <p className="font-headline mt-2 text-3xl font-black tracking-tight text-primary md:text-4xl">{budgetText}</p>
          </div>
          <a
            href={selectedServices.length > 0 ? whatsappLink : undefined}
            target="_blank"
            rel="noreferrer"
            aria-disabled={selectedServices.length === 0}
            className={`rounded-lg px-5 py-3 text-sm font-bold uppercase tracking-wider transition ${
              selectedServices.length > 0
                ? "bg-primary text-white hover:brightness-110"
                : "cursor-not-allowed border border-white/20 bg-white/[0.05] text-white/45"
            }`}
          >
            {selectedServices.length > 0 ? dict.finalizeButton : dict.chooseAtLeastOne}
          </a>
        </motion.div>

        <p className="mt-3 text-xs text-white/45">{dict.mobileHint}</p>
      </div>
    </section>
  );
}
