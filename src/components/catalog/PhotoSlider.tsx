import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PhotoSliderProps {
  photos: string[];
  alt: string;
}

export default function PhotoSlider({ photos = [], alt }: PhotoSliderProps) {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  const list = Array.isArray(photos) && photos.length > 0 ? photos : ["/main.jpg"];

  function prev(e: React.MouseEvent) {
    e.stopPropagation();
    setCurrent((c) => (c === 0 ? list.length - 1 : c - 1));
  }

  function next(e: React.MouseEvent) {
    e.stopPropagation();
    setCurrent((c) => (c === list.length - 1 ? 0 : c + 1));
  }

  return (
    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden rounded-t-2xl group">
      {!loaded[current] && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={list[current] || "/main.jpg"}
        alt={`${alt} — фото ${current + 1}`}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded[current] ? "opacity-100" : "opacity-0"}`}
        loading="lazy"
        onLoad={() => setLoaded((prev) => ({ ...prev, [current]: true }))}
        onError={() => setLoaded((prev) => ({ ...prev, [current]: true }))}
      />

      {list.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Предыдущее фото"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Следующее фото"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ChevronRight size={16} />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {list.slice(0, 6).map((_, i) => (
              <button
                type="button"
                key={i}
                aria-label={`Фото ${i + 1}`}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${i === current ? "bg-white w-3" : "bg-white/50"}`}
              />
            ))}
          </div>

          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
            {current + 1}/{list.length}
          </div>
        </>
      )}
    </div>
  );
}
