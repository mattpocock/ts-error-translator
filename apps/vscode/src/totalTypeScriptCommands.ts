import * as vscode from 'vscode';

class UriEventHandler
  extends vscode.EventEmitter<vscode.Uri>
  implements vscode.UriHandler
{
  public handleUri(uri: vscode.Uri): vscode.ProviderResult<void> {
    this.fire(uri);
  }
}

const terminals = new Set<vscode.Terminal>();

const uriHandler = new UriEventHandler();

export const initTotalTypeScriptCommands = async (
  context: vscode.ExtensionContext,
) => {
  const openFileAndRunTests = async (config: {
    script: string;
    fileUri: vscode.Uri;
  }) => {
    await vscode.window.showTextDocument(config.fileUri);

    terminals.forEach((terminal) => {
      try {
        terminal.dispose();
      } catch (e) {}
    });

    terminals.clear();

    const terminal = vscode.window.createTerminal();

    terminals.add(terminal);

    terminal.sendText(config.script);
    terminal.show(true);
  };

  context.subscriptions.push(
    vscode.window.registerUriHandler(uriHandler),
    uriHandler.event(async (uri) => {
      const info = parseQuery<{
        filename: string;
        repo: string;
        script: string;
      }>(uri);

      for (const folder of vscode.workspace.workspaceFolders || []) {
        if (folder.name === info.repo) {
          await openFileAndRunTests({
            fileUri: vscode.Uri.joinPath(folder.uri, info.filename),
            script: info.script,
          });
          return;
        }
      }

      // Tries scanning other workspaces at the same level for the right folder

      const candidateRepos = await vscode.workspace.fs.readDirectory(
        vscode.Uri.joinPath(
          vscode.Uri.parse(vscode.workspace.rootPath!),
          '../',
        ),
      );

      const candidateRepo = candidateRepos.find(([name]) => name === info.repo);

      console.log(candidateRepo, info.repo);

      if (candidateRepo) {
        const rootUri = vscode.Uri.joinPath(
          vscode.Uri.parse(vscode.workspace.rootPath!),
          '../',
          candidateRepo[0],
        );

        await vscode.workspace.updateWorkspaceFolders(
          vscode.workspace.workspaceFolders?.length || 0,
          0,
          {
            uri: rootUri,
          },
        );

        await openFileAndRunTests({
          fileUri: vscode.Uri.joinPath(rootUri, info.filename),
          script: info.script,
        });
        return;
      }

      vscode.window
        .showErrorMessage(
          `Could not find the right file in this repository.`,
          {
            detail: `Looks like this isn't total-typescript/${info.repo}. Would you like to clone it?`,
            modal: true,
          },
          'Clone from GitHub',
        )
        .then((action) => {
          if (action === 'Clone from GitHub') {
            vscode.env.openExternal(
              vscode.Uri.parse(
                `https://github.com/total-typescript/${info.repo}`,
              ),
            );
          }
        });
    }),
  );
};

function parseQuery<T>(uri: vscode.Uri): T {
  return uri.query.split('&').reduce((prev: any, current) => {
    const queryString = current.split('=');
    prev[queryString[0]] = queryString[1];
    return prev;
  }, {});
}
