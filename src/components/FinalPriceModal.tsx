import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import {
  IconPriceMatch,
  IconWinterTire,
  IconDealerSeal,
} from "./icons/AutoIcons";
import LeadForm from "./LeadForm";

interface FinalPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FinalPriceModal({ isOpen, onClose }: FinalPriceModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-t-xl sm:rounded-lg w-full sm:max-w-md shadow-2xl overflow-hidden animate-slide-up sm:animate-fade-in max-h-[92vh] flex flex-col border border-zinc-200">
        {/* Header: Refined automotive obsidian banner with orange accent line */}
        <div className="bg-gradient-to-r from-zinc-950 via-[#131822] to-zinc-950 p-5 text-white relative border-b-2 border-orange-500">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-md flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/15 border border-orange-500/40 rounded-lg flex items-center justify-center flex-shrink-0 text-orange-500">
              <IconPriceMatch className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg leading-tight">
                Получить финальную цену
              </h3>
              <p className="text-zinc-400 text-xs mt-0.5">
                Расчёт за&nbsp;5&nbsp;минут с&nbsp;учётом всех выгод и&nbsp;акций
              </p>
            </div>
          </div>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto">
          {/* Key Advantages Badges */}
          <div className="space-y-2 mb-4 bg-zinc-50 border border-zinc-200/90 rounded-md p-3">
            <div className="flex items-start gap-2.5 text-xs text-zinc-800">
              <IconDealerSeal className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <span>
                <strong>Гарантия лучшей цены:</strong> есть расчёт от другого дилера? <span className="whitespace-nowrap">Сделаем цену выгоднее!</span>
              </span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-zinc-800">
              <IconWinterTire className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <span>
                <strong>Сезонная программа:</strong> комплект зимней резины в&nbsp;подарок при&nbsp;бронировании
              </span>
            </div>
          </div>

          <p className="text-zinc-600 text-xs mb-4 leading-relaxed">
            Укажите телефон&nbsp;— специалист отдела продаж рассчитает персональную стоимость автомобиля с&nbsp;максимальной выгодой:
          </p>

          <LeadForm
            formType="hero_final_price"
            submitLabel="Зафиксировать финальную цену"
            onSuccess={() => setTimeout(onClose, 3000)}
          />
        </div>
      </div>
    </div>
  );
}
