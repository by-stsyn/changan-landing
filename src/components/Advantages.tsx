import {
  IconWarrantyShield,
  IconCarSilhouette,
  IconChronometer,
  IconCreditPercent,
  IconWinterTire,
  IconConciergeSupport,
  IconDealerSeal,
} from "./icons/AutoIcons";

const ITEMS = [
  {
    num: "01",
    tag: "Гарантия завода 5 лет",
    icon: IconWarrantyShield,
    title: "Официальный статус дилера",
    desc: "Прямые поставки от\u00A0производителя Changan. Заводская гарантия 5\u00A0лет или\u00A0150\u00A0000\u00A0км, сертифицированный сервис и\u00A0оригинальные запчасти.",
  },
  {
    num: "02",
    tag: "Склад в Санкт-Петербурге",
    icon: IconCarSilhouette,
    title: "Более 60\u00A0автомобилей в\u00A0наличии",
    desc: "Широкий выбор моделей и\u00A0комплектаций на\u00A0собственном складе. Автомобили с\u00A0действующим ЭПТС готовы к\u00A0выдаче в\u00A0день обращения.",
  },
  {
    num: "03",
    tag: "Сделка от 2 часов",
    icon: IconChronometer,
    title: "Выдача автомобиля за\u00A01\u00A0день",
    desc: "Полный цикл от\u00A0первого звонка до\u00A0вручения ключей за\u00A0один визит. Оформление страховки и\u00A0постановка на\u00A0учёт без\u00A0очередей.",
  },
  {
    num: "04",
    tag: "Субсидия производителя",
    icon: IconCreditPercent,
    title: "Кредитные программы от\u00A00,01%",
    desc: "Специальные субсидированные ставки ведущих банков-партнёров. Экспресс-одобрение по\u00A0двум документам за\u00A015\u00A0минут.",
  },
  {
    num: "05",
    tag: "Сезонные привилегии",
    icon: IconWinterTire,
    title: "Комплект шин и\u00A0подарки",
    desc: "Зимняя резина, защитные ковры, металлическая защита картера и\u00A0дополнительное оснащение включены в\u00A0актуальное спецпредложение.",
  },
  {
    num: "06",
    tag: "Сервисный консьерж",
    icon: IconConciergeSupport,
    title: "Персональное сопровождение",
    desc: "Выделенный менеджер на\u00A0весь срок владения автомобилем, прямая связь с\u00A0мастером-приёмщиком и\u00A0приоритетная запись на\u00A0сервис.",
  },
];

export default function Advantages() {
  return (
    <section className="py-20 sm:py-24 bg-white border-b border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-zinc-100 border border-zinc-200/90 rounded-full px-3.5 py-1 mb-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-700">
            <IconDealerSeal className="w-3.5 h-3.5 text-orange-600" />
            <span>Стандарты Changan «Прагматика»</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-zinc-900 tracking-tight leading-tight mb-3.5">
            Преимущества официального{" "}
            <span className="font-semibold text-zinc-900">дилерского центра</span>
          </h2>

          <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
            Покупка нового автомобиля без&nbsp;посредников: прямые заводские условия,
            юридическая чистота и&nbsp;полное сервисное обслуживание в&nbsp;Санкт-Петербурге
          </p>
        </div>

        {/* 6 High-End Architectural Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ITEMS.map(({ num, tag, icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-zinc-50/70 hover:bg-white rounded-lg border border-zinc-200/90 hover:border-zinc-300 p-6 sm:p-7 transition-all duration-200 hover:shadow-lg hover:shadow-zinc-900/5 relative group flex flex-col justify-between"
            >
              <div>
                {/* Top row: Icon + Number Index */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-md bg-white border border-zinc-200/90 flex items-center justify-center text-zinc-800 group-hover:border-orange-500/40 group-hover:text-orange-600 transition-colors shadow-xs">
                    <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-zinc-400 group-hover:text-orange-500 transition-colors">
                    {num}
                  </span>
                </div>

                {/* Subtitle tag */}
                <div className="text-[11px] font-semibold text-orange-600 uppercase tracking-wider mb-1.5">
                  {tag}
                </div>

                {/* Card Title */}
                <h3 className="font-semibold text-zinc-900 text-base sm:text-lg mb-2 leading-snug tracking-tight">
                  {title}
                </h3>

                {/* Card Description with clean wrapping */}
                <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                  {desc}
                </p>
              </div>

              {/* Bottom subtle indicator line on hover */}
              <div className="mt-5 pt-3.5 border-t border-zinc-200/60 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Гарантировано договором</span>
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-orange-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
