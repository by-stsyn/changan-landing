export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/header-logo copy.svg" alt="Changan" className="h-7 w-auto opacity-80" />
            <div className="w-px h-6 bg-white/20" />
            <div>
              <div className="text-white font-bold text-sm">Чанган Центр Прагматика Купчино</div>
              <div className="text-gray-500 text-xs">Официальный дилер Changan в Санкт-Петербурге</div>
            </div>
          </div>

          <div className="text-center sm:text-right text-xs text-gray-600 space-y-0.5">
            <div>© 2026 Чанган Центр Прагматика Купчино</div>
            <div>г. Санкт-Петербург, ул. Малая Балканская, д.57</div>
<div>
              <a 
                href="tel:+78127608508" 
                className="hover:text-orange-500 transition-colors"
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).ym) {
                    (window as any).ym(108557355, 'reachGoal', 'zvonok');
                  }
                }}
              >
                +7 (812) 760-85-08
              </a>
            </div>
            <div className="text-gray-700 text-xs mt-1">
              Информация на сайте носит информационный характер и не является публичной офертой
            </div>
            <div className="pt-1">
              <a
                href="/privacy-policy.pdf"
                className="text-gray-500 hover:text-orange-400 underline transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent("open-privacy-modal"));
                }}
              >
                Политика конфиденциальности
              </a>
            </div>
          </div>
        </div>
      </div>

      <div id="price-disclaimer" className="border-t border-white/5 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <p className="text-gray-600 text-xs leading-relaxed">
            <sup className="text-gray-500 font-bold mr-1">1</sup>
            Цены указаны с учётом всех действующих выгод и носят информационный характер. Итоговая стоимость автомобиля определяется в соответствии с условиями договора купли-продажи. Выгоды предоставляются при выполнении определённых условий: приобретение в кредит в банках-партнёрах, оформление страховых продуктов, сдача автомобиля в трейд-ин. Выгоды не суммируются между собой, если иное не указано явно. Изображения носят иллюстративный характер и могут отличаться от комплектации в наличии. Актуальные условия уточняйте у менеджеров дилерского центра по телефону{" "}
<a 
              href="tel:+78127608508" 
              className="text-gray-500 hover:text-orange-500 transition-colors"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).ym) {
                  (window as any).ym(108557355, 'reachGoal', 'zvonok');
                }
              }}
            >
              +7 (812) 760-85-08
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
