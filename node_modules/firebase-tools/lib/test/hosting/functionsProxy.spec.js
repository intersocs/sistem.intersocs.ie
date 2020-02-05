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
const lodash_1 = require("lodash");
const chai_1 = require("chai");
const express = require("express");
const nock = require("nock");
const sinon = require("sinon");
const supertest = require("supertest");
const functionsProxy_1 = require("../../hosting/functionsProxy");
const registry_1 = require("../../emulator/registry");
const types_1 = require("../../emulator/types");
const fakeEmulator_1 = require("../emulators/fakeEmulator");
describe("functionsProxy", () => {
    const fakeOptions = {
        port: 7777,
        project: "project-foo",
        targets: [],
    };
    const fakeRewrite = { function: "bar" };
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        const fakeFunctionsEmulator = new fakeEmulator_1.FakeEmulator(types_1.Emulators.FUNCTIONS, "localhost", 7778);
        yield registry_1.EmulatorRegistry.start(fakeFunctionsEmulator);
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        nock.cleanAll();
        yield registry_1.EmulatorRegistry.stopAll();
    }));
    it("should resolve a function returns middleware that proxies to the live version", () => __awaiter(this, void 0, void 0, function* () {
        nock("https://us-central1-project-foo.cloudfunctions.net")
            .get("/bar/")
            .reply(200, "live version");
        const mwGenerator = yield functionsProxy_1.default(fakeOptions);
        const mw = yield mwGenerator(fakeRewrite);
        const spyMw = sinon.spy(mw);
        return supertest(spyMw)
            .get("/")
            .expect(200, "live version")
            .then(() => {
            chai_1.expect(spyMw.calledOnce).to.be.true;
        });
    }));
    it("should resolve a function that returns middleware that proxies to a local version", () => __awaiter(this, void 0, void 0, function* () {
        nock("http://localhost:7778")
            .get("/project-foo/us-central1/bar/")
            .reply(200, "local version");
        const options = lodash_1.cloneDeep(fakeOptions);
        options.targets = ["functions"];
        const mwGenerator = yield functionsProxy_1.default(options);
        const mw = yield mwGenerator(fakeRewrite);
        const spyMw = sinon.spy(mw);
        return supertest(spyMw)
            .get("/")
            .expect(200, "local version")
            .then(() => {
            chai_1.expect(spyMw.calledOnce).to.be.true;
        });
    }));
    it("should pass through normal 404 errors", () => __awaiter(this, void 0, void 0, function* () {
        nock("https://us-central1-project-foo.cloudfunctions.net")
            .get("/bar/404.html")
            .reply(404, "normal 404");
        const mwGenerator = yield functionsProxy_1.default(fakeOptions);
        const mw = yield mwGenerator(fakeRewrite);
        const spyMw = sinon.spy(mw);
        return supertest(spyMw)
            .get("/404.html")
            .expect(404, "normal 404")
            .then(() => {
            chai_1.expect(spyMw.calledOnce).to.be.true;
        });
    }));
    it("should do nothing on 404 errors with x-cascade", () => __awaiter(this, void 0, void 0, function* () {
        nock("https://us-central1-project-foo.cloudfunctions.net")
            .get("/bar/404-cascade.html")
            .reply(404, "normal 404 with cascade", { "x-cascade": "pass" });
        const mwGenerator = yield functionsProxy_1.default(fakeOptions);
        const mw = yield mwGenerator(fakeRewrite);
        const spyMw = sinon.spy(mw);
        const finalMw = sinon.stub().callsFake((_, res) => {
            res.status(404).send("unknown response");
        });
        const app = express();
        app.use(spyMw);
        app.use(finalMw);
        return supertest(app)
            .get("/404-cascade.html")
            .expect(404, "unknown response")
            .then(() => {
            chai_1.expect(spyMw.calledOnce).to.be.true;
        });
    }));
    it("should remove cookies on non-private cached responses", () => __awaiter(this, void 0, void 0, function* () {
        nock("https://us-central1-project-foo.cloudfunctions.net")
            .get("/bar/cached")
            .reply(200, "cached page", { "cache-control": "custom", "set-cookie": "nom" });
        const mwGenerator = yield functionsProxy_1.default(fakeOptions);
        const mw = yield mwGenerator(fakeRewrite);
        const spyMw = sinon.spy(mw);
        return supertest(spyMw)
            .get("/cached")
            .expect(200, "cached page")
            .then((res) => {
            chai_1.expect(spyMw.calledOnce).to.be.true;
            chai_1.expect(res.header["set-cookie"]).to.be.undefined;
        });
    }));
    it("should add required Vary headers to the response", () => __awaiter(this, void 0, void 0, function* () {
        nock("https://us-central1-project-foo.cloudfunctions.net")
            .get("/bar/vary")
            .reply(200, "live vary version", { vary: "Other, Authorization" });
        const mwGenerator = yield functionsProxy_1.default(fakeOptions);
        const mw = yield mwGenerator(fakeRewrite);
        const spyMw = sinon.spy(mw);
        return supertest(spyMw)
            .get("/vary")
            .expect(200, "live vary version")
            .then((res) => {
            chai_1.expect(spyMw.calledOnce).to.be.true;
            chai_1.expect(res.header.vary).to.equal("Other, Authorization, Accept-Encoding, Cookie");
        });
    }));
    it("should respond with a 500 error if an error occurs calling the function", () => __awaiter(this, void 0, void 0, function* () {
        nock("https://us-central1-project-foo.cloudfunctions.net")
            .get("/bar/500")
            .replyWithError({ message: "normal error" });
        const mwGenerator = yield functionsProxy_1.default(fakeOptions);
        const mw = yield mwGenerator(fakeRewrite);
        const spyMw = sinon.spy(mw);
        return supertest(spyMw)
            .get("/500")
            .expect(500)
            .then(() => {
            chai_1.expect(spyMw.calledOnce).to.be.true;
        });
    }));
    it("should respond with a 504 error if a timeout error occurs calling the function", () => __awaiter(this, void 0, void 0, function* () {
        nock("https://us-central1-project-foo.cloudfunctions.net")
            .get("/bar/timeout")
            .replyWithError({ message: "ahh", code: "ETIMEDOUT" });
        const mwGenerator = yield functionsProxy_1.default(fakeOptions);
        const mw = yield mwGenerator(fakeRewrite);
        const spyMw = sinon.spy(mw);
        return supertest(spyMw)
            .get("/timeout")
            .expect(504)
            .then(() => {
            chai_1.expect(spyMw.calledOnce).to.be.true;
        });
    }));
    it("should respond with a 504 error if a sockettimeout error occurs calling the function", () => __awaiter(this, void 0, void 0, function* () {
        nock("https://us-central1-project-foo.cloudfunctions.net")
            .get("/bar/sockettimeout")
            .replyWithError({ message: "ahh", code: "ESOCKETTIMEDOUT" });
        const mwGenerator = yield functionsProxy_1.default(fakeOptions);
        const mw = yield mwGenerator(fakeRewrite);
        const spyMw = sinon.spy(mw);
        return supertest(spyMw)
            .get("/sockettimeout")
            .expect(504)
            .then(() => {
            chai_1.expect(spyMw.calledOnce).to.be.true;
        });
    }));
});
//# sourceMappingURL=functionsProxy.spec.js.map