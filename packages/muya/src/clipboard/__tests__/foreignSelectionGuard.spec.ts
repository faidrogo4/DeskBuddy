// @vitest-environment happy-dom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Muya } from '../../muya';

const editors: Muya[] = [];
let originalVersion: string | undefined;

beforeEach(() => {
    originalVersion = window.MUYA_VERSION;
    window.MUYA_VERSION = 'test';
});

afterEach(() => {
    while (editors.length)
        editors.pop()!.destroy();
    document.getSelection()?.removeAllRanges();
    if (originalVersion === undefined)
        delete (window as Partial<Window>).MUYA_VERSION;
    else
        window.MUYA_VERSION = originalVersion;
});

function boot(markdown: string): Muya {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const muya = new Muya(host, { markdown });
    muya.init();
    editors.push(muya);
    return muya;
}

function firstText(muya: Muya): Text {
    const leaf = muya.editor.scrollPage!.firstContentInDescendant()!;
    return document.createTreeWalker(leaf.domNode!, NodeFilter.SHOW_TEXT).nextNode() as Text;
}

function keydown(muya: Muya, key: string): KeyboardEvent {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
    muya.domNode.dispatchEvent(event);
    return event;
}

function beforeinput(muya: Muya, data: string): InputEvent {
    const event = new InputEvent('beforeinput', { inputType: 'insertText', data, bubbles: true, cancelable: true });
    muya.domNode.dispatchEvent(event);
    return event;
}

describe('clipboard guard for selections Muya cannot resolve', () => {
    // Regression: the split-view guard swallowed every keystroke while the
    // caret sat on the editor container, so typing `/` into a fresh document
    // never reached the paragraph.
    it('lets native input through for a caret inside the editor that maps to no block', () => {
        const muya = boot('');
        muya.domNode.focus();
        const container = muya.editor.scrollPage!.domNode!;
        document.getSelection()!.setBaseAndExtent(container, 0, container, 0);
        expect(muya.editor.selection.getSelection()).toBeNull();

        expect(keydown(muya, '/').defaultPrevented).toBe(false);
        expect(beforeinput(muya, '/').defaultPrevented).toBe(false);
    });

    it('blocks input for a native range that reaches into another editor', () => {
        const left = boot('Left document\n');
        const right = boot('Right document\n');
        left.domNode.focus();
        document.getSelection()!.setBaseAndExtent(firstText(left), 1, firstText(right), 4);
        expect(left.editor.selection.getSelection()).toBeNull();

        expect(keydown(left, 'x').defaultPrevented).toBe(true);
        expect(beforeinput(left, 'x').defaultPrevented).toBe(true);
    });
});
