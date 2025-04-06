#!/usr/bin/env node

/**
 * Reset Project Script
 * This script provides a complete reset and cleanup for the project.
 * It removes node_modules, clears caches, reinstalls dependencies,
 * and properly configures the project.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const isWindows = os.platform() === 'win32';
const command = (cmd) => {
  try {
    console.log(`\n🚀 Running: ${cmd}\n`);
    execSync(cmd, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`\n❌ Error executing: ${cmd}\n`);
    console.error(error.message);
    return false;
  }
};

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

console.log(`\n${colors.bright}${colors.cyan}=== UG Campus Navigator Project Reset ====${colors.reset}\n`);
console.log(`${colors.yellow}This script will reset the project to a clean state.${colors.reset}`);
console.log(`${colors.yellow}It will delete node_modules, clear caches, and reinstall dependencies.${colors.reset}\n`);

// Step 1: Kill any running processes
console.log(`\n${colors.bright}${colors.green}Step 1: Killing running processes${colors.reset}`);
if (isWindows) {
  command('taskkill /F /IM node.exe /T');
} else {
  command('killall -9 node || true');
}

// Step 2: Clear Watchman watches (if available)
console.log(`\n${colors.bright}${colors.green}Step 2: Clearing Watchman watches${colors.reset}`);
if (!isWindows) {
  command('watchman watch-del-all || true');
}

// Step 3: Remove metro cache
console.log(`\n${colors.bright}${colors.green}Step 3: Remove Metro bundler cache${colors.reset}`);
const tempDir = os.tmpdir();
if (isWindows) {
  command(`if exist "${tempDir}\\metro-*" rmdir /s /q "${tempDir}\\metro-*"`);
} else {
  command(`rm -rf ${tempDir}/metro-* || true`);
}

// Step 4: Remove node_modules
console.log(`\n${colors.bright}${colors.green}Step 4: Removing node_modules${colors.reset}`);
command(isWindows ? 'if exist node_modules rmdir /s /q node_modules' : 'rm -rf node_modules');

// Step 5: Remove lock files
console.log(`\n${colors.bright}${colors.green}Step 5: Removing lock files${colors.reset}`);
if (fs.existsSync('package-lock.json')) {
  fs.unlinkSync('package-lock.json');
  console.log('Removed package-lock.json');
}
if (fs.existsSync('yarn.lock')) {
  fs.unlinkSync('yarn.lock');
  console.log('Removed yarn.lock');
}

// Step 6: Clear React Native cache
console.log(`\n${colors.bright}${colors.green}Step 6: Clearing React Native cache${colors.reset}`);
command(isWindows ? 'if exist .expo rmdir /s /q .expo' : 'rm -rf .expo');

// Step 7: Clean npm cache
console.log(`\n${colors.bright}${colors.green}Step 7: Cleaning npm cache${colors.reset}`);
command('npm cache clean --force');

// Step 8: Install dependencies
console.log(`\n${colors.bright}${colors.green}Step 8: Reinstalling dependencies${colors.reset}`);
if (!command('npm install')) {
  console.error(`\n${colors.red}Failed to reinstall dependencies. Project reset incomplete.${colors.reset}`);
  process.exit(1);
}

// Step 9: Install Expo properly
console.log(`\n${colors.bright}${colors.green}Step 9: Installing Expo and fixing dependencies${colors.reset}`);
command('npx expo install --check');

// Step 10: Run expo doctor to fix any issues
console.log(`\n${colors.bright}${colors.green}Step 10: Running expo doctor${colors.reset}`);
command('npx expo doctor --fix-dependencies');

console.log(`\n${colors.bright}${colors.green}Project has been reset successfully!${colors.reset}`);
console.log(`${colors.cyan}You can now run 'npm start' to start the project.${colors.reset}\n`);
