"use client";

import {
  Package,
  Hammer,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Plus } from "lucide-react";
import { FAB } from "@/components/ui/FAB";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { dashboardStats, recentOrders, formatPrice } from "@/lib/mock-data";
import type { OrderStatus } from "@/lib/types";

const iconMap: Record<string, React.ReactNode> = {
  package: <Package size={28} />,
  hammer: <Hammer size={28} />,
  clock: <Clock size={28} />,
  "trending-up": <TrendingUp size={28} />,
};

const cardColorMap: Record<string, { bg: string; icon: string }> = {
  primary: {
    bg: "var(--color-primary-container)",
    icon: "var(--color-on-primary-container)",
  },
  secondary: {
    bg: "var(--color-secondary-container)",
    icon: "var(--color-on-secondary-container)",
  },
  tertiary: {
    bg: "var(--color-tertiary-container)",
    icon: "var(--color-on-tertiary-container)",
  },
  error: {
    bg: "var(--color-error-container)",
    icon: "var(--color-on-error-container)",
  },
};

export default function DashboardPage() {
  return (
    <div>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <div>
          <h1 className="headline-large" style={{ marginBottom: 4 }}>
            Панель управления
          </h1>
          <p
            className="body-large"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Обзор текущих заказов и статистики
          </p>
        </div>
        <FAB label="Новый расчёт" href="/calculator" icon={Plus} />
      </div>

      {/* Statistics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {dashboardStats.map((stat) => {
          const colors = cardColorMap[stat.color];

          return (
            <div key={stat.label} className="md3-card" style={{ padding: 24 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "var(--radius-lg)",
                    backgroundColor: colors.bg,
                    color: colors.icon,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {iconMap[stat.icon]}
                </div>
              </div>
              <p
                className="body-medium"
                style={{
                  color: "var(--color-on-surface-variant)",
                  marginBottom: 4,
                }}
              >
                {stat.label}
              </p>
              <p className="headline-medium" style={{ fontWeight: 600 }}>
                {stat.value}
              </p>
              {stat.trend && (
                <p
                  className="body-small"
                  style={{
                    color: "var(--color-on-surface-variant)",
                    marginTop: 8,
                  }}
                >
                  {stat.trend}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Orders Table */}
      <div className="md3-card" style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--color-outline-variant)",
          }}
        >
          <h2 className="title-large">Последние заказы</h2>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--color-outline-variant)",
                }}
              >
                {["Номер", "Клиент", "Телефон", "Статус", "Позиций", "Сумма", "Дата"].map(
                  (header) => (
                    <th
                      key={header}
                      className="label-large"
                      style={{
                        padding: "14px 24px",
                        textAlign: "left",
                        color: "var(--color-on-surface-variant)",
                        fontWeight: 500,
                      }}
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="ripple-effect"
                  style={{
                    borderBottom: "1px solid var(--color-outline-variant)",
                    cursor: "pointer",
                    transition: "background-color 150ms ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                      "var(--color-surface-container)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                      "transparent";
                  }}
                >
                  <td
                    className="body-medium"
                    style={{
                      padding: "16px 24px",
                      fontWeight: 500,
                      color: "var(--color-primary)",
                    }}
                  >
                    {order.id}
                  </td>
                  <td className="body-medium" style={{ padding: "16px 24px" }}>
                    {order.clientName}
                  </td>
                  <td
                    className="body-medium"
                    style={{
                      padding: "16px 24px",
                      color: "var(--color-on-surface-variant)",
                    }}
                  >
                    {order.phone}
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <StatusBadge status={order.status as OrderStatus} />
                  </td>
                  <td
                    className="body-medium"
                    style={{
                      padding: "16px 24px",
                      textAlign: "center",
                    }}
                  >
                    {order.itemCount}
                  </td>
                  <td
                    className="body-medium"
                    style={{
                      padding: "16px 24px",
                      fontWeight: 500,
                    }}
                  >
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td
                    className="body-medium"
                    style={{
                      padding: "16px 24px",
                      color: "var(--color-on-surface-variant)",
                    }}
                  >
                    {order.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
