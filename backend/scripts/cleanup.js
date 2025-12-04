// Cleanup script to remove duplicated files
// Run: node scripts/cleanup.js

const fs = require('fs');
const path = require('path');

console.log('🧹 FlowerForge Cleanup Script');
console.log('================================\n');

const filesToRemove = [
    '../src/pages/MyOrders.jsx',
    '../src/pages/AdminDashboard.native.jsx'
];

const rootDir = path.join(__dirname, '..');

filesToRemove.forEach(file => {
    const filePath = path.join(__dirname, file);

    if (fs.existsSync(filePath)) {
        try {
            // Create backup first
            const backupPath = filePath + '.backup';
            fs.copyFileSync(filePath, backupPath);
            console.log(`📦 Backed up: ${file}.backup`);

            // Remove original
            fs.unlinkSync(filePath);
            console.log(`✅ Removed: ${file}`);
        } catch (error) {
            console.error(`❌ Error removing ${file}:`, error.message);
        }
    } else {
        console.log(`⏭️  Skipped: ${file} (not found)`);
    }
});

console.log('\n✨ Cleanup complete!');
console.log('\nNote: Backup files created with .backup extension');
console.log('You can safely delete them after verifying everything works.\n');
