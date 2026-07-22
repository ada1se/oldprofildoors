import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface FABProps {
  label: string;
  href?: string;
  onClick?: () => void;
  icon: LucideIcon;
  variant?: "primary" | "secondary" | "tertiary";
}

const variantStyles: Record<
  string,
  { bg: string; color: string }
> = {
  primary: {
    bg: "var(--color-primary-container)",
    color: "var(--color-on-primary-container)",
  },
  secondary: {
    bg: "var(--color-secondary-container)",
    color: "var(--color-on-secondary-container)",
  },
  tertiary: {
    bg: "var(--color-tertiary-container)",
    color: "var(--color-on-tertiary-container)",
  },
};

export function FAB({
  label,
  href,
  onClick,
  icon: Icon,
  variant = "primary",
}: FABProps) {
  const style = variantStyles[variant];

  const content = (
    <>
      <Icon size={24} />
      <span>{label}</span>
    </>
  );

  const className = "md3-fab md3-fab-extended ripple-effect";

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        style={{
          backgroundColor: style.bg,
          color: style.color,
          textDecoration: "none",
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={className}
      style={{
        backgroundColor: style.bg,
        color: style.color,
      }}
    >
      {content}
    </button>
  );
}
