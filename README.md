# systemdlint-vscode

A vscode extension to lint systemd unit files.

Lot of the code actually written by [vscode-protolint](https://github.com/plexsystems/vscode-protolint) -
so 99.9% of the credit go to them

## Note

**requires** `systemdlint` to be installed locally (run `pip3 install --user systemdlint`)

## Usage

- Install the extension and the tool
- Open any `systemd` unit file (see default selection [here](#default-file-extensions))
- On every saving operation the linter will be executed

## Configuration

| key                                | type          | default                              | description                               |
| ---------------------------------- | ------------- | ------------------------------------ | ----------------------------------------- |
| ssystemdlint-vscode.run.extensions | array[string] | [see here](#default-file-extensions) | File extensions to run the tool on        |
| systemdlint-vscode.update.auto     | boolean       | true                                 | Automatically update systemdlint-adv tool |
| systemdlint-vscode.update.user     | boolean       | true                                 | Update with --user switch                 |

### Default file extensions

- automount
- conf
- link
- mount
- network
- path
- service
- slice
- socket
- swap
- target
- timer
