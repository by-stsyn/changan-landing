import { useEffect, useRef } from "react";
import { X, Car } from "lucide-react";
import { Car as CarType } from "../types/car";
import { formatPrice, getCarTitle } from "../utils/format";
import LeadForm from "./LeadForm";

interface BookingModalProps {
  car: CarType | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ car, isOpen, onClose }: BookingModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!isOpen) return null;

  const title = car ? getCarTitle(car) : "автомобиль";
  const price = car ? (car.priceWithDiscount || car.price) : 0;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl overflow-hidden animate-slide-up sm:animate-fade-in">
        <div className="bg-orange-500 p-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Car size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-black text-lg leading-tight">Забронировать</div>
              <div className="text-orange-100 text-xs">Без предоплаты · Бесплатно</div>
            </div>
          </div>
        </div>

        <div className="p-5">
          {car && (
            <div className="bg-gray-50 rounded-xl p-3 mb-4 flex items-center gap-3">
              {car.photos[0] && (
                <img
                  src={car.photos[0]}
                  alt={title}
                  className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <div className="font-bold text-gray-900 text-sm truncate">{title}</div>
                {car.complectation && (
                  <div className="text-orange-500 text-xs truncate">{car.complectation}</div>
                )}
                {price > 0 && (
                  <div className="text-gray-700 text-sm font-black">{formatPrice(price)}</div>
                )}
              </div>
            </div>
          )}

          <div className="text-gray-500 text-xs mb-4">
            Оставьте контакты — менеджер свяжется с вами в течение 5 минут и зафиксирует бронь
          </div>

<LeadForm
            formType="booking"
            submitLabel="Забронировать автомобиль"
            carTitle={title}
            carId={car?.id}
            onSuccess={() => setTimeout(onClose, 3000)}
          />
          
        </div>
      </div>
    </div>
  );
}
