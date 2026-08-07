export function Logo({ subtitle = true }: { subtitle?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex size-10 items-center justify-center">
        <svg viewBox="0 0 100 100" className="size-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer circle arc (Teal) */}
          <path d="M 22,65 A 38,38 0 1,1 78,65" stroke="#15A6A6" strokeWidth="5" strokeLinecap="round" />
          {/* Left part of M (Dark Blue) */}
          <path d="M 28,68 C 28,68 28,35 28,35 L 50,48" stroke="#0E3860" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          {/* Right part of M (Teal) */}
          <path d="M 72,68 C 72,68 72,35 72,35 L 50,48" stroke="#15A6A6" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          {/* The plus sign (Teal) */}
          <path d="M 50,60 V 76 M 42,68 H 58" stroke="#15A6A6" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </span>
      <span className="leading-tight flex flex-col justify-center">
        <span className="block text-[22px] font-bold tracking-tight">
          <span className="text-[#0E3860] dark:text-blue-100">Med</span><span className="text-[#15A6A6] dark:text-teal-400">Doc</span>
        </span>
        {subtitle ? (
          <span className="block text-[8px] font-bold tracking-widest text-muted-foreground uppercase mt-[-1px]">
            Early detection. Better tomorrows.
          </span>
        ) : null}
      </span>
    </span>
  );
}
