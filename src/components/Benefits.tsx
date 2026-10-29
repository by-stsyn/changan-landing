import { BadgePercent, CreditCard, Car } from "lucide-react";
import { IconTradeInExchange } from "./icons/AutoIcons";
import Timer from "./Timer";
import LeadForm from "./LeadForm";

const BULLETS = [
  { icon: BadgePercent, text: "Выгода до 800 000 ₽ на весь модельный ряд" },
  { icon: CreditCard, text: "Кредит от 0,01% — без первоначального взноса" },
  { icon: IconTradeInExchange, text: "Дополнительная субсидия по трейд-ин до 300 000 ₽" },
  { icon: Car, text: "Более 60 автомобилей в наличии прямо сейчас" },
];

export default function Benefits() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1 mb-4">
              <span className="text-orange-600 text-xs font-semibold uppercase tracking-wide">Специальное предложение</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3 leading-tight">
              Получите лучшее
              <br />
              <span className="text-orange-500">предложение</span>
            </h2>
            <p className="text-gray-500 mb-6">Выгода действует ограниченное время. Успейте воспользоваться максимальными условиями</p>

            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-3 font-medium">До окончания выгоды:</div>
              <Timer />
            </div>

            <div className="space-y-3">
              {BULLETS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={18} className="text-orange-500" />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed pt-1.5">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="text-gray-900 font-black text-xl mb-1">Оставьте заявку</div>
            <div className="text-gray-500 text-sm mb-5">Рассчитаем выгоду и подберём автомобиль</div>
            <LeadForm formType="benefits" submitLabel="Получить предложение" />
          </div>
        </div>
      </div>
    </section>
  );
}
