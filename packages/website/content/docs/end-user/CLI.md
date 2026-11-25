# Command Line Interface

```
Usage: deskbuddy [commands] [path ...]

  Available commands:

        --debug                   Enable debug mode
        --safe                    Disable plugins and other user configuration
    -n, --new-window              Open a new window on second-instance
        --user-data-dir           Change the user data directory
        --disable-gpu             Disable GPU hardware acceleration
        --disable-spellcheck      Disable the spell checker for this session
    -v, --verbose                 Be verbose
        --version                 Print version information
    -h, --help                    Print this help message
```

## Making `deskbuddy` available in your shell

`deskbuddy` has to point at your installation of DeskBuddy. Where that is — and what you have
to do about it — varies from platform to platform.

### Linux

The `.deb` and `.rpm` packages already install `/usr/bin/deskbuddy`, and the Snap exposes a
`deskbuddy` command, so there is nothing to set up. For the AppImage or the tarball, alias the
binary you extracted:

```sh
alias deskbuddy="$HOME/Applications/deskbuddy.AppImage"
```

### macOS

```sh
alias deskbuddy="/Applications/deskbuddy.app/Contents/MacOS/deskbuddy"
```

### Windows

Add the installation directory to your `PATH` — `%LOCALAPPDATA%\Programs\deskbuddy` for a
default install — or save a wrapper like this one as `deskbuddy.cmd` in a directory that is
already on it:

```bat
@echo off
"%LOCALAPPDATA%\Programs\deskbuddy\deskbuddy.exe" %*
```

Do **not** put a symlink, a hard link or a lone copy of `deskbuddy.exe` on your `PATH`.
Chromium looks for `icudtl.dat` and the other bundled resources in the directory of the
executable path it was launched from, and Windows reports the link's own path rather than the
target's. DeskBuddy then aborts before it starts, printing only:

```
[ERROR:base\i18n\icu_util.cc:232] Invalid file descriptor to ICU data received.
```

Linking is safe on Linux — `/usr/bin/deskbuddy` from the `.deb` and `.rpm` packages is itself a
symlink into `/opt/deskbuddy` — because the kernel resolves the link before the process starts.
