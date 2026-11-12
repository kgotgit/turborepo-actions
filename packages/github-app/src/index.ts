import { info, getInput } from '@actions/core';
import { context, getOctokit } from '@actions/github';

export interface IssueComment {
  body: string;
  reactions?: {
    '+1': boolean;
    '-1': boolean;
    laugh: boolean;
    confused: boolean;
    heart: boolean;
  };
}

export class GitHubAppClient {
  private octokit: ReturnType<typeof getOctokit>;

  constructor(token: string) {
    this.octokit = getOctokit(token);
  }

  async createIssueComment(comment: IssueComment): Promise<void> {
    const { owner, repo, issue } = context.payload.pull_request 
      ? { ...context.repo, issue: { number: context.payload.pull_request.number } }
      : { ...context.repo, issue: context.issue };

    if (!issue) {
      throw new Error('Unable to find issue/PR number');
    }

    await this.octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: issue.number,
      body: comment.body,
    });

    info(`✅ Comment posted to #${issue.number}`);
  }

  async createCheckRun(name: string, status: 'queued' | 'in_progress' | 'completed'): Promise<void> {
    const { owner, repo } = context.repo;

    await this.octokit.rest.checks.create({
      owner,
      repo,
      name,
      head_sha: context.sha,
      status,
      started_at: new Date().toISOString(),
    });

    info(`✅ Check run created: ${name} (${status})`);
  }

  async createDeployment(environment: string, ref: string): Promise<number> {
    const { owner, repo } = context.repo;

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

    info(`✅ Deployment created to ${environment}`);
    return deploymentId;
  }

  getContext() {
    return context;
  }
}

export function getGitHubToken(): string {
  const token = getInput('github-token') || process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GitHub token not provided');
  }
  return token;
}
