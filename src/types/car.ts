export interface Car {
  id: string;
  dealer: string;
  brand: string;
  model: string;
  modification: string;
  complectation: string;
  year: string;
  bodyType: string;
  color: string;
  engineVolume: string;
  transmission: string;
  drive: string;
  mileage: number;
  price: number;
  priceWithDiscount: number;
  tradeinDiscount: number;
  creditDiscount: number;
  insuranceDiscount: number;
  totalDiscount: number;
  photos: string[];
  availability: string;
  vin: string;
}

export interface CarsResponse {
  cars: Car[];
  total: number;
  updatedAt: string;
  error?: string;
}

export interface LeadPayload {
  name: string;
  phone: string;
  carTitle?: string;
  carId?: string;
  formType: string;
  source?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
}

export interface Filters {
  model: string;
  priceMin: number;
  priceMax: number;
  bodyType: string;
}
