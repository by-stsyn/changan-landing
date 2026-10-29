import { useState, FormEvent } from "react";
import { Phone, User, CheckCircle, Loader2 } from "lucide-react";
import { sendToCalltouch } from "../components/calltouch";
import PhoneInput from "./PhoneInput";

interface LeadFormProps {
  formType: string;
  submitLabel?: string;
  dark?: boolean;
  carTitle?: string;
  carId?: string;
  onSuccess?: () => void;
}

export default function LeadForm({ formType, submitLabel = "Отправить заявку", dark, carTitle, carId, onSuccess }: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  
  // Локальные состояния для Web3Forms вместо Supabase
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const inputClass = `w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 border ${
    dark
      ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-orange-500 focus:bg-white/15"
      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:bg-white focus:shadow-sm"
  }`;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!phone.trim() || !consent) return;

    // 👉 CALLTOUCH (лучшее место — ДО отправки в CRM)
    try {
      sendToCalltouch({
        fio: name || "Не указано",
        phone,
        subject: `Changan Купчино | ${formType || "Заявка с формы"}`,
        comment: `Форма: LeadForm | ${carTitle || ""} | ${carId || ""}`,
        tags: `changan_kupchino,${formType},${carId || ""}`,
      });
    } catch (err) {
      console.warn("Calltouch error:", err);
    }

    setIsSubmitting(true);
    setIsError(false);

    try {
      // 👉 Web3Forms API
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          // Системные настройки
          access_key: "5cc58f38-0192-4892-9491-bc506437ed33",
          subject: `🔔 Changan Купчино | ${formType || "Новая заявка с сайта"}`,
          from_name: "Сайт Changan Купчино",
          
          // Поля, которые увидит менеджер в письме (красивые названия)
          "Тип формы": formType,
          "Имя клиента": name || "Не указано",
          "Телефон клиента": phone,
          "Интересующий автомобиль": carTitle || "Не указан",
          "ID автомобиля": carId || "Не указан"
        }),
      });

      const result = await response.json();

      if (response.status === 200) {
        setIsSuccess(true);
        
        // Отправляем цель в Метрику при успешной заявке со ВСЕХ форм
        if (typeof window !== 'undefined' && (window as any).ym) {
          (window as any).ym(108557355, 'reachGoal', 'forma');
        }
        
        if (onSuccess) onSuccess();
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

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-6 gap-3 text-center">
        <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle size={28} className="text-green-500" />
        </div>
        <div className={`font-bold text-lg ${dark ? "text-white" : "text-gray-900"}`}>Заявка принята!</div>
        <div className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
          Менеджер свяжется с вами в течение 5 минут
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="relative">
        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`${inputClass} pl-10`}
        />
      </div>
      <div className="relative">
        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <PhoneInput
          value={phone}
          onChange={setPhone}
          required
          className={`${inputClass} pl-10`}
        />
      </div>

      <label className="flex items-start gap-2.5 cursor-pointer select-none">
        <div
          onClick={() => setConsent((v) => !v)}
          className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150 cursor-pointer ${
            consent
              ? "bg-orange-500 border-orange-500"
              : dark ? "border-gray-500 bg-transparent" : "border-gray-300 bg-white"
          }`}
        >
          {consent && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span className={`text-xs leading-relaxed ${dark ? "text-gray-400" : "text-gray-500"}`}>
          Я даю согласие группе компаний «Прагматика» на{" "}
          <a
            href="/privacy-policy.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`underline hover:text-orange-500 transition-colors ${dark ? "text-gray-300" : "text-gray-600"}`}
            onClick={(e) => e.stopPropagation()}
          >
            обработку моих персональных данных
          </a>
        </span>
      </label>

      {isError && (
        <div className="text-red-400 text-xs px-1">Ошибка отправки. Попробуйте ещё раз.</div>
      )}
      <button
        type="submit"
        disabled={isSubmitting || !phone.trim() || !consent}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Отправка...
          </>
        ) : submitLabel}
      </button>
    </form>
  );
}
