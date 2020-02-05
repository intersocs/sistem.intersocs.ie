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
const _ = require("lodash");
const sinon = require("sinon");
const project_1 = require("../../../init/features/project");
const firebaseApi = require("../../../firebaseApi");
const prompt = require("../../../prompt");
const TEST_FIREBASE_PROJECT = {
    projectId: "my-project-123",
    projectNumber: 123456789,
    displayName: "my-project",
    name: "projects/my-project",
    resources: {
        hostingSite: "my-project",
        realtimeDatabaseInstance: "my-project",
        storageBucket: "my-project.appspot.com",
        locationId: "us-central",
    },
};
const ANOTHER_FIREBASE_PROJECT = {
    projectId: "another-project",
    projectNumber: 987654321,
    displayName: "another-project",
    name: "projects/another-project",
    resources: {},
};
const TEST_PROJECT_INFO = {
    id: "my-project-123",
    label: "my-project-123 (my-project)",
    instance: "my-project",
    location: "us-central",
};
describe("project", () => {
    const sandbox = sinon.createSandbox();
    let listProjectsStub;
    let getProjectStub;
    let promptStub;
    beforeEach(() => {
        listProjectsStub = sandbox.stub(firebaseApi, "listProjects");
        getProjectStub = sandbox.stub(firebaseApi, "getProject");
        promptStub = sandbox.stub(prompt, "promptOnce");
    });
    afterEach(() => {
        sandbox.restore();
    });
    describe("getProjectInfo", () => {
        it("should get correct project info when no project supplied", () => __awaiter(this, void 0, void 0, function* () {
            const options = {};
            listProjectsStub.returns([TEST_FIREBASE_PROJECT, ANOTHER_FIREBASE_PROJECT]);
            promptStub.returns("my-project-123");
            const project = yield project_1.getProjectInfo(options);
            chai_1.expect(project).to.deep.equal(TEST_PROJECT_INFO);
        }));
        it("should set instance and location to undefined when resources not provided", () => __awaiter(this, void 0, void 0, function* () {
            const options = {};
            listProjectsStub.returns([ANOTHER_FIREBASE_PROJECT]);
            promptStub.returns("another-project");
            const project = yield project_1.getProjectInfo(options);
            chai_1.expect(project).to.deep.equal({
                id: "another-project",
                label: "another-project (another-project)",
                instance: undefined,
                location: undefined,
            });
        }));
        it("should get the correct project info when --project is supplied", () => __awaiter(this, void 0, void 0, function* () {
            const options = { project: "my-project" };
            getProjectStub.returns(TEST_FIREBASE_PROJECT);
            const project = yield project_1.getProjectInfo(options);
            chai_1.expect(project).to.deep.equal(TEST_PROJECT_INFO);
        }));
        it("should return correct project info when choosing new project", () => __awaiter(this, void 0, void 0, function* () {
            const options = {};
            listProjectsStub.returns([TEST_FIREBASE_PROJECT, ANOTHER_FIREBASE_PROJECT]);
            promptStub.returns("[create a new project]");
            const project = yield project_1.getProjectInfo(options);
            chai_1.expect(project).to.deep.equal({ id: "[create a new project]" });
        }));
        it("should return correct project info when choosing not to set up project", () => __awaiter(this, void 0, void 0, function* () {
            const options = {};
            listProjectsStub.returns([TEST_FIREBASE_PROJECT, ANOTHER_FIREBASE_PROJECT]);
            promptStub.returns("[don't setup a default project]");
            const project = yield project_1.getProjectInfo(options);
            chai_1.expect(project).to.deep.equal({ id: "[don't setup a default project]" });
        }));
    });
    describe("doSetup", () => {
        it("should set up the correct properties in the project", () => __awaiter(this, void 0, void 0, function* () {
            const options = { project: "my-project" };
            const setup = { config: {}, rcfile: {} };
            getProjectStub.returns(TEST_FIREBASE_PROJECT);
            yield project_1.doSetup(setup, {}, options);
            chai_1.expect(_.get(setup, "projectId")).to.deep.equal("my-project-123");
            chai_1.expect(_.get(setup, "instance")).to.deep.equal("my-project");
            chai_1.expect(_.get(setup, "projectLocation")).to.deep.equal("us-central");
            chai_1.expect(_.get(setup.rcfile, "projects.default")).to.deep.equal("my-project-123");
        }));
        it("should set up the correct properties when choosing new project", () => __awaiter(this, void 0, void 0, function* () {
            const options = {};
            const setup = { config: {}, rcfile: {} };
            listProjectsStub.returns([TEST_FIREBASE_PROJECT, ANOTHER_FIREBASE_PROJECT]);
            promptStub.returns("[create a new project]");
            yield project_1.doSetup(setup, {}, options);
            chai_1.expect(_.get(setup, "createProject")).to.deep.equal(true);
        }));
        it("should set up the correct properties when not choosing a project", () => __awaiter(this, void 0, void 0, function* () {
            const options = {};
            const setup = { config: {}, rcfile: {} };
            listProjectsStub.returns([TEST_FIREBASE_PROJECT, ANOTHER_FIREBASE_PROJECT]);
            promptStub.returns("[don't setup a default project]");
            yield project_1.doSetup(setup, {}, options);
            chai_1.expect(setup).to.deep.equal({ config: {}, rcfile: {}, project: {} });
        }));
        it("should set project location even if .firebaserc is already set up", () => __awaiter(this, void 0, void 0, function* () {
            const options = {};
            const setup = { config: {}, rcfile: { projects: { default: "my-project" } } };
            getProjectStub.returns(TEST_FIREBASE_PROJECT);
            yield project_1.doSetup(setup, {}, options);
            chai_1.expect(_.get(setup, "projectId")).to.equal("my-project");
            chai_1.expect(_.get(setup, "projectLocation")).to.equal("us-central");
        }));
    });
});
//# sourceMappingURL=project.spec.js.map