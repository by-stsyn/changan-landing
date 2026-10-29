import React, { useState, useEffect } from "react";
import { Phone, Menu, X, MapPin, Clock, ShieldCheck, Car, ArrowRight } from "lucide-react";

interface HeaderProps {
  onCTAClick: () => void;
  onScrollToCatalog?: () => void;
}

export default function Header({ onCTAClick, onScrollToCatalog }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleCatalogClick = () => {
    setMobileMenuOpen(false);
    if (onScrollToCatalog) {
      onScrollToCatalog();
    }
  };

  const handleCTAClick = () => {
    setMobileMenuOpen(false);
    onCTAClick();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            {/* 1. Logo Section */}
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Clean Official Logo (No overflow text on mobile) */}
              <img
                src="/header-logo copy.svg"
                alt="Changan — Официальный дилер"
                className="h-6 sm:h-9 w-auto flex-shrink-0"
              />

              {/* Desktop Dealership Title */}
              <div className="hidden sm:flex items-center gap-2.5">
                <div className="w-px h-6 bg-gray-200 flex-shrink-0" />
                <div className="leading-tight min-w-0">
                  <div className="font-black text-gray-950 text-sm tracking-wide leading-[1.1]">
                    Чанган Центр Прагматика Купчино
                  </div>
                  <div className="text-gray-600 text-[11px] font-medium mt-0.5">
                    Официальный дилер Changan
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Desktop Center: Working hours & Address */}
            <div className="hidden lg:flex flex-col items-start justify-center leading-tight">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <span className="text-[11px] uppercase tracking-wider text-gray-900 font-bold">
                  Пн–Вс: 9:00–21:00
                </span>
              </div>
              <span className="text-xs text-gray-600 font-medium">
                г. СПб, ул. Малая Балканская, д.57
              </span>
            </div>

            {/* 3. Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Call Button */}
              <a
                href="tel:+78127608508"
                className="flex items-center gap-2 text-gray-950 font-black hover:text-orange-500 transition-colors"
                onClick={() => {
                  if (typeof window !== "undefined" && window.ym) {
                    window.ym(108557355, "reachGoal", "zvonok");
                  }
                }}
                aria-label="Позвонить в дилерский центр"
              >
                <div className="flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8 bg-orange-50 sm:bg-orange-500/10 rounded-lg p-1.5 sm:p-0">
                  <Phone size={18} className="text-orange-500" />
                </div>
                <span className="hidden sm:inline text-sm sm:text-base tracking-tight">+7 (812) 760-85-08</span>
              </a>

              {/* Quick CTA Button (Outline variant so it doesn't fight the hero primary button) */}
              <button
                onClick={onCTAClick}
                className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white active:bg-orange-600 font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition-all duration-150 whitespace-nowrap text-xs sm:text-sm tracking-wide"
              >
                <span className="hidden sm:inline">Получить предложение</span>
                <span className="sm:hidden">Заявка</span>
              </button>

              {/* Burger Menu Button (Mobile only) */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="sm:hidden flex items-center justify-center w-9 h-9 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-900 rounded-lg transition-colors border border-gray-200"
                aria-label="Открыть мобильное меню"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 4. Full Mobile Burger Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden flex flex-col bg-[#0a0d12] text-white animate-in fade-in duration-200">
          {/* Drawer Top Bar */}
          <div className="flex items-center justify-between h-14 px-4 border-b border-white/10 bg-[#0a0d12]">
            <img
              src="/header-logo copy.svg"
              alt="Changan"
              className="h-6 w-auto filter invert brightness-0"
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Закрыть меню"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
            {/* Dealership Card */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs uppercase tracking-wider font-bold text-orange-400 mb-1">
                Официальный дилер Changan
              </div>
              <div className="text-base font-black text-white mb-2">
                Чанган Центр «Прагматика» Купчино
              </div>

              <div className="space-y-2 text-xs text-gray-300 pt-2 border-t border-white/10">
                <div className="flex items-start gap-2">
                  <MapPin size={15} className="text-orange-400 flex-shrink-0 mt-0.5" />
                  <span>Санкт-Петербург, ул. Малая Балканская, д. 57</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-orange-400 flex-shrink-0" />
                  <span>Пн–Вс: 9:00 – 21:00</span>
                </div>
              </div>
            </div>

            {/* Quick Navigation Items */}
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider font-bold text-gray-400 px-1">
                Разделы
              </div>

              <button
                onClick={handleCatalogClick}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">
                    <Car size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Каталог автомобилей</div>
                    <div className="text-[11px] text-gray-400">60+ авто с ЭПТС в наличии</div>
                  </div>
                </div>
                <ArrowRight size={16} className="text-gray-400" />
              </button>

              <button
                onClick={handleCTAClick}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Кредит от 0,01% и Trade-in</div>
                    <div className="text-[11px] text-gray-400">Выгода до 800 000 ₽</div>
                  </div>
                </div>
                <ArrowRight size={16} className="text-gray-400" />
              </button>
            </div>

            {/* Direct Phone Call Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30">
              <div className="text-xs text-orange-300 font-semibold mb-1">
                Отдел продаж (с 9:00 до 21:00):
              </div>
              <a
                href="tel:+78127608508"
                className="text-xl font-black text-white hover:text-orange-400 transition-colors flex items-center gap-2 mb-2"
              >
                <Phone size={20} className="text-orange-500" />
                <span>+7 (812) 760-85-08</span>
              </a>
              <div className="text-[11px] text-gray-300">
                Бесплатная консультация менеджера и бронь условий
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleCTAClick}
              className="w-full py-4 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold text-base tracking-wide uppercase shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
            >
              <span>Получить предложение до 800 000 ₽</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
