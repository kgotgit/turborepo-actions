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
export declare class GitHubAppClient {
    private octokit;
    constructor(token: string);
    createIssueComment(comment: IssueComment): Promise<void>;
    createCheckRun(name: string, status: 'queued' | 'in_progress' | 'completed'): Promise<void>;
    createDeployment(environment: string, ref: string): Promise<number>;
    getContext(): import("@actions/github/lib/context").Context;
}
export declare function getGitHubToken(): string;
//# sourceMappingURL=index.d.ts.map