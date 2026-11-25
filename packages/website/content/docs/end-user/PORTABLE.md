# Portable Mode

DeskBuddy stores all user configuration inside the [application data directory](APPLICATION_DATA_DIRECTORY.md) that can be changed with `--user-data-dir` command-line flag.

## Linux and Windows

On Linux and Windows you can also create a directory called `deskbuddy-user-data` to save all user data inside the directory. Like:

```
deskbuddy-portable/
 ├── deskbuddy (Linux) or DeskBuddy.exe (Windows)
 ├── deskbuddy-user-data/
 ├── resources/
 ├── THIRD-PARTY-LICENSES.txt
 └── ...
```
