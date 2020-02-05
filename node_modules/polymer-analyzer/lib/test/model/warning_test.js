"use strict";
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
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
const knuth_shuffle_1 = require("knuth-shuffle");
const analyzer_1 = require("../../core/analyzer");
const model_1 = require("../../model/model");
const overlay_loader_1 = require("../../url-loader/overlay-loader");
suite('applyEdits', () => {
    let memoryMap;
    let loader;
    setup(() => {
        memoryMap = new overlay_loader_1.InMemoryOverlayUrlLoader();
        memoryMap.urlContentsMap.set('test.html', 'abc');
        const analyzer = new analyzer_1.Analyzer({ urlLoader: memoryMap });
        loader = (url) => __awaiter(this, void 0, void 0, function* () {
            const analysis = yield analyzer.analyze([url]);
            const document = analysis.getDocument(url);
            return document.parsedDocument;
        });
    });
    function makeTestReplacement(startLine, startColumn, endLine, endColumn, replacementText) {
        return {
            range: {
                file: 'test.html',
                start: { line: startLine, column: startColumn },
                end: { line: endLine, column: endColumn }
            },
            replacementText
        };
    }
    ;
    test('works in the trivial case', () => __awaiter(this, void 0, void 0, function* () {
        const contents = 'abc';
        memoryMap.urlContentsMap.set('test.html', contents);
        const result = yield model_1.applyEdits([], loader);
        chai_1.assert.deepEqual(result.appliedEdits, []);
        chai_1.assert.deepEqual(result.incompatibleEdits, []);
        chai_1.assert.deepEqual(Array.from(result.editedFiles.entries()), []);
    }));
    test('can apply a simple single edit', () => __awaiter(this, void 0, void 0, function* () {
        const edit = [makeTestReplacement(0, 1, 0, 2, 'd')];
        const result = yield model_1.applyEdits([edit], loader);
        chai_1.assert.deepEqual(result.appliedEdits, [edit]);
        chai_1.assert.deepEqual(result.incompatibleEdits, []);
        chai_1.assert.deepEqual(Array.from(result.editedFiles.entries()), [['test.html', 'adc']]);
    }));
    test('can apply two compatible edits', () => __awaiter(this, void 0, void 0, function* () {
        const edit1 = [makeTestReplacement(0, 1, 0, 2, 'd')];
        const edit2 = [makeTestReplacement(0, 2, 0, 3, 'g')];
        const result = yield model_1.applyEdits([edit1, edit2], loader);
        chai_1.assert.deepEqual(result.appliedEdits, [edit1, edit2]);
        chai_1.assert.deepEqual(result.incompatibleEdits, []);
        chai_1.assert.deepEqual(Array.from(result.editedFiles.entries()), [['test.html', 'adg']]);
    }));
    test('does not apply an internally inconsistent edit', () => __awaiter(this, void 0, void 0, function* () {
        const edit = [
            makeTestReplacement(0, 0, 0, 3, 'def'),
            makeTestReplacement(0, 0, 0, 3, 'ghi'),
        ];
        const result = yield model_1.applyEdits([edit], loader);
        chai_1.assert.deepEqual(result.appliedEdits, []);
        chai_1.assert.deepEqual(result.incompatibleEdits, [edit]);
        chai_1.assert.deepEqual(Array.from(result.editedFiles.entries()), []);
    }));
    let testName = 'takes edits in order, rejecting those incompatible ' +
        'with the accepted ones so far';
    test(testName, () => __awaiter(this, void 0, void 0, function* () {
        const edits = [
            [makeTestReplacement(0, 0, 0, 1, '1')],
            [makeTestReplacement(0, 0, 0, 3, '!!!')],
            [makeTestReplacement(0, 2, 0, 3, '3')],
        ];
        const result = yield model_1.applyEdits(edits, loader);
        chai_1.assert.deepEqual(result.appliedEdits, [edits[0], edits[2]]);
        chai_1.assert.deepEqual(result.incompatibleEdits, [edits[1]]);
        chai_1.assert.deepEqual(Array.from(result.editedFiles.entries()), [['test.html', '1b3']]);
    }));
    testName = 'can deal with inserting, replacing and removing characters';
    test(testName, () => __awaiter(this, void 0, void 0, function* () {
        const edits = [
            [makeTestReplacement(0, 0, 0, 0, '0000')],
            [makeTestReplacement(0, 0, 0, 1, '111')],
            [makeTestReplacement(0, 1, 0, 2, '')],
            [makeTestReplacement(0, 2, 0, 3, '33')],
            [makeTestReplacement(0, 3, 0, 3, '4')],
        ];
        // These edits are valid from any order, try a bunch of them.
        for (let _ = 0; _ < 1000; _++) {
            const shuffledEdits = Array.from(edits);
            knuth_shuffle_1.knuthShuffle(shuffledEdits);
            const result = yield model_1.applyEdits(shuffledEdits, loader);
            chai_1.assert.deepEqual(result.appliedEdits, shuffledEdits);
            chai_1.assert.deepEqual(result.incompatibleEdits, []);
            chai_1.assert.deepEqual(Array.from(result.editedFiles.entries()), [['test.html', '0000111334']]);
        }
    }));
    testName = 'can do two inserts into the same location without conflict';
    test(testName, () => __awaiter(this, void 0, void 0, function* () {
        const edits = [
            [makeTestReplacement(0, 0, 0, 0, 'xxxx')],
            [makeTestReplacement(0, 0, 0, 0, 'yyyy')],
        ];
        const result = yield model_1.applyEdits(edits, loader);
        chai_1.assert.deepEqual(result.appliedEdits, edits);
        chai_1.assert.deepEqual(result.incompatibleEdits, []);
        chai_1.assert.deepEqual(Array.from(result.editedFiles.entries()), [['test.html', 'yyyyxxxxabc']]);
    }));
});

//# sourceMappingURL=warning_test.js.map
