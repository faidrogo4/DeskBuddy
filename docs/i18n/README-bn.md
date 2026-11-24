<p align="center"><img src="../assets/logo-small.png" alt="DeskBuddy" width="100" height="100"></p>

<h1 align="center">DeskBuddy</h1>

<div align="center">
  <strong>:high_brightness: আধুনিক প্রজন্মের Markdown এডিটর :crescent_moon:</strong><br>
  একটি সাধারণ এবং অত্যাধুনিক ওপেন-সোর্স Markdown এডিটর যা গতি এবং ব্যবহারযোগ্যতার দিকে গুরুত্ত দেয়।<br>
  <sub>Linux, macOS এবং Windows-এর জন্য।</sub>
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
      বৈশিষ্ট্য
    </a>
    <span> | </span>
    <a href="../../README.md#download-and-installation">
      ডাউনলোড
    </a>
    <span> | </span>
    <a href="../../README.md#development">
      ডেভেলপমেন্ট
    </a>
    <span> | </span>
    <a href="../../README.md#contribution">
      অবদান
    </a>
  </h3>
</div>

<div align="center">
  <sub>অনুবাদসমূহ:</sub>
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
  <a href="README-kr.md#readme">
    <span>:kr:</span>
  </a>
  <a href="README-ar.md#readme">
    <span>:saudi_arabia:</span>
  </a>
</div>

## স্ক্রিনশট

![](../assets/deskbuddy.png?raw=true)

## বৈশিষ্ট্য

- রিয়েলটাইম প্রিভিউ (WYSIWYG) এবং পরিচ্ছন্ন, আধুনিক ইন্টারফেস আপনাকে গভীর মনোযোগের সাথে লেখার অভিজ্ঞতা দেয়।
- [CommonMark Spec](https://spec.commonmark.org), [GitHub Flavored Markdown Spec](https://github.github.com/gfm/) এবং আংশিকভাবে [Pandoc markdown](https://pandoc.org/MANUAL.html#pandocs-markdown) সমর্থন করে।
- Markdown এক্সটেনশন যেমন গণিতের অভিব্যক্তি (KaTeX), front matter এবং emoji সমর্থন করে।
- দ্রুত লেখার জন্য paragraph ও inline style shortcut সমর্থন করে।
- **HTML** এবং **PDF** ফাইলে এক্সপোর্ট করা যায়।
- বিভিন্ন [theme](../../packages/website/content/docs/end-user/THEMES.md): **Cadmium Light**, **Material Dark** ইত্যাদি।
- বিভিন্ন এডিটিং মোড: **Source Code mode**, **Typewriter mode**, **Focus mode**।
- ক্লিপবোর্ড থেকে সরাসরি ছবি পেস্ট করা যায়।

## ডাউনলোড ও ইনস্টলেশন

![platform](https://img.shields.io/static/v1.svg?label=Platform&message=Linux%20x64%20|%20macOS%20x64%2Farm64%20|%20Windows%20x64%2Farm64&style=for-the-badge)

|                ![](https://raw.githubusercontent.com/wiki/ryanoasis/nerd-fonts/screenshots/v1.0.x/mac-pass-sm.png)                |                ![](https://raw.githubusercontent.com/wiki/ryanoasis/nerd-fonts/screenshots/v1.0.x/windows-pass-sm.png)                |               ![](https://raw.githubusercontent.com/wiki/ryanoasis/nerd-fonts/screenshots/v1.0.x/linux-pass-sm.png)               |
| :-------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: |
| [![Download for macOS](https://img.shields.io/badge/macOS-Download-blue)](https://github.com/faidrogo4/DeskBuddy/releases/latest) | [![Download for Windows](https://img.shields.io/badge/Windows-Download-blue)](https://github.com/faidrogo4/DeskBuddy/releases/latest) | [![Download for Linux](https://img.shields.io/badge/Linux-Download-blue)](https://github.com/faidrogo4/DeskBuddy/releases/latest) |

সর্বশেষ সংস্করণের নতুন ফিচারগুলো দেখতে [CHANGELOG](../../packages/website/content/docs/CHANGELOG.md) দেখুন।

#### macOS

macOS 11 (Big Sur) বা পরবর্তী সংস্করণ প্রয়োজন। Universal build প্রকাশ করা হয় না, তাই আপনার মেশিনের সঙ্গে মিল থাকা `arm64` বা `x64` installer বেছে নিন।

আপনি [release page](https://github.com/faidrogo4/DeskBuddy/releases/latest) থেকে সর্বশেষ `deskbuddy-mac-(arm64|x64)-%version%.dmg` ডাউনলোড করতে পারেন।

#### Windows

Windows 10 অথবা 11 প্রয়োজন। x64 এবং arm64 - উভয় installer প্রকাশ করা হয়, তাই আপনার মেশিনের architecture অনুযায়ীটি বেছে নিন।

শুধু setup wizard (`deskbuddy-win-(x64|arm64)-%version%-setup.exe`) ডাউনলোড করে ইনস্টল করুন এবং user-only নাকি machine-wide ইনস্টল করবেন তা বেছে নিন।

#### Linux

অনুগ্রহ করে [Linux installation instructions](../../packages/website/content/docs/end-user/INSTALLATION.md) অনুসরণ করুন।

#### অন্যান্য

Linux, macOS এবং Windows-এর সব binary [release page](https://github.com/faidrogo4/DeskBuddy/releases/latest) থেকে ডাউনলোড করা যাবে। আপনার সিস্টেমের জন্য কোনো সংস্করণ না থাকলে একটি [issue](https://github.com/faidrogo4/DeskBuddy/issues) খুলুন।

## ডেভেলপমেন্ট

আপনি যদি নিজে DeskBuddy build করতে চান, তাহলে আমাদের [build instructions](../../packages/website/content/docs/dev/BUILD.md) দেখুন।

- [ব্যবহারকারী ডকুমেন্টেশন](../../packages/website/content/docs/README.md)
- [ডেভেলপার ডকুমেন্টেশন](../../packages/website/content/docs/dev/README.md)

DeskBuddy সম্পর্কে আপনার কোনো প্রশ্ন থাকলে issue খুলতে পারেন। Issue খোলার সময় অনুগ্রহ করে ডিফল্ট ফরম্যাটটি ব্যবহার করুন। অবশ্যই, সরাসরি PR পাঠালে সেটিও অত্যন্ত প্রশংসিত হবে।

## অবদান

DeskBuddy এখনো উন্নয়নাধীন, তাই pull request করার আগে [Contributing Guide](../../.github/CONTRIBUTING.md) পড়ে নিন।

## লাইসেন্স

[**MIT**](../../LICENSE)।
