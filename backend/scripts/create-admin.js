// Script to create admin account
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAdminAccount() {
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

        // Check if admin exists
        const [existing] = await connection.execute(
            'SELECT * FROM admins WHERE email = ?',
            ['admin@flower.com']
        );

        if (existing.length > 0) {
            console.log('⚠️  Admin already exists, updating password...');
            await connection.execute(
                'UPDATE admins SET password = ? WHERE email = ?',
                [hash, 'admin@flower.com']
            );
            console.log('✅ Password updated');
        } else {
            console.log('Creating new admin account...');
            await connection.execute(
                'INSERT INTO admins (email, password, name, role) VALUES (?, ?, ?, ?)',
                ['admin@flower.com', hash, 'System Administrator', 'admin']
            );
            console.log('✅ Admin account created');
        }

        // Verify
        const [rows] = await connection.execute(
            'SELECT id, email, name, role, created_at FROM admins WHERE email = ?',
            ['admin@flower.com']
        );

        console.log('\n✅ Admin account details:');
        console.log(rows[0]);

        await connection.end();

        console.log('\n🎉 Success! You can now login with:');
        console.log('Email: admin@flower.com');
        console.log('Password: pa55w0rd');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', error);
    }
}

createAdminAccount();
