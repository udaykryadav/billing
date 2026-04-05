const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function main() {
  const adminClient = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  });

  try {
    await adminClient.connect();
    await adminClient.query('CREATE DATABASE billing');
    console.log('Database billing created successfully.');
  } catch (err) {
    if (err.code === '42P04') {
      console.log('Database billing already exists.');
    } else {
      console.error('Error creating database:', err);
    }
  } finally {
    await adminClient.end();
  }

  await delay(1000);

  const billingClient = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'billing',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  });

  try {
    await billingClient.connect();
    const schemaSql = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf8');
    await billingClient.query(schemaSql);
    console.log('Schema executed successfully.');

    const seedSqlPath = path.join(__dirname, '../seed.sql');
    if (fs.existsSync(seedSqlPath)) {
      const seedSql = fs.readFileSync(seedSqlPath, 'utf8');
      await billingClient.query(seedSql);
      console.log('Seed executed successfully.');
    }
  } catch (err) {
    console.error('Error executing schema/seed:', err);
  } finally {
    await billingClient.end();
  }
}

main();
