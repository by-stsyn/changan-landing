import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Calendar, Fuel, Settings2, MapPin, Phone, Tag, CheckCircle, Loader2, ArrowRightLeft, Gauge } from "lucide-react";
import { Car } from "../types/car";
import { formatPrice, formatDrive, getCarTitle } from "../utils/format";
import PhotoSlider from "../components/catalog/PhotoSlider";
import Footer from "../components/Footer";
import { sendToCalltouch } from "../components/calltouch";
import PhoneInput from "../components/PhoneInput";

const MIN_PRICE = 1500000;
const MAX_PRICE = 7000000;
const CREDIT_TERMS =[12, 24, 36, 48, 60, 72, 84];
const CREDIT_RATE = 0.0001;

// Вспомогательная функция для безопасного парсинга чисел из фида
const getNumber = (val: any): number => {
  if (typeof val === "number") return val;
  if (!val) return 0;
  // Если парсер вернул объект (например { _: "300000" })
  const str = typeof val === "object" && val._ ? String(val._) : String(val);
  // Вырезаем всё, кроме цифр
  const cleaned = str.replace(/\D/g, "");
  return Number(cleaned) || 0;
};

interface CarDetailPageProps {
  car: Car;
}

interface DiscountState {
  tradein: boolean;
  credit: boolean;
  insurance: boolean;
}

