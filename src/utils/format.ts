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

export function formatDrive(drive: string): string {
  if (!drive) return drive;
  return DRIVE_LABELS[drive.toLowerCase()] ?? drive;
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
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get("utm_source") || document.referrer || "direct",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    utmTerm: params.get("utm_term") || "",
  };
}

export function getCarTitle(car: { brand: string; model: string; modification: string; year: string }): string {
  const parts = [car.brand, car.model, car.year].filter(Boolean);
  return parts.join(" ");
}
