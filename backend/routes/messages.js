const express = require('express');
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
        
        const [result] = await pool.query(`
            INSERT INTO messages (order_id, sender_id, sender_type, content)
            VALUES (?, ?, 'customer', ?)
        `, [order_id || null, req.user.id, content]);
        
        res.status(201).json({ success: true, message_id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;