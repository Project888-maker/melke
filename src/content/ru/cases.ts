import type { CaseStudy } from "../types";
import { workPhoto, workTeaser } from "@/lib/media";

const seq = (year: number, base: string, n: number, pad = true) =>
  Array.from({ length: n }, (_, i) => workPhoto(year, `${base}-${pad ? String(i + 1).padStart(2, "0") : i + 1}`));

export const caseTags = ["Все", "Жилые комплексы", "Частные дома", "Алюминий", "Балконы", "Общественные здания", "Аксессуары"] as const;

export const cases: CaseStudy[] = [
  {
    slug: "zona-otdyha-s-kuhney-i-barbekyu", year: 2025, title: "Зона отдыха с кухней и барбекю",
    place: "Трасса Калининград — Багратионовск", tags: ["Алюминий", "Частные дома"],
    teaser: workTeaser(2025, "teacer-zona-otdyha"), photos: seq(2025, "zona-otdyha", 7),
    text: ["Объект на аэродроме малой авиации. Подъёмно-сдвижная система Alumark S158, цвет по палитре RAL 7016, двухкамерные стеклопакеты. Система может быть как со всеми активными створками, так и с глухой частью."],
    specs: ["Монтажная глубина 158 мм", "Заполнение от 10 до 50 мм", "Вес створки до 440 кг", "Высота створки до 3300 мм", "Ширина створки до 3200 мм", "Ширина изделия до 12 метров", "Покраска в любой цвет RAL"],
  },
  {
    slug: "vhodnaya-dver-iz-profilya-melke", year: 2025, title: "Входная дверь из профиля Melke", tags: ["Частные дома"],
    teaser: workTeaser(2025, "teacer-melke-evalution"), photos: [workPhoto(2025, "melke-evalution-01")],
    text: ["Входная дверь из профиля Melke Evolution (класс 1, толщина стенки 3 мм) с технологией Cool Colours и двухкамерным стеклопакетом 40 мм.", "Используется проверенная немецкая фурнитура Siegenia: бесшумная работа, плавное закрывание, защита от взлома."],
    specs: ["Широкий выбор цветов: от классики до модных оттенков", "Декор: витражи, патинирование, фрезеровка", "Остекление от матового до зеркального"],
  },
  {
    slug: "alyuminievoe-osteklenie-na-kryshe", year: 2025, title: "Алюминиевое остекление на крыше", tags: ["Алюминий", "Частные дома"],
    teaser: workTeaser(2025, "teacer-osteklenie-na-kryshe"), photos: [workPhoto(2025, "osteklenie-na-kryshe-01")],
    text: ["Зенитный фонарь: тёплая крыша над бассейном из алюминиевого профиля, стоечно-ригельная конструкция."],
  },
  {
    slug: "terrasy-provedal", year: 2025, title: "Остекление террас профилем Provedal", tags: ["Алюминий", "Частные дома"],
    teaser: workTeaser(2025, "teacer-provedal"), photos: seq(2025, "provedal", 2, false),
    text: ["Остекление террас в частных домах алюминиевым профилем Provedal."],
  },
  {
    slug: "balkony-provedal", year: 2025, title: "Раздвижное остекление балконов Provedal", tags: ["Балконы", "Алюминий"],
    teaser: workTeaser(2025, "teacer-balkonprovedal"), photos: [workPhoto(2025, "balkon-provedal-01")],
    text: ["Раздвижная система остекления балконов в алюминиевом профиле Provedal."],
  },
  {
    slug: "moskitnaya-setka-garmoshka", year: 2025, title: "Москитная сетка «гармошка»", tags: ["Аксессуары"],
    teaser: workTeaser(2025, "teacer-moskitnaya-setka-gormoshka"), photos: [workPhoto(2025, "moskitnaya-setka-gormoshka")],
    text: ["Москитная сетка плиссе на окна любых типов."],
  },
  {
    slug: "zhk-novaya-rezidenciya", year: 2018, title: "ЖК «Новая Резиденция»", place: "Гурьевск", tags: ["Жилые комплексы"],
    teaser: workTeaser(2018, "teacer-novaya-rezidenciya"), photos: seq(2018, "novaya-rezidenciya", 2),
  },
  {
    slug: "zhk-inzhenernyy", year: 2018, title: "ЖК «Инженерный»", place: "Калининград", tags: ["Жилые комплексы"],
    teaser: workTeaser(2018, "teacer-inzhenernyy"), photos: seq(2018, "inzhenernyy", 3),
  },
  {
    slug: "kompleks-vad-holmogorovka", year: 2018, title: "Комплекс АО «ВАД»", place: "п. Холмогоровка", tags: ["Общественные здания"],
    teaser: workTeaser(2018, "teacer-holmogorovka"), photos: seq(2018, "holmogorovka", 2),
  },
  {
    slug: "oktyabrskaya-ploshchad-34", year: 2018, title: "Октябрьская площадь, 34", place: "Калининград", tags: ["Жилые комплексы"],
    teaser: workTeaser(2018, "teacer-oktyabrskaya-ploshchad"), photos: seq(2018, "oktyabrskaya-ploshchad", 3),
  },
  {
    slug: "gurevskaya-25", year: 2018, title: "Дом на ул. Гурьевской, 25", place: "Калининград", tags: ["Жилые комплексы"],
    teaser: workTeaser(2018, "teacer-gurevskaya"), photos: seq(2018, "gurevskaya", 2),
  },
  {
    slug: "dokuka-22-chkalovsk", year: 2018, title: "Дом на ул. Докука, 22", place: "Чкаловск", tags: ["Жилые комплексы"],
    teaser: workTeaser(2018, "teacer-chkalovsk"), photos: seq(2018, "chkalovsk", 2),
  },
  {
    slug: "otdelka-balkonov", year: 2018, title: "Отделка балконов", place: "Калининград", tags: ["Балконы"],
    teaser: workTeaser(2018, "teacer-otdelka-balkonov"), photos: seq(2018, "otdelka-balkonov", 6),
  },
  {
    slug: "steklyannaya-pristroyka", year: 2015, title: "Стеклянная пристройка", tags: ["Алюминий", "Частные дома"],
    teaser: workTeaser(2015, "teacer-steklyannaya-pristroyka"), photos: seq(2015, "steklyannaya-pristroyka", 4),
    text: ["Стеклянная пристройка из алюминиевого профиля."],
  },
  {
    slug: "dveri-hst-na-poberezhe", year: 2014, title: "Двери HST на балтийском побережье", tags: ["Частные дома"],
    teaser: workTeaser(2014, "teacer-hst"), photos: seq(2014, "hst", 4),
    text: ["Подъёмно-раздвижные двери HST в домах на балтийском побережье."],
  },
  {
    slug: "banki-na-bolshoy-okruzhnoy", year: 2014, title: "Баньки на Большой Окружной, 35", place: "Калининград", tags: ["Общественные здания"],
    teaser: workTeaser(2014, "teacer-bathhouse"), photos: seq(2014, "bathhouse", 7),
  },
  {
    slug: "rollety-i-vorota", year: 2013, title: "Роллеты и ворота", place: "Калининград", tags: ["Аксессуары"],
    teaser: workTeaser(2013, "teacer-rollety"), photos: seq(2013, "rollety", 5, false),
  },
  {
    slug: "osteklenie-besedok", year: 2013, title: "Остекление беседок", tags: ["Алюминий", "Частные дома"],
    teaser: workTeaser(2013, "teacer-besedka"), photos: seq(2013, "besedka", 6),
  },
  {
    slug: "lodzhii-i-balkony", year: 2013, title: "Остекление лоджий и балконов", place: "Калининград", tags: ["Балконы"],
    teaser: workTeaser(2013, "teacer-balkony"), photos: seq(2013, "balkony", 5),
    text: ["Работы, выполненные специалистами компании в Калининграде и Калининградской области."],
  },
  {
    slug: "roddom-1", year: 2013, title: "Реконструкция роддома №1", place: "Калининград", tags: ["Общественные здания"],
    teaser: workTeaser(2013, "teacer-roddom"), photos: seq(2013, "roddom", 2),
    text: ["Нашей компанией были заменены все двери и окна в двух пятиэтажных зданиях."],
  },
  {
    slug: "teatr-tilzit", year: 2013, title: "Театр юного зрителя «Тильзит»", place: "Советск", tags: ["Общественные здания"],
    teaser: workTeaser(2013, "teacer-tyuz"), photos: seq(2013, "tyuz", 5),
    text: ["Театральное здание было открыто в Тильзите в 1893 году, первый спектакль поставили по пьесе Гёте «Эгмонт».", "В ходе реставрации здания компания «Европейские технологии» провела замену окон в театре."],
  },
  {
    slug: "kostromskaya-6-8", year: 2011, title: "Дома на ул. Костромской, 6–8", place: "Калининград", tags: ["Жилые комплексы"],
    teaser: workTeaser(2011, "teacer-kostromskaya"), photos: seq(2011, "kostromskaya", 5),
    text: ["Остекление новых и реконструируемых домов в Калининграде и Калининградской области."],
  },
];
