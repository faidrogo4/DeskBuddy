import type { VNode } from 'snabbdom';
import type Format from '../../block/base/format';
import type { Muya } from '../../index';
import { EVENT_KEYS } from '../../config';
import { getCursorReference } from '../../selection';
import { query } from '../../utils/dom';
import { h, patch } from '../../utils/snabbdom';
import BaseScrollFloat from '../baseScrollFloat';
import { countDocumentWords, findWordEndingAt, isLetter, rankCompletions, WORD_BOUNDARY } from './words';
import './index.css';

export interface IWordAssistOptions {
    /**
     * Return the correction for a just-finished `word`, or null to leave it.
     * `boundary` is the character that finished it (space, comma, ...).
     */
    autoCorrect?: (word: string, boundary: string) => string | null | undefined;
    /**
     * Extra completion candidates for `prefix` (e.g. a dictionary), ranked
     * after words that already appear in the document.
     */
    getCompletions?: (prefix: string) => string[];
}

interface ITextInputEvent {
    block: Format;
    inputType: string;
    data: string | null;
}

interface ICompletionContext {
    block: Format;
    start: number;
    end: number;
    prefix: string;
}

const MIN_PREFIX_LENGTH = 3;
const MAX_SUGGESTIONS = 5;
const INDEX_DEBOUNCE_MS = 300;

// Keys that leave the word being completed, so the list no longer applies.
const DISMISS_KEYS = new Set<string>([
    EVENT_KEYS.ArrowLeft,
    EVENT_KEYS.ArrowRight,
    EVENT_KEYS.Backspace,
    EVENT_KEYS.Delete,
    EVENT_KEYS.Enter,
    'Home',
    'End',
    'PageUp',
    'PageDown',
]);

const defaultOptions = {
    placement: 'bottom-start' as const,
    offsetOptions: {
        mainAxis: 4,
        crossAxis: 0,
        alignmentAxis: 0,
    },
    showArrow: false,
};

/**
 * Typing assistance for prose blocks:
 *
 * - Autocorrect: when a word is finished by a space or punctuation, the host's
 *   `autoCorrect` hook may replace it. The fix is recorded as its own undo
 *   step, so one Ctrl+Z restores what was typed.
 * - Completion: while a word of at least three letters is being typed, a list
 *   of longer words (from the document, then from `getCompletions`) is shown.
 *   Tab accepts, arrows move, Esc dismisses. Enter is deliberately not bound:
 *   in prose it must always start a new paragraph.
 *
 * Both are gated by the `autoCorrect` / `wordCompletion` muya options, and
 * neither touches code, math, link targets or HTML.
 */
export class WordAssist extends BaseScrollFloat {
    static pluginName = 'wordAssist';
    public override capturesContentKeydown = true;
    public override renderArray: string[] = [];
    public override activeItem: string | null = null;

    private _hooks: IWordAssistOptions;
    private _oldVNode: VNode | null = null;
    private _context: ICompletionContext | null = null;
    private _documentWords: Map<string, number> | null = null;
    private _indexTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(muya: Muya, options: IWordAssistOptions = {}) {
        super(muya, 'mu-word-assist', defaultOptions);
        this._hooks = options;
        this.floatBox!.classList.add('mu-word-assist-wrapper');
        this.listen();
    }

    override capturesContentKey(key: string): boolean {
        return key === EVENT_KEYS.Tab
            || key === EVENT_KEYS.ArrowUp
            || key === EVENT_KEYS.ArrowDown
            || key === EVENT_KEYS.Escape;
    }

    override listen() {
        super.listen();
        const { eventCenter } = this.muya;

        eventCenter.on('muya-text-input', (event: ITextInputEvent) => this._onTextInput(event));
        eventCenter.on('json-change', () => this._scheduleIndex());
    }

    protected override handleFloatKeydown(event: KeyboardEvent) {
        switch (event.key) {
            case EVENT_KEYS.Tab:
                if (event.shiftKey)
                    this.step('previous');
                else
                    this.selectItem(this.activeItem);
                break;

            case EVENT_KEYS.ArrowUp:
                this.step('previous');
                break;

            case EVENT_KEYS.ArrowDown:
                this.step('next');
                break;

            default:
                if (DISMISS_KEYS.has(event.key))
                    this.hide();
                break;
        }
    }

    override hide() {
        super.hide();
        this._context = null;
    }

    // The list is short; 'nearest' avoids nudging anything when the item is
    // already visible (the base class centers it).
    protected override activeEleScrollIntoView(ele: HTMLElement) {
        ele.scrollIntoView({ block: 'nearest' });
    }

    private _onTextInput({ block, inputType, data }: ITextInputEvent) {
        if (inputType !== 'insertText' || !data) {
            this.hide();

            return;
        }

        if (WORD_BOUNDARY.test(data)) {
            this.hide();
            if (this.muya.options.autoCorrect)
                this._autoCorrect(block, data);

            return;
        }

        if (this.muya.options.wordCompletion && isLetter(data))
            this._suggest(block);
        else
            this.hide();
    }

