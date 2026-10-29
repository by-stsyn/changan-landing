import { Star, Quote } from "lucide-react";

const REVIEWS = [
  {
    name: "Алексей Смирнов",
    date: "15 марта 2025",
    rating: 5,
    car: "Changan CS35 Plus",
    text: "Отличный дилер! Менеджер Дмитрий помог подобрать комплектацию, всё объяснил по кредиту. Сделку оформили за один день. Машиной очень доволен, уже 3000 км без нареканий.",
    avatar: "А",
  },
  {
    name: "Елена Морозова",
    date: "2 апреля 2025",
    rating: 5,
    car: "Changan UNI-T",
    text: "Купила UNI-T по программе трейд-ин. Мой старый Kia оценили выше, чем предложили в других местах. Выгода реальная, не обманывают. Рекомендую Центр Купчино!",
    avatar: "Е",
  },
  {
    name: "Михаил Петров",
    date: "20 апреля 2025",
    rating: 5,
    car: "Changan CS55 Plus",
    text: "Приятно удивлён сервисом. Без очередей, менеджер на связи 24/7. Кредит одобрили за 20 минут. Авто получил в идеальном состоянии. Буду рекомендовать друзьям.",
    avatar: "М",
  },
  {
    name: "Наталья Козлова",
    date: "5 мая 2025",
    rating: 5,
    car: "Changan Lamore",
    text: "Давно присматривалась к Changan. Здесь убедили — живые авто в наличии, никаких предзаказов. Сделка прошла быстро, в подарок получила ОСАГО и коврики. Спасибо!",
    avatar: "Н",
  },
  {
    name: "Игорь Васильев",
    date: "12 мая 2025",
    rating: 4,
    car: "Changan CS35 Plus",
    text: "Хороший дилер, профессиональные менеджеры. Единственный момент — пришлось немного подождать с документами. Зато цена с учётом всех выгод оказалась лучшей в СПб.",
    avatar: "И",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "text-orange-500 fill-orange-500" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1 mb-3">
            <span className="text-orange-600 text-xs font-semibold uppercase tracking-wide">Отзывы</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">Что говорят покупатели</h2>
          <p className="text-gray-500 text-sm">Реальные отзывы клиентов Changan Центр Купчино</p>

          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} className="text-orange-500 fill-orange-500" />
              ))}
            </div>
            <span className="text-2xl font-black text-gray-900">4.9</span>
            <span className="text-gray-500 text-sm">из 5 (124 отзыва)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map((review) => (
            <div
              key={review.name}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 relative"
            >
              <Quote size={20} className="absolute top-4 right-4 text-orange-100" />
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {review.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{review.name}</div>
                  <div className="text-gray-400 text-xs">{review.date}</div>
                </div>
              </div>
              <StarRating rating={review.rating} />
              <div className="text-xs text-orange-500 font-semibold mt-1.5 mb-2">{review.car}</div>
              <p className="text-gray-600 text-sm leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
