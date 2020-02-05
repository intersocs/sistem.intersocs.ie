import { ImmutableArray } from '../model/immutable';
import { Feature, ScannedFeature, SourceRange, Warning } from '../model/model';
import { ParsedCssDocument, Visitor } from './css-document';
import { CssScanner } from './css-scanner';
export declare class CssCustomPropertyScanner implements CssScanner {
    scan(document: ParsedCssDocument, visit: (visitor: Visitor) => Promise<void>): Promise<{
        features: CssCustomPropertyAssignment[];
        warnings: Warning[];
    }>;
}
declare module '../model/queryable' {
    interface FeatureKindMap {
        'css-custom-property-assignment': CssCustomPropertyAssignment;
    }
}
export declare class CssCustomPropertyAssignment implements ScannedFeature, Feature {
    readonly sourceRange: SourceRange;
    readonly warnings: ImmutableArray<Warning>;
    readonly kinds: Set<string>;
    readonly identifiers: Set<string>;
    readonly name: string;
    constructor(name: string, sourceRange: SourceRange);
    resolve(): this;
}
declare module '../model/queryable' {
    interface FeatureKindMap {
        'css-custom-property-use': CssCustomPropertyUse;
    }
}
export declare class CssCustomPropertyUse implements ScannedFeature, Feature {
    readonly sourceRange: SourceRange;
    readonly warnings: ImmutableArray<Warning>;
    readonly kinds: Set<string>;
    readonly identifiers: Set<string>;
    readonly name: string;
    constructor(name: string, sourceRange: SourceRange);
    resolve(): this;
}
