import { info, debug } from '@actions/core';
import { execSync } from 'child_process';

export interface GitCommitConfig {
  message: string;
  author?: {
    name: string;
    email: string;
  };
  files: string[];
}

export async function configureGitUser(name: string, email: string): Promise<void> {
  try {
    execSync(`git config user.name "${name}"`, { encoding: 'utf-8' });
    execSync(`git config user.email "${email}"`, { encoding: 'utf-8' });
    info(`✅ Git user configured: ${name} <${email}>`);
  } catch (error) {
    throw new Error(`Failed to configure git user: ${error}`);
  }
}

export async function getChangedFiles(): Promise<string[]> {
  try {
    const output = execSync('git diff --name-only HEAD', { encoding: 'utf-8' });
    return output.trim().split('\n').filter(f => f.length > 0);
  } catch {
    debug('No changed files found');
    return [];
  }
}

export async function getCurrentBranch(): Promise<string> {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' });
    return branch.trim();
  } catch (error) {
    throw new Error(`Failed to get current branch: ${error}`);
  }
}

export async function commitChanges(config: GitCommitConfig): Promise<boolean> {
  try {
    if (config.author) {
      await configureGitUser(config.author.name, config.author.email);
    }

    // Add files
    config.files.forEach(file => {
      execSync(`git add "${file}"`, { encoding: 'utf-8' });
    });

    // Commit
    execSync(`git commit -m "${config.message}"`, { encoding: 'utf-8' });
    info(`✅ Committed: ${config.message}`);
    return true;
  } catch (error) {
    debug(`No changes to commit or commit failed: ${error}`);
    return false;
  }
}

export async function getLastCommitHash(): Promise<string> {
  try {
    const hash = execSync('git rev-parse HEAD', { encoding: 'utf-8' });
    return hash.trim();
  } catch (error) {
    throw new Error(`Failed to get last commit hash: ${error}`);
  }
}
