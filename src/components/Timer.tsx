import { useEffect, useState } from "react";

const CYCLE_MS = 6 * 24 * 60 * 60 * 1000; // 6 days in milliseconds
const STORAGE_KEY = "changan_promo_cycle_6d";

export default function Timer() {
  const getInitialTarget = () => {
    const now = Date.now();
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      let target = parseInt(stored, 10);
      if (target > now) return target;
      // If cycle expired, calculate next 6-day cycle forward
      while (target <= now) {
        target += CYCLE_MS;
      }
      localStorage.setItem(STORAGE_KEY, String(target));
      return target;
    }
    const target = now + CYCLE_MS;
    localStorage.setItem(STORAGE_KEY, String(target));
    return target;
  };

  const [targetTime, setTargetTime] = useState(getInitialTarget);
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, targetTime - Date.now()));

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      let diff = targetTime - now;

      // When timer expires, restart the 6-day cycle in a loop
      if (diff <= 0) {
        let nextTarget = targetTime;
        while (nextTarget <= now) {
          nextTarget += CYCLE_MS;
        }
        localStorage.setItem(STORAGE_KEY, String(nextTarget));
        setTargetTime(nextTarget);
        diff = nextTarget - now;
      }

      setTimeLeft(diff);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const pad = (n: number) => String(n).padStart(2, "0");

  const units = [
    { value: pad(days), label: "дней", short: "ДН" },
    { value: pad(hours), label: "часов", short: "ЧАС" },
    { value: pad(minutes), label: "минут", short: "МИН" },
    { value: pad(seconds), label: "секунд", short: "СЕК" },
  ];

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {units.map(({ value, label, short }, i) => (
        <div key={label} className="flex items-center gap-1.5 sm:gap-2">
          {/* Segment display cell with brushed metal bevel and crisp contrast */}
          <div className="relative flex flex-col items-center justify-center bg-[#0d121b] border border-white/12 border-t-white/20 rounded-md px-2.5 sm:px-3 py-1.5 sm:py-2 min-w-[50px] sm:min-w-[58px] shadow-md shadow-black/40">
            {/* Subtle top bezel hairline */}
            <div className="absolute top-0 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            {/* Bold, sharp tabular mono digits */}
            <div className="text-xl sm:text-2xl lg:text-[26px] font-mono font-bold tabular-nums text-white leading-tight tracking-tight">
              {value}
            </div>

            {/* Micro-typographic metric label */}
            <div className="text-[9px] sm:text-[10px] text-zinc-400 font-medium tracking-[0.14em] uppercase mt-0.5 select-none">
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{short}</span>
            </div>
          </div>

          {/* Precision hairline separator */}
          {i < units.length - 1 && (
            <div className="flex flex-col gap-1 items-center justify-center py-1 opacity-60">
              <span className="w-1 h-1 rounded-full bg-orange-400/80" />
              <span className="w-1 h-1 rounded-full bg-orange-400/80" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
