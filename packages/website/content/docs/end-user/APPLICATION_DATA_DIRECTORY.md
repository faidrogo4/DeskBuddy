# Application Data Directory

The per-user application data directory is located in the following directory:

- `%APPDATA%\deskbuddy` on Windows
- `$XDG_CONFIG_HOME/deskbuddy` or `~/.config/deskbuddy` on Linux
- `~/Library/Application Support/deskbuddy` on macOS

When [portable mode](PORTABLE.md) is enabled, the directory location is either the `--user-data-dir` parameter or `deskbuddy-user-data` directory.
