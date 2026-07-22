"use client";

import { Plus, Save, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useCalculatorStore } from "@/store/calculator-store";
import { RoomBlock } from "@/components/features/RoomBlock";
import { formatPrice } from "@/lib/mock-data";
import { getAllSeries, type SeriesOption } from "@/actions/catalog";

export default function CalculatorPage() {
  const {
    clientInfo,
    setClientInfo,
    rooms,
    addRoom,
    totalPrice,
  } = useCalculatorStore();

  // Load series list once on mount (shared across all room blocks)
  const [seriesList, setSeriesList] = useState<SeriesOption[]>([]);

  useEffect(() => {
    getAllSeries().then(setSeriesList);
  }, []);

  const hasRooms = rooms.length > 0;
  const isReadyToSave =
    clientInfo.name.trim() !== "" &&
    clientInfo.phone.trim() !== "" &&
    hasRooms &&
    rooms.every(
      (r) => r.seriesId && r.model && r.category && r.width && r.height
    );

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      {/* Left Column — Configuration */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Page Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 className="headline-large" style={{ marginBottom: 4 }}>
            Калькулятор
          </h1>
          <p
            className="body-large"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Расчёт стоимости дверных конструкций
          </p>
        </div>

        {/* Section 1: Client Information */}
        <div className="md3-card" style={{ marginBottom: 24 }}>
          <h2
            className="title-large"
            style={{ marginBottom: 20 }}
          >
            Данные клиента
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div>
              <label
                className="label-medium"
                style={{
                  display: "block",
                  marginBottom: 8,
                  color: "var(--color-on-surface-variant)",
                }}
              >
                Имя клиента *
              </label>
              <input
                className="md3-input"
                value={clientInfo.name}
                onChange={(e) => setClientInfo("name", e.target.value)}
                placeholder="Ахметов Серик"
              />
            </div>

            <div>
              <label
                className="label-medium"
                style={{
                  display: "block",
                  marginBottom: 8,
                  color: "var(--color-on-surface-variant)",
                }}
              >
                Телефон *
              </label>
              <input
                className="md3-input"
                value={clientInfo.phone}
                onChange={(e) => setClientInfo("phone", e.target.value)}
                placeholder="+7 701 234 5678"
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label
                className="label-medium"
                style={{
                  display: "block",
                  marginBottom: 8,
                  color: "var(--color-on-surface-variant)",
                }}
              >
                Адрес (необязательно)
              </label>
              <input
                className="md3-input"
                value={clientInfo.address}
                onChange={(e) => setClientInfo("address", e.target.value)}
                placeholder="г. Шымкент, ул. Тауке хана, д. 15"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Room Configuration Blocks */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h2 className="title-large">Помещения</h2>
            <button
              onClick={addRoom}
              className="md3-btn-tonal ripple-effect"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Plus size={20} />
              Создать помещение
            </button>
          </div>

          {/* Room blocks list */}
          {hasRooms ? (
            rooms.map((room, index) => (
              <RoomBlock
                key={room.id}
                room={room}
                index={index}
                seriesList={seriesList}
              />
            ))
          ) : (
            <div
              className="md3-card-outlined"
              style={{
                padding: "48px 24px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "var(--radius-full)",
                  backgroundColor: "var(--color-surface-container-highest)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <Plus
                  size={28}
                  style={{ color: "var(--color-on-surface-variant)" }}
                />
              </div>
              <p
                className="body-large"
                style={{
                  color: "var(--color-on-surface-variant)",
                  marginBottom: 16,
                }}
              >
                Нажмите «Создать помещение», чтобы начать расчёт
              </p>
              <button
                onClick={addRoom}
                className="md3-btn-filled ripple-effect"
              >
                <Plus size={18} />
                Создать помещение
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Column — Price Summary (Sticky) */}
      <div
        style={{
          width: 320,
          flexShrink: 0,
          position: "sticky",
          top: 24,
        }}
      >
        <div className="md3-card" style={{ padding: 24 }}>
          <h3
            className="title-large"
            style={{ marginBottom: 20 }}
          >
            Итого
          </h3>

          {/* Summary details */}
          <div
            style={{
              borderBottom: "1px solid var(--color-outline-variant)",
              paddingBottom: 16,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span
                className="body-medium"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Помещений
              </span>
              <span className="body-medium">{rooms.length}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span
                className="body-medium"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Дверей всего
              </span>
              <span className="body-medium">
                {rooms.reduce((sum, r) => sum + r.quantity, 0)}
              </span>
            </div>
          </div>

          {/* Total Price */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 24,
            }}
          >
            <span className="title-medium">Сумма</span>
            <span
              className="headline-medium"
              style={{
                fontWeight: 700,
                color: "var(--color-primary)",
              }}
            >
              {formatPrice(totalPrice)}
            </span>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <button
              className="md3-btn-filled ripple-effect"
              disabled={!isReadyToSave}
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "14px 24px",
              }}
            >
              <Save size={18} />
              Сохранить в заказы
            </button>

            <button
              className="md3-btn-outlined ripple-effect"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "14px 24px",
              }}
            >
              <FileText size={18} />
              Создать КП
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
