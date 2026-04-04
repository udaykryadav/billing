
-- 1. Populate Customers Table
INSERT INTO customers (CustID, CustName, CustAddress, CustPAN, CustGST, isActive) VALUES
('C00001', 'Gupta Enterprize Pvt. Ltd.', 'Gurgaon, Haryana', 'BCNSG1234H', '06BCNSG1234H1Z5', 'Y'),
('C00002', 'Mahesh Industries Pvt. Ltd.', 'Delhi, Delhi', 'AMNSM1234U', '07AMNSM1234U1Z5', 'Y'),
('C00003', 'Omkar and Brothers Pvt. Ltd.', 'Uttrakhand, Uttar Pradesh', 'CNBSO1234S', '05CNBSO1234S1Z5', 'N'),
('C00004', 'Bhuwan Infotech.', 'Alwar, Rajasthan', 'CMNSB1234A', '08CMNSB1234A1Z5', 'Y'),
('C00005', 'Swastik Software Pvt. Ltd.', 'Gurgaon, Haryana', 'AGBCS1234B', '06AGBCS1234B1Z5', 'Y');

-- 2. Populate Items Table
INSERT INTO items (ItemID, ItemName, ItemPrice, isActive) VALUES
('IT00001', 'Laptop', 85000.00, 'Y'),
('IT00002', 'LED Monitor', 13450.00, 'Y'),
('IT00003', 'Pen Drive', 980.00, 'Y'),
('IT00004', 'Mobile', 18900.00, 'Y'),
('IT00005', 'Headphone', 2350.00, 'N'),
('IT00006', 'Bagpack', 1200.00, 'Y'),
('IT00007', 'Powerbank', 1400.00, 'Y');

