import { NextResponse } from "next/server";
import { company } from "@/lib/i18n";

/**
 * Draft's answers to free-text questions. Until the language model is connected
 * (step 4 of the plan), questions are matched against a small knowledge base
 * built from the company's own content.
 */
const kb: { test: RegExp; answer: string; links?: { label: string; path: string }[] }[] = [
  { test: /(адрес|где вы|офис|находит|приех|карт|address|adresse|where)/i, answer: "Офис: Калининград, Московский проспект 186/1, оф. 304. Работаем с понедельника по пятницу, с 9:00 до 17:00. Производство: Аллея Смелых 31Л.", links: [{ label: "Контакты и карта", path: "kontakty" }] },
  { test: /(телефон|позвон|номер|связат|phone|telefon)/i, answer: `Звоните: ${company.phone}. Ещё номера: +7 (911) 499-69-62 и +7 (906) 214-98-81. Почта: ${company.email}.`, links: [{ label: "Контакты", path: "kontakty" }] },
  { test: /(час|время работ|график|режим|выходн|hours|öffnungs)/i, answer: "Офис работает с понедельника по пятницу, с 9:00 до 17:00. Производство — с 8:00 до 17:00." },
  { test: /(цен|стоим|сколько стоит|прайс|расч[её]т|price|preis|cost)/i, answer: "Стоимость зависит от размеров, профиля, стеклопакета и фурнитуры, поэтому точную цену даёт расчёт. Оставьте заявку, и менеджер подготовит его под ваш проект." },
  { test: /(замер|measure|aufma)/i, answer: "Замер бесплатный, в Калининграде и области. Мастер приедет, снимет размеры и уточнит детали. Запишу вас?" },
  { test: /(centum|центум|т[её]пл|мороз|холод|энерго|warm)/i, answer: "Самая тёплая система — Melke Centum: шестикамерная рама 80 мм, семикамерная створка 100 мм, три контура уплотнения и стеклопакет до 50 мм. Лучший выбор для загородного дома.", links: [{ label: "Melke Centum", path: "okna/centum" }] },
  { test: /(evolution|эволюшн|эволюци|квартир|универсал)/i, answer: "Для квартиры и дома чаще всего выбирают Melke Evolution: пятикамерный профиль 70 мм со стенкой 3 мм и стеклопакетом до 40 мм.", links: [{ label: "Melke Evolution", path: "okna/evolution" }] },
  { test: /(smart|смарт|ultra|ультра)/i, answer: "Melke Smart Ultra — новая система: профиль 65 мм, 4 камеры, стеклопакет 28 или 36 мм.", links: [{ label: "Melke Smart Ultra", path: "okna/smart-ultra" }] },
  { test: /(сравн|разниц|отлича|чем лучше|compare|vergleich)/i, answer: "Centum — максимум тепла (80/100 мм, 6/7 камер). Evolution — универсальная (70 мм, 5 камер). Smart Ultra — компактная новинка (65 мм, 4 камеры). В каталоге есть таблица сравнения.", links: [{ label: "Сравнить системы", path: "okna#compare" }] },
  { test: /(балкон|лоджи)/i, answer: "Остекляем балконы и лоджии: тёплое остекление металлопластиковыми рамами и холодное — алюминиевой раздвижной системой Provedal.", links: [{ label: "Балконы и лоджии", path: "resheniya/balkony-i-lodzhii" }] },
  { test: /(террас|бесед|веранд|алюмин|hst|раздвиж|портал|панорам)/i, answer: "Для террас и панорамных проёмов делаем подъёмно-раздвижные двери HST (до 6,5 м в ширину) и алюминиевые системы Alumark и Provedal.", links: [{ label: "Двери HST", path: "resheniya/dveri-hst" }, { label: "Алюминиевое остекление", path: "resheniya/alyuminievoe-osteklenie" }] },
  { test: /(москит|сетк|комар|net)/i, answer: "Делаем рамочные, рулонные, плиссе и дверные москитные сетки на окна любых производителей. Обычно сетка готова на следующий день после замера.", links: [{ label: "Москитные сетки", path: "aksessuary/moskitnye-setki" }] },
  { test: /(подоконн|отлив|откос|сэндвич|стеклопакет)/i, answer: "Комплектуем окна подоконниками, отливами, откосами из сэндвич-панелей и стеклопакетами под задачу.", links: [{ label: "Аксессуары", path: "aksessuary" }] },
  { test: /(дет|ребен|ребён|безопасн|замок)/i, answer: "Для детской безопасности ставим ручки с ключом, детские замки и защитное остекление. Важно: москитная сетка от выпадения не защищает.", links: [{ label: "Безопасность", path: "aksessuary#safety" }] },
  { test: /(цвет|ламин|антрацит|дерев|cool colou?rs)/i, answer: "Доступны белый, антрацит и отделка под дерево. Покрытие Melke Cool Colours сохраняет насыщенность цвета и устойчиво к нагреву. Доступность цвета уточняется при расчёте." },
  { test: /(гарант|срок служб|долговеч)/i, answer: "По испытаниям РОСТЕСТ характеристики пластикового профиля не меняются на протяжении 40 условных лет эксплуатации. Условия гарантии на конкретный заказ уточнит менеджер." },
  { test: /(о компани|кто вы|давно|производств|опыт)/i, answer: "«Европейские технологии» — производитель оконных систем из ПВХ и алюминия в Калининграде. Работаем с 2008 года, собственное производство с 2011 года.", links: [{ label: "О компании", path: "o-kompanii" }] },
];

export async function POST(request: Request) {
  let question = "";
  try {
    question = String((await request.json()).question ?? "").slice(0, 500);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const hit = kb.find((k) => k.test.test(question));
  if (hit) return NextResponse.json({ ok: true, answer: hit.answer, links: hit.links ?? [], matched: true });
  return NextResponse.json({ ok: true, matched: false, answer: "", links: [{ label: "Каталог окон", path: "okna" }, { label: "Контакты", path: "kontakty" }] });
}
