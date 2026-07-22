"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calculator,
  ClipboardList,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Главная", href: "/", icon: LayoutDashboard },
  { label: "Расчёт", href: "/calculator", icon: Calculator },
  { label: "Заказы", href: "/orders", icon: ClipboardList },
  { label: "Настройки", href: "/settings", icon: Settings },
];

export function NavigationRail() {
  const pathname = usePathname();

  return (
    <nav className="nav-rail">
      {/* Logo / Brand Mark */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "var(--radius-lg)",
          background: "var(--color-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-on-primary)",
          fontWeight: 700,
          fontSize: 18,
          marginBottom: 20,
          flexShrink: 0,
        }}
      >
        PD
      </div>

      {/* Navigation Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="nav-rail-item ripple-effect"
              data-active={isActive}
            >
              <div className="nav-rail-indicator">
                <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
              </div>
              <span className="nav-rail-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
