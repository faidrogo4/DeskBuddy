/**
 * Chromium's spell checker has no "ignore" list, only the persistent custom
 * dictionary. An ignored word is therefore added to that dictionary for the
 * rest of the run and taken out again afterwards.
 *
 * The pending removals are also written to disk: the quit-time removal is
 * best effort (Chromium saves the dictionary asynchronously and a crash skips
 * it entirely), so the next launch finishes the job via `purgeStale`.
 */

export interface DictionaryOps {
  add(word: string): boolean
  remove(word: string): boolean
}

export interface IgnoredWordsStorage {
  read(): string[]
  write(words: string[]): void
}

export class IgnoredWords {
  private _words = new Set<string>()

  constructor(
    private _dictionary: DictionaryOps,
    private _storage: IgnoredWordsStorage
  ) {}

  has(word: string): boolean {
    return this._words.has(word)
  }

  list(): string[] {
    return [...this._words]
  }

  ignore(word: string): boolean {
    if (this._words.has(word)) return true
    if (!this._dictionary.add(word)) return false
    this._words.add(word)
    this._persist()
    return true
  }

  /**
   * The user chose to keep `word` for good (e.g. "Add to Dictionary"), so it
   * must survive the end-of-run cleanup.
   */
  keep(word: string): void {
    if (this._words.delete(word)) this._persist()
  }

  /** End-of-run cleanup. The file is left for `purgeStale` as a safety net. */
  releaseAll(): void {
    for (const word of this._words) this._dictionary.remove(word)
  }

  /** Remove words left over from a previous run, then forget them. */
  purgeStale(): void {
    const stale = this._storage.read().filter((word) => !this._words.has(word))
    for (const word of stale) this._dictionary.remove(word)
    this._persist()
  }

  private _persist(): void {
    this._storage.write(this.list())
  }
}
