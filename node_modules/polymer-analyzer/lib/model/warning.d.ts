import { Analyzer } from '../core/analyzer';
import { ParsedDocument } from '../parser/document';
import { Analysis } from './analysis';
import { SourceRange } from './source-range';
export interface WarningInit {
    readonly message: string;
    readonly sourceRange: SourceRange;
    readonly severity: Severity;
    readonly code: string;
    readonly parsedDocument: ParsedDocument;
    readonly fix?: Edit;
    readonly actions?: ReadonlyArray<Action>;
}
export declare class Warning {
    readonly code: string;
    readonly message: string;
    readonly sourceRange: SourceRange;
    readonly severity: Severity;
    /**
     * If the problem has a single automatic fix, this is it.
     *
     * Whether and how much something is 'automatic' can be a bit tricky to
     * delineate. Roughly speaking, if 99% of the time the change solves the
     * issue completely then it should go in `fix`.
     */
    readonly fix: Edit | undefined;
    /**
     * Other actions that could be taken in response to this warning.
     *
     * Each action is separate and they may be mutually exclusive. In the case
     * of edit actions they often are.
     */
    readonly actions: ReadonlyArray<Action> | undefined;
    private readonly _parsedDocument;
    constructor(init: WarningInit);
    toString(options?: Partial<WarningStringifyOptions>): string;
    private _severityToColorFunction(severity);
    private _severityToString(colorize);
    toJSON(): {
        code: string;
        message: string;
        severity: Severity;
        sourceRange: SourceRange;
    };
}
export declare enum Severity {
    ERROR = 0,
    WARNING = 1,
    INFO = 2,
}
export declare class WarningCarryingException extends Error {
    readonly warning: Warning;
    constructor(warning: Warning);
}
export declare type Verbosity = 'one-line' | 'full' | 'code-only';
export interface WarningStringifyOptions {
    readonly verbosity: Verbosity;
    readonly color: boolean;
}
export declare type Action = EditAction | {
    /** To ensure that type safe code actually checks for the action kind. */
    kind: 'never';
};
/**
 * An EditAction is like a fix, only it's not applied automatically when the
 * user runs `polymer lint --fix`. Often this is because it's less safe to
 * apply automatically, and there may be caveats, or multiple ways to resolve
 * the warning.
 *
 * For example, a change to an element that updates it to no longer use a
 * deprecated feature, but that involves a change in the element's API should
 * not be a fix, but should instead be an EditAction.
 */
export interface EditAction {
    kind: 'edit';
    /**
     * A unique string code for the edit action. Useful so that the user can
     * request that all actions with a given code should be applied.
     */
    code: string;
    /**
     * A short description of the change, noting caveats and important information
     * for the user.
     */
    description: string;
    edit: Edit;
}
/**
 * Represents an action for replacing a range in a document with some text.
 *
 * This is sufficient to represent all operations on text files, including
 * inserting and deleting text (using empty ranges or empty replacement
 * text, respectively).
 */
export interface Replacement {
    readonly range: SourceRange;
    readonly replacementText: string;
}
/**
 * A set of replacements that must all be applied as a single atomic unit.
 */
export declare type Edit = ReadonlyArray<Replacement>;
export interface EditResult {
    /** The edits that had no conflicts, and are reflected in editedFiles. */
    appliedEdits: Edit[];
    /** Edits that could not be applied due to overlapping ranges. */
    incompatibleEdits: Edit[];
    /** A map from urls to their new contents. */
    editedFiles: Map<string, string>;
}
/**
 * Takes the given edits and, provided there are no overlaps, applies them to
 * the contents loadable from the given loader.
 *
 * If there are overlapping edits, then edits earlier in the array get priority
 * over later ones.
 */
export declare function applyEdits(edits: Edit[], loader: (url: string) => Promise<ParsedDocument<any, any>>): Promise<EditResult>;
export declare function makeParseLoader(analyzer: Analyzer, analysis?: Analysis): (url: string) => Promise<ParsedDocument<any, any>>;
