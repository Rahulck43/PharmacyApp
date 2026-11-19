# ABC Pharmacy – Medicine Tracker

A single-page application for ABC Pharmacy to keep track of medicines and record sales.

- **Backend:** ASP.NET Core Web API (.NET 9), data stored in a JSON file
- **Frontend:** React + TypeScript (Vite)

## Features

- View all medicines in a grid (name, brand, expiry date, quantity, price)
- Row colours:
  - **Red**: expires in less than 30 days, or already expired
  - **Yellow**: less than 10 units in stock
- Search medicines by name (case-insensitive, partial match)
- Add a new medicine, with validation
- Record a sale, which reduces stock
- View sales history

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) 20.19+ or 22.12+

## Getting started

### 1. Run the API

```bash
dotnet run --project src/PharmacyApp.Api
```

- The API runs at **http://localhost:5149**
- Swagger UI: **http://localhost:5149/swagger**
- On first run, sample data is created in `src/PharmacyApp.Api/App_Data/pharmacy.json`. It covers every colour case. To reset the data, stop the API and delete this file.

> Use the default `http` profile. The frontend calls `http://localhost:5149`.

### 2. Run the frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173**

The API address is set in `client/.env.development`.

## Project structure

```
PharmacyApp/
├── src/
│   ├── PharmacyApp.Api/             # Controllers, error handling, startup, config
│   ├── PharmacyApp.Core/            # Entities, DTOs, services, business rules, interfaces
│   └── PharmacyApp.Infrastructure/  # JSON file storage, repositories, seed data
└── client/                          # React frontend
```

Dependencies point inward: **Api → Core ← Infrastructure**. Core has no dependency on storage, so the JSON storage can be replaced (e.g. with SQL Server) without changing business logic.

## API endpoints

| Method | Endpoint | Description | Responses |
|---|---|---|---|
| GET | `/api/medicines?search={name}` | List medicines, optional search by name | 200 |
| GET | `/api/medicines/{id}` | Get one medicine (includes notes) | 200, 404 |
| POST | `/api/medicines` | Add a medicine | 201, 400, 422 |
| GET | `/api/sales` | List sales, newest first | 200 |
| GET | `/api/sales/{id}` | Get one sale | 200, 404 |
| POST | `/api/sales` | Record a sale | 201, 400, 404, 422 |

Errors are returned as [ProblemDetails](https://www.rfc-editor.org/rfc/rfc9457) JSON:

- **400**: invalid input (e.g. missing name, price with more than 2 decimals)
- **404**: medicine or sale not found
- **422**: valid input that breaks a business rule (e.g. not enough stock, expired medicine)

### Example requests

```json
POST /api/medicines
{
  "fullName": "Paracetamol 500mg",
  "brand": "Calpol",
  "notes": "After food",
  "expiryDate": "2027-03-31",
  "quantity": 50,
  "price": 25.50
}
```

```json
POST /api/sales
{
  "medicineId": "3f2c9a1e-...",
  "quantity": 3
}
```

## Business rules and assumptions

- **Expiring soon**: expiry date is less than 30 days from today. A medicine expiring in exactly 30 days is not flagged.
- **Low stock**: quantity is less than 10. Exactly 10 is not flagged.
- **Red wins over yellow**: a medicine that is both expiring soon and low in stock is shown in red, because expiry is the bigger risk.
- **Expired medicines** are shown in red with an "Expired" label and cannot be sold.
- A medicine with an expiry date in the past cannot be added.
- A sale cannot exceed the available stock.
- Adding a medicine with the same name again creates a separate entry (treated as a new batch, which may have a different expiry date).
- A sale stores the medicine name and unit price at the time of sale, so sales history stays correct if the price changes later.
- "Today" is based on the server's local date.
- Both thresholds (30 days, 10 units) are set in `appsettings.json` under `Inventory`.

## Design decisions

- **Layered architecture** with dependency injection: controllers handle HTTP only, services hold the business rules, and repositories handle data access.
- **One JSON file** holds both medicines and sales. All reads and writes go through a single `JsonDataStore` with a lock, so a sale (stock reduction + sale record) is saved together and concurrent sales cannot oversell.
- **Safe file writes**: data is written to a temporary file first, then moved into place, so a crash cannot leave a half-written file.
- **The backend calculates the status flags** (`isExpiringSoon`, `isLowStock`, `isExpired`), so the rules live in one place. The frontend only maps them to colours.
- **Validation on both sides**: the frontend validates for a better user experience; the API validates again because it must never trust the client.
- **`decimal` for money**, `DateOnly` for expiry dates.

## Possible improvements

- Unit tests for the services and entity rules, and integration tests for the API
- A database (e.g. SQL Server with EF Core) instead of a JSON file
- Edit and delete medicines
- Pagination for large lists
- Authentication and roles