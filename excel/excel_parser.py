import pandas as pd
import json

def parse_excel_to_json(file_path, output_path):
    print(f"Читаем файл: {file_path}...")
    try:
        xls = pd.ExcelFile(file_path)
    except Exception as e:
        print(f"Ошибка чтения файла: {e}")
        return

    # Структура будущей базы данных
    database_seed = {
        "series": {},
        "dimension_rules": {
            "height": {
                "tier1": {"markup": 0.10, "description": "2050 - 2250 мм"},
                "tier2": {"markup": 0.20, "description": "2300 мм"}
            },
            "width": {
                "tier1": {"markup": 0.10, "description": "850, 900 мм"},
                "tier2": {"markup": 0.20, "description": "950, 1000 мм"}
            }
        }
    }
    
    # Автоматически находим все листы, в названии которых есть слово "Серия", 
    # исключая дубликаты вроде "Серия P.O (2)"
    target_sheets = [sheet for sheet in xls.sheet_names if 'Серия' in sheet and '(2)' not in sheet]
    
    for sheet_name in target_sheets:
        print(f"Парсинг листа: {sheet_name}")
        df = pd.read_excel(xls, sheet_name=sheet_name)
        
        series_name = sheet_name.replace("Серия ", "").strip()
        series_data = {
            "models": {},
            "category_markups": {}
        }
        
        # --- 1. ДИНАМИЧЕСКИЙ ПОИСК ЦЕН НА МОДЕЛИ ---
        model_start_idx = None
        # Ищем строку с заголовками таблицы
        for idx, row in df.iterrows():
            if str(row.iloc[0]).strip() == 'Модель' and str(row.iloc[1]).strip() == 'Заполнение':
                model_start_idx = idx + 1
                break
                
        if model_start_idx:
            for i in range(model_start_idx, len(df)):
                model_name = str(df.iloc[i, 0]).strip()
                fill_type = str(df.iloc[i, 1]).strip()
                price = df.iloc[i, 4] # Индекс 4 - это колонка E (Розница)
                
                # Если дошли до пустой строки или строки с наценками — останавливаемся
                if pd.isna(model_name) or model_name == 'nan' or "Наценка" in model_name:
                    break 
                    
                if not pd.isna(price):
                    series_data["models"][model_name] = {
                        "fillType": fill_type,
                        "basePrice": float(price)
                    }

        # --- 2. ПОИСК ФИКСИРОВАННЫХ НАЦЕНОК ЗА КАТЕГОРИЮ ---
        for idx, row in df.iterrows():
            cell_val = str(row.iloc[0]).strip()
            if "Наценка на полотна в покрытиях" in cell_val:
                markup_price = row.iloc[4]
                if not pd.isna(markup_price):
                    # Присваиваем вытащенную сумму обеим категориям
                    series_data["category_markups"]["Category 2"] = float(markup_price)
                    series_data["category_markups"]["Category 3"] = float(markup_price)
                break
                
        database_seed["series"][series_name] = series_data

    # Сохраняем результат
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(database_seed, f, ensure_ascii=False, indent=4)
        
    print(f"✅ Данные успешно извлечены и сохранены в {output_path}")

# Запуск скрипта
parse_excel_to_json("excel/Profildoors-research.xlsx", "seed.json")