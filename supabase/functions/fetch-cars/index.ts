import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { XMLParser } from "npm:fast-xml-parser@4.3.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const FEED_URL = "https://export.maxposter.ru/dealer-export/1983-38233.xml";
const TARGET_DEALER_SUBSTRING = "Changan";

const BODY_TYPE_MAP: Record<string, string> = {
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

const TRANSMISSION_MAP: Record<string, string> = {
  automatic: "Автомат",
  robotized: "Робот",
  variator: "Вариатор",
  manual: "Механика",
};

const COLOR_MAP: Record<string, string> = {
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

function num(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") return parseFloat(v.replace(/[^\d.]/g, "")) || 0;
  return 0;
}

function str(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "object" && v !== null) {
    const obj = v as Record<string, unknown>;
    if ("#text" in obj) return String(obj["#text"]).trim();
    return "";
  }
  return String(v).trim();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const feedRes = await fetch(FEED_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; DealerBot/1.0)" },
      signal: AbortSignal.timeout(25000),
    });

    if (!feedRes.ok) throw new Error(`Feed returned ${feedRes.status}`);

    const xmlText = await feedRes.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "_",
      isArray: (name: string) => name === "vehicle" || name === "photo",
      parseTagValue: true,
      parseAttributeValue: true,
      trimValues: true,
    });

    const parsed = parser.parse(xmlText);
    const vehicles: Record<string, unknown>[] = parsed?.vehicles?.vehicle ?? [];

    const cars: Record<string, unknown>[] = [];

    for (const v of vehicles) {
      const dealer = str(v.dealer);
      if (!dealer.includes(TARGET_DEALER_SUBSTRING)) continue;

      const price = num(v.price);
      const priceWithDiscount = num(v.priceWithDiscount) || price;
      const tradeinDiscount = num(v.tradeinDiscount);
      const creditDiscount = num(v.creditDiscount);
      const insuranceDiscount = num(v.insuranceDiscount);

      if (price === 0) continue;

      const photosContainer = v.photos as Record<string, unknown> | undefined;
      const rawPhotos = photosContainer?.photo;
      const photos: string[] = Array.isArray(rawPhotos)
        ? rawPhotos.filter((p) => typeof p === "string" && p.startsWith("http"))
        : typeof rawPhotos === "string" && rawPhotos.startsWith("http")
        ? [rawPhotos]
        : [];

      if (photos.length === 0) continue;

      const bodyTypeKey = str(v.bodyType).toLowerCase();
      const gearboxKey = str(v.gearboxType).toLowerCase();
      const colorKey = str(v.bodyColor).toLowerCase();
      const engineVol = num(v.engineVolume);

      cars.push({
        id: str(v.id),
        dealer,
        brand: str(v.brand),
        model: str(v.model),
        modification: str(v.modification),
        complectation: str(v.complectation),
        year: str(v.year),
        bodyType: BODY_TYPE_MAP[bodyTypeKey] || str(v.bodyConfiguration) || bodyTypeKey,
        color: COLOR_MAP[colorKey] || colorKey,
        engineVolume: engineVol > 0 ? `${(engineVol / 1000).toFixed(1)} л` : "",
        transmission: TRANSMISSION_MAP[gearboxKey] || gearboxKey,
        drive: str(v.driveType),
        mileage: num(v.mileage),
        price,
        priceWithDiscount,
        tradeinDiscount,
        creditDiscount,
        insuranceDiscount,
        totalDiscount: price - priceWithDiscount,
        photos,
        availability: str(v.availability),
        address: str(v.address),
        vin: str(v.vin),
      });
    }

    cars.sort((a, b) => num(b.totalDiscount) - num(a.totalDiscount));

    return new Response(
      JSON.stringify({ cars, total: cars.length, updatedAt: new Date().toISOString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "max-age=300" } }
    );
  } catch (err) {
    console.error("fetch-cars error:", err);
    return new Response(
      JSON.stringify({ cars: [], total: 0, error: String(err), updatedAt: new Date().toISOString() }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
