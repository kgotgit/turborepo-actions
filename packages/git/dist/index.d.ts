export interface GitCommitConfig {
    message: string;
    author?: {
        name: string;
        email: string;
    };
    files: string[];
}
export declare function configureGitUser(name: string, email: string): Promise<void>;
export declare function getChangedFiles(): Promise<string[]>;
export declare function getCurrentBranch(): Promise<string>;
export declare function commitChanges(config: GitCommitConfig): Promise<boolean>;
export declare function getLastCommitHash(): Promise<string>;
//# sourceMappingURL=index.d.ts.map