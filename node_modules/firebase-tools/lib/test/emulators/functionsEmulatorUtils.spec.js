"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const functionsEmulatorUtils_1 = require("../../emulator/functionsEmulatorUtils");
describe("FunctionsEmulatorUtils", () => {
    describe("extractParamsFromPath", () => {
        it("should match a path which fits a wildcard template", () => {
            const params = functionsEmulatorUtils_1.extractParamsFromPath("companies/{company}/users/{user}", "/companies/firebase/users/abe");
            chai_1.expect(params).to.deep.equal({ company: "firebase", user: "abe" });
        });
        it("should not match unfilled wildcards", () => {
            const params = functionsEmulatorUtils_1.extractParamsFromPath("companies/{company}/users/{user}", "companies/{still_wild}/users/abe");
            chai_1.expect(params).to.deep.equal({ user: "abe" });
        });
        it("should not match a path which is too long", () => {
            const params = functionsEmulatorUtils_1.extractParamsFromPath("companies/{company}/users/{user}", "companies/firebase/users/abe/boots");
            chai_1.expect(params).to.deep.equal({});
        });
        it("should not match a path which is too short", () => {
            const params = functionsEmulatorUtils_1.extractParamsFromPath("companies/{company}/users/{user}", "companies/firebase/users/");
            chai_1.expect(params).to.deep.equal({});
        });
        it("should not match a path which has different chunks", () => {
            const params = functionsEmulatorUtils_1.extractParamsFromPath("locations/{company}/users/{user}", "companies/firebase/users/{user}");
            chai_1.expect(params).to.deep.equal({});
        });
    });
    describe("isValidWildcardMatch", () => {
        it("should match a path which fits a wildcard template", () => {
            const valid = functionsEmulatorUtils_1.isValidWildcardMatch("companies/{company}/users/{user}", "/companies/firebase/users/abe");
            chai_1.expect(valid).to.equal(true);
        });
        it("should not match a path which is too long", () => {
            const tooLong = functionsEmulatorUtils_1.isValidWildcardMatch("companies/{company}/users/{user}", "companies/firebase/users/abe/boots");
            chai_1.expect(tooLong).to.equal(false);
        });
        it("should not match a path which is too short", () => {
            const tooShort = functionsEmulatorUtils_1.isValidWildcardMatch("companies/{company}/users/{user}", "companies/firebase/users/");
            chai_1.expect(tooShort).to.equal(false);
        });
        it("should not match a path which has different chunks", () => {
            const differentChunk = functionsEmulatorUtils_1.isValidWildcardMatch("locations/{company}/users/{user}", "companies/firebase/users/{user}");
            chai_1.expect(differentChunk).to.equal(false);
        });
    });
    describe("trimSlashes", () => {
        it("should remove leading and trailing slashes", () => {
            chai_1.expect(functionsEmulatorUtils_1.trimSlashes("///a/b/c////")).to.equal("a/b/c");
        });
        it("should replace multiple adjacent slashes with a single slash", () => {
            chai_1.expect(functionsEmulatorUtils_1.trimSlashes("a////b//c")).to.equal("a/b/c");
        });
        it("should do both", () => {
            chai_1.expect(functionsEmulatorUtils_1.trimSlashes("///a////b//c/")).to.equal("a/b/c");
        });
    });
});
//# sourceMappingURL=functionsEmulatorUtils.spec.js.map