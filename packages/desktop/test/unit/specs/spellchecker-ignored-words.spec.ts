import { beforeEach, describe, expect, it } from 'vitest'
import { IgnoredWords } from 'main_renderer/spellchecker/ignoredWords'

// A fake Chromium dictionary plus an in-memory stand-in for the JSON file.
const setup = (stored: string[] = [], dictionary: string[] = []) => {
  const words = new Set(dictionary)
  const storage = { saved: [...stored] }
  const ignored = new IgnoredWords(
    {
      add: (word) => {
        if (words.has(word)) return false
        words.add(word)
        return true
      },
      remove: (word) => words.delete(word)
    },
    {
      read: () => [...storage.saved],
      write: (list) => {
        storage.saved = [...list]
      }
    }
  )
  return { ignored, words, storage }
}

describe('IgnoredWords', () => {
  let env: ReturnType<typeof setup>

  beforeEach(() => {
    env = setup()
  })

  it('adds an ignored word to the dictionary and records it for cleanup', () => {
    expect(env.ignored.ignore('frobnicate')).toBe(true)

    expect(env.words.has('frobnicate')).toBe(true)
    expect(env.ignored.has('frobnicate')).toBe(true)
    expect(env.storage.saved).toEqual(['frobnicate'])
  })

  it('removes ignored words at the end of the run but keeps the file as a safety net', () => {
    env.ignored.ignore('frobnicate')

    env.ignored.releaseAll()

    expect(env.words.has('frobnicate')).toBe(false)
    expect(env.storage.saved).toEqual(['frobnicate'])
  })

  it('keeps a word for good once the user adds it to the dictionary', () => {
    env.ignored.ignore('frobnicate')

    env.ignored.keep('frobnicate')
    env.ignored.releaseAll()

    expect(env.words.has('frobnicate')).toBe(true)
    expect(env.storage.saved).toEqual([])
  })

  it('does not track a word Chromium refused to add (e.g. already saved)', () => {
    env = setup([], ['saved'])

    expect(env.ignored.ignore('saved')).toBe(false)
    env.ignored.releaseAll()

    expect(env.words.has('saved')).toBe(true)
  })

  it('purges words left over by a run that did not clean up', () => {
    env = setup(['leftover'], ['leftover', 'saved'])

    env.ignored.purgeStale()

    expect([...env.words]).toEqual(['saved'])
    expect(env.storage.saved).toEqual([])
  })

  it('does not purge words ignored in the current run', () => {
    env = setup(['leftover'])
    env.ignored.ignore('current')

    env.ignored.purgeStale()

    expect(env.words.has('current')).toBe(true)
    expect(env.storage.saved).toEqual(['current'])
  })
})
