import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

// The service is a module singleton, so each test loads a fresh copy against
// a stubbed `window.electron` bridge.
const win = window as unknown as {
  electron?: { ipcRenderer: { invoke: Mock; on: Mock } }
}

let invoke: Mock
let on: Mock

const load = async(language: string, knownWords: string[] = []) => {
  invoke.mockResolvedValue(knownWords)
  vi.resetModules()
  const service = await import('../../../src/renderer/src/spellchecker/wordAssist')
  service.startWordAssist(() => language)
  // Let the initial dictionary fetch settle.
  await Promise.resolve()
  await Promise.resolve()
  return service
}

beforeEach(() => {
  invoke = vi.fn()
  on = vi.fn()
  win.electron = { ipcRenderer: { invoke, on } }
})

afterEach(() => {
  delete win.electron
})

describe('word assist service', () => {
  it('autocorrects in English', async() => {
    const { wordAssistHooks } = await load('en-GB')
    expect(wordAssistHooks.autoCorrect('teh', ' ')).toBe('the')
  })

  it('does not autocorrect other languages', async() => {
    // "dont" is a French word.
    const { wordAssistHooks } = await load('fr-FR')
    expect(wordAssistHooks.autoCorrect('dont', ' ')).toBeNull()
  })

  it('never corrects words in the user dictionary, whatever their case', async() => {
    const { wordAssistHooks } = await load('en-US', ['Teh'])
    expect(wordAssistHooks.autoCorrect('teh', ' ')).toBeNull()
  })

  it('completes from the user dictionary first, then common English words', async() => {
    const { wordAssistHooks } = await load('en-US', ['Recursion'])
    const list = wordAssistHooks.getCompletions('rec')
    expect(list[0]).toBe('Recursion')
    expect(list).toContain('recommend')
  })

  it('offers only dictionary words for other languages', async() => {
    const { wordAssistHooks } = await load('de-DE', ['Rechnung'])
    expect(wordAssistHooks.getCompletions('rec')).toEqual(['Rechnung'])
  })

  it('refetches the dictionary when the main process reports a change', async() => {
    const { wordAssistHooks } = await load('en-US')
    expect(on).toHaveBeenCalledWith('mt::spellchecker-dictionary-changed', expect.any(Function))

    invoke.mockResolvedValue(['teh'])
    on.mock.calls[0][1]()
    await Promise.resolve()
    await Promise.resolve()

    expect(wordAssistHooks.autoCorrect('teh', ' ')).toBeNull()
  })
})
