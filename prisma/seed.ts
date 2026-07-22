import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

// Настраиваем драйвер libSQL для SQLite напрямую
const dbPath = process.env.DATABASE_URL || 'file:./prisma/dev.db';
const adapter = new PrismaLibSql({ url: dbPath }); // Передаем объект с url напрямую!
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Начинаем загрузку прайс-листа в базу данных...');

    const seedPath = path.join(__dirname, '../seed.json');

    if (!fs.existsSync(seedPath)) {
        console.error(`Файл не найден по пути: ${seedPath}`);
        return;
    }

    const rawData = fs.readFileSync(seedPath, 'utf-8');
    const data = JSON.parse(rawData);

    // Перебираем все серии из JSON
    for (const [seriesName, seriesData] of Object.entries(data.series)) {
        console.log(`Обработка коллекции: ${seriesName}`);

        const series = await prisma.series.upsert({
            where: { name: seriesName },
            update: {},
            create: { name: seriesName },
        });

        const typedSeriesData = seriesData as any;

        for (const [modelName, modelInfo] of Object.entries(typedSeriesData.models)) {
            const typedModelInfo = modelInfo as any;
            await prisma.productModel.upsert({
                where: {
                    name_seriesId: {
                        name: modelName,
                        seriesId: series.id,
                    },
                },
                update: {
                    basePrice: typedModelInfo.basePrice,
                    fillType: typedModelInfo.fillType,
                },
                create: {
                    name: modelName,
                    basePrice: typedModelInfo.basePrice,
                    fillType: typedModelInfo.fillType,
                    seriesId: series.id,
                },
            });
        }

        for (const [catName, markupValue] of Object.entries(typedSeriesData.category_markups)) {
            await prisma.categoryMarkup.upsert({
                where: {
                    categoryName_seriesId: {
                        categoryName: catName,
                        seriesId: series.id,
                    },
                },
                update: {
                    markupValue: markupValue as number,
                },
                create: {
                    categoryName: catName,
                    markupValue: markupValue as number,
                    seriesId: series.id,
                },
            });
        }
    }

    console.log('✅ Прайс-лист успешно загружен в базу данных SQLite!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });