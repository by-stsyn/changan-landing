import { useState, useMemo } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Car, Filters } from "../../types/car";
import { useCars } from "../../hooks/useCars";
import CarCard from "./CarCard";
import FiltersPanel from "./Filters";

const SKELETON_COUNT = 6;

interface CatalogProps {
  onBook: (car: Car) => void;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-8 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-10 bg-orange-100 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

export default function Catalog({ onBook }: CatalogProps) {
  const { cars, loading, error, total } = useCars();
  const [filters, setFilters] = useState<Filters>({ model: "", priceMin: 0, priceMax: 0, bodyType: "" });
  const [visibleCount, setVisibleCount] = useState(9);

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (filters.model && car.model !== filters.model) return false;
      if (filters.bodyType && car.bodyType !== filters.bodyType) return false;
      const price = car.priceWithDiscount || car.price;
      if (filters.priceMax > 0 && price > filters.priceMax) return false;
      return true;
    });
  }, [cars, filters]);

  const visibleCars = filteredCars.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCars.length;

  return (
    <section id="catalog" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1 mb-3">
            <span className="text-orange-600 text-xs font-semibold uppercase tracking-wide">Каталог</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
            Автомобили в наличии
          </h2>
          {!loading && (
            <p className="text-gray-500 text-sm">
              Найдено автомобилей: <span className="text-orange-500 font-bold">{filteredCars.length}</span>
              {total > 0 && total !== filteredCars.length && (
                <span className="text-gray-400"> из {total}</span>
              )}
            </p>
          )}
        </div>

        {!loading && cars.length > 0 && (
          <FiltersPanel cars={cars} filters={filters} onChange={setFilters} />
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
              <AlertCircle size={24} className="text-red-400" />
            </div>
            <div className="text-gray-700 font-semibold">Не удалось загрузить каталог</div>
            <div className="text-gray-400 text-sm max-w-xs">
              Проверьте соединение с интернетом и попробуйте обновить страницу
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors mt-2"
            >
              <RefreshCw size={14} />
              Обновить
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => <SkeletonCard key={i} />)
            : visibleCars.map((car) => (
                <CarCard key={car.id} car={car} onBook={onBook} />
              ))}
        </div>

        {!loading && filteredCars.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-2">Автомобили не найдены</div>
            <div className="text-gray-300 text-sm">Попробуйте изменить параметры фильтров</div>
          </div>
        )}

        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisibleCount((c) => c + 6)}
              className="bg-white hover:bg-gray-50 border-2 border-orange-500 text-orange-500 font-bold px-8 py-3 rounded-xl transition-all duration-200 hover:shadow-md text-sm"
            >
              Показать ещё ({filteredCars.length - visibleCount})
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
