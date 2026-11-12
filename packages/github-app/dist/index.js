"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubAppClient = void 0;
exports.getGitHubToken = getGitHubToken;
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
class GitHubAppClient {
    constructor(token) {
        this.octokit = (0, github_1.getOctokit)(token);
    }
    async createIssueComment(comment) {
        const { owner, repo, issue } = github_1.context.payload.pull_request
            ? { ...github_1.context.repo, issue: { number: github_1.context.payload.pull_request.number } }
            : { ...github_1.context.repo, issue: github_1.context.issue };
        if (!issue) {
            throw new Error('Unable to find issue/PR number');
        }
        await this.octokit.rest.issues.createComment({
            owner,
            repo,
            issue_number: issue.number,
            body: comment.body,
        });
        (0, core_1.info)(`✅ Comment posted to #${issue.number}`);
    }
    async createCheckRun(name, status) {
        const { owner, repo } = github_1.context.repo;
        await this.octokit.rest.checks.create({
            owner,
            repo,
            name,
            head_sha: github_1.context.sha,
            status,
            started_at: new Date().toISOString(),
        });
        (0, core_1.info)(`✅ Check run created: ${name} (${status})`);
    }
    async createDeployment(environment, ref) {
        const { owner, repo } = github_1.context.repo;
        const response = await this.octokit.rest.repos.createDeployment({
            owner,
            repo,
            ref,
            environment,
            required_contexts: [],
            auto_merge: false,
        });
        // Handle both success and error responses
        const deploymentId = 'id' in response.data ? response.data.id : 0;
        (0, core_1.info)(`✅ Deployment created to ${environment}`);
        return deploymentId;
    }
    getContext() {
        return github_1.context;
    }
}
exports.GitHubAppClient = GitHubAppClient;
function getGitHubToken() {
    const token = (0, core_1.getInput)('github-token') || process.env.GITHUB_TOKEN;
    if (!token) {
        throw new Error('GitHub token not provided');
    }
    return token;
}
//# sourceMappingURL=index.js.map