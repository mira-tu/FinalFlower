const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, search, limit = 20, page = 1 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT p.*, c.name as category_name, c.slug as category_slug
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.is_active = TRUE
        `;
        const params = [];

        if (category) {
            query += ' AND c.slug = ?';
            params.push(category);
        }

        if (search) {
            query += ' AND p.name LIKE ?';
            params.push(`%${search}%`);
        }

        query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [products] = await pool.query(query, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_active = TRUE';
        const countParams = [];

        if (category) {
            countQuery += ' AND c.slug = ?';
            countParams.push(category);
        }
        if (search) {
            countQuery += ' AND p.name LIKE ?';
            countParams.push(`%${search}%`);
        }

        const [countResult] = await pool.query(countQuery, countParams);
        const total = countResult[0].total;

        res.json({
            success: true,
            products,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const [products] = await pool.query(`
            SELECT p.*, c.name as category_name, c.slug as category_slug
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `, [req.params.id]);

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Get reviews
        const [reviews] = await pool.query(`
            SELECT r.*, u.name as user_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.product_id = ?
            ORDER BY r.created_at DESC
            LIMIT 10
        `, [req.params.id]);

        // Calculate average rating
        const [ratingResult] = await pool.query(
            'SELECT AVG(rating) as average_rating, COUNT(*) as review_count FROM reviews WHERE product_id = ?',
            [req.params.id]
        );

        const product = {
            ...products[0],
            reviews,
            average_rating: ratingResult[0].average_rating || 0,
            review_count: ratingResult[0].review_count
        };

        res.json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

const upload = require('../middleware/upload');

// @route   POST /api/products
// @desc    Create new product (Admin only)
// @access  Private/Admin
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category_id, stock_quantity } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name and price'
            });
        }

        const [result] = await pool.query(
            'INSERT INTO products (name, description, price, category_id, stock_quantity, is_active, image_url) VALUES (?, ?, ?, ?, ?, TRUE, ?)',
            [name, description || '', price, category_id || 1, stock_quantity || 0, image_url]
        );

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product: {
                id: result.insertId,
                name,
                description,
                price,
                category_id,
                stock_quantity,
                image_url
            }
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/products/:id
// @desc    Update product (Admin only)
// @access  Private/Admin
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category_id, stock_quantity } = req.body;
        let image_url = req.body.image_url; // Keep existing image if not updated

        if (req.file) {
            image_url = `/uploads/${req.file.filename}`;
        }

        const [result] = await pool.query(
            'UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, stock_quantity = ?, image_url = ? WHERE id = ?',
            [name, description, price, category_id, stock_quantity, image_url, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product updated successfully'
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin only)
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM products WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
