import { getInput, setOutput, logInfo, logError } from '@actions/shared';

async function run() {
  try {
    const path = getInput('path');
    logInfo(`Checking out repository at ${path}`);
    setOutput('status', 'success');
  } catch (error) {
    logError(`Action failed: ${error}`);
    process.exit(1);
  }
}

run();
