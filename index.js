const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

try {
  const runnerTemp = process.env.RUNNER_TEMP || '/tmp';
  const runId = process.env.GITHUB_RUN_ID || 'unknown';
  const runAttempt = process.env.GITHUB_RUN_ATTEMPT || '1';

  const isolatedHome = path.join(runnerTemp, `go-home-${runId}-${runAttempt}`);

  console.log(`Creating isolated HOME at: ${isolatedHome}`);
  fs.mkdirSync(isolatedHome, { recursive: true });

  // Set environment variables
  core.exportVariable('HOME', isolatedHome);
  core.exportVariable('MY_ISOLATED_HOME', isolatedHome);

  // Save state for post action
  core.saveState('isolated-home', isolatedHome);

  // Set output
  core.setOutput('isolated-home', isolatedHome);

  console.log('Isolated HOME setup completed successfully');
} catch (error) {
  core.setFailed(error.message);
}
