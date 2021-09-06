import * as cp from 'child_process';
import * as vscode from 'vscode';
import * as util from 'util';
import { SystemdlintError, parsesystemdlintError } from './systemdlintError';

export interface LinterError {
  proto: SystemdlintError;
  range: vscode.Range;
}

export default class Linter {
  private codeDocument: vscode.TextDocument;

  constructor(document: vscode.TextDocument) {
    this.codeDocument = document;
  }

  public static update():void {   
    const config = vscode.workspace.getConfiguration();
    if (config.get("systemdlint-vscode.update.auto")) {
      const exec = util.promisify(cp.exec);
      let cmd: Array<string> = ["pip3", "install", "--upgrade"];
      if (config.get("systemdlint-vscode.update.user")) {
        cmd.push("--user")
      }
      cmd.push("systemdlint")
      exec(cmd.join(" "));
    }
  }

  public async lint(): Promise<LinterError[]> {
    const errors = await this.runSystemLint();
    if (!errors) {
      return [];
    }

    const lintingErrors: LinterError[] = this.parseErrors(errors);
    return lintingErrors;
  }

  private parseErrors(errorStr: string): LinterError[] {
    let errors = errorStr.split('\n') || [];

    var result = errors.reduce((errors: LinterError[], currentError: string) => {
      const parsedError = parsesystemdlintError(currentError);
      if (!parsedError.reason) {
        return errors;
      }

      const linterError: LinterError = this.createLinterError(parsedError);
      return errors.concat(linterError);
    }, []);

    return result;
  }

  private async runSystemLint(): Promise<string> {
    const currentFile = this.codeDocument.uri.fsPath;
    const config = vscode.workspace.getConfiguration();
    const fileExt = currentFile.split('.').pop();
    const allowedExt = <Array<string>>config.get("systemdlint-vscode.run.extensions");
    if (fileExt && allowedExt.includes(fileExt)) {
      const exec = util.promisify(cp.exec);
      const cmd = `systemdlint --norootfs ${currentFile}`;

      const lintResults = await exec(cmd)
      return lintResults.stderr;
    }
    return ""
  }

  private createLinterError(error: SystemdlintError): LinterError {
    const linterError: LinterError = {
      proto: error,
      range: this.getErrorRange(error)
    };

    return linterError;
  }

  private getErrorRange(error: SystemdlintError): vscode.Range {
    return this.codeDocument.lineAt(error.line - 1).range;
  }
}
