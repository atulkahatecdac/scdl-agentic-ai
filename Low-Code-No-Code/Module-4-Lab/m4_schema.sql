-- Module 4 table: invoices
-- Load with (PowerShell):
--   Get-Content m4_schema.sql | docker exec -i mysql mysql -un8n -pn8npass bizdb

DROP TABLE IF EXISTS invoices;
CREATE TABLE invoices (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  vendor_name     VARCHAR(150),
  invoice_number  VARCHAR(50),
  invoice_date    DATE,
  gstin           VARCHAR(20),
  total_amount    DECIMAL(12,2),
  currency        CHAR(3),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
