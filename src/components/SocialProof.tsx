import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

const MESSAGES = [
  "Иван из Санкт-Петербурга оставил заявку на Changan CS55",
  "Анна из Купчино смотрит Changan UNI-T",
  "Сергей из Московского р-на забронировал CS35 Plus",
  "Ольга из Пушкина интересуется Changan Lamore",
  "Дмитрий запросил условия кредита на CS55 Plus",
  "Марина получила персональное предложение",
  
  "Артём из Санкт-Петербурга оставил заявку на Changan CS75 Plus",
  "Виктория из Приморского района смотрит Changan UNI-K",
  "Никита из Невского района запросил расчет кредита на CS55 Plus",
  "Полина из Купчино забронировала Changan UNI-T",
  "Евгений из Московского района интересуется CS35 Plus",
  "Ксения из Петроградского района получила предложение на UNI-K",
  "Илья из Калининского района оставил заявку на Changan Lamore",
  "Маргарита из Фрунзенского района смотрит CS55",
  "Денис из Красносельского района запросил трейд-ин на UNI-T",
  "Алина из Васильевского острова забронировала CS75 Plus",
  "Максим из Колпино интересуется Changan UNI-K",
  "София из Кудрово получила персональное предложение",
  "Георгий из Парнаса смотрит Changan CS35 Plus",
  "Елизавета из Шушар оставила заявку на UNI-T",
  "Пётр из Адмиралтейского района запросил расчет на CS55 Plus",
  "Дарина из Выборгского района интересуется Changan Lamore",
  "Степан из Красногвардейского района забронировал UNI-K",
  "Вероника из Сестрорецка смотрит CS75 Plus",
  "Александр из Кировского района оставил заявку на CS55",
  "Яна из Мурино запросила кредит на Changan UNI-T",

  "Роман из Санкт-Петербурга интересуется CS35 Plus",
  "Оксана из Приморского района оставила заявку на UNI-K",
  "Тимур из Невского района смотрит Changan CS55 Plus",
  "Инна из Купчино получила предложение на CS75 Plus",
  "Владимир из Московского района забронировал UNI-T",
  "Артём из Пушкина запросил трейд-ин на CS35 Plus",
  "Наталья из Калининского района интересуется UNI-K",
  "Игорь из Фрунзенского района оставил заявку на CS55",
  "Антон из Красносельского района смотрит Lamore",
  "Олеся из Васильевского острова получила расчет кредита",
  "Кирилл из Колпино забронировал CS75 Plus",
  "Екатерина из Кудрово интересуется UNI-T",
  "Сергей из Парнаса запросил предложение на CS55 Plus",
  "Мария из Шушар смотрит Changan UNI-K",
  "Андрей из Адмиралтейского района оставил заявку на Lamore",
  "Татьяна из Выборгского района забронировала CS35 Plus",
  "Дмитрий из Красногвардейского района интересуется CS75",
  "Юлия из Сестрорецка получила предложение на UNI-T",
  "Павел из Кировского района смотрит CS55 Plus",
  "Алина из Мурино запросила расчет на UNI-K",

  "Глеб из Санкт-Петербурга забронировал CS55 Plus",
  "Светлана из Приморского района интересуется Lamore",
  "Николай из Невского района оставил заявку на UNI-K",
  "Валерия из Купчино смотрит CS35 Plus",
  "Михаил из Московского района запросил кредит на CS75 Plus",
  "Юрий из Калининского района получил предложение на UNI-T",
  "Анастасия из Фрунзенского района забронировала CS55",
  "Константин из Красносельского района интересуется UNI-K",
  "Дарья из Васильевского острова смотрит Lamore",
  "Руслан из Колпино оставил заявку на CS75 Plus",
  "Елена из Кудрово запросила трейд-ин на CS55",
  "Борис из Парнаса интересуется UNI-T",
  "Ангелина из Шушар получила предложение на CS35 Plus",
  "Виталий из Адмиралтейского района смотрит UNI-K",
  "Людмила из Выборгского района забронировала Lamore",
  "Олег из Красногвардейского района запросил расчет на CS55 Plus",
  "Ирина из Сестрорецка интересуется CS75 Plus",
  "Арсений из Кировского района смотрит UNI-T",
  "Кристина из Мурино оставила заявку на CS35 Plus",
  "Фёдор из Пушкина получил предложение на UNI-K",
];

export default function SocialProof() {
  const [notification, setNotification] = useState<string | null>(null);
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let currentIndex = msgIndex;

    const show = () => {
      setNotification(MESSAGES[currentIndex % MESSAGES.length]);
      currentIndex += 1;
      setMsgIndex(currentIndex);
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
    };

    const initialTimer = setTimeout(show, 15000);
    const interval = setInterval(show, 90000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="fixed top-20 left-4 right-4 sm:left-auto sm:right-auto sm:bottom-24 sm:top-auto z-40 pointer-events-none">
        <div
          className={`sm:fixed sm:bottom-24 sm:left-4 max-w-xs bg-white rounded-xl shadow-xl border border-gray-100 p-3 transition-all duration-500 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
        >
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp size={14} className="text-white" />
            </div>
            <div>
              <div className="text-gray-600 text-xs leading-snug">{notification}</div>
              <div className="text-green-500 text-xs font-semibold mt-0.5">только что</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
