import { describe, expect, it } from 'vitest';
import { countDocumentWords, findWordEndingAt, matchCase, rankCompletions, WORD_BOUNDARY } from '../words';

describe('findWordEndingAt', () => {
    it('finds the word that ends at the offset', () => {
        expect(findWordEndingAt('I saw teh', 9)).toEqual({ start: 6, word: 'teh' });
    });

    it('keeps apostrophes between letters', () => {
        expect(findWordEndingAt('we dont', 7)?.word).toBe('dont');
        expect(findWordEndingAt('we don\'t', 8)?.word).toBe('don\'t');
        expect(findWordEndingAt('it’s', 4)?.word).toBe('it’s');
    });

    it('handles non-ASCII letters', () => {
        expect(findWordEndingAt('ein schönes', 11)?.word).toBe('schönes');
    });

    it('rejects words glued to paths, identifiers, numbers and addresses', () => {
        expect(findWordEndingAt('src/teh', 7)).toBeNull();
        expect(findWordEndingAt('my_teh', 6)).toBeNull();
        expect(findWordEndingAt('2teh', 4)).toBeNull();
        expect(findWordEndingAt('me@teh', 6)).toBeNull();
        expect(findWordEndingAt('#teh', 4)).toBeNull();
        expect(findWordEndingAt('www.teh', 7)).toBeNull();
    });

    it('allows words after quotes and brackets', () => {
        expect(findWordEndingAt('("teh', 5)?.word).toBe('teh');
    });

    it('returns null when no letter precedes the offset', () => {
        expect(findWordEndingAt('teh ', 4)).toBeNull();
        expect(findWordEndingAt('', 0)).toBeNull();
    });
});

describe('matchCase', () => {
    it('follows a leading capital', () => {
        expect(matchCase('Teh', 'the')).toBe('The');
    });

    it('follows all caps', () => {
        expect(matchCase('TEH', 'the')).toBe('THE');
    });

    it('leaves lowercase input to the replacement as written', () => {
        expect(matchCase('teh', 'the')).toBe('the');
        expect(matchCase('i', 'I')).toBe('I');
    });

    it('does not treat a single capital letter as all caps', () => {
        expect(matchCase('I', 'me')).toBe('Me');
    });
});

describe('word boundary', () => {
    it.each([' ', ',', '.', '!', '?', ';', ':', ')', '"', ' '])('treats %j as a boundary', (char) => {
        expect(WORD_BOUNDARY.test(char)).toBe(true);
    });

    it.each(['a', '\'', '-', '_', '/', '('])('does not treat %j as a boundary', (char) => {
        expect(WORD_BOUNDARY.test(char)).toBe(false);
    });
});

describe('countDocumentWords', () => {
    it('counts prose words of four letters or more', () => {
        const counts = countDocumentWords('The quick brown fox, the quick dog.');
        expect(counts.get('quick')).toBe(2);
        expect(counts.has('fox')).toBe(false);
    });

    it('ignores code, math and URLs', () => {
        const markdown = [
            'Some prose here.',
            '',
            '```js',
            'const variableName = 1',
            '```',
            '',
            'Inline `functionName` and https://example.com/somewhere',
            '',
            '$$',
            'equation',
            '$$',
        ].join('\n');
        const counts = countDocumentWords(markdown);
        expect(counts.has('prose')).toBe(true);
        expect(counts.has('variableName')).toBe(false);
        expect(counts.has('functionName')).toBe(false);
        expect(counts.has('example')).toBe(false);
        expect(counts.has('equation')).toBe(false);
    });
});

describe('rankCompletions', () => {
    it('puts frequent document words first, then extra words', () => {
        const doc = new Map([['recommend', 1], ['record', 3]]);
        expect(rankCompletions('rec', doc, ['receive'], 5)).toEqual(['record', 'recommend', 'receive']);
    });

    it('skips candidates that save fewer than two keystrokes', () => {
        const doc = new Map([['reco', 1], ['recor', 1], ['record', 1]]);
        expect(rankCompletions('rec', doc, [], 5)).toEqual(['recor', 'record']);
    });

    it('dedupes case-insensitively and follows the prefix case', () => {
        const doc = new Map([['receive', 1]]);
        expect(rankCompletions('Rec', doc, ['receive', 'recent'], 5)).toEqual(['Receive', 'Recent']);
    });

    it('keeps deliberate mixed case', () => {
        const doc = new Map([['MarkText', 4]]);
        expect(rankCompletions('mar', doc, [], 5)).toEqual(['MarkText']);
    });

    it('respects the limit', () => {
        expect(rankCompletions('alp', new Map(), ['alphabet', 'alpine', 'alpaca'], 2)).toEqual(['alphabet', 'alpine']);
    });
});
