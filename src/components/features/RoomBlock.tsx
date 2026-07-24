"use client";

import { Trash2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import { useCalculatorStore } from "@/store/calculator-store";
import {
  AVAILABLE_WIDTHS,
  AVAILABLE_HEIGHTS,
  type RoomConfig,
} from "@/lib/types";
import {
  getAllSeries,
  getSeriesDetails,
  type SeriesOption,
  type ModelOption,
  type CategoryMarkupOption,
} from "@/actions/catalog";

interface RoomBlockProps {
  room: RoomConfig;
  index: number;
  /** Pre-loaded series list shared across all rooms */
  seriesList: SeriesOption[];
}

export function RoomBlock({ room, index, seriesList }: RoomBlockProps) {
  const {
    updateRoom,
    removeRoom,
    setRoomDimensions,
    setRoomSeries,
    setRoomModel,
    setRoomCategory,
  } = useCalculatorStore();

  const [isExpanded, setIsExpanded] = useState(true);

  // DB-fetched data for the selected series
  const [models, setModels] = useState<ModelOption[]>([]);
  const [categoryMarkups, setCategoryMarkups] = useState<
    CategoryMarkupOption[]
  >([]);
  const [isPending, startTransition] = useTransition();

  // Fetch models & categories when series changes
  useEffect(() => {
    if (!room.seriesId) {
      setModels([]);
      setCategoryMarkups([]);
      return;
    }

    startTransition(async () => {
      const details = await getSeriesDetails(room.seriesId);
      setModels(details.models);
      setCategoryMarkups(details.categoryMarkups);
    });
  }, [room.seriesId]);

  /**
   * Sequential step logic:
   * Step 0: Select Series
   * Step 1: Select Model (after series)
   * Step 2: Select Category (after model)
   * Step 3: Select Dimensions (after category)
   * Step 4: Options — transom, false panel, quantity (after dimensions)
   */
  const currentStep = !room.seriesId
    ? 0
    : !room.model
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
            {room.series && (
              <p
                className="body-small"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                {room.series}
                {room.model ? ` · ${room.model}` : ""}
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

          {/* Step 0: Select Series */}
          <div style={{ marginBottom: 24 }}>
            <label
              className="label-medium"
              style={{
                display: "block",
                marginBottom: 12,
                color: "var(--color-on-surface-variant)",
              }}
            >
              Шаг 1 — Коллекция (серия)
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {seriesList.map((s) => (
                <button
                  key={s.id}
                  className={`md3-chip ${room.seriesId === s.id ? "selected" : ""}`}
                  onClick={() => setRoomSeries(room.id, s.id, s.name)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Step 1: Select Model (loaded from DB for the selected series) */}
          {currentStep >= 1 && (
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
                Шаг 2 — Модель двери
                {isPending && (
                  <Loader2
                    size={14}
                    style={{
                      display: "inline-block",
                      marginLeft: 8,
                      animation: "spin 1s linear infinite",
                    }}
                  />
                )}
              </label>

              {isPending ? (
                <div
                  style={{
                    padding: "16px 0",
                    color: "var(--color-on-surface-variant)",
                  }}
                  className="body-small"
                >
                  Загрузка моделей...
                </div>
              ) : models.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {models.map((m) => (
                    <button
                      key={m.id}
                      className={`md3-chip ${room.model === m.name ? "selected" : ""}`}
                      onClick={() =>
                        setRoomModel(
                          room.id,
                          m.name,
                          m.fillType,
                          m.basePrice
                        )
                      }
                      title={`${m.fillType} · ${new Intl.NumberFormat("ru-KZ").format(m.basePrice)} ₸`}
                    >
                      {m.name}
                      <span
                        style={{
                          fontSize: 11,
                          opacity: 0.7,
                          marginLeft: 4,
                        }}
                      >
                        ({m.fillType})
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  className="body-small"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  Нет доступных моделей для этой серии
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Category (from DB categoryMarkups for this series) */}
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
                Шаг 3 — Категория покрытия
              </label>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {/* Category 1 is always the base (no markup) */}
                <button
                  className={`md3-chip ${room.category === "Category 1" ? "selected" : ""}`}
                  onClick={() =>
                    setRoomCategory(room.id, "Category 1", 0)
                  }
                >
                  Категория 1 (база)
                </button>

                {/* Dynamic categories from DB */}
                {categoryMarkups.map((cat) => (
                  <button
                    key={cat.id}
                    className={`md3-chip ${room.category === cat.categoryName ? "selected" : ""}`}
                    onClick={() =>
                      setRoomCategory(
                        room.id,
                        cat.categoryName,
                        cat.markupValue
                      )
                    }
                  >
                    {cat.categoryName.replace(/Category/gi, "Категория")}
                    <span
                      style={{
                        fontSize: 11,
                        opacity: 0.7,
                        marginLeft: 4,
                      }}
                    >
                      (+{new Intl.NumberFormat("ru-KZ").format(cat.markupValue)})
                    </span>
                  </button>
                ))}
              </div>

              {/* Selected model info */}
              {room.model && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "8px 12px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--color-surface-container)",
                  }}
                >
                  <p className="body-small" style={{ color: "var(--color-on-surface-variant)" }}>
                    Базовая цена модели{" "}
                    <strong>{room.model}</strong>:{" "}
                    {new Intl.NumberFormat("ru-KZ").format(room.basePrice)} ₸
                  </p>
                </div>
              )}
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
                Шаг 4 — Размеры (только фиксированные значения)
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

          {/* Step 4: Options — Transom, False Panel, Quantity */}
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
