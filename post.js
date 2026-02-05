const core = require('@actions/core');
const fs = require('fs');
const { execSync } = require('child_process');

try {
  const isolatedHome = core.getState('isolated-home');

  if (!isolatedHome) {
    console.log('No isolated HOME to clean up');
    process.exit(0);
  }

  if (!fs.existsSync(isolatedHome)) {
    console.log(`Directory ${isolatedHome} does not exist, skipping cleanup`);
    process.exit(0);
  }

  console.log('Post: Removing read-only restrictions from Go cache...');

  try {
    // Fix permissions
    execSync(`chmod -R +w "${isolatedHome}"`, { stdio: 'inherit' });
  } catch (error) {
    console.warn('Warning: Failed to change permissions, continuing...');
  }

  // Remove directory
  fs.rmSync(isolatedHome, { recursive: true, force: true });

  console.log('Post: Isolated HOME cleaned successfully');
} catch (error) {
  core.warning(`Cleanup failed: ${error.message}`);
  // Don't fail the workflow on cleanup errors
}
