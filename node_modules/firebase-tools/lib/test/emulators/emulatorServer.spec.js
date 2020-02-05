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
const emulatorServer_1 = require("../../emulator/emulatorServer");
describe("EmulatorServer", () => {
    it("should correctly start and stop an emulator", () => __awaiter(this, void 0, void 0, function* () {
        const name = types_1.Emulators.FUNCTIONS;
        const emulator = new fakeEmulator_1.FakeEmulator(name, "localhost", 5000);
        const server = new emulatorServer_1.EmulatorServer(emulator);
        yield server.start();
        chai_1.expect(registry_1.EmulatorRegistry.isRunning(name)).to.be.true;
        chai_1.expect(registry_1.EmulatorRegistry.get(name)).to.eql(emulator);
        yield server.stop();
        chai_1.expect(registry_1.EmulatorRegistry.isRunning(name)).to.be.false;
    }));
});
//# sourceMappingURL=emulatorServer.spec.js.map