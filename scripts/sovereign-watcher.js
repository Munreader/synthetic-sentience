// Sovereign Watcher: Auto-deploy on file save for public/*.html
// Watches for changes in public/*.html and runs 'npx firebase deploy --only hosting'

const chokidar = require('chokidar');
const { exec } = require('child_process');

const watcher = chokidar.watch('public/*.html', {
  persistent: true,
  ignoreInitial: true
});

console.log('Sovereign Watcher active: Watching public/*.html for changes...');

watcher.on('change', (path) => {
  console.log(`File changed: ${path}`);
  const deploy = exec('npx firebase deploy --only hosting', (err, stdout, stderr) => {
    if (err) {
      console.error('Deploy failed:', stderr);
    } else {
      console.log('Deploy complete:', stdout);
    }
  });
});
