-- =====================================================
-- Populate Categories and Products for FinalFlower
-- Run this script to sync frontend products with database
-- =====================================================

USE flowerforge;

-- First, insert categories if they don't exist
INSERT IGNORE INTO categories (name, slug, description) VALUES
('All Souls Day', 'all-souls-day', 'Flowers for All Souls Day remembrance'),
('Get Well Soon', 'get-well-soon', 'Cheerful flowers for recovery'),
('Graduation', 'graduation', 'Celebratory flowers for graduation'),
('Mothers Day', 'mothers-day', 'Special flowers for Mother''s Day'),
('Sympathy', 'sympathy', 'Flowers expressing condolences'),
('Valentines', 'valentines', 'Romantic flowers for Valentine''s Day');

-- Clear existing products (optional - comment out if you want to keep existing products)
-- DELETE FROM products;

-- Insert All Souls Day products
INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Peaceful Tribute', 'A solemn arrangement perfect for All Souls Day remembrance', 1200, 
        (SELECT id FROM categories WHERE slug = 'all-souls-day'), '/uploads/products/ALLSOULSDAY1.png', 25, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Eternal Memory', 'White flowers symbolizing eternal peace and memory', 1350, 
        (SELECT id FROM categories WHERE slug = 'all-souls-day'), '/uploads/products/ALLSOULSDAY2.png', 20, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Solemn Respect', 'Elegant tribute arrangement for honoring loved ones', 1500, 
        (SELECT id FROM categories WHERE slug = 'all-souls-day'), '/uploads/products/ALLSOULSDAY3.png', 15, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('White Remembrance', 'Pure white blooms for peaceful remembrance', 1600, 
        (SELECT id FROM categories WHERE slug = 'all-souls-day'), '/uploads/products/ALLSOULSDAY4.png', 22, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Gentle Peace', 'Soft arrangement bringing comfort and peace', 1450, 
        (SELECT id FROM categories WHERE slug = 'all-souls-day'), '/uploads/products/ALLSOULSDAY5.png', 18, TRUE);

-- Insert Get Well Soon products
INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Sunny Recovery', 'Bright yellow flowers to lift spirits', 1300, 
        (SELECT id FROM categories WHERE slug = 'get-well-soon'), '/uploads/products/GETWELLSOON1.png', 28, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Bright Spirits', 'Cheerful blooms for a speedy recovery', 1250, 
        (SELECT id FROM categories WHERE slug = 'get-well-soon'), '/uploads/products/GETWELLSOON2.png', 30, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Healing Thoughts', 'Warm arrangement sending healing wishes', 1400, 
        (SELECT id FROM categories WHERE slug = 'get-well-soon'), '/uploads/products/GETWELLSOON3.png', 25, TRUE);

-- Insert Graduation products
INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Victory Bloom', 'Celebrate achievement with vibrant flowers', 1500, 
        (SELECT id FROM categories WHERE slug = 'graduation'), '/uploads/products/GRADUATION1.png', 18, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Success Bouquet', 'Perfect gift for graduation success', 1600, 
        (SELECT id FROM categories WHERE slug = 'graduation'), '/uploads/products/GRADUATION2.png', 20, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Bright Future', 'Colorful arrangement for a bright future ahead', 1450, 
        (SELECT id FROM categories WHERE slug = 'graduation'), '/uploads/products/GRADUATION3.png', 22, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Achievement Rose', 'Elegant roses celebrating academic achievement', 1550, 
        (SELECT id FROM categories WHERE slug = 'graduation'), '/uploads/products/GRADUATION4.png', 16, TRUE);

