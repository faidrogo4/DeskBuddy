import { beforeEach, describe, expect, it, vi } from 'vitest'

const { addToDictionary, ignoreWord } = vi.hoisted(() => ({
  addToDictionary: vi.fn(() => true),
  ignoreWord: vi.fn(() => true)
}))

vi.mock('main_renderer/spellchecker', () => ({ addToDictionary, ignoreWord }))

const { buildMisspelledWordItems } = await import('main_renderer/contextMenu/editor/spellcheck')

const makeWindow = () => ({
  webContents: {
    send: vi.fn(),
    replaceMisspelling: vi.fn()
  }
})

const click = (item: Electron.MenuItemConstructorOptions, win: unknown) =>
  item.click?.({} as never, win as never, {} as never)

describe('misspelled word context menu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists suggestions, then Ignore and Add to Dictionary', () => {
    const items = buildMisspelledWordItems('teh', ['the', 'tech'])

    expect(items.map((item) => item.label ?? item.type)).toEqual([
      'the',
      'tech',
      'separator',
      'Ignore',
      'Add to Dictionary'
    ])
  })

  it('shows a disabled placeholder when there are no suggestions', () => {
    const [first] = buildMisspelledWordItems('xqzv', [])

    expect(first.label).toBe('No Suggestions')
    expect(first.enabled).toBe(false)
  })

  it('asks the renderer to replace the word with a suggestion', () => {
    const win = makeWindow()
    click(buildMisspelledWordItems('teh', ['the'])[0], win)

    expect(win.webContents.send).toHaveBeenCalledWith('mt::spelling-replace-misspelling', {
      word: 'teh',
      replacement: 'the'
    })
  })

  it('ignores the word and clears its underline', () => {
    const win = makeWindow()
    const ignore = buildMisspelledWordItems('teh', []).find((item) => item.label === 'Ignore')!

    click(ignore, win)

    expect(ignoreWord).toHaveBeenCalledWith('teh')
    expect(win.webContents.replaceMisspelling).toHaveBeenCalledWith('teh')
  })

  it('adds the word to the dictionary and clears its underline', () => {
    const win = makeWindow()
    const add = buildMisspelledWordItems('teh', []).find(
      (item) => item.label === 'Add to Dictionary'
    )!

    click(add, win)

    expect(addToDictionary).toHaveBeenCalledWith(win, 'teh')
    expect(win.webContents.replaceMisspelling).toHaveBeenCalledWith('teh')
  })
})
