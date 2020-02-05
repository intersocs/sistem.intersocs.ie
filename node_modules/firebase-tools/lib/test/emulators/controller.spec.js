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
const types_1 = require("../../emulator/types");
const controller_1 = require("../../emulator/controller");
const registry_1 = require("../../emulator/registry");
const chai_1 = require("chai");
const fakeEmulator_1 = require("./fakeEmulator");
describe("EmulatorController", () => {
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        yield registry_1.EmulatorRegistry.stopAll();
    }));
    it("should start and stop an emulator", () => __awaiter(this, void 0, void 0, function* () {
        const name = types_1.Emulators.FUNCTIONS;
        chai_1.expect(registry_1.EmulatorRegistry.isRunning(name)).to.be.false;
        yield controller_1.startEmulator(new fakeEmulator_1.FakeEmulator(name, "localhost", 7777));
        chai_1.expect(registry_1.EmulatorRegistry.isRunning(name)).to.be.true;
        chai_1.expect(registry_1.EmulatorRegistry.getPort(name)).to.eql(7777);
    }));
});
//# sourceMappingURL=controller.spec.js.map