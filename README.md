# PERN Billing Application

A robust full-stack web application built with **React (Vite), Node.js, Express, and PostgreSQL** designed to manage customers, track inventory items, and generate dynamic transactional billing invoices.

## Features

- **Dashboard Module**: View aggregated generated invoices mapped comprehensively tracking core transaction subroutines with a Live Search.
- **Customer Master**: Create and track Customers with unique system-generated `CustID` sequences (e.g., C00001, C00002) and active/in-active logic rules.
- **Items Master**: Build up product catalogues defining standalone pricing loops and custom mappings hooked onto unique `ItemID` sequences.
- **Billing Engine Integration**: Advanced Invoice generator mapping nested looping logic. Integrates dynamic Cart Modifiers, Multi-table SQL Transactions tracking arrays across `bills` and `bill_items`, alongside a native `18% GST` calculator bypassing structurally for accounts defining active internal tax keys.

## Tech Stack
- **Frontend**: React.js (Vite), React Router Dom
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (pg pool)

---

## Local Setup & Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/en/) installed on your machine.
- [PostgreSQL](https://www.postgresql.org/) database installed and running.

### 2. Database Initialization
1. Open pgAdmin or your PostgreSQL CLI.
2. Create a new database named `billing`.
3. Run the provided SQL scripts located within the root directory directly against the `billing` database to structure your schemas:
   - Execute `schema.sql` -> Maps out `customers`, `items`, `bills`, `bill_items` structures natively alongside the unique InvoiceID Trigger Function.
   - Execute `seed.sql` -> Injects foundational mock data to begin exploring immediately.

### 3. Backend Setup
The backend runs an Express mapping server listening natively on `http://localhost:3000`.

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder matching your local PostgreSQL configurations:
```env
PORT=3000
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_DATABASE=billing
DB_PORT=5432
```

Start the server:
```bash
node index.js
# Or standard run scripts if specified inside package.json
```

### 4. Frontend Setup
The frontend runs via Vite mapping its layout engine natively on `http://localhost:5173`.

```bash
cd frontend
npm install
npm run dev
```

### 5. Access the Application
Open your browser and navigate to exactly: `http://localhost:5173` to explore the Dashboard visually!

---

## Project Structure
- **/backend**: Express routing logic orchestrating secure APIs (`GET/POST`) manipulating standard query blocks securely tracking into PostgreSQL via Transactional integrity loops.
- **/frontend**: Multi-component functional React state components strictly divided per structural route binding directly onto the application data structure visually.
- **schema.sql & seed.sql**: Core foundation syntax building the persistent database tracking systems ensuring the relational layout behaves precisely.
