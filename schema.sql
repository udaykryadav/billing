
-- 1. Create the Customers Table
CREATE TABLE customers (
    CustID VARCHAR(10) PRIMARY KEY, -- e.g., C00001
    CustName VARCHAR(255) NOT NULL,
    CustAddress TEXT,
    CustPAN VARCHAR(20),
    CustGST VARCHAR(15),
    isActive CHAR(1) DEFAULT 'Y', -- 'Y' or 'N'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create the Items Table
CREATE TABLE items (
    ItemID VARCHAR(10) PRIMARY KEY, -- e.g., IT00001
    ItemName VARCHAR(255) NOT NULL,
    ItemPrice DECIMAL(10, 2) NOT NULL,
    isActive CHAR(1) DEFAULT 'Y', -- 'Y' or 'N'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create a Function to generate a random 6-digit invoice ID (e.g., INVC123456)
CREATE OR REPLACE FUNCTION generate_invoice_id()
RETURNS text AS $$
DECLARE
    new_id text;
    done bool;
BEGIN
    done := false;
    WHILE NOT done LOOP
        -- Generate INVC + 6 random digits
        new_id := 'INVC' || lpad(floor(random() * 1000000)::text, 6, '0');
        -- Check if it already exists to ensure uniqueness
        done := NOT EXISTS(SELECT 1 FROM bills WHERE InvoiceID = new_id);
    END LOOP;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- 4. Create the Bills Table
CREATE TABLE bills (
    BillID SERIAL PRIMARY KEY,
    InvoiceID VARCHAR(20) UNIQUE DEFAULT generate_invoice_id(),
    CustID VARCHAR(10) REFERENCES customers(CustID) ON DELETE RESTRICT,
    TotalAmount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create the Bill Items Table
CREATE TABLE bill_items (
    BillItemID SERIAL PRIMARY KEY,
    BillID INT REFERENCES bills(BillID) ON DELETE CASCADE,
    ItemID VARCHAR(10) REFERENCES items(ItemID) ON DELETE RESTRICT,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    PriceAtSale DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
