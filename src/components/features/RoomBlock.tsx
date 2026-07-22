"use client";

import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useCalculatorStore } from "@/store/calculator-store";
import {
  AVAILABLE_WIDTHS,
  AVAILABLE_HEIGHTS,
  type RoomConfig,
} from "@/lib/types";

interface RoomBlockProps {
  room: RoomConfig;
  index: number;
}

/** Temporary model options for MVP skeleton */
const MODEL_OPTIONS = [
  { value: "1 PE.O", label: "1 PE.O" },
  { value: "2 PE.O", label: "2 PE.O" },
  { value: "1.1 P.O", label: "1.1 P.O" },
  { value: "2.1 P.O", label: "2.1 P.O" },
  { value: "1.1.1 PD", label: "1.1.1 PD" },
  { value: "2.1.1 PD", label: "2.1.1 PD" },
];

const CATEGORY_OPTIONS = [
  { value: "1", label: "Категория 1 (база)" },
  { value: "2", label: "Категория 2" },
  { value: "3", label: "Категория 3" },
];

export function RoomBlock({ room, index }: RoomBlockProps) {
  const { updateRoom, removeRoom, setRoomDimensions } = useCalculatorStore();
  const [isExpanded, setIsExpanded] = useState(true);

  /** Which step is currently active (sequential reveal) */
  const currentStep = !room.model
    ? 1
    : !room.category
      ? 2
      : !room.width || !room.height
        ? 3
        : 4;

  return (
    <div
      className="md3-card-outlined"
      style={{
        marginBottom: 16,
        padding: 0,
        overflow: "hidden",
        transition: "all 300ms ease",
      }}
    >
      {/* Room Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          backgroundColor: "var(--color-surface-container)",
          cursor: "pointer",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-full)",
              backgroundColor: "var(--color-primary)",
              color: "var(--color-on-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            {index + 1}
          </div>
          <div>
            <p className="title-medium">{room.roomName}</p>
            {room.model && (
              <p
                className="body-small"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                {room.model}
                {room.width && room.height
                  ? ` · ${room.width}×${room.height} мм`
                  : ""}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {room.calculatedPrice > 0 && (
            <span
              className="label-large"
              style={{ color: "var(--color-primary)" }}
            >
              {new Intl.NumberFormat("ru-KZ").format(room.calculatedPrice)} ₸
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeRoom(room.id);
            }}
            className="ripple-effect"
            style={{
              width: 40,
              height: 40,
              borderRadius: "var(--radius-full)",
              border: "none",
              backgroundColor: "transparent",
              color: "var(--color-error)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Удалить помещение"
          >
            <Trash2 size={20} />
          </button>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div style={{ padding: 24 }}>
          {/* Room Name Input */}
          <div style={{ marginBottom: 24 }}>
            <label
              className="label-medium"
              style={{
                display: "block",
                marginBottom: 8,
                color: "var(--color-on-surface-variant)",
              }}
            >
              Название помещения
            </label>
            <input
              className="md3-input"
              value={room.roomName}
              onChange={(e) =>
                updateRoom(room.id, { roomName: e.target.value })
              }
              placeholder="Например: Гостиная, Спальня..."
            />
          </div>

          {/* Step 1: Select Model */}
          <div style={{ marginBottom: 24 }}>
            <label
              className="label-medium"
              style={{
                display: "block",
                marginBottom: 12,
                color: "var(--color-on-surface-variant)",
              }}
            >
              Шаг 1 — Модель двери
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {MODEL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`md3-chip ${room.model === opt.value ? "selected" : ""}`}
                  onClick={() =>
                    updateRoom(room.id, {
                      model: opt.value,
                      series: opt.value.split(" ")[1] ?? "",
                    })
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Select Category (appears after model is chosen) */}
          {currentStep >= 2 && (
            <div
              style={{
                marginBottom: 24,
                animation: "fadeSlideIn 300ms ease",
              }}
            >
              <label
                className="label-medium"
                style={{
                  display: "block",
                  marginBottom: 12,
                  color: "var(--color-on-surface-variant)",
                }}
              >
                Шаг 2 — Категория покрытия
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {CATEGORY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={`md3-chip ${room.category === opt.value ? "selected" : ""}`}
                    onClick={() =>
                      updateRoom(room.id, { category: opt.value })
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Select Dimensions (CHIPS ONLY — no manual input!) */}
          {currentStep >= 3 && (
            <div
              style={{
                marginBottom: 24,
                animation: "fadeSlideIn 300ms ease",
              }}
            >
              <label
                className="label-medium"
                style={{
                  display: "block",
                  marginBottom: 12,
                  color: "var(--color-on-surface-variant)",
                }}
              >
                Шаг 3 — Размеры (только фиксированные значения)
              </label>

              {/* Width */}
              <p
                className="body-small"
                style={{
                  color: "var(--color-on-surface-variant)",
                  marginBottom: 8,
                }}
              >
                Ширина, мм
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                {AVAILABLE_WIDTHS.map((w) => (
                  <button
                    key={w}
                    className={`md3-chip ${room.width === w ? "selected" : ""}`}
                    onClick={() => setRoomDimensions(room.id, "width", w)}
                  >
                    {w}
                  </button>
                ))}
              </div>

              {/* Height */}
              <p
                className="body-small"
                style={{
                  color: "var(--color-on-surface-variant)",
                  marginBottom: 8,
                }}
              >
                Высота, мм
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {AVAILABLE_HEIGHTS.map((h) => (
                  <button
                    key={h}
                    className={`md3-chip ${room.height === h ? "selected" : ""}`}
                    onClick={() => setRoomDimensions(room.id, "height", h)}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Transom Toggle */}
          {currentStep >= 4 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 24,
                animation: "fadeSlideIn 300ms ease",
              }}
            >
              {/* Transom */}
              <div>
                <label
                  className="label-medium"
                  style={{
                    display: "block",
                    marginBottom: 12,
                    color: "var(--color-on-surface-variant)",
                  }}
                >
                  Фрамуга (верхняя фрамуга)
                </label>
                <label className="md3-toggle">
                  <div
                    className="md3-toggle-track"
                    data-active={room.hasTransom}
                    onClick={() =>
                      updateRoom(room.id, {
                        hasTransom: !room.hasTransom,
                      })
                    }
                  >
                    <div className="md3-toggle-thumb" />
                  </div>
                  <span className="body-medium">
                    {room.hasTransom ? "Да" : "Нет"}
                  </span>
                </label>
              </div>

              {/* False Panel */}
              <div>
                <label
                  className="label-medium"
                  style={{
                    display: "block",
                    marginBottom: 12,
                    color: "var(--color-on-surface-variant)",
                  }}
                >
                  Фальш-панель
                </label>
                <label className="md3-toggle">
                  <div
                    className="md3-toggle-track"
                    data-active={room.hasFalsePanel}
                    onClick={() =>
                      updateRoom(room.id, {
                        hasFalsePanel: !room.hasFalsePanel,
                      })
                    }
                  >
                    <div className="md3-toggle-thumb" />
                  </div>
                  <span className="body-medium">
                    {room.hasFalsePanel ? "Да" : "Нет"}
                  </span>
                </label>
              </div>

              {/* Quantity */}
              <div>
                <label
                  className="label-medium"
                  style={{
                    display: "block",
                    marginBottom: 12,
                    color: "var(--color-on-surface-variant)",
                  }}
                >
                  Количество
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button
                    className="md3-btn-tonal ripple-effect"
                    style={{
                      width: 40,
                      height: 40,
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "var(--radius-full)",
                    }}
                    onClick={() =>
                      updateRoom(room.id, {
                        quantity: Math.max(1, room.quantity - 1),
                      })
                    }
                  >
                    −
                  </button>
                  <span
                    className="title-medium"
                    style={{
                      minWidth: 32,
                      textAlign: "center",
                    }}
                  >
                    {room.quantity}
                  </span>
                  <button
                    className="md3-btn-tonal ripple-effect"
                    style={{
                      width: 40,
                      height: 40,
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "var(--radius-full)",
                    }}
                    onClick={() =>
                      updateRoom(room.id, {
                        quantity: room.quantity + 1,
                      })
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* False Panel Assembly Note */}
          {room.hasFalsePanel && (
            <div
              style={{
                marginTop: 16,
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-tertiary-container)",
                color: "var(--color-on-tertiary-container)",
              }}
            >
              <p className="body-small">
                ⓘ Наличник будет установлен <strong>между</strong> дверным
                полотном и фальш-панелью (не поверх панели).
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
