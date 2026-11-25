// @vitest-environment happy-dom

import type Format from '../format';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Muya } from '../../../muya';

// Regression: `autoPair` must not crash when the editor's cached selection is
// empty. `clickHandler` only refreshes that cache in a `requestAnimationFrame`,
// so a keystroke that lands right after clicking into a pane whose selection
// was collapsed (split view switches panes this way) reached `autoPair` with
// `anchor`/`focus` still null and threw "Cannot read properties of null
// (reading 'offset')" before its own `!oldStart` guard could run.

const bootedHosts: HTMLElement[] = [];
let originalVersion: string | undefined;
let hadVersion = false;

beforeEach(() => {
    hadVersion = 'MUYA_VERSION' in window;
    originalVersion = window.MUYA_VERSION;
    window.MUYA_VERSION = 'test';
});

afterEach(() => {
    while (bootedHosts.length) {
        const host = bootedHosts.pop()!;
        host.remove();
    }
    document.getSelection()?.removeAllRanges();
    if (hadVersion)
        window.MUYA_VERSION = originalVersion as string;
    else
        delete (window as Partial<Window>).MUYA_VERSION;
});

function bootMuya(markdown: string): Muya {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const muya = new Muya(host, { markdown } as ConstructorParameters<typeof Muya>[1]);
    muya.init();
    bootedHosts.push(muya.domNode);
    return muya;
}

function firstFormat(muya: Muya): Format {
    return muya.editor.scrollPage!.firstContentInDescendant() as unknown as Format;
}

function typed(data: string): InputEvent {
    return new InputEvent('input', { data, inputType: 'insertText' });
}

describe('content.autoPair with an empty cached selection', () => {
    it('keeps the typed text instead of throwing', () => {
        const muya = bootMuya('Alpha text\n');
        const block = firstFormat(muya);
        muya.editor.selection.clear();
        expect(muya.editor.selection.anchor).toBeNull();

        const result = block.autoPair(typed('x'), 'Alpha textx', { offset: 11 }, { offset: 11 });

        expect(result.text).toBe('Alpha textx');
    });

    it('skips pairing for that keystroke rather than guessing a caret', () => {
        const muya = bootMuya('Alpha text\n');
        const block = firstFormat(muya);
        muya.editor.selection.clear();

        const result = block.autoPair(typed('('), 'Alpha text(', { offset: 11 }, { offset: 11 });

        expect(result).toEqual({ text: 'Alpha text(', needRender: false });
    });
});
