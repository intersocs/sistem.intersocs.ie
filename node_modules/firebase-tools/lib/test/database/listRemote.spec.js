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
const chai_1 = require("chai");
const nock = require("nock");
const utils = require("../../utils");
const api = require("../../api");
const listRemote_1 = require("../../database/listRemote");
describe("ListRemote", () => {
    const instance = "fake-db";
    const remote = new listRemote_1.RTDBListRemote(instance);
    const serverUrl = utils.addSubdomain(api.realtimeOrigin, instance);
    afterEach(() => {
        nock.cleanAll();
    });
    it("should return subpaths from shallow get request", () => __awaiter(this, void 0, void 0, function* () {
        nock(serverUrl)
            .get("/.json")
            .query({ shallow: true, limitToFirst: "1234" })
            .reply(200, {
            a: true,
            x: true,
            f: true,
        });
        yield chai_1.expect(remote.listPath("/", 1234)).to.eventually.eql(["a", "x", "f"]);
    }));
});
//# sourceMappingURL=listRemote.spec.js.map