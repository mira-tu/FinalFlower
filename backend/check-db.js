const { pool } = require('./config/database');

async function checkUsersTable() {
    try {
        const [result] = await pool.query('DESCRIBE users');
        console.log('Users table structure:');
        console.table(result);

        const [count] = await pool.query('SELECT COUNT(*) as count FROM users');
        console.log(`\nTotal users: ${count[0].count}`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkUsersTable();
