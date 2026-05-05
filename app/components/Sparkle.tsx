type Props = { size?: number; className?: string };

export function Sparkle({ size = 24, className }: Props) {
  return (
    <svg
      data-testid="sparkle"
      role="presentation"
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ color: "var(--color-dourado)" }}
      className={className}
    >
      <path d="M12 0 L13.5 9 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 9 Z" />
    </svg>
  );
}
