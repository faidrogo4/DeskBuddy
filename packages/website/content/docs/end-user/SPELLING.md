#  Spelling

MarkText checks your text for misspelled words as you type and suggests corrections. Spell checking is on by default and can be turned off in settings under *spelling*. We're using Hunspell for Linux and older Windows versions and on macOS and Window 10 you can choose between Hunspell or the system spell checker (default). You can control the default proofing language via settings but can change the language at runtime via right-click menu `Change Language` entry under `Spelling` without changing the default language. By default MarkText only support American English for Hunspell and the local available languages for the system spell checker. You can download 42 languages for Hunspell and many more for macOS and Windows 10 via system settings.

![](../assets/marktext-spellchecker-menu.png)

## Features

**Automatic language detection:**

MarkText can try to automatically detect the language while typing and we're currently support over 160 languages by Compact Language Detector.

**Don't underline misspelled words:**

If you don't like that all spelling mistakes are red highlighted, you can disable this feature in settings but still benefit from manually spell checking via right-click menu. Disabling constantly spell checking will also improve performance overall.

**Fixing, ignoring and adding words:**

Right-click a misspelled word to see the suggested spellings at the top of the menu. Pick one to replace the word, choose `Ignore` to stop flagging the word until you quit MarkText, or choose `Add to Dictionary` to accept it for good. Words you added are listed, and can be removed, under *Custom Dictionary* in the spelling settings.

**Autocorrect:**

When you finish a word with a space or punctuation, MarkText fixes well-known typos such as `teh` → `the` or `dont` → `don't`. Only unambiguous typos are corrected, never real words, and words written in ALL CAPS or in your dictionary are left alone. Undo right after a correction to restore what you typed. Autocorrect only runs for English and never touches code, math, link targets or HTML.

**Word completion:**

After you type three letters of a word, MarkText suggests longer words that start the same way: first words that already appear in your document, then words from your dictionary and, for English, a list of common words. Press `Tab` to accept the highlighted word, `↑`/`↓` to choose another, or `Esc` to dismiss the list. `Enter` always starts a new line.

Both features can be switched off under *Typing Assistance* in the spelling settings.

## Manage dictionaries

### macOS spell checker

You need to add the additional language dictionaries via *"Language & Region"* in your system preferences pane.

### Windows spell checker

On Windows 10, you need to add additional language dictionaries via *"Language"* in your *"Time & language"* settings. Add the additional language(s) and download the *"Basic typing"* language option for each language.

### Hunspell

Please go to spelling settings and scroll to the bottom. Now you see a list of available language dictionaries and can add additional dictionaries via the drop-down menu at the bottom. Please note that an active internet connection is required to download a dictionary!

![](../assets/marktext-spelling-settings.png)
