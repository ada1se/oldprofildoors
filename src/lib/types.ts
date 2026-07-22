/* ===================================================================
   Shared TypeScript Types — ProfilDoors System
   =================================================================== */

/** Order status values matching Prisma enum */
export const ORDER_STATUSES = [
  "NEW",
  "MEASUREMENT_DONE",
  "QUOTE_SENT",
  "PENDING_DECISION",
  "CONFIRMED",
  "PRODUCTION",
  "DELIVERY",
  "INSTALLATION",
  "COMPLETED",
  "CANCELED",
  "ARCHIVED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Human-readable labels for statuses (Russian) */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: "Новый",
  MEASUREMENT_DONE: "Замер выполнен",
  QUOTE_SENT: "КП отправлено",
  PENDING_DECISION: "Ожидает решения",
  CONFIRMED: "Подтверждён",
  PRODUCTION: "Производство",
  DELIVERY: "Доставка",
  INSTALLATION: "Монтаж",
  COMPLETED: "Завершён",
  CANCELED: "Отменён",
  ARCHIVED: "Архив",
};

/** Status badge color mapping */
export const ORDER_STATUS_COLORS: Record<
  OrderStatus,
  { bg: string; text: string }
> = {
  NEW: { bg: "var(--color-status-new-bg)", text: "var(--color-status-new)" },
  MEASUREMENT_DONE: {
    bg: "var(--color-status-progress-bg)",
    text: "var(--color-status-progress)",
  },
  QUOTE_SENT: {
    bg: "var(--color-status-pending-bg)",
    text: "var(--color-status-pending)",
  },
  PENDING_DECISION: {
    bg: "var(--color-status-pending-bg)",
    text: "var(--color-status-pending)",
  },
  CONFIRMED: {
    bg: "var(--color-status-progress-bg)",
    text: "var(--color-status-progress)",
  },
  PRODUCTION: {
    bg: "var(--color-status-progress-bg)",
    text: "var(--color-status-progress)",
  },
  DELIVERY: {
    bg: "var(--color-status-progress-bg)",
    text: "var(--color-status-progress)",
  },
  INSTALLATION: {
    bg: "var(--color-status-progress-bg)",
    text: "var(--color-status-progress)",
  },
  COMPLETED: {
    bg: "var(--color-status-completed-bg)",
    text: "var(--color-status-completed)",
  },
  CANCELED: {
    bg: "var(--color-status-canceled-bg)",
    text: "var(--color-status-canceled)",
  },
  ARCHIVED: {
    bg: "var(--color-surface-container-highest)",
    text: "var(--color-on-surface-variant)",
  },
};

/** Navigation Rail item definition */
export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

/** Dashboard stat card */
export interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  trend?: string;
  color: "primary" | "secondary" | "tertiary" | "error";
}

/** Mock order for dashboard table */
export interface MockOrder {
  id: string;
  clientName: string;
  phone: string;
  status: OrderStatus;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
}

/* ===================================================================
   Calculator Types
   =================================================================== */

/** Available door widths (mm) — chips only, no manual input */
export const AVAILABLE_WIDTHS = [400, 600, 700, 800, 900, 1000] as const;

/** Available door heights (mm) — chips only, no manual input */
export const AVAILABLE_HEIGHTS = [2000, 2100, 2400] as const;

export type DoorWidth = (typeof AVAILABLE_WIDTHS)[number];
export type DoorHeight = (typeof AVAILABLE_HEIGHTS)[number];

/** Client info for the calculator form */
export interface ClientInfo {
  name: string;
  phone: string;
  address: string;
}

/** A single room configuration block in the calculator */
export interface RoomConfig {
  id: string;
  roomName: string;
  quantity: number;
  model: string;
  series: string;
  category: string;
  width: DoorWidth | null;
  height: DoorHeight | null;
  baseColor: string;
  edgeProfileColor: string;
  glassType: string;
  openingSystem: string;
  frameSystem: string;
  hasFalsePanel: boolean;
  hasTransom: boolean;
  calculatedPrice: number;
}

/** AI Visualizer render constraints (future-proofing) */
export interface VisualizerConfig {
  background: "white-wall";
  flooring: "wood-parquet";
  showFurniture: false;
  doorFinish: string;
}
