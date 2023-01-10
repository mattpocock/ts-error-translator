import * as vscode from 'vscode';
import { showBeginnerQuestion } from './showBeginnerQuestion';

export const showTipsQuestion = () => {
  vscode.window
    .showInformationMessage(
      `Would you like to view helpful hints for TypeScript?`,
      'Yes',
      'No',
    )
    .then((res) => {
      if (!res) {
        return;
      }
      vscode.workspace
        .getConfiguration('totalTypeScript')
        .update('hideAllTips', res === 'No', vscode.ConfigurationTarget.Global);

      showBeginnerQuestion();
    });
};
