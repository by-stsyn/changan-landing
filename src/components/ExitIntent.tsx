import { useEffect, useRef, useState } from "react";
import { X, Gift } from "lucide-react";
import LeadForm from "./LeadForm";

export default function ExitIntent() {
  const [isOpen, setIsOpen] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("exit_intent_dismissed");
    if (dismissed) return;

    const timer = setTimeout(() => {
      function handleMouseLeave(e: MouseEvent) {
        if (e.clientY <= 0 && !triggered.current) {
          triggered.current = true;
          setIsOpen(true);
        }
      }
      document.addEventListener("mouseleave", handleMouseLeave);

      return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  function close() {
    setIsOpen(false);
    sessionStorage.setItem("exit_intent_dismissed", "1");
    document.body.style.overflow = "";
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />
      <div className="relative bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-orange-500/10" />
          <button
            onClick={close}
            className="absolute top-3 right-3 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X size={14} />
          </button>
          <div className="relative">
            <div className="w-14 h-14 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Gift size={26} className="text-orange-400" />
            </div>
            <div className="text-white font-black text-xl mb-1">Подождите!</div>
            <div className="text-orange-400 text-sm font-semibold">Специальное предложение только для вас</div>
          </div>
        </div>

        <div className="p-5">
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 mb-4 text-center">
            <div className="text-orange-700 font-black text-2xl mb-0.5">−100 000 ₽</div>
            <div className="text-orange-600 text-xs font-semibold">дополнительная выгода при заявке прямо сейчас</div>
          </div>
<LeadForm
            formType="exit_intent"
            submitLabel="Получить выгоду −100 000 ₽"
            onSuccess={close}
          />
        </div>
      </div>
    </div>
  );
}
