import type { Metadata } from "next";
import { NavigationRail } from "@/components/ui/NavigationRail";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProfilDoors — Система управления заказами",
  description:
    "Внутренняя CRM-система автоматизации продаж и расчёта стоимости дверей ProfilDoors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          {/* Navigation Rail — fixed left sidebar */}
          <NavigationRail />

          {/* Main content area — offset by rail width */}
          <main
            style={{
              marginLeft: 80,
              flex: 1,
              padding: "24px 32px",
              maxWidth: "calc(100vw - 80px)",
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
