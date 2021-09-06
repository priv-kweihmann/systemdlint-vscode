import * as vscode from 'vscode';

export interface SystemdlintError {
  file: string;
  line: number;
  reason: string;
  severity: vscode.DiagnosticSeverity;
}

export function parsesystemdlintError(error: string): SystemdlintError {
  if (!error) {
    return getEmptysystemdlintError();
  }
  const pattern = /^(.*):(\d+):((warning|error|info)) \[(.*?)\] - (.*)$/;

  const match = error.match(pattern)
  if (match) {
    let _sev = vscode.DiagnosticSeverity.Hint;
    if (match[3] == "warning") _sev = vscode.DiagnosticSeverity.Warning;
    else if (match[3] == "error") _sev = vscode.DiagnosticSeverity.Error;
    else _sev = vscode.DiagnosticSeverity.Information;
    
    const systemdlintError: SystemdlintError = {
      file: match[1],
      line: parseInt(match[2], 10),
      reason: `[${match[5]}] ${match[6]}`,
      severity: _sev
    };

    return systemdlintError;
  }

  return getEmptysystemdlintError();
}

export function getEmptysystemdlintError(): SystemdlintError {
  const emptysystemdlintError: SystemdlintError = {
    file: "",
    line: 0,
    reason: "",
    severity: vscode.DiagnosticSeverity.Hint
  };

  return emptysystemdlintError;
}
