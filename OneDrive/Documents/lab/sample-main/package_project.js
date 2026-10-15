const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const source = 'C:\\Users\\anubh\\.gemini\\antigravity\\scratch\\vedxlabs';
const staging = 'C:\\Users\\anubh\\.gemini\\antigravity\\scratch\\staging_clean';
const destination = 'C:\\Users\\anubh\\Downloads\\vedxlabs-complete-project.zip';

// Clean staging
if (fs.existsSync(staging)) {
  fs.rmSync(staging, { recursive: true, force: true });
}
fs.mkdirSync(staging, { recursive: true });

// Exclusions: node_modules, .next, .git, .env files, private auth credentials
const excludeList = new Set(['node_modules', '.next', '.git', 'staging_clean', 'staging_zip']);

function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (excludeList.has(entry.name)) continue;
    if (entry.name.startsWith('.env')) continue;
    if (entry.name === '.admin_auth.json') continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(source, staging);

if (fs.existsSync(destination)) {
  fs.unlinkSync(destination);
}

// Compress using PowerShell Compress-Archive
console.log('Compressing files to Downloads...');
execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${staging}\\*' -DestinationPath '${destination}' -Force"`);

// Clean staging
fs.rmSync(staging, { recursive: true, force: true });

// Verify zip content
const zipStats = fs.statSync(destination);
console.log('ZIP Created Successfully!');
console.log('Path:', destination);
console.log('Size:', (zipStats.size / (1024 * 1024)).toFixed(2), 'MB');
