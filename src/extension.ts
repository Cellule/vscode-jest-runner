'use strict';
import * as vscode from 'vscode';

import { JestRunner } from './jestRunner';
import { JestRunnerCodeLensProvider } from './JestRunnerCodeLensProvider';
import { JestRunnerConfig } from './jestRunnerConfig';

export function activate(context: vscode.ExtensionContext): void {
  const config = new JestRunnerConfig();
  const jestRunner = new JestRunner(config);
  const codeLensProvider = new JestRunnerCodeLensProvider(config.codeLensOptions);

  const runJest = vscode.commands.registerCommand(
    'extension.runMocha',
    async (argument: Record<string, unknown> | string) => {
      return jestRunner.runCurrentTest(argument);
    }
  );

  const runJestCoverage = vscode.commands.registerCommand(
    'extension.runMochaCoverage',
    async (argument: Record<string, unknown> | string) => {
      return jestRunner.runCurrentTest(argument, ['--coverage']);
    }
  );

  const runJestPath = vscode.commands.registerCommand('extension.runMochaPath', async (argument: vscode.Uri) =>
    jestRunner.runTestsOnPath(argument.path)
  );
  const runJestAndUpdateSnapshots = vscode.commands.registerCommand('extension.runMochaAndUpdateSnapshots', async () => {
    jestRunner.runCurrentTest('', ['-u']);
  });
  const runJestFile = vscode.commands.registerCommand('extension.runMochaFile', async () => jestRunner.runCurrentFile());
  const debugJest = vscode.commands.registerCommand(
    'extension.debugMocha',
    async (argument: Record<string, unknown> | string) => {
      if (typeof argument === 'string') {
        return jestRunner.debugCurrentTest(argument);
      } else {
        return jestRunner.debugCurrentTest();
      }
    }
  );
  const debugJestPath = vscode.commands.registerCommand('extension.debugMochaPath', async (argument: vscode.Uri) =>
    jestRunner.debugTestsOnPath(argument.path)
  );
  const runPrev = vscode.commands.registerCommand('extension.runPrevMocha', async () => jestRunner.runPreviousTest());
  const runJestFileWithCoverage = vscode.commands.registerCommand('extension.runMochaFileWithCoverage', async () =>
    jestRunner.runCurrentFile(['--coverage'])
  );

  const runJestFileWithWatchMode = vscode.commands.registerCommand('extension.runMochaFileWithWatchMode', async () =>
    jestRunner.runCurrentFile(['--watch'])
  );

  const watchJest = vscode.commands.registerCommand(
    'extension.watchMocha',
    async (argument: Record<string, unknown> | string) => {
      return jestRunner.runCurrentTest(argument, ['--watch']);
    }
  );

  if (!config.isCodeLensDisabled) {
    const docSelectors: vscode.DocumentFilter[] = [
      {
        pattern: vscode.workspace.getConfiguration().get('mocharunner.codeLensSelector'),
      },
    ];
    const codeLensProviderDisposable = vscode.languages.registerCodeLensProvider(docSelectors, codeLensProvider);
    context.subscriptions.push(codeLensProviderDisposable);
  }
  context.subscriptions.push(runJest);
  context.subscriptions.push(runJestCoverage);
  context.subscriptions.push(runJestAndUpdateSnapshots);
  context.subscriptions.push(runJestFile);
  context.subscriptions.push(runJestPath);
  context.subscriptions.push(debugJest);
  context.subscriptions.push(debugJestPath);
  context.subscriptions.push(runPrev);
  context.subscriptions.push(runJestFileWithCoverage);
  context.subscriptions.push(runJestFileWithWatchMode);
  context.subscriptions.push(watchJest);
}

export function deactivate(): void {
  // deactivate
}
