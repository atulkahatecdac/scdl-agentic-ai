-- Module 2 tables: leads, expenses, sales
-- Load with (PowerShell):
--   Get-Content m2_schema.sql | docker exec -i mysql mysql -un8n -pn8npass bizdb
-- Re-running this script resets these three tables.

DROP TABLE IF EXISTS leads;
CREATE TABLE leads (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  company     VARCHAR(150),
  budget      VARCHAR(30),
  source      VARCHAR(30),
  segment     VARCHAR(10),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS expenses;
CREATE TABLE expenses (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  expense_id   VARCHAR(30) NOT NULL UNIQUE,
  employee     VARCHAR(100) NOT NULL,
  email        VARCHAR(150) NOT NULL,
  amount       DECIMAL(10,2) NOT NULL,
  category     VARCHAR(30),
  description  VARCHAR(255),
  status       VARCHAR(20) NOT NULL DEFAULT 'Pending',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS sales;
CREATE TABLE sales (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  sale_date  DATE NOT NULL,
  region     VARCHAR(20) NOT NULL,
  product    VARCHAR(50) NOT NULL,
  amount     DECIMAL(10,2) NOT NULL
);

-- Sample sales for the last 3 days (relative to the day you load this file),
-- so WF3's "yesterday" query always has data.
INSERT INTO sales (sale_date, region, product, amount) VALUES
  (CURDATE() - INTERVAL 1 DAY, 'West',  'Laptop',        62000),
  (CURDATE() - INTERVAL 1 DAY, 'West',  'Printer',       14500),
  (CURDATE() - INTERVAL 1 DAY, 'West',  'Monitor',       11800),
  (CURDATE() - INTERVAL 1 DAY, 'North', 'Laptop',        58500),
  (CURDATE() - INTERVAL 1 DAY, 'North', 'Router',         4200),
  (CURDATE() - INTERVAL 1 DAY, 'South', 'Monitor',       12300),
  (CURDATE() - INTERVAL 1 DAY, 'South', 'Keyboard',       1900),
  (CURDATE() - INTERVAL 1 DAY, 'South', 'Laptop',        61000),
  (CURDATE() - INTERVAL 1 DAY, 'East',  'Printer',       15200),
  (CURDATE() - INTERVAL 2 DAY, 'West',  'Laptop',        60500),
  (CURDATE() - INTERVAL 2 DAY, 'North', 'Monitor',       11900),
  (CURDATE() - INTERVAL 2 DAY, 'East',  'Router',         4100),
  (CURDATE() - INTERVAL 3 DAY, 'South', 'Laptop',        59900),
  (CURDATE() - INTERVAL 3 DAY, 'West',  'Keyboard',       2100);
