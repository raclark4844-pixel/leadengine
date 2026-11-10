export default function BrandMark({ compact = false }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0" aria-hidden="true">
        <ellipse
          cx="16"
          cy="16"
          rx="14"
          ry="6.4"
          fill="none"
          stroke="hsl(var(--volt))"
          strokeOpacity="0.6"
          strokeWidth="1.25"
          transform="rotate(-28 16 16)"
        />
        <ellipse
          cx="16"
          cy="16"
          rx="13"
          ry="5.4"
          fill="none"
          stroke="hsl(var(--hot))"
          strokeOpacity="0.55"
          strokeWidth="1"
          transform="rotate(40 16 16)"
        />
        <circle cx="16" cy="16" r="4.4" fill="hsl(var(--volt))" />
      </svg>
      <span className="leading-none">
        <span className="block font-display text-[15px] font-extrabold uppercase tracking-[0.16em] text-foreground">
          Demore
        </span>
        {!compact && (
          <span className="mt-1 block text-[9px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Technology Solutions
          </span>
        )}
      </span>
    </span>
  );
}