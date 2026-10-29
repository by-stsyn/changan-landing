import { useEffect } from "react";
import { X, Download, ShieldCheck, Check } from "lucide-react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                Политика конфиденциальности
              </h2>
              <p className="text-xs text-gray-500">
                Чанган Центр Прагматика Купчино (ФЗ №152-ФЗ «О персональных данных»)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/privacy-policy.pdf"
              download
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-orange-600 bg-white border border-gray-200 hover:border-orange-300 px-3 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Download size={14} />
              <span>Скачать PDF</span>
            </a>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Закрыть"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 text-gray-800 text-sm leading-relaxed space-y-6">
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-950 text-xs sm:text-sm">
            <div className="font-bold mb-1 flex items-center gap-1.5 text-orange-800">
              <Check size={16} className="text-orange-600" />
              Официальное согласие на обработку персональных данных
            </div>
            Настоящая Политика определяет порядок обработки и защиты персональных данных клиентов официального дилерского центра <strong>Чанган Центр Прагматика Купчино</strong> в соответствии с требованиями Федерального закона РФ № 152-ФЗ «О персональных данных».
          </div>

          <section>
            <h3 className="font-bold text-base text-gray-900 mb-2">1. Общие положения</h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-2">
              1.1. Настоящая Политика действует в отношении всей информации, которую дилерский центр <strong>«Прагматика Купчино»</strong> (г. Санкт-Петербург, ул. Малая Балканская, д. 57) может получить о Пользователе во время использования им официального сайта.
            </p>
            <p className="text-gray-600 text-xs sm:text-sm">
              1.2. Отправляя заявку на сайте (обратный звонок, бронирование автомобиля, расчет кредита, оценка по программе трейд-ин), Пользователь подтверждает свое согласие на обработку персональных данных.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-base text-gray-900 mb-2">2. Состав обрабатываемых данных</h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-2">
              Оператор обрабатывает следующие персональные данные:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 text-xs sm:text-sm pl-2">
              <li>Имя и контактный номер телефона;</li>
              <li>Параметры интересующего или сдаваемого автомобиля (марка, модель, комплектация, год выпуска, пробег);</li>
              <li>Технические данные посещения (cookie-файлы, параметры сессии для корректной работы сервисов).</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-base text-gray-900 mb-2">3. Цели сбора и обработки данных</h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-2">
              Персональные данные используются исключительно для:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 text-xs sm:text-sm pl-2">
              <li>Консультации по наличию, ценам и комплектациям автомобилей Changan;</li>
              <li>Бронирования автомобилей со склада дилера с максимальной выгодой;</li>
              <li>Расчета предварительных условий кредитования и оценки авто по Trade-in;</li>
              <li>Обратной связи менеджера отдела продаж с клиентом.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-base text-gray-900 mb-2">4. Безопасность и конфиденциальность</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Дилерский центр обеспечивает полную конфиденциальность переданных данных и применяет современные организационные и технические меры для защиты информации от неправомерного доступа. Данные не передаются третьим лицам без согласия субъекта.
            </p>
          </section>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 sm:px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <a
            href="/privacy-policy.pdf"
            download
            className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1.5"
          >
            <Download size={14} />
            Скачать официальный документ (PDF)
          </a>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
