import { useState, FormEvent } from "react";
import { Loader2, X, ChevronRight, HelpCircle } from "lucide-react";
import {
  IconTradeInExchange,
  IconFairValuation,
  IconSubsidyBonus,
  IconChronometer,
  IconDealerSeal,
  IconCheckVerified,
  IconArrowRight,
} from "./icons/AutoIcons";
import { formatPrice } from "../utils/format";
import { sendToCalltouch } from "./calltouch";
import PhoneInput from "./PhoneInput";

const BRANDS = [
  "Kia", "Hyundai", "Toyota", "Volkswagen", "BMW", "Mercedes",
  "Audi", "Renault", "Nissan", "Ford", "Mitsubishi", "Mazda",
  "Honda", "Skoda", "Chery", "Haval", "Geely", "Лада", "Другой"
];

const YEARS = Array.from({ length: 20 }, (_, i) => String(2025 - i));

const STEPS = [
  {
    num: "01",
    title: "Параметры автомобиля",
    desc: "Укажите марку, год и\u00A0пробег в\u00A0форме на\u00A0сайте.",
  },
  {
    num: "02",
    title: "Расчёт за\u00A030\u00A0минут",
    desc: "Менеджер согласует предварительную стоимость онлайн или\u00A0по\u00A0телефону.",
  },
  {
    num: "03",
    title: "Осмотр в\u00A0дилерском центре",
    desc: "Бесплатная диагностика на\u00A0подъёмнике и\u00A0фиксация финальной цены.",
  },
  {
    num: "04",
    title: "Зачёт и\u00A0выдача нового Changan",
    desc: "Стоимость старого авто вычитается из\u00A0цены покупки. Уезжаете в\u00A0тот же день.",
  },
];

