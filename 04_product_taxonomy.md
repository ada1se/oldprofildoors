# Product Taxonomy & AI Visualizer Specs: ProfilDoors System

## 1. Assembly Rules (Product Taxonomy)
The calculator must respect physical engineering constraints when building an order item. Do not allow invalid combinations in the UI.

### 1.1. False Panels and Casings
*   **Straight False Panels:** When a plain, straight false panel (без узора) is added to a configuration, the system must logically map the assembly correctly.
*   **Placement Rule:** The door casing (наличник) must be positioned explicitly between the door and the false panel, not placed on top of the false panel. 

### 1.2. Color & Profile Customization
*   **Granular Color Control:** The system must decouple the door panel color from specific component colors to support premium customization.
*   **Edge Profiles (Окантовка):** Users must be able to apply specific colors (e.g., Champagne, Pearl Bronze, Matte Silver) strictly to the edge profiles of the door without overriding or changing the color of the entire door frame or panel.

## 2. AI Visualizer Module Specifications
*(Note: This module is planned for a later phase, but UI/Data constraints must be established now).*

### 2.1. Rendering Constraints
To ensure product focus and high-end commercial visualization quality (4K architectural standard), the AI visualizer must follow strict environmental rules.
*   **Simplified Environment:** The AI must replace cluttered backgrounds with a clean, standardized room setting.
*   **Background:** Always render a plain white wall.
*   **Flooring:** Always render a standard wooden parquet floor.
*   **Detailing:** Strip away all extraneous interior details (furniture, decor, complex lighting) to keep the focus entirely on the door and its specific texture/finish (e.g., Pearl White, Smoky, Graphite).

## 3. Data Integration
When building the UI components for the Calculator, ensure that checkboxes or toggles for "False Panel" automatically trigger the correct hardware/casing calculation logic defined in Section 1.1.
