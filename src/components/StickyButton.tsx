import { useEffect, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";

interface StickyButtonProps {
  onClick: () => void;
}

export default function StickyButton({ onClick }: StickyButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-5 right-4 z-50 flex flex-col gap-2 transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
    >
<a
        href="tel:+78127608508"
        className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-green-300/50 flex items-center justify-center transition-all duration-200 hover:scale-110"
        aria-label="Позвонить"
        onClick={() => {
          if (typeof window !== 'undefined' && (window as any).ym) {
            (window as any).ym(108557355, 'reachGoal', 'zvonok');
          }
        }}
      >
        <Phone size={20} />
      </a>

      <button
        onClick={onClick}
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-5 rounded-full shadow-lg hover:shadow-orange-300/50 transition-all duration-200 hover:scale-105 text-sm whitespace-nowrap flex items-center gap-2"
      >
        <MessageCircle size={16} />
        Получить предложение
      </button>
    </div>
  );
}
