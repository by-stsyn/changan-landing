import React, { useState, FormEvent } from "react";
import { ChevronDown, X, Phone, User, CheckCircle2, Loader2, Gift, Sparkles, ShieldCheck } from "lucide-react";
import { sendToCalltouch } from "./calltouch";
import PhoneInput from "./PhoneInput";

interface HeroFloatingIslandProps {
  className?: string;
}

export default function HeroFloatingIsland({ className = "" }: HeroFloatingIslandProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    if (!consent) return;

    // Calltouch integration
    try {
      sendToCalltouch({
        fio: name || "Не указано",
        phone,
        subject: "Changan Купчино | Экспресс-бронь выгоды (Баннер)",
        comment: "Заявка с интерактивной формы баннера Hero Changan Купчино",
        tags: "hero_island_lead,changan_kupchino",
      });
    } catch (err) {
      console.warn("Calltouch warning:", err);
    }

    setIsSubmitting(true);
    setIsError(false);

    try {
      // Web3Forms API submission
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "5cc58f38-0192-4892-9491-bc506437ed33",
          subject: "⚡ Changan Купчино | Экспресс-бронь выгоды до 800 000 ₽ (Баннер)",
          from_name: "Сайт Changan Купчино",
          "Тип формы": "Экспресс-бронь выгоды (Баннер)",
          "Имя клиента": name || "Не указано",
          "Телефон клиента": phone,
          "Зафиксированная выгода": "до 800 000 ₽",
          "Подарок": "КАСКО или комплект зимней резины",
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok || response.status === 200 || result.success) {
        setIsSuccess(true);
        // Yandex Metrika goal
        if (typeof window !== "undefined" && (window as any).ym) {
          (window as any).ym(108557355, "reachGoal", "forma");
        }
      } else {
        console.error("Web3Forms error response:", result);
        setIsError(true);
      }
    } catch (err) {
      console.error("Submission fetch error:", err);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className={`transition-all duration-300 z-30 ${className} ${
        isExpanded ? "w-full max-w-md" : "w-auto max-w-fit"
      }`}
    >
      {/* 1. COLLAPSED CAPSULE: High-contrast, solid styling */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          style={{ backgroundColor: "#0c111a" }}
          className="group flex items-center gap-3 border-2 border-orange-500 shadow-2xl shadow-black/80 rounded-2xl px-4 py-3 transition-all duration-200 hover:scale-[1.03] text-left cursor-pointer"
          aria-label="Развернуть форму бронирования выгоды"
        >
          <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/60 flex items-center justify-center flex-shrink-0 text-orange-400 group-hover:scale-110 transition-transform">
            <Gift size={18} />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <span className="text-xs sm:text-sm font-black text-white tracking-wide">
                Экспресс-бронь до 800 000 ₽
              </span>
            </div>
            <span className="text-[11px] text-gray-300">
              Подарок КАСКО или резина • 60+ авто
            </span>
          </div>

          <div className="flex items-center gap-1.5 pl-2 text-orange-400 text-xs font-bold border-l border-white/20 ml-1">
            <span className="hidden sm:inline">Забронировать</span>
            <ChevronDown size={16} className="transform group-hover:translate-y-0.5 transition-transform" />
          </div>
        </button>
      )}

      {/* 2. EXPANDED CARD: 100% OPAQUE SOLID BACKGROUND, ZERO TRANSLUCENCY */}
      {isExpanded && (
        <div
          style={{ backgroundColor: "#0b1019" }}
          className="border-2 border-orange-500 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black text-white animate-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles size={14} className="text-orange-400 flex-shrink-0" />
                <span className="text-[11px] font-black uppercase tracking-wider text-orange-400">
                  Спецпредложение · Прагматика Купчино
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                Экспресс-бронь выгоды до 800 000 ₽
              </h3>
              <p className="text-xs text-gray-300 mt-1">
                Зафиксируйте максимальную выгоду и подарок (КАСКО или резина)
              </p>
            </div>

            <button
              onClick={() => {
                setIsExpanded(false);
                setIsSuccess(false);
              }}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-gray-300 hover:text-white flex items-center justify-center flex-shrink-0 transition-colors"
              aria-label="Свернуть форму"
            >
              <X size={18} />
            </button>
          </div>

          {/* Perks Bar: High contrast badge strip */}
          <div
            style={{ backgroundColor: "#141c2b" }}
            className="flex items-center justify-between gap-2 mb-4 text-xs text-gray-200 border border-gray-700/80 rounded-xl px-3 py-2"
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-orange-400 flex-shrink-0" />
              <span className="font-medium">Гарантия 5 лет</span>
            </div>
            <span className="text-gray-500">•</span>
            <div className="flex items-center gap-1.5">
              <Gift size={14} className="text-orange-400 flex-shrink-0" />
              <span className="font-medium">Подарок к авто</span>
            </div>
            <span className="text-gray-500">•</span>
            <span className="text-green-400 font-bold">60+ авто</span>
          </div>

          {/* Success Screen */}
          {isSuccess ? (
            <div className="py-5 flex flex-col items-center text-center gap-2.5">
              <div className="w-14 h-14 rounded-full bg-green-500/20 border-2 border-green-500/60 flex items-center justify-center text-green-400 mb-1">
                <CheckCircle2 size={32} />
              </div>
              <div className="text-lg font-black text-white">Выгода успешно зафиксирована!</div>
              <div className="text-xs text-gray-300 max-w-xs leading-relaxed">
                Менеджер дилерского центра свяжется с вами по указанному телефону в течение 5 минут.
              </div>
              <button
                onClick={() => {
                  setIsExpanded(false);
                  setIsSuccess(false);
                  setName("");
                  setPhone("");
                }}
                className="mt-3 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-orange-400 hover:text-orange-300 font-bold transition-colors"
              >
                Закрыть окно
              </button>
            </div>
          ) : (
            /* Web3Forms Form */
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Ваше имя
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Например, Александр"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ backgroundColor: "#151d2a" }}
                    className="w-full border-2 border-gray-700 focus:border-orange-500 rounded-xl pl-10 pr-3.5 py-3 text-sm text-white placeholder-gray-400 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Телефон <span className="text-orange-400">*</span>
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                    required
                    style={{ backgroundColor: "#151d2a" }}
                    className="w-full border-2 border-gray-700 focus:border-orange-500 rounded-xl pl-10 pr-3.5 py-3 text-sm text-white placeholder-gray-400 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Consent checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none pt-0.5">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-600 text-orange-500 focus:ring-0 bg-[#151d2a] accent-orange-500 cursor-pointer"
                />
                <span className="text-[11px] text-gray-300 leading-tight">
                  Согласен на{" "}
                  <a
                    href="/privacy-policy.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.dispatchEvent(new CustomEvent("open-privacy-modal"));
                    }}
                    className="underline hover:text-orange-400 text-gray-200"
                  >
                    обработку персональных данных
                  </a>{" "}
                  и бронирование спеццены
                </span>
              </label>

              {isError && (
                <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-500/50 text-red-200 text-xs">
                  Произошла ошибка при отправке. Пожалуйста, позвоните нам по телефону{" "}
                  <a href="tel:+78127608508" className="font-bold underline text-white">
                    +7 (812) 760-85-08
                  </a>
                </div>
              )}

              {/* Submit Button: Always vibrant and inviting */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-black py-3.5 rounded-xl transition-all duration-150 shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 text-sm tracking-wide uppercase mt-1 cursor-pointer disabled:opacity-75"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Отправка заявки...</span>
                  </>
                ) : (
                  <span>Зафиксировать выгоду до 800 000 ₽</span>
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
