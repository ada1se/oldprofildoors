# Data Dictionary & Database Schema: ProfilDoors System

## 1. Overview
This document outlines the core data entities for the ProfilDoors MVP. The database should be designed using a relational model (SQLite for MVP, migrating to PostgreSQL later) via Prisma ORM.

## 2. Core Entities

### 2.1. Client
Stores customer contact information.
*   `id` (UUID/String): Primary Key.
*   `name` (String): Full name of the client.
*   `phone` (String): WhatsApp/Phone number (Unique).
*   `address` (String, Optional): Installation or delivery address.
*   `createdAt` (DateTime): Record creation timestamp.
*   `updatedAt` (DateTime): Record update timestamp.
*   **Relations:** One-to-Many with `Order`.

### 2.2. Order
Represents a sales calculation or confirmed deal.
*   `id` (UUID/String): Primary Key.
*   `clientId` (String): Foreign Key to Client.
*   `status` (Enum): `NEW`, `MEASUREMENT_DONE`, `QUOTE_SENT`, `PENDING_DECISION`, `CONFIRMED`, `PRODUCTION`, `DELIVERY`, `INSTALLATION`, `COMPLETED`, `CANCELED`, `ARCHIVED`.
*   `totalAmount` (Float): Calculated total price of the order.
*   `createdAt` (DateTime): Date the order was initiated.
*   `updatedAt` (DateTime): Date of the last status change or calculation update.
*   **Relations:** One-to-Many with `OrderItem`.

### 2.3. OrderItem (Door Configuration)
Represents a single configured door/opening within an order. This is the core output of the Calculator.
*   `id` (UUID/String): Primary Key.
*   `orderId` (String): Foreign Key to Order.
*   `roomName` (String): Custom identifier (e.g., "Living Room", "Bathroom").
*   `quantity` (Int): Number of identical doors for this opening (Default: 1).
*   `width` (Int): Width in millimeters (e.g., 600, 700, 800, 1000).
*   `height` (Int): Height in millimeters (e.g., 2000, 2100, 2400).
*   
*   **Product Specifications:**
    *   `series` (String): e.g., "PE.O", "P.O".
    *   `model` (String): e.g., "1 PE.O".
    *   `baseColor` (String): Main color of the door panel (e.g., "White Matte", "Graphite").
    *   `edgeProfileColor` (String, Optional): Specific color applied strictly to the door's edge profiles (e.g., "Champagne", "Silver Matte"), overriding the frame color.
    *   `glassType` (String, Optional): Fill type if applicable.
*   
*   **Systems & Components:**
    *   `openingSystem` (String): e.g., "Swing", "Magic", "Penal", "Compack".
    *   `frameSystem` (String): e.g., "Monoblock", "Invisible".
    *   `hardwareSet` (JSON, Optional): Selected locks, hinges, and handles.
    *   `hasFalsePanel` (Boolean): Indicates if a straight false panel is included in the assembly.
    *   `hasTransom` (Boolean): Indicates if a top transom (фрамуга) is included.
*   
*   **Pricing:**
    *   `calculatedPrice` (Float): The final price for this specific item after all rules and multipliers are applied.

### 2.4. Catalog & Pricing Engine Reference (Read-Only Data)
For the MVP, these can be stored as JSON configuration files, hardcoded constants, or simple database tables seeded on deployment.
*   **ProductSeries:** Base prices for standard dimensions.
*   **PricingRules:** Multipliers based on logic (e.g., `height > 2100 = 1.2`).
*   **ColorCategories:** Category 1 (Base), Category 2 (+15%), Category 3.

## 3. Data Integrity Rules
*   Cascading Deletes: Deleting an `Order` MUST delete all associated `OrderItem` records.
*   Null Checks: `width`, `height`, `series`, and `baseColor` are strictly required to perform a calculation.
*   Precision: All monetary values (`calculatedPrice`, `totalAmount`) should be stored as floats or integers (cents) to avoid rounding errors during calculation.
