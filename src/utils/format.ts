export const DRIVE_LABELS: Record<string, string> = {
  front: "Передний",
  front_fwd: "Передний",
  fwd: "Передний",
  rear: "Задний",
  rear_rwd: "Задний",
  rwd: "Задний",
  full_4wd: "Полный",
  "4wd": "Полный",
  awd: "Полный",
  "4x4": "Полный",
  all: "Полный",
};

export const BODY_TYPE_LABELS: Record<string, string> = {
  suv: "Внедорожник",
  sedan: "Седан",
  hatchback: "Хэтчбек",
  liftback: "Лифтбек",
  crossover: "Кроссовер",
  minivan: "Минивэн",
  wagon: "Универсал",
  coupe: "Купе",
  pickup: "Пикап",
  van: "Фургон",
};

export const TRANSMISSION_LABELS: Record<string, string> = {
  automatic: "Автомат",
  robotized: "Робот",
  variator: "Вариатор",
  manual: "Механика",
};

export const COLOR_LABELS: Record<string, string> = {
  white: "Белый",
  black: "Чёрный",
  grey: "Серый",
  gray: "Серый",
  silver: "Серебристый",
  red: "Красный",
  blue: "Синий",
  green: "Зелёный",
  brown: "Коричневый",
  beige: "Бежевый",
  orange: "Оранжевый",
  yellow: "Жёлтый",
  gold: "Золотой",
};

export function formatDrive(drive: string): string {
  if (!drive) return drive;
  return DRIVE_LABELS[drive.toLowerCase()] ?? drive;
}

export function formatBodyType(bodyType: string): string {
  if (!bodyType) return "";
  return BODY_TYPE_LABELS[bodyType.toLowerCase().trim()] ?? bodyType;
}

export function formatTransmission(transmission: string): string {
  if (!transmission) return "";
  return TRANSMISSION_LABELS[transmission.toLowerCase().trim()] ?? transmission;
}

export function formatColor(color: string): string {
  if (!color) return "";
  return COLOR_LABELS[color.toLowerCase().trim()] ?? color;
}

export function formatEngineVolume(volume: string | number): string {
  if (volume === null || volume === undefined || volume === "") return "";
  const str = String(volume).trim();
  if (str.includes("л")) return str;
  const num = parseFloat(str.replace(/[^\d.]/g, ""));
  if (!num || num <= 0) return "";
  if (num > 50) {
    return `${(num / 1000).toFixed(1)} л`;
  }
  return `${num.toFixed(1)} л`;
}

export function formatPrice(value: number): string {
  if (!value || value <= 0) return "По запросу";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function getUtmParams(): Record<string, string> {
  if (typeof window === "undefined") {
    return { source: "direct", utmMedium: "", utmCampaign: "", utmTerm: "" };
  }
  const params = new URLSearchParams(window.location.search);
  const getParam = (key: string) => {
    try {
      return params.get(key) || localStorage.getItem(key) || "";
    } catch {
      return params.get(key) || "";
    }
  };
  return {
    source: getParam("utm_source") || document.referrer || "direct",
    utmMedium: getParam("utm_medium"),
    utmCampaign: getParam("utm_campaign"),
    utmTerm: getParam("utm_term"),
  };
}

export function getCarTitle(car: { brand: string; model: string; modification: string; year: string | number }): string {
  const parts = [car.brand, car.model, car.year].filter(Boolean);
  return parts.join(" ");
}
