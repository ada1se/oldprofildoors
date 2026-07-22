import type { OrderStatus } from "@/lib/types";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/types";

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors = ORDER_STATUS_COLORS[status];
  const label = ORDER_STATUS_LABELS[status];

  return (
    <span
      className="md3-badge"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {label}
    </span>
  );
}
