export function LogoSvg({ className }: { className?: string }) {
  return (
    <svg
      width="180"
      height="40"
      viewBox="0 0 180 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        x="0"
        y="30"
        fill="currentColor"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="28"
        fontWeight="700"
        letterSpacing="-0.5"
      >
        Store404
      </text>
    </svg>
  );
}
