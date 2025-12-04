-- FlowerForge Complete Database Schema
-- MySQL 8.0+
-- Version 2.0 - Full System with All Features

-- Drop existing database if exists (CAUTION: This will delete all data)
-- DROP DATABASE IF EXISTS flowerforge;

-- Create database
CREATE DATABASE IF NOT EXISTS flowerforge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE flowerforge;

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

-- Users table (customers)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    avatar_url VARCHAR(500),
    role ENUM('customer', 'admin', 'employee') DEFAULT 'customer',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- Admins/Employees table
CREATE TABLE IF NOT EXISTS admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    role ENUM('admin', 'employee') DEFAULT 'employee',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- =====================================================
-- ADDRESSES
-- =====================================================

CREATE TABLE IF NOT EXISTS addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    label VARCHAR(50),
    recipient_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    street VARCHAR(255) NOT NULL,
    barangay VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    zip_code VARCHAR(10),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- =====================================================
-- PRODUCTS & CATEGORIES
-- =====================================================

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB;

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2),
    category_id INT,
    image_url VARCHAR(500),
    images JSON,
    stock_quantity INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category_id (category_id),
    INDEX idx_is_active (is_active),
    INDEX idx_is_featured (is_featured),
    INDEX idx_name (name)
) ENGINE=InnoDB;

-- =====================================================
-- SHOPPING CART
-- =====================================================

CREATE TABLE IF NOT EXISTS cart_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    customization JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_item (user_id, product_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- =====================================================
-- ORDERS
-- =====================================================

CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'processing', 'ready_for_pickup', 'out_for_delivery', 'claimed', 'completed', 'cancelled', 'declined') DEFAULT 'pending',
    payment_status ENUM('to_pay', 'awaiting_confirmation', 'paid', 'refunded') DEFAULT 'to_pay',
    payment_method ENUM('cash_on_delivery', 'gcash', 'bank_transfer') NOT NULL,
    delivery_method ENUM('delivery', 'pickup') NOT NULL,
    address_id INT,
    pickup_time DATETIME,
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    notes TEXT,
    receipt_url VARCHAR(500),
    admin_notes TEXT,
    decline_reason TEXT,
    accepted_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_order_number (order_number),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT,
    product_name VARCHAR(255) NOT NULL,
    product_image VARCHAR(500),
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    customization JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB;

-- =====================================================
-- REQUESTS (Bookings, Custom, Special Orders)
-- =====================================================

CREATE TABLE IF NOT EXISTS requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    request_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    type ENUM('booking', 'customized', 'special_order', 'inquiry') NOT NULL,
    status ENUM('pending', 'viewed', 'quoted', 'accepted', 'in_progress', 'completed', 'cancelled', 'declined') DEFAULT 'pending',
    data JSON NOT NULL,
    photo_url VARCHAR(500),
    photos JSON,
    estimated_price DECIMAL(10,2),
    final_price DECIMAL(10,2),
    notes TEXT,
    admin_notes TEXT,
    admin_response TEXT,
    event_date DATETIME,
    event_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_request_number (request_number)
) ENGINE=InnoDB;

-- =====================================================
-- INQUIRIES (Customer to Admin Communication)
-- =====================================================

CREATE TABLE IF NOT EXISTS inquiries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    inquiry_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied', 'resolved', 'closed') DEFAULT 'new',
    admin_id INT,
    admin_reply TEXT,
    replied_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- =====================================================
-- WISHLIST
-- =====================================================

