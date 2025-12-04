// Script to generate and update admin password
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateAdminPassword() {
    try {
        // Generate hash for 'pa55w0rd'
        const password = 'pa55w0rd';
        const hash = await bcrypt.hash(password, 10);

        console.log('✅ Generated hash for password:', password);
        console.log('Hash:', hash);

        // Connect to database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'flowerforge'
        });

        console.log('✅ Connected to database');

        // Update admin password
        const [result] = await connection.execute(
            'UPDATE admins SET password = ? WHERE email = ?',
            [hash, 'admin@flower.com']
        );

        console.log('✅ Updated admin password');
        console.log('Rows affected:', result.affectedRows);

        // Verify the update
        const [rows] = await connection.execute(
            'SELECT id, email, name, role FROM admins WHERE email = ?',
            ['admin@flower.com']
        );

        if (rows.length > 0) {
            console.log('✅ Admin account found:');
            console.log(rows[0]);
        } else {
            console.log('❌ Admin account not found!');
        }

        await connection.end();

        console.log('\n🎉 Done! You can now login with:');
        console.log('Email: admin@flower.com');
        console.log('Password: pa55w0rd');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

updateAdminPassword();
