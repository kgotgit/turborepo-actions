"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureGitUser = configureGitUser;
exports.getChangedFiles = getChangedFiles;
exports.getCurrentBranch = getCurrentBranch;
exports.commitChanges = commitChanges;
exports.getLastCommitHash = getLastCommitHash;
const core_1 = require("@actions/core");
const child_process_1 = require("child_process");
async function configureGitUser(name, email) {
    try {
        (0, child_process_1.execSync)(`git config user.name "${name}"`, { encoding: 'utf-8' });
        (0, child_process_1.execSync)(`git config user.email "${email}"`, { encoding: 'utf-8' });
        (0, core_1.info)(`✅ Git user configured: ${name} <${email}>`);
    }
    catch (error) {
        throw new Error(`Failed to configure git user: ${error}`);
    }
}
async function getChangedFiles() {
    try {
        const output = (0, child_process_1.execSync)('git diff --name-only HEAD', { encoding: 'utf-8' });
        return output.trim().split('\n').filter(f => f.length > 0);
    }
    catch {
        (0, core_1.debug)('No changed files found');
        return [];
    }
}
async function getCurrentBranch() {
    try {
        const branch = (0, child_process_1.execSync)('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' });
        return branch.trim();
    }
    catch (error) {
        throw new Error(`Failed to get current branch: ${error}`);
    }
}
async function commitChanges(config) {
    try {
        if (config.author) {
            await configureGitUser(config.author.name, config.author.email);
        }
        // Add files
        config.files.forEach(file => {
            (0, child_process_1.execSync)(`git add "${file}"`, { encoding: 'utf-8' });
        });
        // Commit
        (0, child_process_1.execSync)(`git commit -m "${config.message}"`, { encoding: 'utf-8' });
        (0, core_1.info)(`✅ Committed: ${config.message}`);
        return true;
    }
    catch (error) {
        (0, core_1.debug)(`No changes to commit or commit failed: ${error}`);
        return false;
    }
}
async function getLastCommitHash() {
    try {
        const hash = (0, child_process_1.execSync)('git rev-parse HEAD', { encoding: 'utf-8' });
        return hash.trim();
    }
    catch (error) {
        throw new Error(`Failed to get last commit hash: ${error}`);
    }
}
//# sourceMappingURL=index.js.map