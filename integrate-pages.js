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

// --- CLOUDFLARE HYGIENE: VAPORIZE OVERWEIGHT ASSETS (> 25MB) ---
console.log('\n🛡️ Initiating Hyper-Hygiene Scan for Cloudflare File Size Protocol...');
const MAX_FILE_SIZE = 24 * 1024 * 1024; // 24 MiB (Slightly under 25MB for safety)

function purgeHeavyAssetsRecursive(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      purgeHeavyAssetsRecursive(fullPath);
    } else if (stat.isFile() && stat.size > MAX_FILE_SIZE) {
      console.log(`🚫 Vaporizing overweight asset: ${item} (${(stat.size / (1024 * 1024)).toFixed(1)} MB)`);
      fs.unlinkSync(fullPath);
    }
  });
}

purgeHeavyAssetsRecursive(destDir);

console.log('✅ Hyper-Hygiene protocols completed successfully.');
console.log('🚀 Pages Bundle Integration Complete.');
