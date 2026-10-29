import React from "react";
import { IconPriceMatch, IconArrowRight } from "./icons/AutoIcons";

interface HeroProps {
  onScrollToCatalog: () => void;
  onCTAClick: () => void;
  onGetFinalPrice?: () => void;
}

export default function Hero({ onScrollToCatalog, onCTAClick, onGetFinalPrice }: HeroProps) {
  const handleFinalPrice = onGetFinalPrice || onCTAClick;

  return (
    <section className="relative min-h-[82vh] sm:min-h-[86vh] lg:min-h-[88vh] flex items-center text-white overflow-hidden py-16 sm:py-24 lg:py-28 bg-zinc-950">
      {/* 1. Desktop Background Image: Shifted further to the right with smooth dark blend */}
      <div className="hidden sm:block absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        <img
          src="/main.banner.webp"
          alt="Новый Changan — Официальный дилер Прагматика Купчино"
          className="w-full h-full object-cover object-[68%_center] scale-[1.08] translate-x-[6%] sm:translate-x-[8%] lg:translate-x-[10%] xl:translate-x-[12%]"
          loading="eager"
        />

        {/* Smooth dark gradient dissolving smoothly into the deep zinc-950 background */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 from-20% via-zinc-950/75 via-45% to-transparent to-75%" />

        {/* Top & bottom subtle transitions */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-zinc-950 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-950 to-transparent" />
      </div>

      {/* 2. Content Container: Spacious, light, focused only on key decision drivers */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-lg lg:max-w-[490px] space-y-6 sm:space-y-7">
          {/* Professional Dealer Price Guarantee Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 backdrop-blur-md text-xs text-zinc-300 shadow-sm">
            <IconPriceMatch className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="leading-snug">
              Есть предложение от&nbsp;другого дилера?{" "}
              <strong className="text-white font-semibold whitespace-nowrap">
                Сделаем цену ещё выгоднее
              </strong>
            </span>
          </div>

          {/* Main Headline: High-impact automotive typography */}
          <h1 className="text-[26px] sm:text-4xl lg:text-[46px] font-black tracking-tight text-white leading-[1.12]">
            Новые Changan <br />
            <span className="inline-block mt-1 sm:mt-1.5 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300 sm:whitespace-nowrap drop-shadow-sm">
              с&nbsp;выгодой до&nbsp;800&nbsp;000&nbsp;₽
            </span>
          </h1>

          {/* Mobile Car Image Showcase */}
          <div className="sm:hidden relative -mx-4 w-[calc(100%+2rem)] aspect-[16/9] overflow-hidden my-4 border-y border-white/10 bg-zinc-950">
            <img
              src="/main.banner.webp"
              alt="Новые автомобили Changan в наличии"
              className="w-full h-full object-cover object-[52%_center]"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
          </div>

          {/* 3. Key Automotive Metrics */}
          <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-7 py-1">
            <div>
              <div className="text-xl sm:text-3xl font-black text-white tracking-tight whitespace-nowrap">
                от&nbsp;0,01%
              </div>
              <div className="text-[11px] sm:text-xs text-zinc-400 mt-1 font-normal tracking-wide whitespace-nowrap">
                Кредитная ставка
              </div>
            </div>

            <div className="w-px h-9 bg-white/15 shrink-0" />

            <div>
              <div className="text-xl sm:text-3xl font-black text-white tracking-tight whitespace-nowrap">
                0&nbsp;₽
              </div>
              <div className="text-[11px] sm:text-xs text-zinc-400 mt-1 font-normal tracking-wide whitespace-nowrap">
                Первый взнос
              </div>
            </div>

            <div className="w-px h-9 bg-white/15 shrink-0" />

            <div>
              <div className="text-xl sm:text-3xl font-black text-white tracking-tight whitespace-nowrap">
                60+
              </div>
              <div className="text-[11px] sm:text-xs text-zinc-400 mt-1 font-normal tracking-wide whitespace-nowrap">
                Авто с&nbsp;ЭПТС
              </div>
            </div>
          </div>

          {/* 4. Action Buttons: High contrast, non-breaking labels */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
            <button
              onClick={handleFinalPrice}
              className="h-12 sm:h-14 px-6 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 active:scale-[0.98] text-white font-bold rounded-md transition-all shadow-lg shadow-black/40 border-t border-white/20 flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap group"
            >
              <span>Получить финальную цену</span>
              <IconArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>

            <button
              onClick={onScrollToCatalog}
              className="h-12 sm:h-14 px-6 bg-white/5 hover:bg-white/10 active:scale-[0.98] border border-white/20 hover:border-white/40 text-white font-medium rounded-md transition-all flex items-center justify-center text-sm sm:text-base whitespace-nowrap"
            >
              Каталог авто в&nbsp;наличии
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
