<p align="center"><img src="docs/assets/logo-small.png" alt="DeskBuddy" width="100" height="100"></p>

<h1 align="center">DeskBuddy</h1>

<div align="center">
  <strong>:high_brightness: Next generation markdown editor :crescent_moon:</strong><br>
  A simple and elegant open-source markdown editor that focused on speed and usability.<br>
  <sub>Available for Linux, macOS and Windows.</sub>
</div>

<br>

<div align="center">
  <!-- License -->
  <a href="LICENSE">
    <img src="https://img.shields.io/github/license/faidrogo4/DeskBuddy.svg" alt="LICENSE">
  </a>
</div>

<div align="center">
  <h3>
    <a href="#features">
      Features
    </a>
    <span> | </span>
    <a href="#download-and-installation">
      Downloads
    </a>
    <span> | </span>
    <a href="#development">
      Development
    </a>
    <span> | </span>
    <a href="#contribution">
      Contribution
    </a>
  </h3>
</div>

<div align="center">
  <sub>Translations:</sub>
  <a href="docs/i18n/README-zh_cn.md#readme">
    <span>:cn:</span>
  </a>
  <a href="docs/i18n/README-zh_tw.md#readme">
    <span>:taiwan:</span>
  </a>
  <a href="docs/i18n/README-jp.md#readme">
    <span>:jp:</span>
  </a>
  <a href="docs/i18n/README-fr.md#readme">
    <span>:fr:</span>
  </a>
  <a href="docs/i18n/README-tr.md#readme">
    <span>:tr:</span>
  </a>
  <a href="docs/i18n/README-es.md#readme">
    <span>:es:</span>
  </a>
  <a href="docs/i18n/README-pt.md#readme">
    <span>:portugal:</span>
  </a>
  <a href="docs/i18n/README-kr.md#readme">
    <span>:kr:</span>
  </a>
  <a href="docs/i18n/README-bn.md#readme">
    <span>:bangladesh:</span>
  </a>
</div>

## Screenshot

![](docs/assets/deskbuddy.png?raw=true)

## Features

- Realtime preview (WYSIWYG) and a clean and simple interface to get a distraction-free writing experience.
- Support [CommonMark Spec](https://spec.commonmark.org), [GitHub Flavored Markdown Spec](https://github.github.com/gfm/) and selective support [Pandoc markdown](https://pandoc.org/MANUAL.html#pandocs-markdown).
- Markdown extensions such as math expressions (KaTeX), front matter and emojis.
- Support paragraphs and inline style shortcuts to improve your writing efficiency.
- Output **HTML** and **PDF** files.
- Various [themes](packages/website/content/docs/end-user/THEMES.md): **Cadmium Light**, **Material Dark** etc.
- Various editing modes: **Source Code mode**, **Typewriter mode**, **Focus mode**.
- Paste images directly from clipboard.

## Download and Installation

![platform](https://img.shields.io/static/v1.svg?label=Platform&message=Linux%20x64%20|%20macOS%20x64%2Farm64%20|%20Windows%20x64%2Farm64&style=for-the-badge)

|                ![](https://raw.githubusercontent.com/wiki/ryanoasis/nerd-fonts/screenshots/v1.0.x/mac-pass-sm.png)                |                ![](https://raw.githubusercontent.com/wiki/ryanoasis/nerd-fonts/screenshots/v1.0.x/windows-pass-sm.png)                |               ![](https://raw.githubusercontent.com/wiki/ryanoasis/nerd-fonts/screenshots/v1.0.x/linux-pass-sm.png)               |
| :-------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: |
| [![Download for macOS](https://img.shields.io/badge/macOS-Download-blue)](https://github.com/faidrogo4/DeskBuddy/releases/latest) | [![Download for Windows](https://img.shields.io/badge/Windows-Download-blue)](https://github.com/faidrogo4/DeskBuddy/releases/latest) | [![Download for Linux](https://img.shields.io/badge/Linux-Download-blue)](https://github.com/faidrogo4/DeskBuddy/releases/latest) |

Want to see new features of the latest version? Please refer to the [CHANGELOG](packages/website/content/docs/CHANGELOG.md).

#### macOS

Requires macOS 11 (Big Sur) or later. Universal builds aren't published — pick the matching `arm64` or `x64` installer.

Download the latest `deskbuddy-mac-(arm64|x64)-%version%.dmg` from the [release page](https://github.com/faidrogo4/DeskBuddy/releases/latest).

#### Windows

Requires Windows 10 or 11. Both x64 and arm64 installers are published — pick the architecture that matches your machine.

Simply download and install DeskBuddy via the setup wizard (`deskbuddy-win-(x64|arm64)-%version%-setup.exe`) and choose whether to install per-user or machine wide.

#### Linux

Please follow the [Linux installation instructions](packages/website/content/docs/end-user/INSTALLATION.md).

#### Other

All binaries for Linux, macOS and Windows can be downloaded from the [release page](https://github.com/faidrogo4/DeskBuddy/releases/latest). If a version is unavailable for your system, then please open an [issue](https://github.com/faidrogo4/DeskBuddy/issues).

## Development

If you wish to build DeskBuddy yourself, please check out our [build instructions](packages/website/content/docs/dev/BUILD.md).

- [User documentation](packages/website/content/docs/README.md)
- [Developer documentation](packages/website/content/docs/dev/README.md)

If you have any questions regarding DeskBuddy, you are welcome to write an issue. When doing so please use the default format found when opening an issue. Of course, if you submit a PR directly, it will be greatly appreciated.

## Contribution

DeskBuddy is in development, please make sure to read the [Contributing Guide](.github/CONTRIBUTING.md) before making a pull request.

## License

[**MIT**](LICENSE).
