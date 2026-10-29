import { useState, useEffect } from 'react';
import type { Car } from '../types/car';

interface UseCarsResult {
  cars: Car[];
  loading: boolean;
  error: string | null;
  total: number;
  updatedAt: string | null;
}

// In-memory cache so navigating between Catalog and CarDetailRoute is instant
let cachedCars: Car[] = [];
let hasLoadedCars = false;
let ongoingFetch: Promise<Car[]> | null = null;

function parseXmlToCars(xmlText: string): Car[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");
  const vehicleNodes = xmlDoc.querySelectorAll("vehicle, car, offer, item");
  const parsedCars: Car[] = [];

  vehicleNodes.forEach((v) => {
    const data: Record<string, string> = {};
    for (let i = 0; i < v.children.length; i++) {
      const child = v.children[i];
      data[child.tagName.toLowerCase()] = child.textContent?.trim() || "";
    }

    const photos: string[] = [];
    const photoNodes = v.getElementsByTagName("photo");
    for (let i = 0; i < photoNodes.length; i++) {
      if (photoNodes[i].textContent) photos.push(photoNodes[i].textContent!.trim());
    }
    const pictureNodes = v.getElementsByTagName("picture");
    for (let i = 0; i < pictureNodes.length; i++) {
      if (pictureNodes[i].textContent) photos.push(pictureNodes[i].textContent!.trim());
    }

    const rawBrand = data["brand"] || data["mark"] || data["make"] || "Unknown";
    const rawModel = data["model"] || data["folder"] || "Unknown";

    const car: Car = {
      id: data["vin"] || data["id"] || Math.random().toString(),
      vin: data["vin"] || "",
      brand: rawBrand,
      model: rawModel,
      modification: data["modification"] || "",
      year: parseInt(data["year"], 10) || 0,
      price: parseInt(data["price"], 10) || 0,
      creditDiscount: parseInt(data["creditdiscount"], 10) || 0,
      tradeinDiscount: parseInt(data["tradeindiscount"], 10) || 0,
      insuranceDiscount: parseInt(data["insurancediscount"], 10) || 0,
      photos: photos,
      bodyType: data["bodytype"] || "",
      color: data["bodycolor"] || "",
      drive: data["drivetype"] || data["drive"] || "",
      transmission: data["gearboxtype"] || data["gearbox"] || "",
      fuelType: data["enginetype"] || "",
      engineVolume: parseFloat(data["enginevolume"]) || 0,
      enginePower: parseInt(data["enginepower"], 10) || 0,
      mileage: parseInt(data["mileage"], 10) || 0,
      complectation: data["complectation"] || data["equipment"] || "",
      equipment: data["complectation"] || "",
      ownersCount: parseInt(data["ownerscount"], 10) || 0,
      condition: data["type"] || "",
      doorsCount: parseInt(data["bodydoorcount"], 10) || 0,
      wheel: data["steeringwheel"] || "",
      pts: data["ptstype"] || "",
      description: data["description"] || "",
    };

    const brandCheck = car.brand.toLowerCase();
    if (brandCheck.includes('changan') || brandCheck.includes('чанган')) {
      parsedCars.push(car);
    }
  });

  return parsedCars;
}

async function fetchXmlWithFallback(): Promise<string> {
  // First try proxy endpoint with 6s timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const res = await fetch('/proxy.php', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const text = await res.text();
      if (text.includes('<vehicle')) {
        return text;
      }
    }
  } catch {
    // Proxy failed or timed out, will proceed to static fallback
  }

  // Fallback to pre-cached static XML feed
  const fallbackRes = await fetch('/changan-feed.xml');
  if (!fallbackRes.ok) {
    throw new Error(`HTTP ${fallbackRes.status}`);
  }
  return fallbackRes.text();
}

export function useCars(): UseCarsResult {
  const [cars, setCars] = useState<Car[]>(cachedCars);
  const [loading, setLoading] = useState<boolean>(!hasLoadedCars);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If cars are already cached and available, no need to re-fetch
    if (hasLoadedCars && cachedCars.length > 0) {
      setCars(cachedCars);
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadCars() {
      try {
        if (!ongoingFetch) {
          ongoingFetch = (async () => {
            const xmlText = await fetchXmlWithFallback();
            const parsed = parseXmlToCars(xmlText);
            if (parsed.length > 0) {
              cachedCars = parsed;
              hasLoadedCars = true;
            }
            return parsed;
          })();
        }

        const result = await ongoingFetch;
        if (isMounted) {
          setCars(result);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        ongoingFetch = null;
        if (isMounted) {
          console.error("Ошибка при загрузке фида:", err);
          setError((err as Error).message);
          setLoading(false);
        }
      }
    }

    loadCars();

    return () => {
      isMounted = false;
    };
  }, []);

  return { cars, loading, error, total: cars.length, updatedAt: null };
}
