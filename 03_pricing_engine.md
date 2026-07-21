# Pricing Engine Specification: ProfilDoors System

## 1. Core Mathematical Model
The calculation of a door unit must follow a strict, sequential compounding mathematical model. Do not add percentages together before applying them; each multiplier must be applied to the result of the previous step.

### Step 1: Base Price
*   Determine the base retail price based on the selected `Series`, `Model`, and `Glass Type` (e.g., solid vs. glass).
*   **Variable:** `Base_Price`

### Step 2: Category Markup (Coating/Color)
*   Apply the specific coating category markup (Category 1, 2, or 3). 
*   Note: In some series, this is a fixed amount (e.g., Series P.O), while in others it is a percentage (e.g., +15% for Series PD).
*   **Formula:** `Price_Pre_Dimensions = Base_Price + Category_Markup`

### Step 3: Height Multiplier
*   Apply the percentage increase for non-standard heights.
*   **Formula:** `Price_Post_Height = Price_Pre_Dimensions * (1 + Height_Percentage)`

### Step 4: Width Multiplier
*   Apply the percentage increase for non-standard widths to the height-adjusted price.
*   **Formula:** `Price_Post_Width = Price_Post_Height * (1 + Width_Percentage)`

### Step 5: Final Assembly Cost
*   The final price of the door unit (`Total_Item_Price`) is calculated by adding all structural and hardware components to the `Price_Post_Width`.
*   **Formula:** `Total_Item_Price = Price_Post_Width + Transom_Price + Frame_System_Price + Hardware_Price + Opening_System_Price + Additional_Elements`

## 2. Calculation Examples (Test Cases)

### Test Case A: Standard Size, Base Category
*   **Input:** Model 1.1 P.O, Category 1, 700x2000 mm.
*   **Calculation:**
    1. Base Price: 134,645.
    2. Category Markup: 0 (Category 1). `Price_Pre_Dimensions = 134,645`.
    3. Height Markup: 2000 mm = 0%. `Price_Post_Height = 134,645`.
    4. Width Markup: 700 mm = 0%. `Price_Post_Width = 134,645`.
*   **Result:** Panel Cost = 134,645.

### Test Case B: Non-Standard Dimensions, Fixed Category Markup
*   **Input:** Model 1.1 P.O, Category 2, 900x2100 mm.
*   **Calculation:**
    1. Base Price: 134,645.
    2. Category Markup: Fixed 38,956.2 (Category 2). `Price_Pre_Dimensions = 173,601.2`.
    3. Height Markup: 2100 mm = +10%. `Price_Post_Height = 173,601.2 * 1.10 = 190,961.32`.
    4. Width Markup: 900 mm = +10%. `Price_Post_Width = 190,961.32 * 1.10 = 210,057.45`.
*   **Result:** Panel Cost = 210,057.45.

### Test Case C: Non-Standard Height, Percentage Category Markup
*   **Input:** Model 1.1.1 PD, Category 2, 700x2100 mm.
*   **Calculation:**
    1. Base Price: 174,414.
    2. Category Markup: +15% for Series PD. `Price_Pre_Dimensions = 174,414 + (174,414 * 0.15) = 200,576.1`.
    3. Height Markup: 2100 mm = +5% for Series PD. `Price_Post_Height = 200,576.1 * 1.05 = 210,604.91`.
    4. Width Markup: 700 mm = 0%. `Price_Post_Width = 210,604.91 * 1.0 = 210,604.91`.
*   **Result:** Panel Cost = 210,604.91.

## 3. Data Flow Rules for Next.js
*   All calculations must be executed on the server via Server Actions or utility functions to prevent client-side manipulation of prices.
*   Always use precise decimal types (or calculate in the smallest currency unit) to avoid JavaScript floating-point arithmetic errors.
