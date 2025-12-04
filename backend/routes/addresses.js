const express = require('express');
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
        
        const [result] = await pool.query(`
            INSERT INTO addresses (user_id, label, recipient_name, phone, street, barangay, city, province, zip_code, is_default)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [req.user.id, label, recipient_name, phone, street, barangay || null, city, province, zip_code || null, is_default || false]);
        
        res.status(201).json({ success: true, address_id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update address
router.put('/:id', auth, async (req, res) => {
    try {
        const { label, recipient_name, phone, street, barangay, city, province, zip_code } = req.body;
        
        await pool.query(`
            UPDATE addresses SET label = ?, recipient_name = ?, phone = ?, street = ?, barangay = ?, city = ?, province = ?, zip_code = ?
            WHERE id = ? AND user_id = ?
        `, [label, recipient_name, phone, street, barangay, city, province, zip_code, req.params.id, req.user.id]);
        
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

module.exports = router;