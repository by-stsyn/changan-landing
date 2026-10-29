import { useEffect } from "react";
import { Car } from "../types/car";
import { useCars } from "../hooks/useCars";
import CarDetailPage from "./CarDetailPage";
import { ArrowLeft } from "lucide-react";

interface CarDetailRouteProps {
  vin: string;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <div className="text-gray-600 text-sm font-medium">Загрузка информации об автомобиле...</div>
      </div>
    </div>
  );
}

function NotFoundScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-sm mx-auto px-4">
        <div className="text-6xl font-black text-gray-200 mb-4">404</div>
        <div className="text-xl font-bold text-gray-900 mb-2">Автомобиль не найден</div>
        <div className="text-gray-500 text-sm mb-6">Возможно, этот автомобиль уже продан или URL указан неверно</div>
        <button
          onClick={() => {
            window.history.pushState({}, "", "/");
            window.dispatchEvent(new PopStateEvent("popstate"));
          }}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          Вернуться к каталогу
        </button>
      </div>
    </div>
  );
}

export default function CarDetailRoute({ vin }: CarDetailRouteProps) {
  const { cars, loading } = useCars();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [vin]);

  if (loading) {
    return <LoadingScreen />;
  }

  const cleanVin = decodeURIComponent(vin || "").trim().toLowerCase();
  const car = cars.find((c: Car) => {
    const cVin = (c.vin || "").trim().toLowerCase();
    const cId = String(c.id || "").trim().toLowerCase();
    return (cVin && cVin === cleanVin) || (cId && cId === cleanVin);
  });

  if (!car) {
    return <NotFoundScreen />;
  }

  return <CarDetailPage car={car} />;
}
