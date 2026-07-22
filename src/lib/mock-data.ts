import type { StatCard, MockOrder } from "./types";

/** Dashboard statistics cards */
export const dashboardStats: StatCard[] = [
  {
    label: "Всего заказов",
    value: 148,
    icon: "package",
    trend: "+12 за месяц",
    color: "primary",
  },
  {
    label: "В работе",
    value: 23,
    icon: "hammer",
    trend: "5 на производстве",
    color: "secondary",
  },
  {
    label: "Ожидают решения",
    value: 8,
    icon: "clock",
    trend: "3 дня среднее",
    color: "tertiary",
  },
  {
    label: "Выручка за месяц",
    value: "4 250 000 ₸",
    icon: "trending-up",
    trend: "+18% к прошлому",
    color: "primary",
  },
];

/** Recent orders for dashboard table */
export const recentOrders: MockOrder[] = [
  {
    id: "ORD-2024-001",
    clientName: "Ахметов Серик",
    phone: "+7 701 234 5678",
    status: "NEW",
    totalAmount: 385000,
    itemCount: 3,
    createdAt: "2024-12-15",
  },
  {
    id: "ORD-2024-002",
    clientName: "Касымова Айгуль",
    phone: "+7 702 345 6789",
    status: "MEASUREMENT_DONE",
    totalAmount: 720000,
    itemCount: 5,
    createdAt: "2024-12-14",
  },
  {
    id: "ORD-2024-003",
    clientName: "Нурланов Бауыржан",
    phone: "+7 707 456 7890",
    status: "QUOTE_SENT",
    totalAmount: 1250000,
    itemCount: 8,
    createdAt: "2024-12-13",
  },
  {
    id: "ORD-2024-004",
    clientName: "Темирбекова Дана",
    phone: "+7 705 567 8901",
    status: "CONFIRMED",
    totalAmount: 450000,
    itemCount: 2,
    createdAt: "2024-12-12",
  },
  {
    id: "ORD-2024-005",
    clientName: "Сулейменов Арман",
    phone: "+7 700 678 9012",
    status: "PRODUCTION",
    totalAmount: 890000,
    itemCount: 6,
    createdAt: "2024-12-11",
  },
  {
    id: "ORD-2024-006",
    clientName: "Жанибекова Мадина",
    phone: "+7 708 789 0123",
    status: "PENDING_DECISION",
    totalAmount: 295000,
    itemCount: 2,
    createdAt: "2024-12-10",
  },
  {
    id: "ORD-2024-007",
    clientName: "Оспанов Кайрат",
    phone: "+7 747 890 1234",
    status: "COMPLETED",
    totalAmount: 1540000,
    itemCount: 10,
    createdAt: "2024-12-08",
  },
  {
    id: "ORD-2024-008",
    clientName: "Мустафина Алия",
    phone: "+7 701 901 2345",
    status: "CANCELED",
    totalAmount: 180000,
    itemCount: 1,
    createdAt: "2024-12-07",
  },
];

/** Format price with Kazakh tenge symbol */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("ru-KZ", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(amount) + " ₸";
}
