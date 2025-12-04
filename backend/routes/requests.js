const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { auth } = require('../middleware/auth');

// Create request
router.post('/', auth, async (req, res) => {
    try {
        const { type, data, photo_url, notes } = req.body;
        
        const [result] = await pool.query(`
            INSERT INTO requests (user_id, type, status, data, photo_url, notes)
            VALUES (?, ?, 'pending', ?, ?, ?)
        `, [req.user.id, type, JSON.stringify(data), photo_url || null, notes || null]);
        
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
        const [requests] = await pool.query(`
            SELECT * FROM requests WHERE user_id = ? ORDER BY created_at DESC
        `, [req.user.id]);
        
        res.json({ success: true, requests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;