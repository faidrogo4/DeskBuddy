import { describe, expect, it } from 'vitest'
import { getAutoCorrection } from '../../../src/renderer/src/spellchecker/autocorrect'

const noneKnown = (): boolean => false

describe('getAutoCorrection', () => {
  it('fixes a known typo', () => {
    expect(getAutoCorrection('teh', ' ', noneKnown)).toBe('the')
    expect(getAutoCorrection('recieve', ',', noneKnown)).toBe('receive')
  })

  it('adds missing apostrophes', () => {
    expect(getAutoCorrection('dont', ' ', noneKnown)).toBe("don't")
    expect(getAutoCorrection('ive', ' ', noneKnown)).toBe("I've")
  })

  it('keeps a leading capital', () => {
    expect(getAutoCorrection('Teh', ' ', noneKnown)).toBe('The')
    expect(getAutoCorrection('Alot', ' ', noneKnown)).toBe('A lot')
  })

  it('leaves ALL CAPS words alone, as they are usually acronyms', () => {
    expect(getAutoCorrection('ADN', ' ', noneKnown)).toBeNull()
    expect(getAutoCorrection('TEH', ' ', noneKnown)).toBeNull()
  })

  it('never corrects a word the user accepted', () => {
    const known = (word: string): boolean => word.toLowerCase() === 'teh'
    expect(getAutoCorrection('teh', ' ', known)).toBeNull()
  })

  it('leaves real words alone', () => {
    for (const word of ['the', 'wont', 'cant', 'its', 'ill', 'were', 'well', 'lets']) {
      expect(getAutoCorrection(word, ' ', noneKnown), word).toBeNull()
    }
  })

  it('capitalises a lone "i" except before a period', () => {
    expect(getAutoCorrection('i', ' ', noneKnown)).toBe('I')
    expect(getAutoCorrection('i', ',', noneKnown)).toBe('I')
    expect(getAutoCorrection('i', '.', noneKnown)).toBeNull()
    expect(getAutoCorrection("i'm", ' ', noneKnown)).toBe("I'm")
  })

  it('reports no change for already-correct capitalised words', () => {
    // "I'm" maps to itself; the caller treats an identical result as no-op.
    expect(getAutoCorrection("I'm", ' ', noneKnown)).toBe("I'm")
  })
})
