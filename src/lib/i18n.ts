export const locales = ["ru", "en", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";
export const isLocale = (v: string): v is Locale =>
  (locales as readonly string[]).includes(v);

export const localeNames: Record<Locale, string> = {
  ru: "Русский",
  en: "English",
  de: "Deutsch",
};

/** Interface strings. Long-form page content lives in src/content. */
const ui = {
  ru: {
    brand: "Европейские технологии",
    region: "Калининград и область",
    nav: { solutions: "Решения", windows: "Окна ET", accessories: "Аксессуары", projects: "Наши работы", about: "О компании", news: "Новости", contacts: "Контакты" },
    home: "Главная",
    more: "Подробнее",
    compare: "Сравнить",
    inCompare: "В сравнении",
    all: "Все",
    openMenu: "Открыть меню",
    closeMenu: "Закрыть меню",
    language: "Язык",
    cta: { calc: "Рассчитать мой заказ", measure: "Записаться на замер", choose: "Помочь с выбором", discuss: "Обсудить остекление", office: "Приехать в офис", call: "Позвонить", viewCase: "Смотреть кейс", allProjects: "Все проекты", allSystems: "Все системы", route: "Построить маршрут", pick: "Подобрать решение" },
    form: {
      name: "Ваше имя", phone: "Телефон", message: "Комментарий", messagePh: "Расскажите об объекте: сколько окон, сроки, пожелания",
      object: "Что остекляем", system: "Система", count: "Количество окон", any: "Пока не знаю",
      consent: "Соглашаюсь на обработку персональных данных", policy: "Политика конфиденциальности",
      send: "Отправить заявку", sending: "Отправляем…", okTitle: "Заявка принята", okText: "Перезвоним в рабочее время: пн–пт, 9:00–17:00.",
      errName: "Укажите имя", errPhone: "Укажите телефон полностью", errConsent: "Нужно согласие на обработку данных", errSend: "Не получилось отправить. Позвоните нам: +7 (4012) 98-70-08", close: "Закрыть",
      titles: { calc: "Расчёт заказа", measure: "Запись на замер", consult: "Консультация", office: "Визит в офис" },
      leads: { calc: "Подготовим расчёт под ваш проект и перезвоним.", measure: "Бесплатный замер в Калининграде и области.", consult: "Ответим на вопросы и поможем с выбором.", office: "Покажем образцы и подберём оптимальный вариант." },
    },
    footer: { rights: "Информация на сайте не является публичной офертой.", office: "Офис", factory: "Производство", hours: "пн–пт, 9:00–17:00", factoryHours: "пн–пт, 8:00–17:00" },
    draft: { online: "Драфт на связи", ask: "Есть вопрос?", title: "Драфт", subtitle: "Герой ET. На стороне вашего комфорта.", placeholder: "Напишите вопрос…", send: "Отправить", restart: "Начать заново", speak: "Говорить с Драфтом", speakShort: "Говорить", end: "Завершить разговор", mute: "Выключить микрофон", unmute: "Включить микрофон", connecting: "Соединяю…", listening: "Слушаю вас", thinking: "Думаю…", speaking: "Драфт говорит", micDenied: "Нет доступа к микрофону. Разрешите его в браузере и попробуйте ещё раз.", voiceDown: "Голосовая связь сейчас недоступна. Напишите мне, я отвечу в чате.", opened: "Открыл страницу", formOpened: "Открыл форму заявки", manager: "Связаться с менеджером", expand: "Развернуть чат", minimize: "Свернуть чат", voiceNote: "Разговор с ИИ-помощником. Микрофон включён только во время разговора." },
    notFound: { title: "Страница не найдена", text: "Возможно, она переехала. Начните с главной или каталога окон.", home: "На главную" },
    photo: "Фото проекта",
    year: "Год",
  },
  en: {
    brand: "European Technologies",
    region: "Kaliningrad and region",
    nav: { solutions: "Solutions", windows: "ET Windows", accessories: "Accessories", projects: "Our work", about: "About", news: "News", contacts: "Contacts" },
    home: "Home",
    more: "Learn more",
    compare: "Compare",
    inCompare: "In comparison",
    all: "All",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
    cta: { calc: "Get a quote", measure: "Book a measurement", choose: "Help me choose", discuss: "Discuss glazing", office: "Visit the office", call: "Call", viewCase: "View case", allProjects: "All projects", allSystems: "All systems", route: "Get directions", pick: "Find a solution" },
    form: {
      name: "Your name", phone: "Phone", message: "Comment", messagePh: "Tell us about the property: number of windows, timing, wishes",
      object: "What are we glazing", system: "System", count: "Number of windows", any: "Not sure yet",
      consent: "I agree to the processing of personal data", policy: "Privacy policy",
      send: "Send request", sending: "Sending…", okTitle: "Request received", okText: "We will call you back during working hours: Mon–Fri, 9:00–17:00.",
      errName: "Please enter your name", errPhone: "Please enter a full phone number", errConsent: "Consent is required", errSend: "Could not send. Please call us: +7 (4012) 98-70-08", close: "Close",
      titles: { calc: "Quote request", measure: "Book a measurement", consult: "Consultation", office: "Office visit" },
      leads: { calc: "We will prepare a quote for your project and call you back.", measure: "Free measurement in Kaliningrad and the region.", consult: "We will answer your questions and help you choose.", office: "We will show samples and find the best option." },
    },
    footer: { rights: "Information on this website is not a public offer.", office: "Office", factory: "Production", hours: "Mon–Fri, 9:00–17:00", factoryHours: "Mon–Fri, 8:00–17:00" },
    draft: { online: "Draft is online", ask: "Have a question?", title: "Draft", subtitle: "The ET hero. On the side of your comfort.", placeholder: "Type your question…", send: "Send", restart: "Start over", speak: "Talk to Draft", speakShort: "Speak", end: "End the call", mute: "Mute microphone", unmute: "Unmute microphone", connecting: "Connecting…", listening: "Listening", thinking: "Thinking…", speaking: "Draft is speaking", micDenied: "No access to the microphone. Allow it in your browser and try again.", voiceDown: "Voice is not available right now. Type your question and I will answer in the chat.", opened: "Opened the page", formOpened: "Opened the request form", manager: "Contact a manager", expand: "Expand chat", minimize: "Minimise chat", voiceNote: "You are talking to an AI assistant. The microphone is on only during the call." },
    notFound: { title: "Page not found", text: "It may have moved. Start from the home page or the window catalogue.", home: "Back to home" },
    photo: "Project photo",
    year: "Year",
  },
  de: {
    brand: "Europäische Technologien",
    region: "Kaliningrad und Region",
    nav: { solutions: "Lösungen", windows: "ET Fenster", accessories: "Zubehör", projects: "Referenzen", about: "Über uns", news: "Neuigkeiten", contacts: "Kontakt" },
    home: "Startseite",
    more: "Mehr erfahren",
    compare: "Vergleichen",
    inCompare: "Im Vergleich",
    all: "Alle",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    language: "Sprache",
    cta: { calc: "Angebot anfordern", measure: "Aufmaß vereinbaren", choose: "Bei der Auswahl helfen", discuss: "Verglasung besprechen", office: "Büro besuchen", call: "Anrufen", viewCase: "Projekt ansehen", allProjects: "Alle Projekte", allSystems: "Alle Systeme", route: "Route planen", pick: "Lösung finden" },
    form: {
      name: "Ihr Name", phone: "Telefon", message: "Kommentar", messagePh: "Erzählen Sie vom Objekt: Anzahl der Fenster, Termine, Wünsche",
      object: "Was wird verglast", system: "System", count: "Anzahl der Fenster", any: "Weiß ich noch nicht",
      consent: "Ich stimme der Verarbeitung personenbezogener Daten zu", policy: "Datenschutzerklärung",
      send: "Anfrage senden", sending: "Wird gesendet…", okTitle: "Anfrage erhalten", okText: "Wir rufen Sie während der Geschäftszeiten zurück: Mo–Fr, 9:00–17:00.",
      errName: "Bitte Namen angeben", errPhone: "Bitte vollständige Telefonnummer angeben", errConsent: "Einwilligung erforderlich", errSend: "Senden fehlgeschlagen. Bitte rufen Sie uns an: +7 (4012) 98-70-08", close: "Schließen",
      titles: { calc: "Angebotsanfrage", measure: "Aufmaß vereinbaren", consult: "Beratung", office: "Besuch im Büro" },
      leads: { calc: "Wir erstellen ein Angebot für Ihr Projekt und rufen zurück.", measure: "Kostenloses Aufmaß in Kaliningrad und der Region.", consult: "Wir beantworten Ihre Fragen und helfen bei der Auswahl.", office: "Wir zeigen Muster und finden die beste Lösung." },
    },
    footer: { rights: "Die Angaben auf dieser Website sind kein öffentliches Angebot.", office: "Büro", factory: "Produktion", hours: "Mo–Fr, 9:00–17:00", factoryHours: "Mo–Fr, 8:00–17:00" },
    draft: { online: "Draft ist online", ask: "Haben Sie eine Frage?", title: "Draft", subtitle: "Der ET-Held. Auf der Seite Ihres Komforts.", placeholder: "Frage eingeben…", send: "Senden", restart: "Neu beginnen", speak: "Mit Draft sprechen", speakShort: "Sprechen", end: "Gespräch beenden", mute: "Mikrofon ausschalten", unmute: "Mikrofon einschalten", connecting: "Verbinde…", listening: "Ich höre zu", thinking: "Ich überlege…", speaking: "Draft spricht", micDenied: "Kein Zugriff auf das Mikrofon. Bitte im Browser erlauben und erneut versuchen.", voiceDown: "Die Sprachverbindung ist gerade nicht verfügbar. Schreiben Sie mir, ich antworte im Chat.", opened: "Seite geöffnet", formOpened: "Anfrageformular geöffnet", manager: "Berater kontaktieren", expand: "Chat öffnen", minimize: "Chat verkleinern", voiceNote: "Sie sprechen mit einem KI-Assistenten. Das Mikrofon ist nur während des Gesprächs aktiv." },
    notFound: { title: "Seite nicht gefunden", text: "Vielleicht ist sie umgezogen. Beginnen Sie auf der Startseite oder im Fensterkatalog.", home: "Zur Startseite" },
    photo: "Projektfoto",
    year: "Jahr",
  },
} as const;

export type UI = (typeof ui)["ru"];
export const getUI = (lang: Locale): UI => ui[lang] as unknown as UI;

export const company = {
  phone: "+7 (4012) 98-70-08",
  phoneHref: "tel:+74012987008",
  phones: [
    { label: "+7 (4012) 98-70-08", href: "tel:+74012987008" },
    { label: "+7 (911) 499-69-62", href: "tel:+79114996962" },
    { label: "+7 (906) 214-98-81", href: "tel:+79062149881" },
  ],
  email: "eurotexno@mail.ru",
  telegram: "https://t.me/eurotexnogrup",
  officeMap: "https://yandex.ru/maps/-/CHg9zB3c",
  factoryMap: "https://yandex.ru/maps/-/CHWCm8ZU",
  officeCoords: [54.708965, 20.552485] as const,
  factoryCoords: [54.688508, 20.526028] as const,
  inn: "3906253655",
  ogrn: "1113926045474",
};
