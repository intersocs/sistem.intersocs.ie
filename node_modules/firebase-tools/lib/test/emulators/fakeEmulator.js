"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class FakeEmulator {
    constructor(name, host, port) {
        this.name = name;
        this.host = host;
        this.port = port;
        this.exp = express();
    }
    start() {
        this.server = this.exp.listen(this.port);
        return Promise.resolve();
    }
    connect() {
        return Promise.resolve();
    }
    stop() {
        if (this.server) {
            this.server.close();
            this.server = undefined;
        }
        return Promise.resolve();
    }
    getInfo() {
        return {
            host: this.host,
            port: this.port,
        };
    }
    getName() {
        return this.name;
    }
}
exports.FakeEmulator = FakeEmulator;
//# sourceMappingURL=fakeEmulator.js.map