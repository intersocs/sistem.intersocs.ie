"use strict";
/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const analysis_cache_1 = require("../../core/analysis-cache");
suite('AnalysisCache', () => {
    test('it can be constructed', () => {
        new analysis_cache_1.AnalysisCache();
    });
    function addFakeDocumentToCache(cache, path, dependencies) {
        const resolvedPath = path;
        const resolvedDependencies = dependencies;
        cache.parsedDocumentPromises.set(resolvedPath, `parsed ${resolvedPath} promise`);
        cache.scannedDocumentPromises.set(resolvedPath, `scanned ${resolvedPath} promise`);
        cache.analyzedDocumentPromises.set(resolvedPath, `analyzed ${resolvedPath} promise`);
        cache.scannedDocuments.set(resolvedPath, `scanned ${resolvedPath}`);
        cache.analyzedDocuments.set(resolvedPath, `analyzed ${resolvedPath}`);
        cache.dependencyGraph.addDocument(resolvedPath, resolvedDependencies);
    }
    function assertHasDocument(cache, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const resolvedPath = path;
            chai_1.assert.equal(yield cache.parsedDocumentPromises.getOrCompute(resolvedPath, null), `parsed ${resolvedPath} promise`);
            chai_1.assert.equal(yield cache.scannedDocumentPromises.getOrCompute(resolvedPath, null), `scanned ${resolvedPath} promise`);
            // caller must assert on cache.analyzedDocumentPromises themselves
            chai_1.assert.equal(cache.scannedDocuments.get(resolvedPath), `scanned ${resolvedPath}`);
            chai_1.assert.equal(cache.analyzedDocuments.get(resolvedPath), `analyzed ${resolvedPath}`);
        });
    }
    function assertNotHasDocument(cache, p) {
        const path = p;
        chai_1.assert.isFalse(cache.parsedDocumentPromises.has(path));
        chai_1.assert.isFalse(cache.scannedDocumentPromises.has(path));
        // caller must assert on cache.analyzedDocumentPromises themselves
        chai_1.assert.isFalse(cache.scannedDocuments.has(path));
        chai_1.assert.isFalse(cache.analyzedDocuments.has(path));
    }
    function assertDocumentScannedButNotResolved(cache, p) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = p;
            chai_1.assert.equal(yield cache.parsedDocumentPromises.getOrCompute(path, null), `parsed ${path} promise`);
            chai_1.assert.equal(yield cache.scannedDocumentPromises.getOrCompute(path, null), `scanned ${path} promise`);
            chai_1.assert.equal(cache.scannedDocuments.get(path), `scanned ${path}`);
            chai_1.assert.isFalse(cache.analyzedDocuments.has(path));
            chai_1.assert.isFalse(cache.analyzedDocumentPromises.has(path));
        });
    }
    test('it invalidates a path when asked to', () => __awaiter(this, void 0, void 0, function* () {
        const cache = new analysis_cache_1.AnalysisCache();
        addFakeDocumentToCache(cache, 'index.html', []);
        addFakeDocumentToCache(cache, 'unrelated.html', []);
        yield assertHasDocument(cache, 'index.html');
        yield assertHasDocument(cache, 'unrelated.html');
        const forkedCache = cache.invalidate(['index.html']);
        yield assertHasDocument(cache, 'index.html');
        yield assertHasDocument(cache, 'unrelated.html');
        assertNotHasDocument(forkedCache, 'index.html');
        yield assertHasDocument(forkedCache, 'unrelated.html');
        // The promise of unrelated.html's result has been turned into
        // a Promise.resolve() of its non-promise cache.
        chai_1.assert.equal(yield forkedCache.analyzedDocumentPromises.getOrCompute('unrelated.html', null), `analyzed unrelated.html`);
    }));
    test('it invalidates the dependants of a path when asked to', () => __awaiter(this, void 0, void 0, function* () {
        const cache = new analysis_cache_1.AnalysisCache();
        // Picture a graph where
        addFakeDocumentToCache(cache, 'index.html', ['element.html']);
        addFakeDocumentToCache(cache, 'element.html', ['behavior.html']);
        addFakeDocumentToCache(cache, 'behavior.html', []);
        addFakeDocumentToCache(cache, 'unrelated.html', []);
        // We added the documents.
        yield assertHasDocument(cache, 'index.html');
        yield assertHasDocument(cache, 'unrelated.html');
        yield assertHasDocument(cache, 'behavior.html');
        yield assertHasDocument(cache, 'unrelated.html');
        const forkedCache = cache.invalidate(['behavior.html']);
        // The original cache is untouched.
        yield assertHasDocument(cache, 'index.html');
        yield assertHasDocument(cache, 'unrelated.html');
        yield assertHasDocument(cache, 'behavior.html');
        yield assertHasDocument(cache, 'unrelated.html');
        // The fork has no trace of behavior.html, and its dependants are scanned
        // but not resolved. Unrelated documents are still fully cached.
        assertNotHasDocument(forkedCache, 'behavior.html');
        yield assertDocumentScannedButNotResolved(forkedCache, 'index.html');
        yield assertDocumentScannedButNotResolved(forkedCache, 'element.html');
        yield assertHasDocument(forkedCache, 'unrelated.html');
    }));
});

//# sourceMappingURL=analysis-cache_test.js.map
