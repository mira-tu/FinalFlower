const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { auth } = require('../middleware/auth');

// Submit review
router.post('/', auth, async (req, res) => {
    try {
        const { product_id, order_id, rating, comment } = req.body;
        
        const [result] = await pool.query(`
            INSERT INTO reviews (product_id, user_id, order_id, rating, comment)
            VALUES (?, ?, ?, ?, ?)
        `, [product_id, req.user.id, order_id || null, rating, comment || null]);
        
        res.status(201).json({ success: true, review_id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get product reviews
router.get('/product/:product_id', async (req, res) => {
    try {
        const [reviews] = await pool.query(`
            SELECT r.*, u.name as user_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.product_id = ?
            ORDER BY r.created_at DESC
        `, [req.params.product_id]);
        
        res.json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;