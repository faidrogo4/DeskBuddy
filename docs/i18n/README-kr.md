<p align="center"><img src="../assets/logo-small.png" alt="DeskBuddy" width="100" height="100"></p>

<h1 align="center">DeskBuddy</h1>

<div align="center">
  <strong>:high_brightness: 차세대 마크다운 에디터 :crescent_moon:</strong><br>
  속도와 사용성에 초점을 맞춘 단순하고 우아한 오픈 소스 마크다운 에디터.<br>
  <sub>Linux, macOS 및 Windows에서 사용 가능합니다.</sub>
</div>

<br>

<div align="center">
  <!-- License -->
  <a href="../../LICENSE">
    <img src="https://img.shields.io/github/license/faidrogo4/DeskBuddy.svg" alt="LICENSE">
  </a>
</div>

<div align="center">
  <h3>
    <a href="../../README.md#features">
      기능
    </a>
    <span> | </span>
    <a href="../../README.md#download-and-installation">
      다운로드 및 설치
    </a>
    <span> | </span>
    <a href="../../README.md#development">
      개발
    </a>
    <span> | </span>
    <a href="../../README.md#contribution">
      기여
    </a>
  </h3>
</div>

<div align="center">
  <sub>번역:</sub>
  <a href="../../README.md">
    <span>:uk:</span>
  </a>
  <a href="README-zh_cn.md#readme">
    <span>:cn:</span>
  </a>
  <a href="README-zh_tw.md#readme">
    <span>:taiwan:</span>
  </a>
  <a href="README-de.md#readme">
    <span>:de:</span>
  </a>
  <a href="README-jp.md#readme">
    <span>:jp:</span>
  </a>
  <a href="README-fr.md#readme">
    <span>:fr:</span>
  </a>
  <a href="README-tr.md#readme">
    <span>:tr:</span>
  </a>
  <a href="README-es.md#readme">
    <span>:es:</span>
  </a>
  <a href="README-pt.md#readme">
    <span>:portugal:</span>
  </a>
  <a href="README-ar.md#readme">
    <span>:saudi_arabia:</span>
  </a>
  <a href="README-bn.md#readme">
    <span>:bangladesh:</span>
  </a>
</div>

## 스크린샷

![](../assets/deskbuddy.png?raw=true)

## 기능

- 실시간 미리보기(WYSIWYG)와 깔끔하고 단순한 인터페이스로 방해받지 않는 작성 경험을 제공합니다.
- [CommonMark Spec](https://spec.commonmark.org), [GitHub Flavored Markdown Spec](https://github.github.com/gfm/)을 지원하고, [Pandoc markdown](https://pandoc.org/MANUAL.html#pandocs-markdown)을 부분적으로 지원합니다.
- 수식(KaTeX), 프론트 매터, 이모지 등 마크다운 확장 기능.
- 단락 및 인라인 스타일 단축키로 작성 효율을 높여 줍니다.
- **HTML** 및 **PDF** 파일 출력.
- 다양한 [테마](../../packages/website/content/docs/end-user/THEMES.md): **Cadmium Light**, **Material Dark** 등.
- 다양한 편집 모드: **소스 코드 모드**, **타자기 모드**, **포커스 모드**.
- 클립보드에서 직접 이미지를 붙여넣기.

## 다운로드 및 설치

![플랫폼](https://img.shields.io/static/v1.svg?label=Platform&message=Linux-64%20|%20macOS-64%20|%20Win-32%20|%20Win-64&style=for-the-badge)

|                ![](https://raw.githubusercontent.com/wiki/ryanoasis/nerd-fonts/screenshots/v1.0.x/mac-pass-sm.png)                |                ![](https://raw.githubusercontent.com/wiki/ryanoasis/nerd-fonts/screenshots/v1.0.x/windows-pass-sm.png)                |               ![](https://raw.githubusercontent.com/wiki/ryanoasis/nerd-fonts/screenshots/v1.0.x/linux-pass-sm.png)               |
| :-------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: |
| [![Download for macOS](https://img.shields.io/badge/macOS-Download-blue)](https://github.com/faidrogo4/DeskBuddy/releases/latest) | [![Download for Windows](https://img.shields.io/badge/Windows-Download-blue)](https://github.com/faidrogo4/DeskBuddy/releases/latest) | [![Download for Linux](https://img.shields.io/badge/Linux-Download-blue)](https://github.com/faidrogo4/DeskBuddy/releases/latest) |

최신 버전의 새 기능을 확인하고 싶으신가요? [CHANGELOG](../../packages/website/content/docs/CHANGELOG.md)를 참조하세요.

#### macOS

[릴리스 페이지](https://github.com/faidrogo4/DeskBuddy/releases/latest)에서 최신 `deskbuddy-mac-(arm64|x64)-%version%.dmg`를 다운로드하세요.

#### Windows

설치 마법사(`deskbuddy-win-(x64|arm64)-%version%-setup.exe`)를 통해 DeskBuddy를 다운로드하고 설치하여 사용자별 또는 시스템 전체 설치를 선택합니다.

#### Linux

[Linux 설치 지침](../../packages/website/content/docs/end-user/INSTALLATION.md)을 따르세요.

#### 기타

Linux, macOS 및 Windows용 모든 바이너리는 [릴리스 페이지](https://github.com/faidrogo4/DeskBuddy/releases/latest)에서 다운로드할 수 있습니다. 시스템에 사용 가능한 버전이 없으면 [issue](https://github.com/faidrogo4/DeskBuddy/issues)를 열어 주세요.

## 개발

DeskBuddy를 직접 빌드하려면 [빌드 지침](../../packages/website/content/docs/dev/BUILD.md)을 확인하세요.

- [사용자 문서](../../packages/website/content/docs/README.md)
- [개발자 문서](../../packages/website/content/docs/dev/README.md)

DeskBuddy에 관한 질문이 있으면 issue를 작성하세요. 그럴 때는 issue를 열 때 나오는 기본 형식을 사용해 주세요. 물론, PR을 직접 제출하시면 매우 감사하겠습니다.

## 기여

DeskBuddy는 개발 중입니다. pull request를 하기 전에 반드시 [기여 가이드](../../.github/CONTRIBUTING.md)를 읽어 주세요.

## 라이선스

[**MIT**](../../LICENSE).
