const LETTER = /[\p{L}\p{M}]/u;
const APOSTROPHES = new Set(['\'', '’']);

// A word touching one of these is part of a path, identifier, URL, e-mail
// address, hashtag or number rather than prose, so it is left alone.
const NON_PROSE_NEIGHBOURS = /[\p{N}_\-/\\@#$%&=+~`.]/u;

/** Characters that finish a word and so trigger autocorrect. */
export const WORD_BOUNDARY = /^[\s.,;:!?)\]"”]$/u;

export const isLetter = (char: string | undefined): boolean => !!char && LETTER.test(char);

/**
 * Find the word that ends exactly at `end` in `text`: letters plus apostrophes
 * between letters ("don't"). Returns null when there is none, or when the
 * word is glued to a non-prose neighbour (`foo/bar`, `a.b`, `x2`).
 */
export function findWordEndingAt(text: string, end: number): { start: number; word: string } | null {
    let start = end;
    while (start > 0) {
        const char = text[start - 1];
        if (isLetter(char)) {
            start--;
            continue;
        }
        if (APOSTROPHES.has(char) && start < end && isLetter(text[start - 2])) {
            start--;
            continue;
        }
        break;
    }

    if (start === end || !isLetter(text[start]))
        return null;

    const before = text[start - 1];
    if (before !== undefined && NON_PROSE_NEIGHBOURS.test(before))
        return null;

    return { start, word: text.substring(start, end) };
}

/**
 * Give `replacement` the capitalisation pattern of `original`: ALL CAPS stays
 * all caps, a leading capital stays a leading capital, otherwise the
 * replacement is returned as written (so "i" -> "I" survives).
 */
export function matchCase(original: string, replacement: string): string {
    const letters = original.replace(/\P{L}/gu, '');
    if (letters.length > 1 && letters === letters.toUpperCase() && letters !== letters.toLowerCase())
        return replacement.toUpperCase();

    const first = original[0];
    if (first && first !== first.toLowerCase())
        return replacement[0].toUpperCase() + replacement.slice(1);

    return replacement;
}

const INDEX_WORD = /\p{L}[\p{L}\p{M}'’]*[\p{L}\p{M}]/gu;
const INLINE_CODE = /`[^`\n]*`/g;
const URL_LIKE = /\b(?:https?:\/\/|www\.)\S+/g;
const MATH_BLOCK = /\$\$[\s\S]*?\$\$/g;

const FENCE = /^ {0,3}(`{3}|~{3})/;

function stripFencedCode(markdown: string): string {
    let fence: string | null = null;

    return markdown
        .split('\n')
        .filter((line) => {
            const marker = FENCE.exec(line)?.[1];
            if (fence) {
                if (marker === fence)
                    fence = null;

                return false;
            }
            if (marker) {
                fence = marker;

                return false;
            }

            return true;
        })
        .join('\n');
}

/** Words shorter than this are not worth completing, so are not indexed. */
export const MIN_INDEXED_WORD_LENGTH = 4;

/**
 * Count the prose words in a markdown document, skipping code, math and URLs
 * so identifiers and link targets do not leak into completions.
 */
export function countDocumentWords(markdown: string): Map<string, number> {
    const prose = stripFencedCode(markdown)
        .replace(MATH_BLOCK, ' ')
        .replace(INLINE_CODE, ' ')
        .replace(URL_LIKE, ' ');

    const counts = new Map<string, number>();
    for (const [word] of prose.matchAll(INDEX_WORD)) {
        if (word.length >= MIN_INDEXED_WORD_LENGTH)
            counts.set(word, (counts.get(word) ?? 0) + 1);
    }

    return counts;
}

/**
 * Merge completion candidates for `prefix`: document words first (most
 * frequent first), then `extra` in the order given. Matching is
 * case-insensitive; a candidate must be at least two characters longer than
 * the prefix to be worth a keystroke. The first spelling seen wins.
 */
export function rankCompletions(
    prefix: string,
    documentWords: Map<string, number>,
    extra: string[],
    limit: number,
): string[] {
    const lowerPrefix = prefix.toLowerCase();
    const minLength = prefix.length + 2;
    const matches = (word: string) => word.length >= minLength && word.toLowerCase().startsWith(lowerPrefix);

    const fromDocument = [...documentWords]
        .filter(([word]) => matches(word))
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([word]) => word);

    const seen = new Set<string>();
    const result: string[] = [];
    for (const word of [...fromDocument, ...extra.filter(matches)]) {
        const key = word.toLowerCase();
        if (seen.has(key))
            continue;
        seen.add(key);
        // Keep deliberate mixed case ("DeskBuddy"); otherwise follow the prefix.
        result.push(word === word.toLowerCase() ? matchCase(prefix, word) : word);
        if (result.length >= limit)
            break;
    }

    return result;
}
