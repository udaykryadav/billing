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

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
