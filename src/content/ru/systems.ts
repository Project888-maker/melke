import type { WindowSystem } from "../types";
import { img } from "@/lib/media";

const colors = [
  { name: "Белый", desc: "Классический и универсальный", swatch: "linear-gradient(135deg,#ffffff,#e9eef2)" },
  { name: "Антрацит", desc: "Современный и выразительный", swatch: "linear-gradient(135deg,#4a4f55,#2b2f34)" },
  { name: "Дерево", desc: "Естественная эстетика", swatch: "linear-gradient(135deg,#a8642f,#5e3413 60%,#8a4f22)" },
];

export const compareRows: { key: string; label: string }[] = [
  { key: "width", label: "Монтажная ширина, мм" },
  { key: "frame", label: "Камеры в раме, шт." },
  { key: "sash", label: "Камеры в створке, шт." },
  { key: "glass", label: "Стеклопакет, мм" },
  { key: "seals", label: "Контуры уплотнения" },
  { key: "use", label: "Лучше всего подходит" },
];

export const categories = [
  { key: "all", label: "Все системы" },
  { key: "warm", label: "Больше тепла" },
  { key: "universal", label: "Универсальные" },
  { key: "compact", label: "Компактные" },
] as const;

export const systems: WindowSystem[] = [
  {
    slug: "centum",
    name: "Melke Centum",
    badge: { text: "Больше тепла", tone: "peach" },
    category: "warm",
    short: "Максимальный комфорт и энергоэффективность для вашего дома.",
    width: "80 / 100 мм",
    chambers: "6 / 7 камер",
    chambersLabel: "Камеры в раме / створке",
    img: img("centum"),
    heroImg: img("centum"),
    cutout: img("centum-cutout"),
    heroCutout: img("centum-cutout"),
    heroTitle: "на профиле Melke Centum",
    heroLead: "Тепло и тишина для загородного дома.",
    heroNote: "Система премиум-класса для домов и коттеджей.",
    stats: [
      { value: "80 / 100 мм", label: "Рама / створка" },
      { value: "6 / 7 камер", label: "В раме / в створке" },
      { value: "до 50 мм", label: "Стеклопакет" },
    ],
    sectionTitle: "Тепло, которое остаётся в доме",
    sectionLead:
      "Melke Centum отличается непревзойдёнными характеристиками по звуко- и теплоизоляции и эффективно устраняет теплопотери.",
    features: [
      { title: "Рама 80 мм, створка 100 мм", text: "Шестикамерная рама и семикамерная створка.", img: img("centum") },
      { title: "Три контура уплотнения", text: "Защита от ветра, влаги и уличного шума.", img: img("evo-t2") },
      { title: "Стеклопакет до 50 мм", text: "Подберём формулу под расположение дома.", img: img("evo-t3") },
    ],
    about: [
      "Melke Centum — система премиум-класса, уникальная на российском рынке пластиковых окон.",
      "Шестикамерная 80-мм рама, семикамерная 100-мм створка, три контура уплотнения и стеклопакет шириной 50 мм надёжно защищают дом в любую погоду. Это лучшее решение для остекления загородных домов и коттеджей: окна устраняют теплопотери и гармонично дополняют современный интерьер.",
    ],
    interiorTitle: "Для дома. Для семьи. Надолго.",
    interiorText:
      "Окна ET на профиле Melke Centum сохраняют тепло в доме и подчёркивают его архитектуру. Melke Centum сохранит тепло ваших близких, даже если они далеко.",
    interiorImg: img("interior-light"),
    colors,
    colorsNote: "Доступность цвета уточняется при расчёте.",
    ctaTitle: "Изготовим окна ET под вашу задачу.",
    ctaText:
      "Подберём оптимальную комплектацию и поможем с выбором цвета. Бесплатный замер в Калининграде и области.",
    compare: { width: "80 / 100", frame: "6", sash: "7", glass: "до 50", seals: "3", use: "Загородный дом, коттедж" },
  },
  {
    slug: "evolution",
    name: "Melke Evolution",
    badge: { text: "Хит линейки", tone: "pink" },
    category: "universal",
    short: "Надёжное решение с отличными характеристиками и современным дизайном.",
    width: "70 мм",
    chambers: "5 камер",
    chambersLabel: "Камеры в раме / створке",
    img: img("evolution"),
    heroImg: img("evolution-hero"),
    cutout: img("evolution-cutout"),
    heroCutout: img("evolution-hero-cutout"),
    heroTitle: "на профиле Melke Evolution",
    heroLead: "Комфорт на каждый день.",
    heroNote: "Универсальная система для квартиры и загородного дома.",
    stats: [
      { value: "70 мм", label: "Монтажная ширина" },
      { value: "5 камер", label: "В раме и створке" },
      { value: "Под ваш проект", label: "Цвет и комплектация" },
    ],
    sectionTitle: "Что важно в ваших окнах",
    sectionLead:
      "Профильная система Melke Evolution и качественные комплектующие обеспечивают комфортное использование окон ET каждый день.",
    features: [
      { title: "Профиль 70 мм", text: "Пятикамерная конструкция профиля.", img: img("evo-t1") },
      { title: "Стеклопакет под задачу", text: "Подберём с учётом расположения дома и ваших пожеланий.", img: img("evo-t2") },
      { title: "Удобное открывание", text: "Согласуем створки, ручки и фурнитуру.", img: img("evo-t3") },
    ],
    about: [
      "Пятикамерный профиль с толщиной внешних стенок 3 мм, уплотнитель из термоэластопласта и двухкамерный стеклопакет сохраняют тепло и тишину в помещении.",
      "Melke Evolution подходит как для квартир с центральным отоплением (с однокамерным стеклопакетом), так и для индивидуального жилищного строительства. Двухкамерный стеклопакет толщиной 40 мм зимой сохранит тепло, а летом защитит от жары.",
      "Технология Cool Colours сохраняет насыщенность цвета и прочность материала на долгие годы.",
    ],
    interiorTitle: "Для квартиры. Для дома. Для вас.",
    interiorText:
      "Окна ET на профиле Melke Evolution гармонично впишутся в любой интерьер. Обеспечат комфорт и тишину в городской квартире и загородном доме.",
    interiorImg: img("interior-light"),
    colors,
    colorsNote: "Доступность цвета уточняется при расчёте.",
    ctaTitle: "Изготовим окна ET под вашу задачу.",
    ctaText:
      "Подберём оптимальную комплектацию и поможем с выбором цвета. Бесплатный замер в Калининграде и области.",
    compare: { width: "70", frame: "5", sash: "5", glass: "до 40", seals: "—", use: "Квартира, частный дом" },
  },
  {
    slug: "smart-ultra",
    name: "Melke Smart Ultra",
    badge: { text: "Новая система", tone: "lime" },
    category: "compact",
    short: "Современная система с улучшенными характеристиками для новых проектов.",
    width: "65 мм",
    chambers: "4 камеры",
    chambersLabel: "Камеры в раме / створке",
    img: img("smart-ultra"),
    heroImg: img("smart-ultra-hero"),
    cutout: img("smart-ultra-cutout"),
    heroCutout: img("smart-ultra-hero-cutout"),
    heroTitle: "на профиле Melke Smart Ultra",
    heroLead: "Современная система для квартиры и загородного дома.",
    heroNote: "Изготавливаем окна ET из профиля Melke.",
    stats: [
      { value: "65 мм", label: "Монтажная ширина" },
      { value: "4 камеры", label: "В раме и створке" },
      { value: "28 / 36 мм", label: "Стеклопакет" },
    ],
    sectionTitle: "Продумано до деталей",
    sectionLead:
      "Современные решения и качественные комплектующие обеспечивают комфорт и надёжную работу окон ET на профиле Melke Smart Ultra на долгие годы.",
    features: [
      { title: "Профиль 65 мм", text: "Четырёхкамерная конструкция профиля.", img: img("smart-t1") },
      { title: "Выбор стеклопакета", text: "Согласуем комплектацию под условия вашего дома.", img: img("smart-t2") },
      { title: "Цвет под интерьер", text: "Покажем доступные варианты отделки.", img: img("smart-t3") },
    ],
    about: [],
    interiorTitle: "Ваш интерьер. Ваш характер.",
    interiorText:
      "Окна ET на профиле Melke Smart Ultra гармонично впишутся в любой архитектурный стиль. Выберите цвет, который подчеркнёт характер вашего дома.",
    interiorImg: img("interior-dark"),
    colors: [colors[0], colors[1], { ...colors[2], name: "Под дерево" }],
    colorsNote: "Доступность цвета уточняется при расчёте.",
    ctaTitle: "Изготовим окна ET под вашу задачу.",
    ctaText:
      "Подберём оптимальную комплектацию и поможем с выбором цвета. Бесплатный замер в Калининграде и области.",
    compare: { width: "65", frame: "4", sash: "4", glass: "28 / 36", seals: "—", use: "Новые проекты, квартира" },
  },
];
