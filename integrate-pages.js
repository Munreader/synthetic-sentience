const fs = require('fs');
const path = require('path');

const sourceDir = path.join(process.cwd(), '.open-next');
const destDir = path.join(sourceDir, 'assets');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

if (!fs.existsSync(sourceDir)) {
  console.error('Error: .open-next directory not found.');
  process.exit(1);
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

console.log('Synchronizing OpenNext bundle to Assets namespace...');

// Get all items in .open-next/
const items = fs.readdirSync(sourceDir);

items.forEach(item => {
  // Skip 'assets' folder to avoid self-recursion
  if (item === 'assets') return;
  
  const srcPath = path.join(sourceDir, item);
  const destPath = path.join(destDir, item);
  
  try {
    copyRecursiveSync(srcPath, destPath);
    console.log(`✓ Merged: ${item}`);
  } catch (err) {
    console.warn(`⚠️ Failed to copy ${item}:`, err.message);
  }
});

// Finally rename worker.js to _worker.js inside the assets directory
const sourceWorker = path.join(destDir, 'worker.js');
const targetWorker = path.join(destDir, '_worker.js');

if (fs.existsSync(sourceWorker)) {
  fs.renameSync(sourceWorker, targetWorker);
  console.log('🚀 Renamed worker.js -> _worker.js successfully!');
} else {
  console.warn('⚠️ Could not find worker.js in destination to rename.');
}

console.log('Pages Bundle Integration Complete.');
