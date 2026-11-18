// @vitest-environment happy-dom

import type { WordAssist as WordAssistType } from '..';
import type Format from '../../../block/base/format';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { WordAssist } from '..';
import { Muya } from '../../../muya';

// Drives the real editor: text is typed into the block's DOM and the `input`
// event goes through the editor's dispatcher, so the autocorrect and
// completion paths run exactly as they do in the app.

const CORRECTIONS: Record<string, string> = { teh: 'the', alot: 'a lot' };

const hooks = {
    autoCorrect: vi.fn((word: string) => CORRECTIONS[word.toLowerCase()] ?? null),
    getCompletions: vi.fn((_prefix: string): string[] => []),
};

beforeAll(() => {
    Muya.use(WordAssist, hooks as unknown as Record<string, unknown>);
    // happy-dom has no layout, so the caret has no rect and the list would
    // have nothing to anchor to.
    vi.spyOn(Range.prototype, 'getClientRects').mockReturnValue(
        [new DOMRect(0, 0, 1, 16)] as unknown as DOMRectList,
    );
});

const bootedHosts: HTMLElement[] = [];
let hadVersion = false;
let originalVersion: string | undefined;

beforeEach(() => {
    hadVersion = 'MUYA_VERSION' in window;
    originalVersion = window.MUYA_VERSION;
    window.MUYA_VERSION = 'test';
    hooks.autoCorrect.mockClear();
    hooks.getCompletions.mockReset().mockReturnValue([]);
});

afterEach(() => {
    while (bootedHosts.length)
        bootedHosts.pop()!.remove();
    document.getSelection()?.removeAllRanges();
    if (hadVersion)
        window.MUYA_VERSION = originalVersion as string;
    else
        delete (window as Partial<Window>).MUYA_VERSION;
});

function bootMuya(markdown: string, options: { autoCorrect?: boolean; wordCompletion?: boolean } = {}): Muya {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const muya = new Muya(host, {
        markdown,
        autoCorrect: true,
        wordCompletion: true,
        ...options,
    } as ConstructorParameters<typeof Muya>[1]);
    muya.init();
    bootedHosts.push(muya.domNode);
    return muya;
}

function lastBlock(muya: Muya): Format {
    return muya.editor.scrollPage!.lastContentInDescendant() as unknown as Format;
}

function lastTextNode(root: Node): Text {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let last: Text | null = null;
    while (walker.nextNode())
        last = walker.currentNode as Text;
    return last!;
}

// Type `char` at the end of the last block, the way the browser would: mutate
// the DOM, move the caret, then fire `input`.
function typeAtEnd(muya: Muya, char: string) {
    const block = lastBlock(muya);
    const node = lastTextNode(block.domNode!);
    node.data += char;

    const range = document.createRange();
    range.setStart(node, node.data.length);
    range.collapse(true);
    const selection = document.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);

    block.domNode!.dispatchEvent(new InputEvent('input', { inputType: 'insertText', data: char, bubbles: true }));
}

function pressKey(muya: Muya, key: string) {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
    lastBlock(muya).domNode!.dispatchEvent(event);
    return event;
}

function assistOf(muya: Muya): WordAssistType {
    return (muya as unknown as { _uiPlugins: Record<string, WordAssistType> })._uiPlugins.wordAssist;
}

describe('wordAssist — autocorrect', () => {
    it('replaces a known typo when the word is finished', () => {
        const muya = bootMuya('I saw teh\n');
        typeAtEnd(muya, ' ');

        expect(lastBlock(muya).text).toBe('I saw the ');
        expect(hooks.autoCorrect).toHaveBeenCalledWith('teh', ' ');
    });

    it('keeps the caret after the boundary when the length changes', () => {
        const muya = bootMuya('it was alot\n');
        typeAtEnd(muya, ',');

        const block = lastBlock(muya);
        expect(block.text).toBe('it was a lot,');
        expect(block.getCursor()!.start.offset).toBe(block.text.length);
    });

    it('reverts only the correction on undo', () => {
        const muya = bootMuya('I saw teh\n');
        typeAtEnd(muya, ' ');
        expect(lastBlock(muya).text).toBe('I saw the ');

        muya.undo();

        expect(lastBlock(muya).text).toBe('I saw teh ');
    });

    it('does nothing when the option is off', () => {
        const muya = bootMuya('I saw teh\n', { autoCorrect: false });
        typeAtEnd(muya, ' ');

        expect(lastBlock(muya).text).toBe('I saw teh ');
        expect(hooks.autoCorrect).not.toHaveBeenCalled();
    });

    it('leaves inline code alone', () => {
        const muya = bootMuya('`teh\n');
        typeAtEnd(muya, '`');
        typeAtEnd(muya, ' ');

        expect(lastBlock(muya).text).toBe('`teh` ');
    });
});

describe('wordAssist — completion', () => {
    it('offers longer document words for a three-letter prefix', () => {
        const muya = bootMuya('A recommendation.\n\nre\n');
        typeAtEnd(muya, 'c');

        const assist = assistOf(muya);
        expect(assist.status).toBe(true);
        expect(assist.renderArray).toEqual(['recommendation']);
    });

    it('does not offer the word being typed back to itself', () => {
        const muya = bootMuya('recomm\n');
        typeAtEnd(muya, 'e');

        expect(assistOf(muya).status).toBe(false);
    });

    it('merges host completions after document words', () => {
        hooks.getCompletions.mockReturnValue(['receive']);
        const muya = bootMuya('A recommendation.\n\nre\n');
        typeAtEnd(muya, 'c');

        expect(assistOf(muya).renderArray).toEqual(['recommendation', 'receive']);
        expect(hooks.getCompletions).toHaveBeenCalledWith('rec');
    });

    it('completes the word on Tab without inserting a tab', () => {
        const muya = bootMuya('A recommendation.\n\nre\n');
        typeAtEnd(muya, 'c');

        const event = pressKey(muya, 'Tab');

        expect(event.defaultPrevented).toBe(true);
        expect(lastBlock(muya).text).toBe('recommendation');
    });

    it('lets Enter through and dismisses the list', () => {
        const muya = bootMuya('A recommendation.\n\nre\n');
        typeAtEnd(muya, 'c');

        pressKey(muya, 'Enter');

        expect(assistOf(muya).status).toBe(false);
        expect(lastBlock(muya).text).not.toBe('recommendation');
    });

    it('stays hidden when the option is off', () => {
        const muya = bootMuya('A recommendation.\n\nre\n', { wordCompletion: false });
        typeAtEnd(muya, 'c');

        expect(assistOf(muya).status).toBe(false);
    });
});

describe('format.isRangeInProse', () => {
    it.each([
        ['plain text', 'see teh here', 4, 7, true],
        ['emphasis', 'see *teh* here', 5, 8, true],
        ['link text', 'see [teh](u) x', 5, 8, true],
        ['inline code', 'see `teh` here', 5, 8, false],
        ['link target', 'see [x](teh) x', 8, 11, false],
        ['inline math', 'see $teh$ here', 5, 8, false],
    ])('%s', (_name, markdown, start, end, expected) => {
        const muya = bootMuya(`${markdown}\n`);
        expect(lastBlock(muya).isRangeInProse(start, end)).toBe(expected);
    });
});
