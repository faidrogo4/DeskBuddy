import fs from 'fs'
import path from 'path'
import { app, BrowserWindow, ipcMain, session } from 'electron'
import log from 'electron-log'
import { isOsx } from '../config'
import { IgnoredWords } from './ignoredWords'

// Editor windows all use the default session, so its dictionary (and with it
// the ignore list) is shared by every window.
let ignoredWords: IgnoredWords | null = null

const getIgnoredWords = (): IgnoredWords => {
  if (ignoredWords) return ignoredWords
  const file = path.join(app.getPath('userData'), 'spellchecker-ignored-words.json')
  ignoredWords = new IgnoredWords(
    {
      add: (word) => session.defaultSession.addWordToSpellCheckerDictionary(word),
      remove: (word) => session.defaultSession.removeWordFromSpellCheckerDictionary(word)
    },
    {
      read: () => {
        try {
          const words: unknown = JSON.parse(fs.readFileSync(file, 'utf8'))
          return Array.isArray(words) ? words.filter((w) => typeof w === 'string') : []
        } catch {
          return []
        }
      },
      write: (words) => {
        try {
          fs.writeFileSync(file, JSON.stringify(words))
        } catch (error) {
          log.warn('Unable to save ignored spelling words:', error)
        }
      }
    }
  )
  return ignoredWords
}

/**
 * Tell every window that the set of accepted words changed, so autocorrect
 * and word completion stop or start using a word right away.
 */
const notifyDictionaryChanged = (): void => {
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send('mt::spellchecker-dictionary-changed')
  }
}

/**
 * Add the given word to the spellchecker dictionary.
 */
export const addToDictionary = (win: BrowserWindow, word: string): boolean => {
  const ignored = getIgnoredWords()
  // An ignored word is already in Chromium's dictionary (where `add` would
  // report a duplicate); it only has to be exempted from the cleanup.
  if (ignored.has(word)) {
    ignored.keep(word)
    return true
  }
  const added = win.webContents.session.addWordToSpellCheckerDictionary(word)
  if (added) notifyDictionaryChanged()
  return added
}

/**
 * Stop flagging `word` until MarkText quits, without saving it to the
 * dictionary.
 */
export const ignoreWord = (word: string): boolean => {
  const ignored = getIgnoredWords().ignore(word)
  if (ignored) notifyDictionaryChanged()
  return ignored
}

/**
 * Remove the given word from the spellchecker dictionary.
 */
export const removeFromDictionary = (win: BrowserWindow, word: string): boolean => {
  getIgnoredWords().keep(word)
  const removed = win.webContents.session.removeWordFromSpellCheckerDictionary(word)
  if (removed) notifyDictionaryChanged()
  return removed
}

/**
 * Returns the words the user saved to the custom dictionary. Ignored words
 * are in Chromium's dictionary too, but only for this run, so they are hidden.
 */
export const getCustomDictionaryWords = async(win: BrowserWindow): Promise<string[]> => {
  const words = await win.webContents.session.listWordsInSpellCheckerDictionary()
  const ignored = getIgnoredWords()
  return words.filter((word) => !ignored.has(word))
}

/**
 * Every word the spell checker currently accepts beyond its built-in
 * dictionary: saved words plus words ignored for this run.
 */
export const getKnownWords = async(win: BrowserWindow): Promise<string[]> => {
  return win.webContents.session.listWordsInSpellCheckerDictionary()
}

/**
 * Sets whether to enable the builtin spell checker.
 */
export const setSpellCheckerEnabled = (win: BrowserWindow, enabled: boolean): boolean => {
  win.webContents.session.setSpellCheckerEnabled(enabled)
  return win.webContents.session.isSpellCheckerEnabled() === enabled
}

/**
 * Switch the spellchecker to the given language and enable the builtin spell checker.
 */
export const switchLanguage = (win: BrowserWindow, lang: string): void => {
  win.webContents.session.setSpellCheckerLanguages([lang])
}

/**
 * Returns the list of available spellchecker languages, or empty on macOS
 * where the OS spellchecker is used and language is auto-detected.
 */
export const getAvailableDictionaries = (win: BrowserWindow): string[] => {
  if (!win.webContents.session.isSpellCheckerEnabled) {
    console.warn('Spell Checker not available but dictionaries requested.')
    return []
  } else if (isOsx) {
    return []
  }

  const availableLanguages = win.webContents.session.availableSpellCheckerLanguages

  return availableLanguages.length > 0 ? availableLanguages : ['en-US']
}

const registerSpellcheckerHandlers = (): void => {
  app.whenReady().then(async() => {
    try {
      // Wait for Chromium to load the dictionary before editing it.
      await session.defaultSession.listWordsInSpellCheckerDictionary()
      getIgnoredWords().purgeStale()
    } catch (error) {
      log.warn('Unable to clean up ignored spelling words:', error)
    }
  })
  app.on('will-quit', () => {
    ignoredWords?.releaseAll()
  })

  ipcMain.handle('mt::spellchecker-remove-word', async(e, word: string) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    if (!win) return false
    return removeFromDictionary(win, word)
  })
  ipcMain.handle('mt::spellchecker-switch-language', async(e, lang: string) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    if (win) switchLanguage(win, lang)
    return null
  })
  ipcMain.handle('mt::spellchecker-get-available-dictionaries', async(e) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    if (!win) return []
    return getAvailableDictionaries(win)
  })
  // We have to set a language or call `switchLanguage` on Linux and Windows.
  ipcMain.handle('mt::spellchecker-set-enabled', async(e, enabled: boolean) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    if (!win) return false
    if (!setSpellCheckerEnabled(win, enabled)) {
      log.warn(`Failed to (de-)activate spell checking on editor (id=${win.id}).`)
      return false
    }
    return true
  })
  ipcMain.handle('mt::spellchecker-get-custom-dictionary-words', async(e) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    if (!win) return []
    return getCustomDictionaryWords(win)
  })
  ipcMain.handle('mt::spellchecker-get-known-words', async(e) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    if (!win) return []
    return getKnownWords(win)
  })
}

export default registerSpellcheckerHandlers