    private _autoCorrect(block: Format, boundary: string) {
        const correct = this._hooks.autoCorrect;
        const cursor = block.getCursor();
        if (!correct || !cursor || cursor.start.offset !== cursor.end.offset)
            return;

        const { text } = block;
        const offset = cursor.start.offset;
        const wordEnd = offset - boundary.length;
        if (text.substring(wordEnd, offset) !== boundary)
            return;

        const found = findWordEndingAt(text, wordEnd);
        if (!found || !block.isRangeInProse(found.start, wordEnd))
            return;

        const replacement = correct(found.word, boundary);
        if (!replacement || replacement === found.word)
            return;

        this._applyAsOwnUndoStep(() => {
            block.replaceTextInline(
                found.start,
                wordEnd,
                replacement,
                offset + replacement.length - found.word.length,
            );
        });
    }

    private _suggest(block: Format) {
        const cursor = block.getCursor();
        if (!cursor || cursor.start.offset !== cursor.end.offset) {
            this.hide();

            return;
        }

        const { text } = block;
        const end = cursor.start.offset;
        const found = isLetter(text[end]) ? null : findWordEndingAt(text, end);
        if (!found || found.word.length < MIN_PREFIX_LENGTH || !block.isRangeInProse(found.start, end)) {
            this.hide();

            return;
        }

        const { word: prefix, start } = found;
        const extra = this._hooks.getCompletions?.(prefix) ?? [];
        const list = rankCompletions(prefix, this._getDocumentWords(), extra, MAX_SUGGESTIONS);
        const reference = list.length ? getCursorReference() : null;
        if (!reference) {
            this.hide();

            return;
        }

        this._context = { block, start, end, prefix };
        this.show(reference, (item: string) => this._complete(item));
        this.renderArray = list;
        this.activeItem = list[0];
        this.render();
    }

    private _complete(word: string | null) {
        const context = this._context;
        if (!word || !context)
            return;

        const { block, start, end, prefix } = context;
        // The list may outlive an edit made some other way; never overwrite text
        // that is no longer the prefix it was computed for.
        if (block.text.substring(start, end) !== prefix)
            return;

        this._applyAsOwnUndoStep(() => block.replaceTextInline(start, end, word));
    }

    // Isolate `edit` in the undo history: commit the pending keystrokes first,
    // then commit the edit alone, so undo reverts exactly this change.
    private _applyAsOwnUndoStep(edit: () => void) {
        const { jsonState, history } = this.muya.editor;
        jsonState.flush();
        history.cutoff();
        edit();
        jsonState.flush();
        history.cutoff();
    }

    private _scheduleIndex() {
        if (!this.muya.options.wordCompletion)
            return;
        if (this._indexTimer)
            clearTimeout(this._indexTimer);
        this._indexTimer = setTimeout(() => {
            this._indexTimer = null;
            this._documentWords = this._buildIndex();
        }, INDEX_DEBOUNCE_MS);
    }

    private _getDocumentWords(): Map<string, number> {
        this._documentWords ??= this._buildIndex();

        return this._documentWords;
    }

    private _buildIndex(): Map<string, number> {
        const counts = countDocumentWords(this.muya.getMarkdown());

        // The index is rebuilt while the user types, so the word under the
        // caret is usually half-finished; it must not be offered back as a
        // completion of itself.
        const block = this.muya.editor.activeContentBlock;
        const cursor = block?.getCursor();
        if (block && cursor) {
            const { text } = block;
            let end = cursor.start.offset;
            while (isLetter(text[end]))
                end++;
            const partial = findWordEndingAt(text, end)?.word;
            const count = partial ? counts.get(partial) : undefined;
            if (partial && count !== undefined) {
                if (count > 1)
                    counts.set(partial, count - 1);
                else
                    counts.delete(partial);
            }
        }

        return counts;
    }

    render() {
        const { renderArray, activeItem, scrollElement, _oldVNode: oldVNode } = this;
        const items = renderArray.map((word, index) => {
            const selector = word === activeItem ? 'li.item.active' : 'li.item';

            return h(
                selector,
                {
                    dataset: { index: String(index) },
                    on: {
                        click: () => this.selectItem(word),
                    },
                },
                [
                    h('span.text', word),
                    word === activeItem ? h('kbd.hint', 'Tab') : '',
                ],
            );
        });

        const vnode = h('ul', items);
        patch(oldVNode ?? scrollElement!, vnode);
        this._oldVNode = vnode;
    }

    getItemElement(item: string): HTMLElement | null {
        const index = this.renderArray.indexOf(item);
        if (index < 0)
            return null;

        return query<HTMLElement>(`[data-index="${index}"]`, this.floatBox!);
    }

    override destroy() {
        if (this._indexTimer)
            clearTimeout(this._indexTimer);
        super.destroy();
    }
}

export default WordAssist;