function CreditBlock({ carPrice }: { carPrice: number }) {
  const [price, setPrice] = useState(Math.min(Math.max(carPrice, MIN_PRICE), MAX_PRICE));
  const [initialPaymentPct, setInitialPaymentPct] = useState(20);
  const [term, setTerm] = useState(60);

  const result = useMemo(() => {
    const initialPayment = Math.round(price * (initialPaymentPct / 100));
    const loanAmount = Math.max(price - initialPayment, 0);
    const monthlyRate = CREDIT_RATE / 12;
    const monthlyPayment = loanAmount > 0
      ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1)
      : 0;
    return { initialPayment, loanAmount, monthlyPayment: Math.round(monthlyPayment) };
  }, [price, initialPaymentPct, term]);

  return (
    <div className="bg-gray-950 text-white rounded-2xl p-6">
      <h3 className="font-black text-lg mb-5">Кредитный калькулятор</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Стоимость: <span className="text-orange-400 font-bold">{formatPrice(price)}</span>
          </label>
          <input type="range" min={MIN_PRICE} max={MAX_PRICE} step={50000} value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatPrice(MIN_PRICE)}</span><span>{formatPrice(MAX_PRICE)}</span>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Первый взнос: <span className="text-orange-400 font-bold">{initialPaymentPct}%</span> — {formatPrice(result.initialPayment)}
          </label>
          <input type="range" min={0} max={80} step={5} value={initialPaymentPct}
            onChange={(e) => setInitialPaymentPct(Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span><span>80%</span>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2 font-medium">Срок</label>
          <div className="flex flex-wrap gap-2">
            {CREDIT_TERMS.map((t) => (
              <button key={t} onClick={() => setTerm(t)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${term === t ? "bg-orange-500 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}>
                {t} мес
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <div className="text-gray-400 text-xs mb-1">Ежемесячный платёж</div>
          <div className="text-3xl font-black">{formatPrice(result.monthlyPayment)}</div>
          <div className="text-orange-400 text-xs mt-1">/ месяц · Ставка от {(CREDIT_RATE * 100).toFixed(2)}% годовых</div>
        </div>
      </div>
    </div>
  );
}

function ConsentCheckbox({ consent, setConsent, dark }: { consent: boolean; setConsent: (v: boolean) => void; dark?: boolean }) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer select-none">
      <div
        onClick={() => setConsent(!consent)}
        className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150 cursor-pointer ${
          consent
            ? "bg-orange-500 border-orange-500"
            : dark ? "border-white/40 bg-transparent" : "border-gray-300 bg-white"
        }`}
      >
        {consent && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className={`text-xs leading-relaxed ${dark ? "text-white/70" : "text-gray-500"}`}>
        Я даю согласие группе компаний «Прагматика» на{" "}
        <a href="/privacy-policy.pdf" target="_blank" rel="noopener noreferrer"
          className={`underline hover:text-orange-500 transition-colors ${dark ? "text-white/90" : "text-gray-600"}`}
          onClick={(e) => e.stopPropagation()}>
          обработку моих персональных данных
        </a>
      </span>
    </label>
  );
}

function TradeInBlock({ carTitle }: { carTitle: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent || !phone.trim()) return;

    // 👉 CALLTOUCH
    try {
      sendToCalltouch({
        fio: name || "Не указано",
        phone,
        subject: "Changan Купчино | Trade-in заявка",
        comment: `Авто: ${carTitle}`,
        tags: "changan_kupchino,tradein_detail",
      });
    } catch (err) {
      console.warn("Calltouch error:", err);
    }

    setIsSubmitting(true);
    setIsError(false);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "5cc58f38-0192-4892-9491-bc506437ed33",
          subject: `🔔 Changan Купчино | Trade-in по авто ${carTitle}`,
          from_name: "Сайт Changan Купчино",
          "Тип формы": "Трейд-ин (со страницы авто)",
          "Имя клиента": name || "Не указано",
          "Телефон клиента": phone,
          "Интересующий автомобиль": carTitle
        }),
      });

      if (response.status === 200) {
        setIsSuccess(true);
        if (typeof window !== 'undefined' && (window as any).ym) {
          (window as any).ym(108557355, 'reachGoal', 'forma');
        }
      } else {
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
          <ArrowRightLeft size={20} className="text-orange-500" />
        </div>
        <div>
          <div className="font-black text-gray-900">Трейд-ин</div>
          <div className="text-gray-500 text-xs">Зачтём ваш автомобиль в счёт покупки</div>
        </div>
      </div>
      {isSuccess ? (
        <div className="flex flex-col items-center py-6 gap-2 text-center">
          <CheckCircle size={32} className="text-green-500" />
          <div className="font-bold text-gray-900">Заявка принята!</div>
          <div className="text-gray-500 text-sm">Менеджер свяжется с вами в течение 5 минут</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500" />
          <PhoneInput value={phone} onChange={setPhone} required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500" />
          <ConsentCheckbox consent={consent} setConsent={setConsent} />
          {isError && <div className="text-red-500 text-xs">Ошибка отправки. Попробуйте ещё раз.</div>}
          <button type="submit" disabled={isSubmitting || !phone.trim() || !consent}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm">
            {isSubmitting ? <><Loader2 size={16} className="animate-spin" />Отправка...</> : "Получить оценку трейд-ин"}
          </button>
        </form>
      )}
    </div>
  );
}

function BookingBlock({ car }: { car: Car }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const title = getCarTitle(car);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent || !phone.trim()) return;

    // 👉 CALLTOUCH ДО отправки в CRM
    try {
      sendToCalltouch({
        fio: name || "Не указано",
        phone,
        subject: "Changan Купчино | Бронирование авто",
        comment: `Авто: ${title} | ID: ${car.id}`,
        tags: `changan_kupchino,booking_detail,${car.id || ""}`,
      });
    } catch (err) {
      console.warn("Calltouch error:", err);
    }

    setIsSubmitting(true);
    setIsError(false);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "5cc58f38-0192-4892-9491-bc506437ed33",
          subject: `🔔 Changan Купчино | Бронирование авто ${title}`,
          from_name: "Сайт Changan Купчино",
          "Тип формы": "Бронирование автомобиля (детальная страница)",
          "Имя клиента": name || "Не указано",
          "Телефон клиента": phone,
          "Бронируемый автомобиль": title,
          "ID автомобиля": car.id || "Не указан"
        }),
      });

      if (response.status === 200) {
        setIsSuccess(true);
        if (typeof window !== 'undefined' && (window as any).ym) {
          (window as any).ym(108557355, 'reachGoal', 'forma');
        }
      } else {
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-orange-500 rounded-2xl p-6 text-white">
      <div className="font-black text-lg mb-1">Забронировать</div>
      <div className="text-orange-100 text-sm mb-5">Бесплатно · Без предоплаты · За 5 минут</div>
      {isSuccess ? (
        <div className="flex flex-col items-center py-4 gap-2 text-center">
          <CheckCircle size={32} className="text-white" />
          <div className="font-bold text-white">Заявка принята!</div>
          <div className="text-orange-100 text-sm">Менеджер свяжется с вами в течение 5 минут</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/20 border border-white/30 text-white placeholder-white/60 rounded-xl px-4 py-3 text-sm outline-none focus:border-white" />
          <PhoneInput value={phone} onChange={setPhone} required
            className="w-full bg-white/20 border border-white/30 text-white placeholder-white/60 rounded-xl px-4 py-3 text-sm outline-none focus:border-white" />
          <ConsentCheckbox consent={consent} setConsent={setConsent} dark />
          {isError && <div className="text-red-200 text-xs">Ошибка отправки. Попробуйте ещё раз.</div>}
          <button type="submit" disabled={isSubmitting || !phone.trim() || !consent}
            className="w-full bg-white hover:bg-orange-50 disabled:bg-orange-300 disabled:cursor-not-allowed text-orange-600 font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm">
            {isSubmitting ? <><Loader2 size={16} className="animate-spin" />Отправка...</> : "Забронировать автомобиль"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function CarDetailPage({ car }: CarDetailPageProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [car?.vin, car?.id]);

  const [discounts, setDiscounts] = useState<DiscountState>({ tradein: true, credit: true, insurance: true });
  const title = getCarTitle(car);

  // Надежно парсим все цены как строгие числа
  const tDiscount = getNumber(car.tradeinDiscount);
  const cDiscount = getNumber(car.creditDiscount);
  const iDiscount = getNumber(car.insuranceDiscount);
  const bPrice = getNumber(car.price);

  const hasDiscounts = tDiscount > 0 || cDiscount > 0 || iDiscount > 0;

  const selectedDiscount =
    (discounts.tradein ? tDiscount : 0) +
    (discounts.credit ? cDiscount : 0) +
    (discounts.insurance ? iDiscount : 0);

  const finalPrice = Math.max(bPrice - selectedDiscount, 0);
  const hasAnyDiscount = selectedDiscount > 0;

  function toggle(key: keyof DiscountState) {
    setDiscounts((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const modelFeatures =[
    car.engineVolume && `Двигатель ${car.engineVolume}`,
    car.transmission && `Трансмиссия: ${car.transmission}`,
    car.drive && `Привод: ${formatDrive(car.drive)}`,
    car.bodyType && `Кузов: ${car.bodyType}`,
    car.color && `Цвет: ${car.color}`,
    car.year && `Год выпуска: ${car.year}`,
    car.mileage === 0 && "Новый автомобиль",
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-gray-50">
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => { window.history.pushState({}, "", "/"); window.dispatchEvent(new PopStateEvent("popstate")); }}
                className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors text-sm font-semibold flex-shrink-0"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline text-xs">Все авто</span>
              </button>
              
              <div className="w-px h-6 bg-gray-200 flex-shrink-0" />
              
              {/* МОБИЛЬНОЕ НАЗВАНИЕ */}
              <div className="flex sm:hidden flex-col items-start gap-0.5">
                <img src="/header-logo copy.svg" alt="Changan" className="h-6 w-auto" />
                <div className="text-gray-900 font-black text-[10px] tracking-wide leading-none">
                  Чанган Прагматика <span className="text-orange-500">Купчино</span>
                </div>
              </div>

              {/* ДЕСКТОПНОЕ НАЗВАНИЕ (ДВЕ СТРОКИ) */}
              <div className="hidden sm:flex items-center gap-3">
                <img src="/header-logo copy.svg" alt="Changan" className="h-7 w-auto" />
                <div className="w-px h-5 bg-gray-300" />
                <div className="leading-tight">
                  <div className="text-gray-900 font-black text-sm leading-[1.1]">
                    Чанган Центр Прагматика Купчино
                  </div>
                  <div className="text-gray-400 text-[10px] mt-0.5">Официальный дилер Changan</div>
                </div>
              </div>
            </div>

            {/* ЦЕНТРАЛЬНЫЙ БЛОК: ВРЕМЯ И АДРЕС (КАК НА ГЛАВНОЙ) */}
            <div className="hidden lg:flex flex-col items-start justify-center leading-tight mx-4">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">
                Пн–Вс: 9:00–21:00
              </span>
              <span className="text-[11px] text-gray-500 whitespace-nowrap">
                ул. Малая Балканская, д.57
              </span>
            </div>

            <a href="tel:+78127608508" className="flex items-center gap-2 text-gray-800 font-semibold hover:text-orange-500 transition-colors text-sm flex-shrink-0">
              <div className="bg-orange-500/10 p-1.5 rounded-lg sm:bg-transparent sm:p-0">
                <Phone size={15} className="text-orange-500" />
              </div>
              <span className="hidden sm:inline">+7 (812) 760-85-08</span>
            </a>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-4 text-sm text-gray-500">
            <button onClick={() => { window.history.pushState({}, "", "/"); window.dispatchEvent(new PopStateEvent("popstate")); }} className="hover:text-orange-500 transition-colors">Главная</button>
            <span className="mx-2">·</span>
            <span className="text-gray-900 font-medium">{title}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <PhotoSlider photos={car.photos} alt={title} />
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{title}</h1>
                    {car.complectation && (
                      <div className="text-orange-500 font-semibold text-sm mt-1">{car.complectation}</div>
                    )}
                    {car.modification && (
                      <div className="text-gray-500 text-sm mt-0.5">{car.modification}</div>
                    )}
                  </div>
                  <div className="bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0">
                    В наличии
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600 mb-6">
                  {car.year && (
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-400" />
                      {car.year} год
                    </div>
                  )}
                  {car.engineVolume && (
                    <div className="flex items-center gap-1.5">
                      <Fuel size={14} className="text-gray-400" />
                      {car.engineVolume}
                    </div>
                  )}
                  {car.transmission && (
                    <div className="flex items-center gap-1.5">
                      <Settings2 size={14} className="text-gray-400" />
                      {car.transmission}
                    </div>
                  )}
                  {car.drive && (
                    <div className="flex items-center gap-1.5">
                      <Gauge size={14} className="text-gray-400" />
                      {formatDrive(car.drive)} привод
                    </div>
                  )}
                </div>

                {hasDiscounts && (
                  <div className="mb-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                      <Tag size={14} className="text-orange-500" />
                      Применить выгоду
                    </div>
                    <div className="space-y-2">
                      {tDiscount > 0 && (
                        <label className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" checked={discounts.tradein} onChange={() => toggle("tradein")}
                              className="w-4 h-4 accent-orange-500 cursor-pointer" />
                            <span className="text-sm text-gray-700">Трейд-ин</span>
                          </div>
                          <span className="text-sm font-bold text-green-600">−{formatPrice(tDiscount)}</span>
                        </label>
                      )}
                      {cDiscount > 0 && (
                        <label className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" checked={discounts.credit} onChange={() => toggle("credit")}
                              className="w-4 h-4 accent-orange-500 cursor-pointer" />
                            <span className="text-sm text-gray-700">Кредит</span>
                          </div>
                          <span className="text-sm font-bold text-green-600">−{formatPrice(cDiscount)}</span>
                        </label>
                      )}
                      {iDiscount > 0 && (
                        <label className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" checked={discounts.insurance} onChange={() => toggle("insurance")}
                              className="w-4 h-4 accent-orange-500 cursor-pointer" />
                            <span className="text-sm text-gray-700">Страховка</span>
                          </div>
                          <span className="text-sm font-bold text-green-600">−{formatPrice(iDiscount)}</span>
                        </label>
                      )}
                    </div>
                  </div>
                )}

                <div className="mb-5">
                  {hasAnyDiscount ? (
                    <>
                      <div className="text-gray-400 text-base line-through">{formatPrice(bPrice)}</div>
                      <div className="text-4xl font-black text-gray-900">
                        {formatPrice(finalPrice)}
                        <a href="#price-disclaimer" className="text-orange-400 text-sm font-bold align-super ml-1 hover:text-orange-600 transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById("price-disclaimer")?.scrollIntoView({ behavior: "smooth" }); }}>1</a>
                      </div>
                      <div className="text-green-600 text-sm font-bold mt-1">Выгода: −{formatPrice(selectedDiscount)}</div>
                    </>
                  ) : (
                    <div className="text-4xl font-black text-gray-900">
                      {formatPrice(bPrice)}
                      <a href="#price-disclaimer" className="text-orange-400 text-sm font-bold align-super ml-1 hover:text-orange-600 transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById("price-disclaimer")?.scrollIntoView({ behavior: "smooth" }); }}>1</a>
                    </div>
                  )}
                </div>

                {car.vin && (
                  <div className="text-xs text-gray-400 border-t border-gray-100 pt-4 mt-4">
                    VIN: <span className="font-mono text-gray-600">{car.vin}</span>
                  </div>
                )}
              </div>

              {modelFeatures.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="font-black text-xl text-gray-900 mb-4">Характеристики</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {modelFeatures.map((feat) => (
                      <div key={feat} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />
                        {feat}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="font-black text-xl text-gray-900 mb-4">Кредит на этот автомобиль</h2>
                {/* Передаем очищенное число в калькулятор */}
                <CreditBlock carPrice={bPrice} />
              </div>
            </div>

            <div className="space-y-5">
              <BookingBlock car={car} />
              <TradeInBlock carTitle={title} />

              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="font-bold text-gray-900 mb-3">Дилерский центр</div>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>г. Санкт-Петербург, ул. Малая Балканская, д.57</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-orange-500 flex-shrink-0" />
                    <a href="tel:+78127608508" className="text-orange-500 hover:text-orange-600 transition-colors font-semibold">
                      +7 (812) 760-85-08
                    </a>
                  </div>
                  <div className="text-gray-500 text-xs">Ежедневно: 9:00 — 21:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
