import { info, error as logError } from '@actions/core';

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

export class E2ENotificationBuilder {
  private messages: NotificationMessage[] = [];
  private testResults: E2ETestResult[] = [];

  addTestResult(result: E2ETestResult): this {
    this.testResults.push(result);
    return this;
  }

  addCustomMessage(message: NotificationMessage): this {
    this.messages.push(message);
    return this;
  }

  buildSummary(): string {
    const passed = this.testResults.filter(r => r.status === 'passed').length;
    const failed = this.testResults.filter(r => r.status === 'failed').length;
    const skipped = this.testResults.filter(r => r.status === 'skipped').length;
    const total = this.testResults.length;

    return `
## E2E Test Results 🧪
- ✅ Passed: ${passed}/${total}
- ❌ Failed: ${failed}/${total}
- ⏭️  Skipped: ${skipped}/${total}
`.trim();
  }

  buildDetailedReport(): string {
    let report = this.buildSummary() + '\n\n### Test Details:\n';

    this.testResults.forEach(result => {
      const icon = result.status === 'passed' ? '✅' : 
                   result.status === 'failed' ? '❌' : '⏭️';
      report += `${icon} **${result.testName}** - ${result.duration}ms\n`;
      
      if (result.error) {
        report += `   Error: ${result.error}\n`;
      }
    });

    return report;
  }

  logSummary(): void {
    info(this.buildSummary());
  }

  logDetailedReport(): void {
    info(this.buildDetailedReport());
  }

  getNotifications(): NotificationMessage[] {
    return [...this.messages];
  }
}

export function createE2ENotificationBuilder(): E2ENotificationBuilder {
  return new E2ENotificationBuilder();
}
