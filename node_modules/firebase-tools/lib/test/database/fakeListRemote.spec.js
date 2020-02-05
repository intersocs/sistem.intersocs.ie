"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const expect = chai.expect;
class FakeListRemote {
    constructor(data) {
        this.data = data;
        this.delay = 0;
    }
    listPath(path, numChildren, startAfter, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            if (timeout === 0) {
                throw new Error("timeout");
            }
            const d = this.dataAtPath(path);
            if (d) {
                let keys = Object.keys(d);
                if (startAfter) {
                    keys = keys.filter((key) => key > startAfter);
                }
                keys = keys.slice(0, numChildren);
                return keys;
            }
            return [];
        });
    }
    size(data) {
        if (typeof data === "number") {
            return data;
        }
        let size = 0;
        for (const key of Object.keys(data)) {
            size += this.size(data[key]);
        }
        return size;
    }
    dataAtPath(path) {
        const splitedPath = path.slice(1).split("/");
        let d = this.data;
        for (const p of splitedPath) {
            if (d && p !== "") {
                if (typeof d === "number") {
                    d = null;
                }
                else {
                    d = d[p];
                }
            }
        }
        return d;
    }
}
exports.FakeListRemote = FakeListRemote;
describe("FakeListRemote", () => {
    it("should return limit the number of subpaths returned", () => __awaiter(this, void 0, void 0, function* () {
        const fakeDb = new FakeListRemote({ 1: 1, 2: 2, 3: 3, 4: 4 });
        yield expect(fakeDb.listPath("/", 4)).to.eventually.eql(["1", "2", "3", "4"]);
        yield expect(fakeDb.listPath("/", 3)).to.eventually.eql(["1", "2", "3"]);
        yield expect(fakeDb.listPath("/", 2)).to.eventually.eql(["1", "2"]);
        yield expect(fakeDb.listPath("/", 1)).to.eventually.eql(["1"]);
        yield expect(fakeDb.listPath("/", 4, "1")).to.eventually.eql(["2", "3", "4"]);
        yield expect(fakeDb.listPath("/", 4, "2")).to.eventually.eql(["3", "4"]);
        yield expect(fakeDb.listPath("/", 4, "3")).to.eventually.eql(["4"]);
        yield expect(fakeDb.listPath("/", 4, "4")).to.eventually.eql([]);
        yield expect(fakeDb.listPath("/", 3, "1")).to.eventually.eql(["2", "3", "4"]);
        yield expect(fakeDb.listPath("/", 3, "2")).to.eventually.eql(["3", "4"]);
        yield expect(fakeDb.listPath("/", 3, "3")).to.eventually.eql(["4"]);
        yield expect(fakeDb.listPath("/", 3, "3")).to.eventually.eql(["4"]);
        yield expect(fakeDb.listPath("/", 3, "4")).to.eventually.eql([]);
        yield expect(fakeDb.listPath("/", 1, "1")).to.eventually.eql(["2"]);
        yield expect(fakeDb.listPath("/", 1, "2")).to.eventually.eql(["3"]);
        yield expect(fakeDb.listPath("/", 1, "3")).to.eventually.eql(["4"]);
        yield expect(fakeDb.listPath("/", 1, "4")).to.eventually.eql([]);
        yield expect(fakeDb.listPath("/", 1, "1", 0)).to.be.rejected;
    }));
});
//# sourceMappingURL=fakeListRemote.spec.js.map