CREATE TABLE IF NOT EXISTS wishlists (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist (user_id, product_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- =====================================================
-- REVIEWS
-- =====================================================

CREATE TABLE IF NOT EXISTS reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_product_id (product_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- =====================================================
-- STOCK/INVENTORY
-- =====================================================

CREATE TABLE IF NOT EXISTS stock (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    quantity INT NOT NULL DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0,
    unit VARCHAR(50),
    reorder_level INT DEFAULT 10,
    is_available BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_is_available (is_available)
) ENGINE=InnoDB;

-- =====================================================
-- CHAT ROOMS & MESSAGES
-- =====================================================

-- Chat rooms for conversations between customers and admins
CREATE TABLE IF NOT EXISTS chat_rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_id INT,
    request_id INT,
    last_message TEXT,
    last_message_at TIMESTAMP NULL,
    user_unread_count INT DEFAULT 0,
    admin_unread_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_last_message_at (last_message_at)
) ENGINE=InnoDB;

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT NOT NULL,
    sender_id INT NOT NULL,
    sender_type ENUM('customer', 'admin') NOT NULL,
    message_type ENUM('text', 'image', 'payment_request', 'payment_confirmation', 'system') DEFAULT 'text',
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    metadata JSON,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    INDEX idx_room_id (room_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- Legacy messages table (keep for backward compatibility)
CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    sender_id INT NOT NULL,
    sender_type ENUM('customer', 'admin') NOT NULL,
    message_type ENUM('text', 'payment_request', 'payment_confirmation', 'system') DEFAULT 'text',
    content TEXT NOT NULL,
    metadata JSON,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_sender_id (sender_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    admin_id INT,
    target_type ENUM('customer', 'admin', 'all') DEFAULT 'customer',
    type ENUM('order', 'payment', 'promotion', 'system', 'cancellation', 'chat', 'request') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    icon VARCHAR(50),
    link VARCHAR(255),
    data JSON,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_admin_id (admin_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- =====================================================
-- CONTENT MANAGEMENT
-- =====================================================

-- About page content
CREATE TABLE IF NOT EXISTS about_content (
    id INT PRIMARY KEY DEFAULT 1,
    title VARCHAR(255) DEFAULT 'About Us',
    description TEXT,
    mission TEXT,
    vision TEXT,
    story TEXT,
    image_url VARCHAR(500),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (id = 1)
) ENGINE=InnoDB;

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(100) NOT NULL,
    photo_url VARCHAR(500),
    bio TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB;

-- Contact information
CREATE TABLE IF NOT EXISTS contact_info (
    id INT PRIMARY KEY DEFAULT 1,
    shop_name VARCHAR(255) DEFAULT 'FlowerForge',
    address VARCHAR(500),
    phone VARCHAR(20),
    email VARCHAR(255),
    business_hours TEXT,
    map_url VARCHAR(1000),
    facebook_url VARCHAR(500),
    instagram_url VARCHAR(500),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (id = 1)
) ENGINE=InnoDB;

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
('Sympathy', 'sympathy', 'Flowers for condolences and sympathy'),
('Graduation', 'graduation', 'Celebrate achievements and milestones'),
('All Souls Day', 'all-souls-day', 'Honor and remember loved ones'),
('Valentines', 'valentines', 'Express love and romance'),
('Get Well Soon', 'get-well-soon', 'Brighten someone\'s day'),
('Mothers Day', 'mothers-day', 'Celebrate mothers and motherhood')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert default admin account
-- Email: admin@flower.com
-- Password: pa55w0rd (hashed with bcrypt)
INSERT INTO admins (email, password, name, role) VALUES
('admin@flower.com', '$2a$10$mX0ec7fEjBCA.EBDgK0IuOrcmdck43qxOs3XaffQdcse2wGUUyF/m', 'System Administrator', 'admin')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert default about content
INSERT INTO about_content (id, description, mission, vision) VALUES
(1, 
 'Welcome to FlowerForge! We are passionate about creating beautiful floral arrangements for every occasion.',
 'To provide the freshest, most beautiful flowers and exceptional customer service to our community.',
 'To be the premier flower shop known for quality, creativity, and heartfelt service.'
) ON DUPLICATE KEY UPDATE id = id;

-- Insert default contact info
INSERT INTO contact_info (id, shop_name, address, phone, email, business_hours, map_url) VALUES
(1,
 'FlowerForge',
 '123 Flower Street, Quezon City, Metro Manila',
 '+63 912 345 6789',
 'info@flowerforge.com',
 'Monday - Saturday: 8:00 AM - 6:00 PM\nSunday: 9:00 AM - 5:00 PM',
 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1608.6438299927784!2d122.07320562571662!3d6.908031381591681'
) ON DUPLICATE KEY UPDATE id = id;

-- Insert sample stock data
INSERT INTO stock (name, category, quantity, price, unit, reorder_level, is_available) VALUES
('Red Satin Ribbon', 'Ribbons', 50, 25.00, 'meters', 10, TRUE),
('Gold Foil Wrapper', 'Wrappers', 100, 15.00, 'pieces', 20, TRUE),
('Fresh Red Roses', 'Flowers', 200, 50.00, 'stems', 50, TRUE),
('Blue Organza Ribbon', 'Ribbons', 30, 30.00, 'meters', 10, TRUE),
('Clear Cellophane', 'Wrappers', 75, 20.00, 'sheets', 15, TRUE),
('White Lilies', 'Flowers', 150, 45.00, 'stems', 40, TRUE),
('Pink Ribbon', 'Ribbons', 40, 28.00, 'meters', 10, TRUE),
('Brown Kraft Paper', 'Wrappers', 60, 12.00, 'sheets', 15, TRUE)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger: Generate order number
DROP TRIGGER IF EXISTS before_order_insert;
DELIMITER //
CREATE TRIGGER before_order_insert
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        SET NEW.order_number = CONCAT('ORD-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(FLOOR(RAND() * 10000), 4, '0'));
    END IF;
END//
DELIMITER ;

-- Trigger: Generate request number
DROP TRIGGER IF EXISTS before_request_insert;
DELIMITER //
CREATE TRIGGER before_request_insert
BEFORE INSERT ON requests
FOR EACH ROW
BEGIN
    IF NEW.request_number IS NULL OR NEW.request_number = '' THEN
        SET NEW.request_number = CONCAT('REQ-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(FLOOR(RAND() * 10000), 4, '0'));
    END IF;
END//
DELIMITER ;

-- Trigger: Generate inquiry number
DROP TRIGGER IF EXISTS before_inquiry_insert;
DELIMITER //
CREATE TRIGGER before_inquiry_insert
BEFORE INSERT ON inquiries
FOR EACH ROW
BEGIN
    IF NEW.inquiry_number IS NULL OR NEW.inquiry_number = '' THEN
        SET NEW.inquiry_number = CONCAT('INQ-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(FLOOR(RAND() * 10000), 4, '0'));
    END IF;
END//
DELIMITER ;

-- Trigger: Update product stock after order
DROP TRIGGER IF EXISTS after_order_item_insert;
DELIMITER //
CREATE TRIGGER after_order_item_insert
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE products 
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE id = NEW.product_id AND stock_quantity >= NEW.quantity;
END//
DELIMITER ;

-- =====================================================
-- VIEWS FOR ANALYTICS
-- =====================================================

-- View: Order statistics
CREATE OR REPLACE VIEW order_statistics AS
SELECT 
    COUNT(*) as total_orders,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_orders,
    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
    SUM(CASE WHEN payment_status = 'paid' THEN total ELSE 0 END) as total_revenue,
    AVG(total) as average_order_value
FROM orders;

-- View: Top selling products
CREATE OR REPLACE VIEW top_products AS
SELECT 
    p.id,
    p.name,
    p.category_id,
    c.name as category_name,
    COALESCE(SUM(oi.quantity), 0) as total_sold,
    COALESCE(SUM(oi.subtotal), 0) as total_revenue
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN categories c ON p.category_id = c.id
GROUP BY p.id, p.name, p.category_id, c.name
ORDER BY total_sold DESC;

-- View: Low stock items
CREATE OR REPLACE VIEW low_stock_items AS
SELECT 
    id,
    name,
    category,
    quantity,
    reorder_level,
    unit
FROM stock
WHERE quantity <= reorder_level AND is_available = TRUE;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional composite indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_created_status ON orders(created_at, status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_created ON chat_messages(room_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);

SELECT 'Complete database schema created/updated successfully!' as message;
