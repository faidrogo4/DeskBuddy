import { getAutoCorrection } from './autocorrect'
import { COMMON_ENGLISH_WORDS } from './commonWords'

/**
 * Renderer-side data behind muya's WordAssist plugin. Muya registers plugins
 * once per renderer process (shared by every editor pane), so this is a module
 * singleton rather than per-editor state.
 */

// Saved and ignored words, mirrored from the main process.
let acceptedWords: string[] = []
let acceptedLowercase = new Set<string>()
let getLanguage: () => string = () => 'en'
let started = false

const refreshAcceptedWords = async(): Promise<void> => {
  try {
    acceptedWords = await window.electron.ipcRenderer.invoke('mt::spellchecker-get-known-words')
  } catch {
    acceptedWords = []
  }
  acceptedLowercase = new Set(acceptedWords.map((word) => word.toLowerCase()))
}

/**
 * Start tracking the user's dictionary. Safe to call from every editor pane.
 *
 * @param languageGetter Returns the current writing language (BCP 47). The
 *   built-in typo table and word list are English, so both switch off for
 *   other languages; the user's own dictionary words are still completed.
 */
export const startWordAssist = (languageGetter: () => string): void => {
  getLanguage = languageGetter
  if (started) return
  started = true
  window.electron.ipcRenderer.on('mt::spellchecker-dictionary-changed', () => {
    refreshAcceptedWords()
  })
  refreshAcceptedWords()
}

const isEnglish = (): boolean => /^en(?:-|$)/i.test(getLanguage())

const startsWith = (word: string, lowerPrefix: string): boolean =>
  word.toLowerCase().startsWith(lowerPrefix)

/** Hooks handed to `Muya.use(WordAssist, ...)`. */
export const wordAssistHooks = {
  autoCorrect(word: string, boundary: string): string | null {
    if (!isEnglish()) return null
    return getAutoCorrection(word, boundary, (w) => acceptedLowercase.has(w.toLowerCase()))
  },

  getCompletions(prefix: string): string[] {
    const lowerPrefix = prefix.toLowerCase()
    const own = acceptedWords.filter((word) => startsWith(word, lowerPrefix))
    if (!isEnglish()) return own
    return own.concat(COMMON_ENGLISH_WORDS.filter((word) => startsWith(word, lowerPrefix)))
  }
}
