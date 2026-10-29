import { useState, useMemo } from "react";
import { Calculator as CalcIcon } from "lucide-react";
import { formatPrice } from "../utils/format";
import LeadForm from "./LeadForm";

const MIN_PRICE = 1500000;
const MAX_PRICE = 7000000;
const CREDIT_TERMS = [12, 24, 36, 48, 60, 72, 84];
const CREDIT_RATE = 0.0001;

export default function Calculator() {
  const [carPrice, setCarPrice] = useState(2500000);
  const [hasTradeIn, setHasTradeIn] = useState(false);
  const [tradeInValue, setTradeInValue] = useState(800000);
  const [initialPaymentPct, setInitialPaymentPct] = useState(20);
  const [term, setTerm] = useState(60);

  const result = useMemo(() => {
    const tradeInBonus = hasTradeIn ? tradeInValue : 0;
    const initialPayment = Math.round(carPrice * (initialPaymentPct / 100));
    const loanAmount = carPrice - initialPayment - tradeInBonus;

    const monthlyRate = CREDIT_RATE / 12;
    let monthlyPayment = 0;
    if (monthlyRate === 0) {
      monthlyPayment = Math.max(loanAmount, 0) / term;
    } else {
      monthlyPayment = Math.max(loanAmount, 0) * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
    }

    return {
      tradeInBonus,
      initialPayment,
      loanAmount: Math.max(loanAmount, 0),
      monthlyPayment: Math.round(monthlyPayment),
    };
  }, [carPrice, hasTradeIn, tradeInValue, initialPaymentPct, term]);

  const ratePercent = (CREDIT_RATE * 100).toFixed(2);

  // Формируем детальную сводку для менеджера
  const calcSummary = `Авто за ${formatPrice(carPrice)}, Взнос: ${formatPrice(result.initialPayment)} (${initialPaymentPct}%), ${hasTradeIn ? `Сдает авто: ${formatPrice(result.tradeInBonus)}, ` : ""}Срок: ${term} мес, Платёж: ${formatPrice(result.monthlyPayment)}/мес.`;

  return (
    <section className="py-16 bg-gray-950 text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-3 py-1 mb-3">
            <CalcIcon size={13} className="text-orange-400" />
            <span className="text-orange-400 text-xs font-semibold uppercase tracking-wide">Кредитный калькулятор</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black mb-2">Рассчитайте платёж</h2>
          <p className="text-gray-400 text-sm">Узнайте точный ежемесячный платёж с учётом всех выгод</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">
                Стоимость автомобиля: <span className="text-orange-400 font-bold">{formatPrice(carPrice)}</span>
              </label>
              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={50000}
                value={carPrice}
                onChange={(e) => setCarPrice(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{formatPrice(MIN_PRICE)}</span>
                <span>{formatPrice(MAX_PRICE)}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">
                Первоначальный взнос: <span className="text-orange-400 font-bold">{initialPaymentPct}%</span> — {formatPrice(result.initialPayment)}
              </label>
              <input
                type="range"
                min={0}
                max={80}
                step={5}
                value={initialPaymentPct}
                onChange={(e) => setInitialPaymentPct(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>80%</span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <div
                  onClick={() => setHasTradeIn(!hasTradeIn)}
                  className={`w-12 h-6 rounded-full transition-colors duration-200 relative cursor-pointer flex-shrink-0 ${hasTradeIn ? "bg-orange-500" : "bg-gray-600"}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ${hasTradeIn ? "translate-x-6" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm font-medium">Сдаю авто в трейд-ин</span>
              </label>

              {hasTradeIn && (
                <div className="pl-0">
                  <label className="block text-sm text-gray-400 mb-2">
                    Стоимость вашего авто: <span className="text-orange-400 font-bold">{formatPrice(tradeInValue)}</span>
                  </label>
                  <input
                    type="range"
                    min={200000}
                    max={5000000}
                    step={50000}
                    value={tradeInValue}
                    onChange={(e) => setTradeInValue(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>200 000 ₽</span>
                    <span>5 000 000 ₽</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">Срок кредита</label>
              <div className="flex flex-wrap gap-2">
                {CREDIT_TERMS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTerm(t)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${term === t ? "bg-orange-500 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}
                  >
                    {t} мес
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-5">
              <div className="text-center mb-6">
                <div className="text-gray-400 text-sm mb-1">Ежемесячный платёж от</div>
                <div className="text-4xl font-black text-white">{formatPrice(result.monthlyPayment)}</div>
                <div className="text-orange-400 text-sm font-semibold mt-1">/ месяц</div>
                <div className="inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1 mt-2">
                  <span className="text-orange-400 text-xs font-semibold">Ставка от: {ratePercent}% годовых</span>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">Стоимость авто</span>
                  <span className="font-semibold">{formatPrice(carPrice)}</span>
                </div>
                {hasTradeIn && result.tradeInBonus > 0 && (
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-gray-400">Трейд-ин</span>
                    <span className="text-green-400 font-bold">−{formatPrice(result.tradeInBonus)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">Первый взнос</span>
                  <span className="font-semibold">{formatPrice(result.initialPayment)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Сумма кредита</span>
                  <span className="font-semibold">{formatPrice(result.loanAmount)}</span>
                </div>
              </div>
            </div>

            <LeadForm 
              formType="calculator" 
              submitLabel="Оформить по этим условиям" 
              carTitle={calcSummary}
              dark 
            />
            
          </div>
        </div>
      </div>
    </section>
  );
}
