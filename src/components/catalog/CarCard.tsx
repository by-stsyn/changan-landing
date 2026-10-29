import { useState } from "react";
import { Tag, Calendar, Fuel, Settings2, ExternalLink } from "lucide-react";
import { Car } from "../../types/car";
import { formatPrice, formatDrive, getCarTitle } from "../../utils/format";
import PhotoSlider from "./PhotoSlider";

interface CarCardProps {
  car: Car;
  onBook: (car: Car) => void;
}

interface DiscountState {
  tradein: boolean;
  credit: boolean;
  insurance: boolean;
}

const getNumber = (val: unknown): number => {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const obj = typeof val === "object" ? (val as Record<string, unknown>) : null;
  const str = obj && obj._ ? String(obj._) : String(val);
  const cleaned = str.replace(/\D/g, "");
  return Number(cleaned) || 0;
};

export default function CarCard({ car, onBook }: CarCardProps) {
  // Галочки включены по умолчанию
  const [discounts, setDiscounts] = useState<DiscountState>({
    tradein: true,
    credit: true,
    insurance: true,
  });

  // --- ЛОГИКА ДЛЯ ХАНТЕРОВ (ПЕРЕОПРЕДЕЛЕНИЕ ВЫГОДЫ) ---
  const isHunter = String(car.model || "").toUpperCase().includes("HUNTER");

  // Если это Хантер, жестко ставим 800 000 в первую выгоду, остальные зануляем. 
  // Иначе — берем данные из фида как обычно.
  const tDiscount = isHunter ? 800000 : getNumber(car.tradeinDiscount);
  const cDiscount = isHunter ? 0 : getNumber(car.creditDiscount);
  const iDiscount = isHunter ? 0 : getNumber(car.insuranceDiscount);
  const bPrice = getNumber(car.price);
  // ----------------------------------------------------

  // Проверяем наличие выгоды по очищенным данным (ОБЪЯВЛЯЕМ ОДИН РАЗ)
  const hasDiscounts = tDiscount > 0 || cDiscount > 0 || iDiscount > 0;

  // Теперь математика сработает идеально
  const selectedDiscount =
    (discounts.tradein ? tDiscount : 0) +
    (discounts.credit ? cDiscount : 0) +
    (discounts.insurance ? iDiscount : 0);

  const finalPrice = Math.max(bPrice - selectedDiscount, 0);
  const hasAnyDiscount = selectedDiscount > 0;

  function toggle(key: keyof DiscountState) {
    setDiscounts((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const title = getCarTitle(car);

  // --- ЛОГИКА ДЛЯ ПЛАШКИ NEW ---
  const isUniS = String(car.model || "").toUpperCase().includes("UNI-S");
  const is4WD = String(car.modification || "").toUpperCase().includes("4WD") || String(car.model || "").toUpperCase().includes("4WD");
  const is2026 = String(car.year || "") === "2026";
  const showNewBadge = isUniS && is4WD && is2026;
  // ----------------------------------

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col border border-gray-100 group">
      <div className="relative">
        <PhotoSlider photos={car.photos} alt={title} />
        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-lg">
          В наличии
        </div>
        {(car.vin || car.id) && (
          <button
            onClick={() => {
              const carId = car.vin || car.id;
              window.history.pushState({}, "", `/car/${encodeURIComponent(carId)}`);
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
            className="absolute bottom-3 right-3 bg-black/75 hover:bg-black text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors backdrop-blur-sm cursor-pointer shadow-md"
            aria-label="Подробнее об автомобиле"
          >
            <ExternalLink size={12} />
            <span>Подробнее</span>
          </button>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
       <div className="mb-3">
          <h3
            onClick={() => {
              const carId = car.vin || car.id;
              if (carId) {
                window.history.pushState({}, "", `/car/${encodeURIComponent(carId)}`);
                window.dispatchEvent(new PopStateEvent("popstate"));
              }
            }}
            className="font-black text-gray-900 text-base leading-tight mb-0.5 flex items-center gap-2 flex-wrap cursor-pointer hover:text-orange-500 transition-colors"
          >
            <span>{car.brand} {car.model}</span>
            {showNewBadge && (
              <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide shadow-sm">
                NEW
              </span>
            )}
          </h3>
          {car.modification && (
            <p className="text-gray-500 text-xs truncate">{car.modification}</p>
          )}
          {car.complectation && (
            <p className="text-orange-500 text-xs font-semibold truncate">{car.complectation}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4 text-xs text-gray-500">
          {car.year && (
            <div className="flex items-center gap-1">
              <Calendar size={11} className="text-gray-400" />
              {car.year}
            </div>
          )}
          {car.engineVolume && (
            <div className="flex items-center gap-1">
              <Fuel size={11} className="text-gray-400" />
              {car.engineVolume}
            </div>
          )}
          {car.transmission && (
            <div className="flex items-center gap-1">
              <Settings2 size={11} className="text-gray-400" />
              {car.transmission}
            </div>
          )}
          {car.drive && (
            <div className="flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M2 12h4M18 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
              {formatDrive(car.drive)}
            </div>
          )}
          {car.color && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              {car.color}
            </div>
          )}
        </div>

        {hasDiscounts && (
          <div className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
              <Tag size={11} className="text-orange-500" />
              Применить выгоду
            </div>
            <div className="flex flex-col gap-1.5">
              {tDiscount > 0 && (
                <label className="flex items-center justify-between cursor-pointer group/cb">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={discounts.tradein}
                      onChange={() => toggle("tradein")}
                      className="w-3.5 h-3.5 accent-orange-500 cursor-pointer"
                    />
                    <span className="text-xs text-gray-600 group-hover/cb:text-gray-900 transition-colors">
                      {isHunter ? "Лизинг" : "Трейд-ин"}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-green-600">−{formatPrice(tDiscount)}</span>
                </label>
              )}
              {cDiscount > 0 && (
                <label className="flex items-center justify-between cursor-pointer group/cb">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={discounts.credit}
                      onChange={() => toggle("credit")}
                      className="w-3.5 h-3.5 accent-orange-500 cursor-pointer"
                    />
                    <span className="text-xs text-gray-600 group-hover/cb:text-gray-900 transition-colors">Кредит</span>
                  </div>
                  <span className="text-xs font-bold text-green-600">−{formatPrice(cDiscount)}</span>
                </label>
              )}
              {iDiscount > 0 && (
                <label className="flex items-center justify-between cursor-pointer group/cb">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={discounts.insurance}
                      onChange={() => toggle("insurance")}
                      className="w-3.5 h-3.5 accent-orange-500 cursor-pointer"
                    />
                    <span className="text-xs text-gray-600 group-hover/cb:text-gray-900 transition-colors">Страховка</span>
                  </div>
                  <span className="text-xs font-bold text-green-600">−{formatPrice(iDiscount)}</span>
                </label>
              )}
            </div>
          </div>
        )}

        <div className="mt-auto">
          <div className="flex items-end justify-between mb-3">
            <div>
              {hasAnyDiscount ? (
                <>
                  <div className="text-gray-400 text-sm line-through leading-none mb-0.5">{formatPrice(bPrice)}</div>
                  <div className="text-2xl font-black text-gray-900 leading-none">
                    {formatPrice(finalPrice)}
                    <a href="/#price-disclaimer" className="text-orange-400 text-xs font-bold align-super ml-0.5 hover:text-orange-600 transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById("price-disclaimer")?.scrollIntoView({ behavior: "smooth" }); }}>1</a>
                  </div>
                  <div className="text-green-600 text-xs font-bold mt-0.5">−{formatPrice(selectedDiscount)}</div>
                </>
              ) : (
                <div className="text-2xl font-black text-gray-900 leading-none">
                  {formatPrice(bPrice)}
                  <a href="/#price-disclaimer" className="text-orange-400 text-xs font-bold align-super ml-0.5 hover:text-orange-600 transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById("price-disclaimer")?.scrollIntoView({ behavior: "smooth" }); }}>1</a>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => onBook(car)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-orange-200 text-sm"
          >
            Забронировать
          </button>
        </div>
      </div>
    </div>
  );
}
