import { create } from "zustand";
import type { ClientInfo, RoomConfig, DoorWidth, DoorHeight } from "@/lib/types";

interface CalculatorState {
  /** Client information section */
  clientInfo: ClientInfo;

  /** Room configuration blocks */
  rooms: RoomConfig[];

  /** Computed total price */
  totalPrice: number;

  /** Actions */
  setClientInfo: (field: keyof ClientInfo, value: string) => void;
  addRoom: () => void;
  removeRoom: (roomId: string) => void;
  updateRoom: (roomId: string, updates: Partial<RoomConfig>) => void;
  setRoomDimensions: (
    roomId: string,
    dimension: "width" | "height",
    value: DoorWidth | DoorHeight
  ) => void;
  /** Reset downstream fields when series changes */
  setRoomSeries: (
    roomId: string,
    seriesId: string,
    seriesName: string
  ) => void;
  /** Set model and its associated data */
  setRoomModel: (
    roomId: string,
    modelName: string,
    fillType: string,
    basePrice: number
  ) => void;
  /** Set category and its markup value */
  setRoomCategory: (
    roomId: string,
    categoryName: string,
    markupValue: number
  ) => void;
  recalculateTotal: () => void;
  resetCalculator: () => void;
}

let roomCounter = 0;

function createEmptyRoom(): RoomConfig {
  roomCounter += 1;
  return {
    id: `room-${Date.now()}-${roomCounter}`,
    roomName: `Помещение ${roomCounter}`,
    quantity: 1,
    seriesId: "",
    series: "",
    model: "",
    fillType: "",
    basePrice: 0,
    category: "",
    categoryMarkupValue: 0,
    width: null,
    height: null,
    baseColor: "",
    edgeProfileColor: "",
    glassType: "",
    openingSystem: "Swing",
    frameSystem: "Monoblock",
    hasFalsePanel: false,
    hasTransom: false,
    calculatedPrice: 0,
  };
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  clientInfo: {
    name: "",
    phone: "",
    address: "",
  },

  rooms: [],

  totalPrice: 0,

  setClientInfo: (field, value) =>
    set((state) => ({
      clientInfo: { ...state.clientInfo, [field]: value },
    })),

  addRoom: () =>
    set((state) => ({
      rooms: [...state.rooms, createEmptyRoom()],
    })),

  removeRoom: (roomId) =>
    set((state) => ({
      rooms: state.rooms.filter((r) => r.id !== roomId),
    })),

  updateRoom: (roomId, updates) =>
    set((state) => ({
      rooms: state.rooms.map((r) =>
        r.id === roomId ? { ...r, ...updates } : r
      ),
    })),

  setRoomDimensions: (roomId, dimension, value) =>
    set((state) => ({
      rooms: state.rooms.map((r) =>
        r.id === roomId ? { ...r, [dimension]: value } : r
      ),
    })),

  /**
   * When series changes, reset all downstream selections
   * (model, category, dimensions) to force re-selection.
   */
  setRoomSeries: (roomId, seriesId, seriesName) =>
    set((state) => ({
      rooms: state.rooms.map((r) =>
        r.id === roomId
          ? {
              ...r,
              seriesId,
              series: seriesName,
              model: "",
              fillType: "",
              basePrice: 0,
              category: "",
              categoryMarkupValue: 0,
              width: null,
              height: null,
              calculatedPrice: 0,
            }
          : r
      ),
    })),

  /**
   * When model changes, reset category and dimensions
   * (since category markups may differ).
   */
  setRoomModel: (roomId, modelName, fillType, basePrice) =>
    set((state) => ({
      rooms: state.rooms.map((r) =>
        r.id === roomId
          ? {
              ...r,
              model: modelName,
              fillType,
              basePrice,
              category: "",
              categoryMarkupValue: 0,
              width: null,
              height: null,
              calculatedPrice: 0,
            }
          : r
      ),
    })),

  /** Set category choice with its numeric markup */
  setRoomCategory: (roomId, categoryName, markupValue) =>
    set((state) => ({
      rooms: state.rooms.map((r) =>
        r.id === roomId
          ? {
              ...r,
              category: categoryName,
              categoryMarkupValue: markupValue,
              width: null,
              height: null,
              calculatedPrice: 0,
            }
          : r
      ),
    })),

  recalculateTotal: () => {
    const { rooms } = get();
    const total = rooms.reduce(
      (sum, room) => sum + room.calculatedPrice * room.quantity,
      0
    );
    set({ totalPrice: total });
  },

  resetCalculator: () => {
    roomCounter = 0;
    set({
      clientInfo: { name: "", phone: "", address: "" },
      rooms: [],
      totalPrice: 0,
    });
  },
}));
