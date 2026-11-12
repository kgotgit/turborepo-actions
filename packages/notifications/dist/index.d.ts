export interface NotificationMessage {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    body: string;
    metadata?: Record<string, unknown>;
}
export interface E2ETestResult {
    testName: string;
    status: 'passed' | 'failed' | 'skipped';
    duration: number;
    error?: string;
}
export declare class E2ENotificationBuilder {
    private messages;
    private testResults;
    addTestResult(result: E2ETestResult): this;
    addCustomMessage(message: NotificationMessage): this;
    buildSummary(): string;
    buildDetailedReport(): string;
    logSummary(): void;
    logDetailedReport(): void;
    getNotifications(): NotificationMessage[];
}
export declare function createE2ENotificationBuilder(): E2ENotificationBuilder;
//# sourceMappingURL=index.d.ts.map