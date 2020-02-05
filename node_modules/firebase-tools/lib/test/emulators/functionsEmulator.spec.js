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
const functionsEmulator_1 = require("../../emulator/functionsEmulator");
const supertest = require("supertest");
const fixtures_1 = require("./fixtures");
const logger = require("../../logger");
if ((process.env.DEBUG || "").toLowerCase().indexOf("spec") >= 0) {
    logger.add(require("winston").transports.Console, {
        level: "debug",
        showLevel: false,
        colorize: true,
    });
}
const startFunctionRuntime = functionsEmulator_1.FunctionsEmulator.startFunctionRuntime;
function UseFunctions(triggers) {
    const serializedTriggers = triggers.toString();
    functionsEmulator_1.FunctionsEmulator.startFunctionRuntime = (bundleTemplate, triggerId, nodeBinary, proto) => {
        return startFunctionRuntime(bundleTemplate, triggerId, nodeBinary, proto, {
            serializedTriggers,
        });
    };
}
describe("FunctionsEmulator-Hub", () => {
    it("should route requests to /:project_id/:region/:trigger_id to HTTPS Function", () => __awaiter(this, void 0, void 0, function* () {
        UseFunctions(() => {
            require("firebase-admin").initializeApp();
            return {
                function_id: require("firebase-functions").https.onRequest((req, res) => {
                    res.json({ path: req.path });
                }),
            };
        });
        yield supertest(functionsEmulator_1.FunctionsEmulator.createHubServer(fixtures_1.FunctionRuntimeBundles.template, process.execPath))
            .get("/fake-project-id/us-central1/function_id")
            .expect(200)
            .then((res) => {
            chai_1.expect(res.body.path).to.deep.equal("/");
        });
    })).timeout(fixtures_1.TIMEOUT_LONG);
    it("should route requests to /:project_id/:region/:trigger_id/ to HTTPS Function", () => __awaiter(this, void 0, void 0, function* () {
        UseFunctions(() => {
            require("firebase-admin").initializeApp();
            return {
                function_id: require("firebase-functions").https.onRequest((req, res) => {
                    res.json({ path: req.path });
                }),
            };
        });
        yield supertest(functionsEmulator_1.FunctionsEmulator.createHubServer(fixtures_1.FunctionRuntimeBundles.template, process.execPath))
            .get("/fake-project-id/us-central1/function_id/")
            .expect(200)
            .then((res) => {
            chai_1.expect(res.body.path).to.deep.equal("/");
        });
    })).timeout(fixtures_1.TIMEOUT_LONG);
    it("should route requests to /:project_id/:region/:trigger_id/a/b to HTTPS Function", () => __awaiter(this, void 0, void 0, function* () {
        UseFunctions(() => {
            require("firebase-admin").initializeApp();
            return {
                function_id: require("firebase-functions").https.onRequest((req, res) => {
                    res.json({ path: req.path });
                }),
            };
        });
        yield supertest(functionsEmulator_1.FunctionsEmulator.createHubServer(fixtures_1.FunctionRuntimeBundles.template, process.execPath))
            .get("/fake-project-id/us-central1/function_id/a/b")
            .expect(200)
            .then((res) => {
            chai_1.expect(res.body.path).to.deep.equal("/a/b");
        });
    })).timeout(fixtures_1.TIMEOUT_LONG);
    it("should rewrite req.path to hide /:project_id/:region/:trigger_id", () => __awaiter(this, void 0, void 0, function* () {
        UseFunctions(() => {
            require("firebase-admin").initializeApp();
            return {
                function_id: require("firebase-functions").https.onRequest((req, res) => {
                    res.json({ path: req.path });
                }),
            };
        });
        yield supertest(functionsEmulator_1.FunctionsEmulator.createHubServer(fixtures_1.FunctionRuntimeBundles.template, process.execPath))
            .get("/fake-project-id/us-central1/function_id/sub/route/a")
            .expect(200)
            .then((res) => {
            chai_1.expect(res.body.path).to.eq("/sub/route/a");
        });
    })).timeout(fixtures_1.TIMEOUT_LONG);
    it("should rewrite req.baseUrl to show /:project_id/:region/:trigger_id", () => __awaiter(this, void 0, void 0, function* () {
        UseFunctions(() => {
            require("firebase-admin").initializeApp();
            return {
                function_id: require("firebase-functions").https.onRequest((req, res) => {
                    res.json({ baseUrl: req.baseUrl });
                }),
            };
        });
        yield supertest(functionsEmulator_1.FunctionsEmulator.createHubServer(fixtures_1.FunctionRuntimeBundles.template, process.execPath))
            .get("/fake-project-id/us-central1/function_id/sub/route/a")
            .expect(200)
            .then((res) => {
            chai_1.expect(res.body.baseUrl).to.eq("/fake-project-id/us-central1/function_id");
        });
    })).timeout(fixtures_1.TIMEOUT_LONG);
    it("should route request body", () => __awaiter(this, void 0, void 0, function* () {
        UseFunctions(() => {
            require("firebase-admin").initializeApp();
            return {
                function_id: require("firebase-functions").https.onRequest((req, res) => {
                    res.json(req.body);
                }),
            };
        });
        yield supertest(functionsEmulator_1.FunctionsEmulator.createHubServer(fixtures_1.FunctionRuntimeBundles.template, process.execPath))
            .post("/fake-project-id/us-central1/function_id/sub/route/a")
            .send({ hello: "world" })
            .expect(200)
            .then((res) => {
            chai_1.expect(res.body).to.deep.equal({ hello: "world" });
        });
    })).timeout(fixtures_1.TIMEOUT_LONG);
    it("should route query parameters", () => __awaiter(this, void 0, void 0, function* () {
        UseFunctions(() => {
            require("firebase-admin").initializeApp();
            return {
                function_id: require("firebase-functions").https.onRequest((req, res) => {
                    res.json(req.query);
                }),
            };
        });
        yield supertest(functionsEmulator_1.FunctionsEmulator.createHubServer(fixtures_1.FunctionRuntimeBundles.template, process.execPath))
            .get("/fake-project-id/us-central1/function_id/sub/route/a?hello=world")
            .expect(200)
            .then((res) => {
            chai_1.expect(res.body).to.deep.equal({ hello: "world" });
        });
    })).timeout(fixtures_1.TIMEOUT_LONG);
});
//# sourceMappingURL=functionsEmulator.spec.js.map