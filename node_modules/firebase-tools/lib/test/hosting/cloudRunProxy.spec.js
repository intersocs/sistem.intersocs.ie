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
const express = require("express");
const nock = require("nock");
const sinon = require("sinon");
const supertest = require("supertest");
const api_1 = require("../../api");
const cloudRunProxy_1 = require("../../hosting/cloudRunProxy");
describe("cloudRunProxy", () => {
    const fakeOptions = {
        project: "project-foo",
    };
    const fakeRewrite = { run: { serviceId: "helloworld" } };
    const cloudRunServiceOrigin = "https://helloworld-hash-uc.a.run.app";
    afterEach(() => {
        nock.cleanAll();
    });
    it("should error when not provided a valid Cloud Run service ID", () => __awaiter(this, void 0, void 0, function* () {
        const mwGenerator = yield cloudRunProxy_1.default(fakeOptions);
        const mw = yield mwGenerator({ run: { serviceId: "" } });
        const spyMw = sinon.spy(mw);
        return supertest(spyMw)
            .get("/")
            .expect(500, /Cloud Run rewrites must supply a service ID/g)
            .then(() => {
            chai_1.expect(spyMw.calledOnce).to.be.true;
        });
    }));
    it("should error when the Cloud Run service doesn't exist", () => __awaiter(this, void 0, void 0, function* () {
        nock(api_1.cloudRunApiOrigin)
            .get("/v1alpha1/projects/project-foo/locations/us-central1/services/empty")
            .reply(404, { error: "service doesn't exist" });
        const mwGenerator = yield cloudRunProxy_1.default(fakeOptions);
        const mw = yield mwGenerator({ run: { serviceId: "empty" } });
        const spyMw = sinon.spy(mw);
        return supertest(spyMw)
            .get("/")
            .expect(500, /service doesn't exist/g)
            .then(() => {
            chai_1.expect(spyMw.calledOnce).to.be.true;
        });
    }));
    it("should error when the Cloud Run service doesn't exist", () => __awaiter(this, void 0, void 0, function* () {
        nock(api_1.cloudRunApiOrigin)
            .get("/v1alpha1/projects/project-foo/locations/us-central1/services/badService")
            .reply(200, { status: { address: {} } });
        const mwGenerator = yield cloudRunProxy_1.default(fakeOptions);
        const mw = yield mwGenerator({ run: { serviceId: "badService" } });
        const spyMw = sinon.spy(mw);
        return supertest(spyMw)
            .get("/")
            .expect(500, /Cloud Run URL doesn't exist/g)
            .then(() => {
            chai_1.expect(spyMw.calledOnce).to.be.true;
        });
    }));
    it("should resolve a function returns middleware that proxies to the live version", () => __awaiter(this, void 0, void 0, function* () {
        nock(api_1.cloudRunApiOrigin)
            .get("/v1alpha1/projects/project-foo/locations/us-central1/services/helloworld")
            .reply(200, { status: { address: { hostname: cloudRunServiceOrigin } } });
        nock(cloudRunServiceOrigin)
            .get("/")
            .reply(200, "live version");
        const mwGenerator = yield cloudRunProxy_1.default(fakeOptions);
        const mw = yield mwGenerator(fakeRewrite);
        const spyMw = sinon.spy(mw);
        return supertest(spyMw)
            .get("/")
            .expect(200, "live version")
            .then(() => {
            chai_1.expect(spyMw.calledOnce).to.be.true;
        });
    }));
    it("should resolve to a live version in another region", () => __awaiter(this, void 0, void 0, function* () {
        const cloudRunServiceOriginAsia = "https://helloworld-hash-as.a.run.app";
        nock(api_1.cloudRunApiOrigin)
            .get("/v1alpha1/projects/project-foo/locations/asia-southeast1/services/helloworld")
            .reply(200, { status: { address: { hostname: cloudRunServiceOriginAsia } } });
        nock(cloudRunServiceOriginAsia)
            .get("/")
            .reply(200, "live version");
        const mwGenerator = yield cloudRunProxy_1.default(fakeOptions);
        const mw = yield mwGenerator({ run: { serviceId: "helloworld", region: "asia-southeast1" } });
        const spyMw = sinon.spy(mw);
        return supertest(spyMw)
            .get("/")
            .expect(200, "live version")
            .then(() => {
            chai_1.expect(spyMw.calledOnce).to.be.true;
        });
    }));
    it("should cache calls to look up Cloud Run service URLs", () => __awaiter(this, void 0, void 0, function* () {
        const multiCallOrigin = "https://multiLookup-hash-uc.a.run.app";
        const multiNock = nock(api_1.cloudRunApiOrigin)
            .get("/v1alpha1/projects/project-foo/locations/us-central1/services/multiLookup")
            .reply(200, { status: { address: { hostname: multiCallOrigin } } });
        nock(multiCallOrigin)
            .persist()
            .get("/")
            .reply(200, "live version");
        const mwGenerator = yield cloudRunProxy_1.default(fakeOptions);
        const mw = yield mwGenerator({ run: { serviceId: "multiLookup" } });
        const spyMw = sinon.spy(mw);
        yield supertest(spyMw)
            .get("/")
            .expect(200, "live version");
        yield chai_1.expect(spyMw.calledOnce).to.be.true;
        yield chai_1.expect(multiNock.isDone()).to.be.true;
        const failMultiNock = nock(api_1.cloudRunApiOrigin)
            .get("/v1alpha1/projects/project-foo/locations/us-central1/services/multiLookup")
            .reply(500, "should not happen");
        const mw2Generator = yield cloudRunProxy_1.default(fakeOptions);
        const mw2 = yield mw2Generator({ run: { serviceId: "multiLookup" } });
        const spyMw2 = sinon.spy(mw2);
        yield supertest(spyMw2)
            .get("/")
            .expect(200, "live version");
        yield chai_1.expect(spyMw2.calledOnce).to.be.true;
        yield chai_1.expect(failMultiNock.isDone()).to.be.false;
        yield supertest(spyMw2)
            .get("/")
            .expect(200, "live version");
        yield chai_1.expect(spyMw2.calledTwice).to.be.true;
        yield chai_1.expect(failMultiNock.isDone()).to.be.false;
    }));
    it("should pass through normal 404 errors", () => __awaiter(this, void 0, void 0, function* () {
        nock(api_1.cloudRunApiOrigin)
            .get("/v1alpha1/projects/project-foo/locations/us-central1/services/helloworld")
            .reply(200, { status: { address: { hostname: cloudRunServiceOrigin } } });
        nock(cloudRunServiceOrigin)
            .get("/404.html")
            .reply(404, "normal 404");
        const mwGenerator = yield cloudRunProxy_1.default(fakeOptions);
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
        nock(api_1.cloudRunApiOrigin)
            .get("/v1alpha1/projects/project-foo/locations/us-central1/services/helloworld")
            .reply(200, { status: { address: { hostname: cloudRunServiceOrigin } } });
        nock(cloudRunServiceOrigin)
            .get("/404-cascade.html")
            .reply(404, "normal 404 with cascade", { "x-cascade": "pass" });
        const mwGenerator = yield cloudRunProxy_1.default(fakeOptions);
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
        nock(api_1.cloudRunApiOrigin)
            .get("/v1alpha1/projects/project-foo/locations/us-central1/services/helloworld")
            .reply(200, { status: { address: { hostname: cloudRunServiceOrigin } } });
        nock(cloudRunServiceOrigin)
            .get("/cached")
            .reply(200, "cached page", { "cache-control": "custom", "set-cookie": "nom" });
        const mwGenerator = yield cloudRunProxy_1.default(fakeOptions);
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
        nock(api_1.cloudRunApiOrigin)
            .get("/v1alpha1/projects/project-foo/locations/us-central1/services/helloworld")
            .reply(200, { status: { address: { hostname: cloudRunServiceOrigin } } });
        nock(cloudRunServiceOrigin)
            .get("/vary")
            .reply(200, "live vary version", { vary: "Other, Authorization" });
        const mwGenerator = yield cloudRunProxy_1.default(fakeOptions);
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
    it("should respond with a 500 error if an error occurs calling the Cloud Run service", () => __awaiter(this, void 0, void 0, function* () {
        nock(api_1.cloudRunApiOrigin)
            .get("/v1alpha1/projects/project-foo/locations/us-central1/services/helloworld")
            .reply(200, { status: { address: { hostname: cloudRunServiceOrigin } } });
        nock(cloudRunServiceOrigin)
            .get("/500")
            .replyWithError({ message: "normal error" });
        const mwGenerator = yield cloudRunProxy_1.default(fakeOptions);
        const mw = yield mwGenerator(fakeRewrite);
        const spyMw = sinon.spy(mw);
        return supertest(spyMw)
            .get("/500")
            .expect(500)
            .then(() => {
            chai_1.expect(spyMw.calledOnce).to.be.true;
        });
    }));
    it("should respond with a 504 error if a timeout error occurs calling the Cloud Run service", () => __awaiter(this, void 0, void 0, function* () {
        nock(api_1.cloudRunApiOrigin)
            .get("/v1alpha1/projects/project-foo/locations/us-central1/services/helloworld")
            .reply(200, { status: { address: { hostname: cloudRunServiceOrigin } } });
        nock(cloudRunServiceOrigin)
            .get("/timeout")
            .replyWithError({ message: "ahh", code: "ETIMEDOUT" });
        const mwGenerator = yield cloudRunProxy_1.default(fakeOptions);
        const mw = yield mwGenerator(fakeRewrite);
        const spyMw = sinon.spy(mw);
        return supertest(spyMw)
            .get("/timeout")
            .expect(504)
            .then(() => {
            chai_1.expect(spyMw.calledOnce).to.be.true;
        });
    }));
    it("should respond with a 504 error if a sockettimeout error occurs calling the Cloud Run service", () => __awaiter(this, void 0, void 0, function* () {
        nock(api_1.cloudRunApiOrigin)
            .get("/v1alpha1/projects/project-foo/locations/us-central1/services/helloworld")
            .reply(200, { status: { address: { hostname: cloudRunServiceOrigin } } });
        nock(cloudRunServiceOrigin)
            .get("/sockettimeout")
            .replyWithError({ message: "ahh", code: "ESOCKETTIMEDOUT" });
        const mwGenerator = yield cloudRunProxy_1.default(fakeOptions);
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
//# sourceMappingURL=cloudRunProxy.spec.js.map