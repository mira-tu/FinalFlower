const bcrypt = require('bcryptjs');

const email = 'admin@flower.com';
const password = 'pa55w0rd';

bcrypt.hash(password, 10).then(hash => {
    console.log('\n✅ Password hash generated successfully!\n');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('\nHashed Password:');
    console.log(hash);
    console.log('\n📋 Copy the hash above and use it in your database.\n');
    console.log('SQL Command to update admin:');
    console.log(`UPDATE admins SET email = '${email}', password = '${hash}' WHERE id = 1;`);
    console.log('\n');
});
