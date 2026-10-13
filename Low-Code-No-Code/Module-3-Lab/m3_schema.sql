-- Module 3 tables: orders, tickets
-- Load with (PowerShell):
--   Get-Content m3_schema.sql | docker exec -i mysql mysql -un8n -pn8npass bizdb
-- Re-running this script resets these tables.

DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  order_id  VARCHAR(10) PRIMARY KEY,
  customer  VARCHAR(100) NOT NULL,
  country   VARCHAR(50),
  currency  CHAR(3) NOT NULL,
  amount    DECIMAL(12,2) NOT NULL
);

INSERT INTO orders (order_id, customer, country, currency, amount) VALUES
  ('ORD-101', 'Brightline Inc',        'USA',       'USD',   1200.00),
  ('ORD-102', 'Muller GmbH',           'Germany',   'EUR',    850.00),
  ('ORD-103', 'Thames Traders Ltd',    'UK',        'GBP',    400.00),
  ('ORD-104', 'Sakura Retail KK',      'Japan',     'JPY', 250000.00),
  ('ORD-105', 'Outback Supplies',      'Australia', 'AUD',   1750.00),
  ('ORD-106', 'Pune Local Stores',     'India',     'INR',  48000.00);

-- tickets is shared with Module 5 (m5_schema.sql adds the AI columns' data).
DROP TABLE IF EXISTS tickets;
CREATE TABLE tickets (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id   VARCHAR(30) NOT NULL UNIQUE,
  name        VARCHAR(100),
  email       VARCHAR(150) NOT NULL,
  issue       TEXT,
  category    VARCHAR(30),
  priority    VARCHAR(10),
  sla_hours   INT,
  summary     VARCHAR(255),
  status      VARCHAR(20) NOT NULL DEFAULT 'Open',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