-- Insert Mothers Day products
INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Mom''s Delight', 'Beautiful arrangement to delight any mother', 2000, 
        (SELECT id FROM categories WHERE slug = 'mothers-day'), '/uploads/products/MOTHERSDAY1.png', 30, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Queen for a Day', 'Make mom feel like royalty', 2200, 
        (SELECT id FROM categories WHERE slug = 'mothers-day'), '/uploads/products/MOTHERSDAY2.png', 25, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Sweetest Love', 'Sweet blooms expressing pure love', 1800, 
        (SELECT id FROM categories WHERE slug = 'mothers-day'), '/uploads/products/MOTHERSDAY3.png', 28, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Elegant Mom', 'Sophisticated arrangement for an elegant mother', 2500, 
        (SELECT id FROM categories WHERE slug = 'mothers-day'), '/uploads/products/MOTHERSDAY4.png', 20, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Pink Appreciation', 'Pink flowers showing appreciation and love', 1900, 
        (SELECT id FROM categories WHERE slug = 'mothers-day'), '/uploads/products/MOTHERSDAY5.png', 32, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Mother''s Grace', 'Graceful blooms honoring mothers', 2100, 
        (SELECT id FROM categories WHERE slug = 'mothers-day'), '/uploads/products/MOTHERSDAY6.png', 24, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Loving Heart', 'Heart-shaped arrangement full of love', 2300, 
        (SELECT id FROM categories WHERE slug = 'mothers-day'), '/uploads/products/MOTHERSDAY7.png', 26, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Purest Love', 'Pure white and pink expressing deepest love', 2400, 
        (SELECT id FROM categories WHERE slug = 'mothers-day'), '/uploads/products/MOTHERSDAY8.png', 22, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Forever Mom', 'Timeless arrangement for eternal gratitude', 2600, 
        (SELECT id FROM categories WHERE slug = 'mothers-day'), '/uploads/products/MOTHERSDAY9.png', 18, TRUE);

-- Insert Sympathy products
INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Deepest Sympathy', 'Expressing heartfelt condolences', 1400, 
        (SELECT id FROM categories WHERE slug = 'sympathy'), '/uploads/products/SYMPATHY1.png', 20, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Comforting Lilies', 'White lilies bringing comfort in difficult times', 1600, 
        (SELECT id FROM categories WHERE slug = 'sympathy'), '/uploads/products/SYMPATHY2.png', 18, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Peaceful Rest', 'Serene arrangement for peaceful remembrance', 1500, 
        (SELECT id FROM categories WHERE slug = 'sympathy'), '/uploads/products/SYMPATHY3.png', 22, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('In Loving Memory', 'Honoring cherished memories', 1700, 
        (SELECT id FROM categories WHERE slug = 'sympathy'), '/uploads/products/SYMPATHY4.png', 16, TRUE);

-- Insert Valentines products
INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Valentine''s Passion', 'Passionate red roses for your valentine', 2500, 
        (SELECT id FROM categories WHERE slug = 'valentines'), '/uploads/products/VALENTINES1.png', 15, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Romance Red', 'Classic red roses expressing romance', 2800, 
        (SELECT id FROM categories WHERE slug = 'valentines'), '/uploads/products/VALENTINES6.png', 12, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Sweetheart Rose', 'Sweet pink roses for your sweetheart', 2200, 
        (SELECT id FROM categories WHERE slug = 'valentines'), '/uploads/products/VALENTINES7.png', 20, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Be Mine', 'Romantic arrangement saying "Be Mine"', 2400, 
        (SELECT id FROM categories WHERE slug = 'valentines'), '/uploads/products/VALENTINES8.png', 18, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Love Struck', 'Stunning blooms for those love struck', 2600, 
        (SELECT id FROM categories WHERE slug = 'valentines'), '/uploads/products/VALENTINES9.png', 14, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Cupid''s Arrow', 'Hit by Cupid''s arrow of love', 2300, 
        (SELECT id FROM categories WHERE slug = 'valentines'), '/uploads/products/VALENTINES6.png', 16, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Endless Love', 'Premium arrangement for endless love', 3000, 
        (SELECT id FROM categories WHERE slug = 'valentines'), '/uploads/products/VALENTINES7.png', 10, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('My Valentine', 'Perfect gift for your one and only', 2700, 
        (SELECT id FROM categories WHERE slug = 'valentines'), '/uploads/products/VALENTINES8.png', 13, TRUE);

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_active) 
VALUES ('Forever Yours', 'Declaring forever commitment', 2900, 
        (SELECT id FROM categories WHERE slug = 'valentines'), '/uploads/products/VALENTINES9.png', 11, TRUE);

-- Verify the data
SELECT 'Categories created:' AS Info;
SELECT * FROM categories;

SELECT 'Products created:' AS Info;
SELECT p.id, p.name, p.price, c.name as category, p.stock_quantity 
FROM products p 
LEFT JOIN categories c ON p.category_id = c.id 
ORDER BY c.name, p.name;
