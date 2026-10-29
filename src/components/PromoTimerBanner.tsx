import React from "react";
import {
  IconWinterTire,
  IconDealerSeal,
  IconArrowRight,
  IconChronometer,
} from "./icons/AutoIcons";
import Timer from "./Timer";

interface PromoTimerBannerProps {
  onClaim: () => void;
}

export default function PromoTimerBanner({ onClaim }: PromoTimerBannerProps) {
  return (
    <section className="relative z-20 bg-[#0b0e15] border-y border-white/10 shadow-2xl py-6 sm:py-7 overflow-hidden">
      {/* Subtle architectural ambient light */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-28 bg-orange-600/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-24 bg-orange-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          {/* Left Column: Authentic Automotive Offer */}
          <div className="flex items-start gap-4 max-w-xl text-left">
            {/* Precision Wheel / Winter Tire Icon Housing */}
            <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0 mt-1 shadow-inner text-orange-500 group">
              <IconWinterTire className="w-7 h-7 text-orange-500 transition-transform duration-300 group-hover:rotate-12" />
            </div>

            <div>
              {/* Refined Dealer Badging */}
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 text-zinc-300 bg-white/5 border border-white/10 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  Сезонное предложение дилера
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-amber-300/90 bg-amber-950/40 border border-amber-500/20 px-2 py-0.5 rounded whitespace-nowrap">
                  Осталось 4&nbsp;комплекта
                </span>
              </div>

              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight leading-snug">
                Комплект зимней резины в&nbsp;подарок*
              </h2>
              
              <div className="text-xs sm:text-sm text-zinc-400 mt-1 flex items-start sm:items-center gap-1.5">
                <IconDealerSeal className="w-4 h-4 text-orange-500 shrink-0 mt-0.5 sm:mt-0" />
                <span>
                  Есть расчёт дешевле?{" "}
                  <strong className="text-zinc-200 font-semibold sm:whitespace-nowrap">
                    Сделаем честное и&nbsp;выгодное предложение
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Center Column: Digital Chronometer Dashboard */}
          <div className="flex flex-col items-center justify-center bg-[#07090f] border border-white/10 rounded-lg px-4 sm:px-6 py-3 shadow-xl relative">
            <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-zinc-400 font-semibold mb-2 flex items-center gap-1.5 whitespace-nowrap select-none">
              <IconChronometer className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span>Действие спецпредложения:</span>
            </div>
            <Timer />
          </div>

          {/* Right Column: High-End Automotive Action Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-2 w-full lg:w-auto">
            <button
              onClick={onClaim}
              className="w-full lg:w-auto bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 active:scale-[0.98] text-white font-bold py-3.5 px-6 rounded-md shadow-lg shadow-black/40 border-t border-white/20 transition-all duration-200 flex items-center justify-center gap-2 text-sm tracking-wide group whitespace-nowrap"
            >
              <span>Зафиксировать цену и&nbsp;подарок</span>
              <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>
            <span className="text-[11px] text-zinc-400 text-center whitespace-nowrap">
              Бронь без&nbsp;предоплаты · Фиксация за&nbsp;5&nbsp;минут
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
