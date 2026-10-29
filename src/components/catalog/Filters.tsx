import { SlidersHorizontal, X } from "lucide-react";
import { Car, Filters as FiltersType } from "../../types/car";
import { formatPrice } from "../../utils/format";

interface FiltersProps {
  cars: Car[];
  filters: FiltersType;
  onChange: (filters: FiltersType) => void;
}

export default function Filters({ cars, filters, onChange }: FiltersProps) {
  const models = Array.from(new Set(cars.map((c) => c.model).filter(Boolean))).sort();
  const bodyTypes = Array.from(new Set(cars.map((c) => c.bodyType).filter(Boolean))).sort();
  const prices = cars.map((c) => c.priceWithDiscount || c.price).filter((p) => p > 0);
  const globalMin = prices.length ? Math.min(...prices) : 0;
  const globalMax = prices.length ? Math.max(...prices) : 20000000;

  const hasActiveFilters = filters.model !== "" || filters.bodyType !== "" ||
    filters.priceMin > globalMin || filters.priceMax < globalMax;

  function reset() {
    onChange({ model: "", priceMin: 0, priceMax: 0, bodyType: "" });
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
          <SlidersHorizontal size={16} className="text-orange-500" />
          Фильтры
        </div>
        {hasActiveFilters && (
          <button
            onClick={reset}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-orange-500 transition-colors"
          >
            <X size={12} />
            Сбросить
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.length > 1 && (
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Модель</label>
            <select
              value={filters.model}
              onChange={(e) => onChange({ ...filters, model: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-2 outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="">Все модели</option>
              {models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        )}

        {bodyTypes.length > 1 && (
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Кузов</label>
            <select
              value={filters.bodyType}
              onChange={(e) => onChange({ ...filters, bodyType: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-2 outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="">Все кузова</option>
              {bodyTypes.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        )}

        {globalMax > 0 && (
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">
              Цена до: <span className="text-orange-500 font-bold">{formatPrice(filters.priceMax || globalMax)}</span>
            </label>
            <input
              type="range"
              min={globalMin}
              max={globalMax}
              step={50000}
              value={filters.priceMax || globalMax}
              onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) })}
              className="w-full accent-orange-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>{formatPrice(globalMin)}</span>
              <span>{formatPrice(globalMax)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
