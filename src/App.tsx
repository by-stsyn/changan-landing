import { useRef, useState, useCallback, useEffect } from "react";
import { Car } from "./types/car";
import Header from "./components/Header";
import Hero from "./components/Hero";
import PromoTimerBanner from "./components/PromoTimerBanner";
import Catalog from "./components/catalog/Catalog";
import Benefits from "./components/Benefits";
import Calculator from "./components/Calculator";
import Advantages from "./components/Advantages";
import TradeIn from "./components/TradeIn";
import FinalCTA from "./components/FinalCTA";
import BookingModal from "./components/BookingModal";
import FinalPriceModal from "./components/FinalPriceModal";
import ExitIntent from "./components/ExitIntent";
import StickyButton from "./components/StickyButton";
import SocialProof from "./components/SocialProof";
import Footer from "./components/Footer";

export default function App() {
  const catalogRef = useRef<HTMLDivElement>(null);
  const finalCTARef = useRef<HTMLDivElement>(null);
  const [bookingCar, setBookingCar] = useState<Car | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [finalPriceOpen, setFinalPriceOpen] = useState(false);

  // === НАЧАЛО: БУДИЛЬНИК ДЛЯ БАЗЫ ДАННЫХ (Supabase) ===
  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      // Фоновый пинг, чтобы база не засыпала от неактивности
      fetch(`${supabaseUrl}/rest/v1/leads?select=id&limit=1`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }).catch(() => {}); // Ошибки (например от AdBlock) тихо игнорируем
    }
  }, []);
  // === КОНЕЦ БУДИЛЬНИКА ===

  const scrollToCatalog = useCallback(() => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const scrollToFinalCTA = useCallback(() => {
    finalCTARef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const openBooking = useCallback((car: Car) => {
    setBookingCar(car);
    setBookingOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setBookingOpen(false);
  }, []);

  const openFinalPrice = useCallback(() => {
    setFinalPriceOpen(true);
  }, []);

  const closeFinalPrice = useCallback(() => {
    setFinalPriceOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header onCTAClick={scrollToFinalCTA} onScrollToCatalog={scrollToCatalog} />

      <main>
        <Hero
          onScrollToCatalog={scrollToCatalog}
          onCTAClick={scrollToFinalCTA}
          onGetFinalPrice={openFinalPrice}
        />

        <PromoTimerBanner onClaim={openFinalPrice} />
       
        <div ref={catalogRef}>
          <Catalog onBook={openBooking} />
        </div>

        <Benefits />
        <Calculator />
        <Advantages />
        <TradeIn />

        <div ref={finalCTARef}>
          <FinalCTA />
        </div>
      </main>

      <Footer />

      <BookingModal car={bookingCar} isOpen={bookingOpen} onClose={closeBooking} />
      <FinalPriceModal isOpen={finalPriceOpen} onClose={closeFinalPrice} />
      <ExitIntent />
      <StickyButton onClick={scrollToFinalCTA} />
      <SocialProof />
    </div>
  );
}
