"use server";

import { prisma } from "@/lib/prisma";

/* ===================================================================
   Catalog Data Types (serializable for client transport)
   =================================================================== */

export interface SeriesOption {
  id: string;
  name: string;
}

export interface ModelOption {
  id: string;
  name: string;
  fillType: string;
  basePrice: number;
}

export interface CategoryMarkupOption {
  id: string;
  categoryName: string;
  markupValue: number;
}

export interface SeriesDetails {
  models: ModelOption[];
  categoryMarkups: CategoryMarkupOption[];
}

/* ===================================================================
   Server Actions — Catalog Queries
   =================================================================== */

/**
 * Получить список всех доступных серий.
 * Используется для первого шага выбора в RoomBlock.
 */
export async function getAllSeries(): Promise<SeriesOption[]> {
  const series = await prisma.series.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  });

  return series;
}

/**
 * Получить модели и наценки по категориям для выбранной серии.
 * Вызывается после выбора серии менеджером.
 */
export async function getSeriesDetails(
  seriesId: string
): Promise<SeriesDetails> {
  const [models, categoryMarkups] = await Promise.all([
    prisma.productModel.findMany({
      where: { seriesId },
      select: {
        id: true,
        name: true,
        fillType: true,
        basePrice: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.categoryMarkup.findMany({
      where: { seriesId },
      select: {
        id: true,
        categoryName: true,
        markupValue: true,
      },
      orderBy: { categoryName: "asc" },
    }),
  ]);

  return { models, categoryMarkups };
}
