import { MapPin, Phone, Clock } from "lucide-react";
import LeadForm from "./LeadForm";

export default function FinalCTA() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gray-950 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg"
              alt="Changan showroom"
              className="w-full h-full object-cover opacity-20"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950/95 to-gray-900" />
          </div>

          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

          <div className="relative grid lg:grid-cols-2 gap-10 p-8 md:p-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-3 py-1 mb-5">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-orange-400 text-xs font-semibold uppercase tracking-wide">Персональное предложение</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3">
                Получите
                <br />
                <span className="text-orange-500">персональное</span>
                <br />
                предложение
              </h2>
              <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                Оставьте заявку — менеджер перезвонит за 5 минут, подберёт автомобиль и рассчитает максимальную выгоду
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} className="text-orange-500" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">Адрес</div>
                    <div className="text-gray-400 text-xs">г. Санкт-Петербург, ул. Малая Балканская, д.57</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={16} className="text-orange-500" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">Телефон</div>
<a 
                      href="tel:+78127608508" 
                      className="text-orange-400 text-xs hover:text-orange-300 transition-colors"
                      onClick={() => {
                        if (typeof window !== 'undefined' && (window as any).ym) {
                          (window as any).ym(108557355, 'reachGoal', 'zvonok');
                        }
                      }}
                    >
                      +7 (812) 760-85-08
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock size={16} className="text-orange-500" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">Режим работы</div>
                    <div className="text-gray-400 text-xs">Ежедневно: 9:00 — 21:00</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-white font-bold text-lg mb-1">Ждем вашей заявки</div>
                <div className="text-gray-400 text-sm mb-5">Обработаем в течение 5 минут</div>
<LeadForm formType="final_cta" submitLabel="Получить персональное предложение" dark />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
