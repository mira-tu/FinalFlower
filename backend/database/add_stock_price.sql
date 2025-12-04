-- Add price column to stock table
ALTER TABLE stock ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0 AFTER quantity;

-- Insert sample stock data
INSERT INTO stock (name, category, quantity, price, unit, reorder_level, is_available) VALUES
('Red Satin Ribbon', 'Ribbons', 50, 25.00, 'meters', 10, TRUE),
('Gold Foil Wrapper', 'Wrappers', 100, 15.00, 'pieces', 20, TRUE),
('Fresh Red Roses', 'Flowers', 200, 50.00, 'stems', 50, TRUE),
('Blue Organza Ribbon', 'Ribbons', 30, 30.00, 'meters', 10, TRUE),
('Clear Cellophane', 'Wrappers', 75, 20.00, 'sheets', 15, TRUE),
('White Lilies', 'Flowers', 150, 45.00, 'stems', 40, TRUE),
('Pink Ribbon', 'Ribbons', 40, 28.00, 'meters', 10, TRUE),
('Brown Kraft Paper', 'Wrappers', 60, 12.00, 'sheets', 15, TRUE);

SELECT 'Stock table updated successfully!' as message;
