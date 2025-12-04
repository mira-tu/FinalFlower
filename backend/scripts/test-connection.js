const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('Testing connection with:');
        console.log('Host:', process.env.DB_HOST || 'localhost');
        console.log('Port:', process.env.DB_PORT || 3306);
        console.log('User:', process.env.DB_USER || 'root');
        console.log('Password:', process.env.DB_PASSWORD ? '***' : '(empty)');
        console.log('');

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        console.log('✅ Connection successful!');

        const [rows] = await connection.query('SHOW DATABASES');
        console.log('\n📊 Available databases:');
        rows.forEach(row => console.log('  -', row.Database));

        await connection.end();

    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('Error code:', error.code);
        console.error('Error number:', error.errno);
    }
}

testConnection();
