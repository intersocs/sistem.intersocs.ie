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
const registry_1 = require("../../emulator/registry");
const chai_1 = require("chai");
const fakeEmulator_1 = require("./fakeEmulator");
describe("EmulatorRegistry", () => {
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        yield registry_1.EmulatorRegistry.stopAll();
    }));
    it("should not report any running emulators when empty", () => __awaiter(this, void 0, void 0, function* () {
        for (const name of types_1.ALL_EMULATORS) {
            chai_1.expect(registry_1.EmulatorRegistry.isRunning(name)).to.be.false;
        }
        chai_1.expect(registry_1.EmulatorRegistry.listRunning()).to.be.empty;
    }));
    it("should correctly return information about a running emulator", () => __awaiter(this, void 0, void 0, function* () {
        const name = types_1.Emulators.FUNCTIONS;
        const emu = new fakeEmulator_1.FakeEmulator(name, "localhost", 5000);
        chai_1.expect(registry_1.EmulatorRegistry.isRunning(name)).to.be.false;
        yield registry_1.EmulatorRegistry.start(emu);
        chai_1.expect(registry_1.EmulatorRegistry.isRunning(name)).to.be.true;
        chai_1.expect(registry_1.EmulatorRegistry.listRunning()).to.eql([name]);
        chai_1.expect(registry_1.EmulatorRegistry.get(name)).to.eql(emu);
        chai_1.expect(registry_1.EmulatorRegistry.getPort(name)).to.eql(5000);
    }));
    it("once stopped, an emulator is no longer running", () => __awaiter(this, void 0, void 0, function* () {
        const name = types_1.Emulators.FUNCTIONS;
        const emu = new fakeEmulator_1.FakeEmulator(name, "localhost", 5000);
        chai_1.expect(registry_1.EmulatorRegistry.isRunning(name)).to.be.false;
        yield registry_1.EmulatorRegistry.start(emu);
        chai_1.expect(registry_1.EmulatorRegistry.isRunning(name)).to.be.true;
        yield registry_1.EmulatorRegistry.stop(name);
        chai_1.expect(registry_1.EmulatorRegistry.isRunning(name)).to.be.false;
    }));
});
//# sourceMappingURL=registry.spec.js.map