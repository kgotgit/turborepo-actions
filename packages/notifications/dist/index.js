"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.E2ENotificationBuilder = void 0;
exports.createE2ENotificationBuilder = createE2ENotificationBuilder;
const core_1 = require("@actions/core");
class E2ENotificationBuilder {
    constructor() {
        this.messages = [];
        this.testResults = [];
    }
    addTestResult(result) {
        this.testResults.push(result);
        return this;
    }
    addCustomMessage(message) {
        this.messages.push(message);
        return this;
    }
    buildSummary() {
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
    buildDetailedReport() {
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
    logSummary() {
        (0, core_1.info)(this.buildSummary());
    }
    logDetailedReport() {
        (0, core_1.info)(this.buildDetailedReport());
    }
    getNotifications() {
        return [...this.messages];
    }
}
exports.E2ENotificationBuilder = E2ENotificationBuilder;
function createE2ENotificationBuilder() {
    return new E2ENotificationBuilder();
}
//# sourceMappingURL=index.js.map