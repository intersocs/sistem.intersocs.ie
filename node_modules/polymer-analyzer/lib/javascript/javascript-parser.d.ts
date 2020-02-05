import * as estree from 'estree';
import { InlineDocInfo, LocationOffset, Severity, SourceRange } from '../model/model';
import { ResolvedUrl } from '../model/url';
import { Parser } from '../parser/parser';
import { JavaScriptDocument } from './javascript-document';
export declare type SourceType = 'script' | 'module';
export declare const baseParseOptions: {
    ecmaVersion: number;
    attachComment: boolean;
    comment: boolean;
    loc: boolean;
};
export declare class JavaScriptParser implements Parser<JavaScriptDocument> {
    sourceType: SourceType;
    parse(contents: string, url: ResolvedUrl, inlineInfo?: InlineDocInfo<any>): JavaScriptDocument;
}
export declare class JavaScriptModuleParser extends JavaScriptParser {
    sourceType: SourceType;
}
export declare class JavaScriptScriptParser extends JavaScriptParser {
    sourceType: SourceType;
}
export declare type ParseResult = {
    type: 'success';
    sourceType: SourceType;
    program: estree.Program;
} | {
    type: 'failure';
    warning: {
        sourceRange: SourceRange;
        severity: Severity;
        code: string;
        message: string;
    };
};
/**
 * Parse the given contents and return either an AST or a parse error as a
 * Warning.
 *
 * It needs the filename and the location offset to produce correct warnings.
 */
export declare function parseJs(contents: string, file: string, locationOffset?: LocationOffset, warningCode?: string, sourceType?: SourceType): ParseResult;
