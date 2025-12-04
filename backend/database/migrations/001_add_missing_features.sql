-- Migration: Add missing features to FlowerForge database
-- Run this to update existing database

USE flowerforge;

-- =====================================================
-- ADD MISSING COLUMNS TO EXISTING TABLES
-- =====================================================

-- Add is_featured to products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE AFTER is_active,
ADD COLUMN IF NOT EXISTS compare_price DECIMAL(10,2) AFTER price,
ADD COLUMN IF NOT EXISTS images JSON AFTER image_url,
ADD COLUMN IF NOT EXISTS tags JSON AFTER is_featured;

CREATE INDEX IF NOT EXISTS idx_is_featured ON products(is_featured);

-- Add accepted and declined status to orders
ALTER TABLE orders 
MODIFY COLUMN status ENUM('pending', 'accepted', 'processing', 'ready_for_pickup', 'out_for_delivery', 'claimed', 'completed', 'cancelled', 'declined') DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS decline_reason TEXT AFTER admin_notes,
ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP NULL AFTER decline_reason,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP NULL AFTER accepted_at,
ADD COLUMN IF NOT EXISTS discount DECIMAL(10,2) DEFAULT 0 AFTER delivery_fee;

-- Add more statuses to requests
ALTER TABLE requests 
MODIFY COLUMN status ENUM('pending', 'viewed', 'quoted', 'accepted', 'in_progress', 'completed', 'cancelled', 'declined') DEFAULT 'pending',
MODIFY COLUMN type ENUM('booking', 'customized', 'special_order', 'inquiry') NOT NULL,
ADD COLUMN IF NOT EXISTS photos JSON AFTER photo_url,
ADD COLUMN IF NOT EXISTS admin_response TEXT AFTER admin_notes,
ADD COLUMN IF NOT EXISTS event_date DATETIME AFTER admin_response,
ADD COLUMN IF NOT EXISTS event_type VARCHAR(100) AFTER event_date;

-- =====================================================
-- CREATE CART TABLE
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
-- CREATE INQUIRIES TABLE
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
-- CREATE CHAT TABLES
-- =====================================================

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

-- =====================================================
-- CREATE INQUIRY NUMBER TRIGGER
-- =====================================================

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

-- =====================================================
-- UPDATE NOTIFICATIONS FOR ADMIN SUPPORT
-- =====================================================

ALTER TABLE notifications
ADD COLUMN IF NOT EXISTS admin_id INT AFTER user_id,
ADD COLUMN IF NOT EXISTS target_type ENUM('customer', 'admin', 'all') DEFAULT 'customer' AFTER admin_id,
ADD COLUMN IF NOT EXISTS data JSON AFTER link,
MODIFY COLUMN type ENUM('order', 'payment', 'promotion', 'system', 'cancellation', 'chat', 'request') NOT NULL;

SELECT 'Migration completed successfully!' as message;
