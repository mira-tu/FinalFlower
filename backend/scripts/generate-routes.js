// This script creates placeholder route files for all API endpoints
// Run: node scripts/generate-routes.js

const fs = require('fs');
const path = require('path');

const routeTemplates = {
    orders: `const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { auth } = require('../middleware/auth');

// Get user orders
router.get('/', auth, async (req, res) => {
    try {
        const { status } = req.query;
        let query = 'SELECT * FROM orders WHERE user_id = ?';
        const params = [req.user.id];
        
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }
        
        query += ' ORDER BY created_at DESC';
        
        const [orders] = await pool.query(query, params);
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Create order
router.post('/', auth, async (req, res) => {
    try {
        const { items, delivery_method, address_id, payment_method, notes, receipt_url } = req.body;
        
        // Calculate totals
        let subtotal = 0;
        for (const item of items) {
            const [products] = await pool.query('SELECT price FROM products WHERE id = ?', [item.product_id]);
            if (products.length > 0) {
                subtotal += products[0].price * item.quantity;
            }
        }
        
        const delivery_fee = delivery_method === 'delivery' ? 100 : 0;
        const total = subtotal + delivery_fee;
        
        // Create order
        const [result] = await pool.query(\`
            INSERT INTO orders (user_id, status, payment_status, payment_method, delivery_method, address_id, subtotal, delivery_fee, total, notes, receipt_url)
            VALUES (?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?)
        \`, [
            req.user.id,
            payment_method === 'cash_on_delivery' ? 'to_pay' : 'awaiting_confirmation',
            payment_method,
            delivery_method,
            address_id || null,
            subtotal,
            delivery_fee,
            total,
            notes || null,
            receipt_url || null
        ]);
        
        const orderId = result.insertId;
        
        // Insert order items
        for (const item of items) {
            const [products] = await pool.query('SELECT name, price FROM products WHERE id = ?', [item.product_id]);
            if (products.length > 0) {
                await pool.query(\`
                    INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, subtotal)
                    VALUES (?, ?, ?, ?, ?, ?)
                \`, [
                    orderId,
                    item.product_id,
                    products[0].name,
                    item.quantity,
                    products[0].price,
                    products[0].price * item.quantity
                ]);
            }
        }
        
        // Get order number
        const [orders] = await pool.query('SELECT order_number FROM orders WHERE id = ?', [orderId]);
        
        res.status(201).json({
            success: true,
            order: {
                id: orderId,
                order_number: orders[0].order_number,
                total
            }
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get order details
router.get('/:id', auth, async (req, res) => {
    try {
        const [orders] = await pool.query(\`
            SELECT o.*, a.street, a.city, a.province
            FROM orders o
            LEFT JOIN addresses a ON o.address_id = a.id
            WHERE o.id = ? AND o.user_id = ?
        \`, [req.params.id, req.user.id]);
        
        if (orders.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
        
        res.json({
            success: true,
            order: {
                ...orders[0],
                items
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Cancel order
router.put('/:id/cancel', auth, async (req, res) => {
    try {
        await pool.query(\`
            UPDATE orders SET status = 'cancelled' WHERE id = ? AND user_id = ? AND status IN ('pending', 'processing')
        \`, [req.params.id, req.user.id]);
        
        res.json({ success: true, message: 'Order cancelled' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;`,

    requests: `const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { auth } = require('../middleware/auth');

// Create request
router.post('/', auth, async (req, res) => {
    try {
        const { type, data, photo_url, notes } = req.body;
        
        const [result] = await pool.query(\`
            INSERT INTO requests (user_id, type, status, data, photo_url, notes)
            VALUES (?, ?, 'pending', ?, ?, ?)
        \`, [req.user.id, type, JSON.stringify(data), photo_url || null, notes || null]);
        
        const [requests] = await pool.query('SELECT request_number FROM requests WHERE id = ?', [result.insertId]);
        
        res.status(201).json({
            success: true,
            request: {
                id: result.insertId,
                request_number: requests[0].request_number
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get user requests
router.get('/', auth, async (req, res) => {
    try {
        const [requests] = await pool.query(\`
            SELECT * FROM requests WHERE user_id = ? ORDER BY created_at DESC
        \`, [req.user.id]);
        
        res.json({ success: true, requests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;`,

    addresses: `const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { auth } = require('../middleware/auth');

// Get user addresses
router.get('/', auth, async (req, res) => {
    try {
        const [addresses] = await pool.query('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC', [req.user.id]);
        res.json({ success: true, addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Add address
router.post('/', auth, async (req, res) => {
    try {
        const { label, recipient_name, phone, street, barangay, city, province, zip_code, is_default } = req.body;
        
        if (is_default) {
            await pool.query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [req.user.id]);
        }
        
        const [result] = await pool.query(\`
            INSERT INTO addresses (user_id, label, recipient_name, phone, street, barangay, city, province, zip_code, is_default)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        \`, [req.user.id, label, recipient_name, phone, street, barangay || null, city, province, zip_code || null, is_default || false]);
        
        res.status(201).json({ success: true, address_id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update address
router.put('/:id', auth, async (req, res) => {
    try {
        const { label, recipient_name, phone, street, barangay, city, province, zip_code } = req.body;
        
        await pool.query(\`
            UPDATE addresses SET label = ?, recipient_name = ?, phone = ?, street = ?, barangay = ?, city = ?, province = ?, zip_code = ?
            WHERE id = ? AND user_id = ?
        \`, [label, recipient_name, phone, street, barangay, city, province, zip_code, req.params.id, req.user.id]);
        
        res.json({ success: true, message: 'Address updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Delete address
router.delete('/:id', auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ success: true, message: 'Address deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Set default address
router.put('/:id/set-default', auth, async (req, res) => {
    try {
        await pool.query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [req.user.id]);
        await pool.query('UPDATE addresses SET is_default = TRUE WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ success: true, message: 'Default address updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;`,

    wishlist: `const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { auth } = require('../middleware/auth');

// Get wishlist
router.get('/', auth, async (req, res) => {
    try {
        const [items] = await pool.query(\`
            SELECT w.*, p.name, p.price, p.image_url
            FROM wishlists w
            JOIN products p ON w.product_id = p.id
            WHERE w.user_id = ?
            ORDER BY w.created_at DESC
        \`, [req.user.id]);
        
        res.json({ success: true, wishlist: items });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Add to wishlist
router.post('/add', auth, async (req, res) => {
    try {
        const { product_id } = req.body;
        
        await pool.query(\`
            INSERT IGNORE INTO wishlists (user_id, product_id) VALUES (?, ?)
        \`, [req.user.id, product_id]);
        
        res.json({ success: true, message: 'Added to wishlist' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Remove from wishlist
router.delete('/remove/:product_id', auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.product_id]);
        res.json({ success: true, message: 'Removed from wishlist' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;`,

    reviews: `const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { auth } = require('../middleware/auth');

// Submit review
router.post('/', auth, async (req, res) => {
    try {
        const { product_id, order_id, rating, comment } = req.body;
        
        const [result] = await pool.query(\`
            INSERT INTO reviews (product_id, user_id, order_id, rating, comment)
            VALUES (?, ?, ?, ?, ?)
        \`, [product_id, req.user.id, order_id || null, rating, comment || null]);
        
        res.status(201).json({ success: true, review_id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get product reviews
router.get('/product/:product_id', async (req, res) => {
    try {
        const [reviews] = await pool.query(\`
            SELECT r.*, u.name as user_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.product_id = ?
            ORDER BY r.created_at DESC
        \`, [req.params.product_id]);
        
        res.json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;`,

    messages: `const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { auth } = require('../middleware/auth');

// Get user messages
router.get('/', auth, async (req, res) => {
    try {
        const { order_id } = req.query;
        let query = 'SELECT * FROM messages WHERE sender_id = ? AND sender_type = "customer"';
        const params = [req.user.id];
        
        if (order_id) {
            query += ' AND order_id = ?';
            params.push(order_id);
        }
        
        query += ' ORDER BY created_at ASC';
        
        const [messages] = await pool.query(query, params);
        res.json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Send message
router.post('/', auth, async (req, res) => {
    try {
        const { order_id, content } = req.body;
        
        const [result] = await pool.query(\`
            INSERT INTO messages (order_id, sender_id, sender_type, content)
            VALUES (?, ?, 'customer', ?)
        \`, [order_id || null, req.user.id, content]);
        
        res.status(201).json({ success: true, message_id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;`,

    notifications: `const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { auth } = require('../middleware/auth');

// Get user notifications
router.get('/', auth, async (req, res) => {
    try {
        const [notifications] = await pool.query(\`
            SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50
        \`, [req.user.id]);
        
        res.json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Mark as read
router.put('/:id/read', auth, async (req, res) => {
    try {
        await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ success: true, message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM notifications WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;`,

    admin: `const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { adminAuth, adminOnly } = require('../middleware/auth');

// Get all orders (Admin/Employee)
router.get('/orders', adminAuth, async (req, res) => {
    try {
        const { status, payment_status } = req.query;
        let query = 'SELECT o.*, u.name as customer_name, u.email as customer_email FROM orders o JOIN users u ON o.user_id = u.id WHERE 1=1';
        const params = [];
        
        if (status) {
            query += ' AND o.status = ?';
            params.push(status);
        }
        if (payment_status) {
            query += ' AND o.payment_status = ?';
            params.push(payment_status);
        }
        
        query += ' ORDER BY o.created_at DESC';
        
        const [orders] = await pool.query(query, params);
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update order status
router.put('/orders/:id/status', adminAuth, async (req, res) => {
    try {
        const { status } = req.body;
        await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ success: true, message: 'Status updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update payment status
router.put('/orders/:id/payment-status', adminAuth, async (req, res) => {
    try {
        const { payment_status } = req.body;
        await pool.query('UPDATE orders SET payment_status = ? WHERE id = ?', [payment_status, req.params.id]);
        res.json({ success: true, message: 'Payment status updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get sales summary (Admin only)
router.get('/sales/summary', adminOnly, async (req, res) => {
    try {
        const [summary] = await pool.query('SELECT * FROM order_statistics');
        res.json({ success: true, summary: summary[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;`,

    upload: `const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { auth } = require('../middleware/auth');

// Upload image
router.post('/image', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        
        const url = \`\${req.protocol}://\${req.get('host')}/uploads/\${req.file.filename}\`;
        
        res.json({
            success: true,
            url,
            filename: req.file.filename
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Upload failed' });
    }
});

module.exports = router;`
};

// Create routes directory if it doesn't exist
const routesDir = path.join(__dirname, '..', 'routes');
if (!fs.existsSync(routesDir)) {
    fs.mkdirSync(routesDir, { recursive: true });
}

// Generate route files
Object.entries(routeTemplates).forEach(([name, content]) => {
    const filePath = path.join(routesDir, `${name}.js`);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Created ${name}.js`);
    } else {
        console.log(`⏭️  Skipped ${name}.js (already exists)`);
    }
});

console.log('\\n🎉 Route generation complete!');
