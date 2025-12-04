-- FlowerForge Database Schema
-- MySQL 8.0+
-- Created: 2024-12-04

-- Drop existing database if exists (CAUTION: This will delete all data)
-- DROP DATABASE IF EXISTS flowerforge;

-- Create database
CREATE DATABASE IF NOT EXISTS flowerforge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE flowerforge;

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

-- Users table (customers)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    role ENUM('customer', 'admin', 'employee') DEFAULT 'customer',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- Admins/Employees table
CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee') DEFAULT 'employee',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- =====================================================
-- ADDRESSES
-- =====================================================

CREATE TABLE addresses (
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
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB;

-- Products table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id INT,
    image_url VARCHAR(500),
    stock_quantity INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category_id (category_id),
    INDEX idx_is_active (is_active),
    INDEX idx_name (name)
) ENGINE=InnoDB;

-- =====================================================
-- ORDERS
-- =====================================================

CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    status ENUM('pending', 'processing', 'ready_for_pickup', 'out_for_delivery', 'claimed', 'completed', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('to_pay', 'awaiting_confirmation', 'paid', 'refunded') DEFAULT 'to_pay',
    payment_method ENUM('cash_on_delivery', 'gcash', 'bank_transfer') NOT NULL,
    delivery_method ENUM('delivery', 'pickup') NOT NULL,
    address_id INT,
    pickup_time DATETIME,
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    notes TEXT,
    receipt_url VARCHAR(500),
    admin_notes TEXT,
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
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB;

-- =====================================================
-- REQUESTS (Bookings, Custom, Special Orders)
-- =====================================================

CREATE TABLE requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    request_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    type ENUM('booking', 'customized', 'special_order') NOT NULL,
    status ENUM('pending', 'quoted', 'accepted', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    data JSON NOT NULL,
    photo_url VARCHAR(500),
    estimated_price DECIMAL(10,2),
    final_price DECIMAL(10,2),
    notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_request_number (request_number)
) ENGINE=InnoDB;

-- =====================================================
-- WISHLIST
-- =====================================================

CREATE TABLE wishlists (
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

CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
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

CREATE TABLE stock (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    quantity INT NOT NULL DEFAULT 0,
    unit VARCHAR(50),
    reorder_level INT DEFAULT 10,
    is_available BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_is_available (is_available)
) ENGINE=InnoDB;

-- =====================================================
-- MESSAGES
-- =====================================================

CREATE TABLE messages (
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

CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    type ENUM('order', 'payment', 'promotion', 'system', 'cancellation') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    icon VARCHAR(50),
    link VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- =====================================================
-- CONTENT MANAGEMENT
-- =====================================================

-- About page content
CREATE TABLE about_content (
    id INT PRIMARY KEY DEFAULT 1,
    description TEXT,
    mission TEXT,
    vision TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (id = 1)
) ENGINE=InnoDB;

-- Team members
CREATE TABLE team_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(100) NOT NULL,
    photo_url VARCHAR(500),
    bio TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB;

-- Contact information
CREATE TABLE contact_info (
    id INT PRIMARY KEY DEFAULT 1,
    address VARCHAR(500),
    phone VARCHAR(20),
    email VARCHAR(255),
    business_hours TEXT,
    map_url VARCHAR(1000),
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
('Mothers Day', 'mothers-day', 'Celebrate mothers and motherhood');

-- Insert default admin account
-- Email: admin@flower.com
-- Password: pa55w0rd (hashed with bcrypt)
INSERT INTO admins (email, password, name, role) VALUES
('admin@flower.com', '$2a$10$mX0ec7fEjBCA.EBDgK0IuOrcmdck43qxOs3XaffQdcse2wGUUyF/m', 'System Administrator', 'admin');

-- Insert default about content
INSERT INTO about_content (id, description, mission, vision) VALUES
(1, 
 'Welcome to Jocery\'s Flower Shop! We are passionate about creating beautiful floral arrangements for every occasion.',
 'To provide the freshest, most beautiful flowers and exceptional customer service to our community.',
 'To be the premier flower shop known for quality, creativity, and heartfelt service.'
);

-- Insert default contact info
INSERT INTO contact_info (id, address, phone, email, business_hours, map_url) VALUES
(1,
 'Jocery\'s Flower Shop, 123 Flower Street, Quezon City, Metro Manila',
 '+63 912 345 6789',
 'info@jocerysflowershop.com',
 'Monday - Saturday: 8:00 AM - 6:00 PM\nSunday: 9:00 AM - 5:00 PM',
 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1608.6438299927784!2d122.07320562571662!3d6.908031381591681!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x325041c4ef608537%3A0xbd63d709d92c1d51!2sCagayano%27s%20Panciteria!5e0!3m2!1sen!2sus!4v1763301121573!5m2!1sen!2sus'
);

-- =====================================================
-- VIEWS FOR ANALYTICS
-- =====================================================

-- View: Order statistics
CREATE VIEW order_statistics AS
SELECT 
    COUNT(*) as total_orders,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_orders,
    SUM(CASE WHEN payment_status = 'paid' THEN total ELSE 0 END) as total_revenue,
    AVG(total) as average_order_value
FROM orders;

-- View: Top selling products
CREATE VIEW top_products AS
SELECT 
    p.id,
    p.name,
    p.category_id,
    c.name as category_name,
    SUM(oi.quantity) as total_sold,
    SUM(oi.subtotal) as total_revenue
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN categories c ON p.category_id = c.id
GROUP BY p.id, p.name, p.category_id, c.name
ORDER BY total_sold DESC;

-- View: Low stock items
CREATE VIEW low_stock_items AS
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
-- TRIGGERS
-- =====================================================

-- Trigger: Generate order number
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

-- Trigger: Update product stock after order
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
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional composite indexes
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_orders_created_status ON orders(created_at, status);
CREATE INDEX idx_messages_order_created ON messages(order_id, created_at);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

SELECT 'Database schema created successfully!' as message;
SELECT 'Total tables created:' as info, COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'flowerforge';
