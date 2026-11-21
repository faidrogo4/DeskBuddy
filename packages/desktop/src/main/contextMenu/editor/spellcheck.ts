import { ipcMain, type BrowserWindow, type MenuItemConstructorOptions } from 'electron'
import log from 'electron-log'
import { isOsx } from '../../config'
import { addToDictionary, ignoreWord } from '../../spellchecker'
import { SEPARATOR } from './menuItems'
import { t } from '../../i18n'

/**
 * Items shown at the top of the menu for a misspelled word: the suggestions,
 * then Ignore and Add to Dictionary.
 */
export const buildMisspelledWordItems = (
  misspelledWord: string,
  wordSuggestions: string[]
): MenuItemConstructorOptions[] => {
  const items: MenuItemConstructorOptions[] = wordSuggestions.map((word) => ({
    label: word,
    click(_menuItem, targetWindow) {
      if (targetWindow) {
        ;(targetWindow as BrowserWindow).webContents.send('mt::spelling-replace-misspelling', {
          word: misspelledWord,
          replacement: word
        })
      }
    }
  }))

  if (items.length === 0) {
    items.push({ label: t('contextMenu.noSuggestions'), enabled: false })
  }

  // Chromium only re-checks a word when it is edited; replacing the word with
  // itself clears the stale underline once it is accepted.
  const refreshUnderline = (targetWindow: unknown): void => {
    ;(targetWindow as BrowserWindow | undefined)?.webContents.replaceMisspelling(misspelledWord)
  }

  items.push(
    SEPARATOR,
    {
      label: t('contextMenu.ignoreWord'),
      click(_menuItem, targetWindow) {
        if (!ignoreWord(misspelledWord)) {
          log.error(`Error while ignoring "${misspelledWord}".`)
          return
        }
        refreshUnderline(targetWindow)
      }
    },
    {
      label: t('contextMenu.addToDictionary'),
      click(_menuItem, targetWindow) {
        if (!targetWindow) return
        if (!addToDictionary(targetWindow as BrowserWindow, misspelledWord)) {
          log.error(`Error while adding "${misspelledWord}" to dictionary.`)
          return
        }
        refreshUnderline(targetWindow)
      }
    }
  )

  return items
}

/**
 * The "Spelling" submenu: switching language and managing the dictionary.
 */
export default (): MenuItemConstructorOptions[] => [
  {
    label: t('contextMenu.changeLanguage'),
    // NB: On macOS the OS spell checker is used and will detect the language automatically.
    visible: !isOsx,
    click(_menuItem, targetWindow) {
      if (targetWindow) {
        ;(targetWindow as BrowserWindow).webContents.send('mt::spelling-show-switch-language')
      }
    }
  },
  {
    label: t('contextMenu.editDictionary'),
    click() {
      ipcMain.emit('app-create-settings-window', 'spelling')
    }
  }
]
