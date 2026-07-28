interface LogoProps {
  size?: number;
  className?: string;
}

// Two stacked "application card" squares (your applications, tracked) with a
// checkmark badge (progress toward an offer). Monochrome mark - the cards
// use currentColor so they invert with the theme automatically; the badge
// is the one deliberate accent, reusing the "offer" status color so it
// reads as "this is where applications are headed."
export function LogoMark({ size = 28, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="8" y="3" width="19" height="19" rx="5" className="fill-foreground/15" />
      <rect x="3" y="9" width="19" height="19" rx="5" className="fill-foreground" />
      <circle cx="24" cy="25" r="7.5" className="fill-background" />
      <circle cx="24" cy="25" r="6" className="fill-status-offer" />
      <path
        d="M21.2 25 L23.3 27.1 L27 22.6"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function Logo({ size = 28, className = "" }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <LogoMark size={size} className={className} />
      <span className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
        AppEasy
      </span>
    </div>
  );
}
