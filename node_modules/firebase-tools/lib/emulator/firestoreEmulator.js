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
const chokidar = require("chokidar");
const fs = require("fs");
const request = require("request");
const clc = require("cli-color");
const path = require("path");
const utils = require("../utils");
const javaEmulators = require("../serve/javaEmulators");
const types_1 = require("../emulator/types");
const registry_1 = require("./registry");
const constants_1 = require("./constants");
class FirestoreEmulator {
    constructor(args) {
        this.args = args;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const functionsPort = registry_1.EmulatorRegistry.getPort(types_1.Emulators.FUNCTIONS);
            if (functionsPort) {
                this.args.functions_emulator = `localhost:${functionsPort}`;
            }
            if (this.args.rules && this.args.projectId) {
                const rulesPath = this.args.rules;
                this.rulesWatcher = chokidar.watch(rulesPath, { persistent: true, ignoreInitial: true });
                this.rulesWatcher.on("change", (event, stats) => __awaiter(this, void 0, void 0, function* () {
                    const newContent = fs.readFileSync(rulesPath).toString();
                    utils.logLabeledBullet("firestore", "Change detected, updating rules...");
                    const issues = yield this.updateRules(newContent);
                    if (issues && issues.length > 0) {
                        for (const issue of issues) {
                            utils.logWarning(this.prettyPrintRulesIssue(rulesPath, issue));
                        }
                        utils.logWarning("Failed to update rules");
                    }
                    else {
                        utils.logLabeledSuccess("firestore", "Rules updated.");
                    }
                }));
            }
            return javaEmulators.start(types_1.Emulators.FIRESTORE, this.args);
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve();
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.rulesWatcher) {
                this.rulesWatcher.close();
            }
            return javaEmulators.stop(types_1.Emulators.FIRESTORE);
        });
    }
    getInfo() {
        const host = this.args.host || constants_1.Constants.getDefaultHost(types_1.Emulators.FIRESTORE);
        const port = this.args.port || constants_1.Constants.getDefaultPort(types_1.Emulators.FIRESTORE);
        return {
            host,
            port,
        };
    }
    getName() {
        return types_1.Emulators.FIRESTORE;
    }
    updateRules(content) {
        const projectId = this.args.projectId;
        const { host, port } = this.getInfo();
        const url = `http://${host}:${port}/emulator/v1/projects/${projectId}:securityRules`;
        const body = {
            ignore_errors: true,
            rules: {
                files: [
                    {
                        name: "security.rules",
                        content,
                    },
                ],
            },
        };
        return new Promise((resolve, reject) => {
            request.put(url, { json: body }, (err, res, resBody) => {
                if (err) {
                    reject(err);
                    return;
                }
                const rulesValid = res.statusCode === 200 && !resBody.issues;
                if (!rulesValid) {
                    const issues = resBody.issues;
                    resolve(issues);
                }
                resolve([]);
            });
        });
    }
    prettyPrintRulesIssue(filePath, issue) {
        const relativePath = path.relative(process.cwd(), filePath);
        const line = issue.sourcePosition.line || 0;
        const col = issue.sourcePosition.column || 0;
        return `${clc.cyan(relativePath)}:${clc.yellow(line)}:${clc.yellow(col)} - ${clc.red(issue.severity)} ${issue.description}`;
    }
}
FirestoreEmulator.FIRESTORE_EMULATOR_ENV = "FIRESTORE_EMULATOR_HOST";
FirestoreEmulator.FIRESTORE_EMULATOR_ENV_ALT = "FIREBASE_FIRESTORE_EMULATOR_ADDRESS";
exports.FirestoreEmulator = FirestoreEmulator;
//# sourceMappingURL=firestoreEmulator.js.map