export default function TradeIn() {
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState(65000);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);

  // Модальное окно "Как проходит оценка"
  const [isStepsModalOpen, setIsStepsModalOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!phone.trim() || !consent) return;

    const carTitle = `Трейд-ин: ${brand || "авто"} ${year || "год не указан"}, пробег ${formatPrice(mileage).replace("₽", "км")}`;

    // CALLTOUCH
    try {
      sendToCalltouch({
        fio: name || "Не указано",
        phone,
        subject: "Changan Купчино | Оценка Trade-in",
        comment: `Форма: Trade-in | ${carTitle}`,
        tags: "changan_kupchino,tradein",
      });
    } catch (err) {
      console.warn("Calltouch error:", err);
    }

    setIsSubmitting(true);
    setIsError(false);

    try {
      // Web3Forms API
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "5cc58f38-0192-4892-9491-bc506437ed33",
          subject: "🔔 Changan Купчино | Заявка на оценку Trade-in",
          from_name: "Сайт Changan Купчино",
          "Тип формы": "Оценка Трейд-ин",
          "Имя клиента": name || "Не указано",
          "Телефон клиента": phone,
          "Марка авто (сдаваемая)": brand || "Не указана",
          "Год выпуска": year || "Не указан",
          "Пробег": `${mileage.toLocaleString("ru-RU")} км`,
        }),
      });

      const result = await response.json();

      if (response.status === 200) {
        setIsSuccess(true);

        // Яндекс.Метрика
        if (typeof window !== "undefined" && (window as any).ym) {
          (window as any).ym(108557355, "reachGoal", "forma");
        }
      } else {
        console.error("Web3Forms Error:", result);
        setIsError(true);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="relative py-16 sm:py-20 bg-[#090b11] text-white border-y border-white/10 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-orange-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Левая колонка: лаконично, минимум текста */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3.5 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-orange-400">
                <IconDealerSeal className="w-3.5 h-3.5 text-orange-500" />
                <span>Trade-in Changan</span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-300 normal-case">Гарантия честной сделки</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white tracking-tight leading-tight mb-3">
                Обмен вашего авто на&nbsp;новый{" "}
                <span className="font-semibold text-white">Changan</span>
              </h2>

              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Сдайте текущий автомобиль в&nbsp;зачёт стоимости. Гарантируем справедливую оценку
                по&nbsp;реальному рынку, прямую субсидию до&nbsp;300&nbsp;000&nbsp;₽ и&nbsp;выдачу нового Changan день в&nbsp;день.
              </p>
            </div>

            {/* 3 коротких преимущества (без простыней текста) */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3 bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3">
                <div className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <IconFairValuation className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Гарантируем справедливую оценку</div>
                  <div className="text-xs text-zinc-400">Открытый расчёт по реальному состоянию, без скрытых вычетов</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3">
                <div className="w-8 h-8 rounded-md bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                  <IconSubsidyBonus className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Субсидия до 300 000 ₽</div>
                  <div className="text-xs text-zinc-400">Прямая заводская скидка на покупку нового Changan</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3">
                <div className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <IconChronometer className="w-4 h-4 text-zinc-300" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Оценка за 30 минут</div>
                  <div className="text-xs text-zinc-400">Предварительный расчёт онлайн без визита в салон</div>
                </div>
              </div>
            </div>

            {/* Кнопка "Как проходит оценка" скрывает подробности */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsStepsModalOpen(true)}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 px-4 py-2.5 rounded-md transition-all duration-150 group"
              >
                <HelpCircle className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
                <span>Как проходит оценка и обмен?</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Правая колонка: форма быстрой оценки */}
          <div className="lg:col-span-6">
            <div className="bg-zinc-900/80 backdrop-blur-md rounded-lg p-5 sm:p-7 border border-white/10 shadow-2xl">
              <div className="mb-4">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Экспресс-оценка стоимости
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Узнайте сумму зачёта и&nbsp;размер субсидии на&nbsp;новый Changan
                </p>
              </div>

              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <IconCheckVerified className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-base text-white">
                    Заявка принята
                  </div>
                  <p className="text-zinc-400 text-xs max-w-xs leading-relaxed">
                    Специалист свяжется с&nbsp;вами в&nbsp;течение 15–30&nbsp;минут
                    и&nbsp;назовёт предварительную стоимость автомобиля.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="mt-1 text-xs text-zinc-400 hover:text-white underline underline-offset-4"
                  >
                    Оценить другой авто
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-300 mb-1">
                        Марка авто
                      </label>
                      <select
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full bg-zinc-950/80 border border-white/15 text-white rounded-md px-3 py-2 text-xs sm:text-sm outline-none focus:border-orange-500 transition-colors cursor-pointer appearance-none"
                        required
                      >
                        <option value="" className="bg-zinc-900 text-zinc-400">
                          Марка
                        </option>
                        {BRANDS.map((b) => (
                          <option key={b} value={b} className="bg-zinc-900 text-white">
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-300 mb-1">
                        Год выпуска
                      </label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full bg-zinc-950/80 border border-white/15 text-white rounded-md px-3 py-2 text-xs sm:text-sm outline-none focus:border-orange-500 transition-colors cursor-pointer appearance-none"
                        required
                      >
                        <option value="" className="bg-zinc-900 text-zinc-400">
                          Год
                        </option>
                        {YEARS.map((y) => (
                          <option key={y} value={y} className="bg-zinc-900 text-white">
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Слайдер пробега */}
                  <div className="bg-zinc-950/50 rounded-md p-2.5 border border-white/10">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-zinc-400 text-[11px]">Пробег:</span>
                      <span className="font-mono font-semibold text-orange-400 text-xs">
                        {mileage.toLocaleString("ru-RU")}&nbsp;км
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={300000}
                      step={5000}
                      value={mileage}
                      onChange={(e) => setMileage(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
                    />
                  </div>

                  {/* Инпуты контактов */}
                  <div className="space-y-2.5 pt-1">
                    <input
                      type="text"
                      placeholder="Ваше имя"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-950/80 border border-white/15 text-white placeholder-zinc-400 rounded-md px-3.5 py-2 text-xs sm:text-sm outline-none focus:border-orange-500 transition-colors"
                    />
                    <PhoneInput
                      value={phone}
                      onChange={setPhone}
                      required
                      className="w-full bg-zinc-950/80 border border-white/15 text-white placeholder-zinc-400 rounded-md px-3.5 py-2 text-xs sm:text-sm outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  {/* Согласие */}
                  <label className="flex items-start gap-2 cursor-pointer select-none pt-0.5">
                    <div
                      onClick={() => setConsent((v) => !v)}
                      className={`mt-0.5 w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                        consent
                          ? "bg-orange-600 border-orange-600 text-white"
                          : "border-white/30 bg-zinc-900"
                      }`}
                    >
                      {consent && (
                        <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="white"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-[10px] leading-snug text-zinc-400">
                      Согласен на{" "}
                      <a
                        href="/privacy-policy.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-zinc-200 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        обработку данных
                      </a>{" "}
                      ГК&nbsp;«Прагматика»
                    </span>
                  </label>

                  {isError && (
                    <div className="text-red-400 text-xs text-center">
                      Ошибка отправки. Попробуйте позвонить нам напрямую.
                    </div>
                  )}

                  {/* CTA кнопка */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !phone.trim() || !consent}
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-md transition-all duration-200 shadow-lg shadow-black/50 border-t border-white/20 flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wide group"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Расчёт стоимости...</span>
                      </>
                    ) : (
                      <>
                        <span>Рассчитать выгоду по Trade-in</span>
                        <IconArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
                      </>
                    )}
                  </button>

                  <div className="text-[11px] text-zinc-400 text-center flex items-center justify-center gap-1.5 pt-1">
                    <IconDealerSeal className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>Гарантируем справедливую оценку по договору дилера</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно с подробными шагами: "Как проходит оценка" */}
      {isStepsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsStepsModalOpen(false)}
        >
          <div
            className="bg-[#0e121a] border border-white/15 rounded-lg p-6 sm:p-8 max-w-lg w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Закрыть */}
            <button
              onClick={() => setIsStepsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-md bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <IconTradeInExchange className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Как проходит оценка и обмен
              </h3>
            </div>

            <p className="text-xs text-zinc-400 mb-6">
              Прозрачный процесс зачёта стоимости за 4 простых шага:
            </p>

            <div className="space-y-4 mb-6">
              {STEPS.map((step) => (
                <div key={step.num} className="flex items-start gap-3.5">
                  <span className="font-mono text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded shrink-0 mt-0.5">
                    {step.num}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-white mb-0.5">
                      {step.title}
                    </div>
                    <div className="text-xs text-zinc-400 leading-relaxed">
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-md p-3 flex items-center justify-between text-xs text-zinc-300 mb-6">
              <div className="flex items-center gap-2">
                <IconDealerSeal className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Гарантируем справедливую оценку по договору</span>
              </div>
              <span className="text-zinc-400">0 ₽ за диагностику</span>
            </div>

            <button
              type="button"
              onClick={() => setIsStepsModalOpen(false)}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2.5 rounded-md text-xs sm:text-sm transition-colors"
            >
              Понятно, перейти к расчёту
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
