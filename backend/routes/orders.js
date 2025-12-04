const express = require('express');
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
        const [result] = await pool.query(`
            INSERT INTO orders (user_id, status, payment_status, payment_method, delivery_method, address_id, subtotal, delivery_fee, total, notes, receipt_url)
            VALUES (?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
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
                await pool.query(`
                    INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, subtotal)
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [
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
        const [orders] = await pool.query(`
            SELECT o.*, a.street, a.city, a.province
            FROM orders o
            LEFT JOIN addresses a ON o.address_id = a.id
            WHERE o.id = ? AND o.user_id = ?
        `, [req.params.id, req.user.id]);
        
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
        await pool.query(`
            UPDATE orders SET status = 'cancelled' WHERE id = ? AND user_id = ? AND status IN ('pending', 'processing')
        `, [req.params.id, req.user.id]);
        
        res.json({ success: true, message: 'Order cancelled' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;