# Calculator UI & User Flow: ProfilDoors System

## 1. Client Information Section
The top section of the Calculator must contain inputs for the client's basic data:
*   Client Name
*   Phone Number
*   Address (Optional)

## 2. Room Configuration Blocks
Users add doors by creating room blocks.
*   **Action:** A prominent "Create Room/Space" (Создать помещение) button.
*   **Flow inside each Room Block (Strict Sequence):**
    1.  **Select Model:** User selects the door panel model.
    2.  **Select Category:** Based on the model, Category options (e.g., Cat 1, Cat 2, Cat 3) appear.
    3.  **Select Dimensions:** User selects Width and Height using **interactive buttons/chips with fixed sizes only**. Manual text input for dimensions is strictly forbidden to prevent errors.
    4.  **Transom (Фрамуга):** A simple Yes/No toggle button. If "Yes", the pricing engine logic (+X% markup) is applied to the calculation.

## 3. Dynamic Calculation & Actions
*   **Layout:** The total price must be calculated dynamically in real-time and displayed prominently (e.g., on the right side of the screen or in a sticky bottom bar).
*   **Action Buttons (Bottom):**
    *   **"Save to Orders":** Saves the entire configuration to the database (`Order` and `OrderItem` tables) and changes status to NEW.
    *   **"Create CP" (Коммерческое предложение):** A button to generate a PDF quote. *Note for AI: For the MVP, just create the button and an empty handler function; the PDF template design will be implemented in a later phase.*
