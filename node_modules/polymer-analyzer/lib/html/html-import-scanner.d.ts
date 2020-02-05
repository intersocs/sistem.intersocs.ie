import { ScannedImport } from '../model/model';
import { PackageRelativeUrl, ResolvedUrl } from '../model/url';
import { HtmlVisitor, ParsedHtmlDocument } from './html-document';
import { HtmlScanner } from './html-scanner';
/**
 * Scans for <link rel="import"> and <link rel="lazy-import">
 */
export declare class HtmlImportScanner implements HtmlScanner {
    private _lazyEdges;
    constructor(_lazyEdges?: Map<ResolvedUrl, PackageRelativeUrl[]> | undefined);
    scan(document: ParsedHtmlDocument, visit: (visitor: HtmlVisitor) => Promise<void>): Promise<{
        features: ScannedImport[];
    }>;
}
