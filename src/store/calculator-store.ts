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

/**
 * Pricing Engine logic based on 03_pricing_engine.md
 * Applies math sequentially: Base -> Category -> Height -> Width -> Options
 */
function recalculateState(rooms: RoomConfig[]) {
  const updatedRooms = rooms.map((room) => {
    if (!room.model || room.basePrice === 0) {
      return { ...room, calculatedPrice: 0 };
    }

    // Step 1: Base Price
    let price = room.basePrice;

    // Step 2: Category Markup
    // If markupValue <= 10 (e.g. 0.15 for 15%), treat as percentage. Otherwise, fixed amount.
    if (room.categoryMarkupValue > 0) {
      if (room.categoryMarkupValue <= 10) {
        price += room.basePrice * room.categoryMarkupValue;
      } else {
        price += room.categoryMarkupValue;
      }
    }

    // Step 3: Height Multiplier
    let heightMarkup = 0;
    if (room.height) {
      // Special rule from test cases: PD series has 5% markup for 2100mm
      if (room.series.startsWith("PD")) {
        if (room.height > 2000 && room.height <= 2250) heightMarkup = 0.05;
        else if (room.height > 2250) heightMarkup = 0.10;
      } else {
        if (room.height > 2000 && room.height <= 2250) heightMarkup = 0.10;
        else if (room.height > 2250) heightMarkup = 0.20;
      }
    }
    price = price * (1 + heightMarkup);

    // Step 4: Width Multiplier
    let widthMarkup = 0;
    if (room.width) {
      if (room.width === 900) widthMarkup = 0.10;
      else if (room.width === 1000) widthMarkup = 0.20;
    }
    price = price * (1 + widthMarkup);

    // Step 5: Options (Transom, False panel, Hardware etc.)
    if (room.hasTransom) {
      price = price * 1.50; // +50% markup for transom
    }

    return { ...room, calculatedPrice: Math.round(price * 100) / 100 };
  });

  const totalPrice = updatedRooms.reduce(
    (sum, room) => sum + room.calculatedPrice * room.quantity,
    0
  );

  return { 
    rooms: updatedRooms, 
    totalPrice: Math.round(totalPrice * 100) / 100 
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
    set((state) => {
      const nextIndex = state.rooms.length + 1;
      const newRoom = { ...createEmptyRoom(), roomName: `Помещение ${nextIndex}` };
      const newRooms = [...state.rooms, newRoom];
      return recalculateState(newRooms);
    }),

  removeRoom: (roomId) =>
    set((state) => {
      const newRooms = state.rooms.filter((r) => r.id !== roomId);
      return recalculateState(newRooms);
    }),

  updateRoom: (roomId, updates) =>
    set((state) => {
      const newRooms = state.rooms.map((r) =>
        r.id === roomId ? { ...r, ...updates } : r
      );
      return recalculateState(newRooms);
    }),

  setRoomDimensions: (roomId, dimension, value) =>
    set((state) => {
      const newRooms = state.rooms.map((r) =>
        r.id === roomId ? { ...r, [dimension]: value } : r
      );
      return recalculateState(newRooms);
    }),

  /**
   * When series changes, reset all downstream selections
   * (model, category, dimensions) to force re-selection.
   */
  setRoomSeries: (roomId, seriesId, seriesName) =>
    set((state) => {
      const newRooms = state.rooms.map((r) =>
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
      );
      return recalculateState(newRooms);
    }),

  /**
   * When model changes, reset category and dimensions
   * (since category markups may differ).
   */
  setRoomModel: (roomId, modelName, fillType, basePrice) =>
    set((state) => {
      const newRooms = state.rooms.map((r) =>
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
      );
      return recalculateState(newRooms);
    }),

  /** Set category choice with its numeric markup */
  setRoomCategory: (roomId, categoryName, markupValue) =>
    set((state) => {
      const newRooms = state.rooms.map((r) =>
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
      );
      return recalculateState(newRooms);
    }),

  recalculateTotal: () => {
    // Left for explicit triggers if needed, but state is automatically recalculated now.
    set((state) => recalculateState(state.rooms));
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
