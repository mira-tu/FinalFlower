const express = require('express');
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

module.exports = router;