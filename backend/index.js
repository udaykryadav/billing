const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'billing',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

app.get('/api/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const { CustName, CustAddress, CustPAN, CustGST, isActive } = req.body;

    // Generate new CustID
    const maxResult = await pool.query('SELECT MAX("custid") as max_id FROM customers');
    let maxIdStr = maxResult.rows[0].max_id;
    // In pg column names are case insensitive unless quoted, let's just try MAX(CustID) which returns max_id
    if (!maxIdStr) {
      maxIdStr = 'C00000';
    }
    const nextNum = parseInt(maxIdStr.substring(1)) + 1;
    const newCustId = 'C' + String(nextNum).padStart(5, '0');

    const result = await pool.query(
      'INSERT INTO customers ("custid", "custname", "custaddress", "custpan", "custgst", "isactive") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [newCustId, CustName, CustAddress, CustPAN, CustGST, isActive || 'Y']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const { ItemName, ItemPrice, isActive } = req.body;

    const maxResult = await pool.query('SELECT MAX("itemid") as max_id FROM items');
    let maxIdStr = maxResult.rows[0].max_id;
    if (!maxIdStr) {
      maxIdStr = 'IT00000';
    }
    const nextNum = parseInt(maxIdStr.substring(2)) + 1;
    const newItemId = 'IT' + String(nextNum).padStart(5, '0');

    const result = await pool.query(
      'INSERT INTO items ("itemid", "itemname", "itemprice", "isactive") VALUES ($1, $2, $3, $4) RETURNING *',
      [newItemId, ItemName, ItemPrice, isActive || 'Y']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/bills', async (req, res) => {
  const codeClient = await pool.connect();
  try {
    const { CustID, TotalAmount, items } = req.body;

    if (!CustID || !items || !items.length) {
      return res.status(400).json({ error: 'Missing required Billing data.' });
    }

    await codeClient.query('BEGIN');

    const billInsert = await codeClient.query(
      'INSERT INTO bills ("custid", "totalamount") VALUES ($1, $2) RETURNING "billid", "invoiceid"',
      [CustID, TotalAmount]
    );

    const newBillId = billInsert.rows[0].billid;
    const newInvoiceId = billInsert.rows[0].invoiceid;

    for (let currentItem of items) {
      await codeClient.query(
        'INSERT INTO bill_items ("billid", "itemid", "quantity", "priceatsale") VALUES ($1, $2, $3, $4)',
        [newBillId, currentItem.ItemID, currentItem.Quantity, currentItem.PriceAtSale]
      );
    }

    await codeClient.query('COMMIT');
    res.status(201).json({ success: true, invoiceId: newInvoiceId });
  } catch (error) {
    await codeClient.query('ROLLBACK');
    console.error('Transaction Failed. Error processing Bills API:', error);
    res.status(500).json({ error: 'Internal server error processing Bill.' });
  } finally {
    codeClient.release();
  }
});

app.get('/api/bills', async (req, res) => {
  try {
    const query = `
      SELECT 
        b."billid", b."invoiceid", b."totalamount",
        c."custname" as customername,
        (SELECT string_agg(i."itemname", ', ')
         FROM bill_items bi 
         JOIN items i ON bi."itemid" = i."itemid" 
         WHERE bi."billid" = b."billid") as itemnames
      FROM bills b
      JOIN customers c ON b."custid" = c."custid"
      ORDER BY b.created_at DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching bills:', err);
    res.status(500).json({ error: 'Internal server error fetching bills' });
  }
});

app.get('/api/bills/:invoiceId', async (req, res) => {
  try {
    const billQuery = `
      SELECT b."billid", b."invoiceid", b."totalamount",
             c."custid", c."custname", c."custaddress", c."custpan", c."custgst"
      FROM bills b
      JOIN customers c ON b."custid" = c."custid"
      WHERE b."invoiceid" = $1
    `;
    const billResult = await pool.query(billQuery, [req.params.invoiceId]);
    if (billResult.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    const billData = billResult.rows[0];

    const itemsQuery = `
      SELECT i."itemid", i."itemname", bi."quantity", bi."priceatsale"
      FROM bill_items bi
      JOIN items i ON bi."itemid" = i."itemid"
      WHERE bi."billid" = $1
    `;
    const itemsResult = await pool.query(itemsQuery, [billData.billid]);

    res.json({
      ...billData,
      items: itemsResult.rows
    });
  } catch (err) {
    console.error('Error fetching single bill:', err);
    res.status(500).json({ error: 'Internal server error fetching single bill details.' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
