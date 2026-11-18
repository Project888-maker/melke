import Link from "next/link";
import { btn, BtnInner } from "@/components/Button";

export default function NotFound() {
  return (
    <section className="night grid min-h-[70dvh] place-items-center text-white">
      <div className="container-x py-20 text-center">
        <p className="h-display bg-linear-to-r from-[#0fd6f5] to-[#b7f4ff] bg-clip-text text-[120px] text-transparent sm:text-[180px]">404</p>
        <h1 className="h-display text-3xl sm:text-5xl">Страница не найдена</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-white/65">Возможно, она переехала. Начните с главной или каталога окон.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/ru" className={btn("primary", "lg")}><BtnInner>На главную</BtnInner></Link>
          <Link href="/ru/okna" className={btn("outline", "lg")}><BtnInner variant="outline">Окна ET</BtnInner></Link>
        </div>
      </div>
    </section>
  );
}
