import * as core from '@actions/core';

export function getInput(name: string): string {
  return core.getInput(name);
}

export function setOutput(name: string, value: string): void {
  core.setOutput(name, value);
}

export function logInfo(message: string): void {
  core.info(message);
}

export function logError(message: string): void {
  core.error(message);
}
