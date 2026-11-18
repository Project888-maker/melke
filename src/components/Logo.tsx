export function Logo({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 96 44" className="h-9 w-auto shrink-0" aria-hidden="true">
        <defs>
          <linearGradient id="et-g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#3be6ff" />
            <stop offset="1" stopColor="#00b9dc" />
          </linearGradient>
        </defs>
        <g fill="url(#et-g)" transform="skewX(-14) translate(10 0)">
          <path d="M0 2h40l-2 9H12l-1.6 7H32l-2 8H8.6L7 33h27l-2 9H-9z" />
          <path d="M46 2h44l-2 9H74l-7 31H56l7-31H44z" />
        </g>
      </svg>
      <span className={`border-l pl-3 text-[11px] font-semibold uppercase leading-[1.15] tracking-[0.14em] ${dark ? "border-white/25 text-white" : "border-ink/20 text-ink"}`}>
        Европейские
        <br />
        технологии
      </span>
    </span>
  );
}
