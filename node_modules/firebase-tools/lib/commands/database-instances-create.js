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
const Command = require("../command");
const logger = require("../logger");
const requirePermissions = require("../requirePermissions");
const getProjectNumber = require("../getProjectNumber");
const firedata = require("../gcp/firedata");
exports.default = new Command("database:instances:create <instanceName>")
    .description("create a realtime database instance")
    .before(requirePermissions, ["firebase.projects.create"])
    .action((instanceName, options) => __awaiter(this, void 0, void 0, function* () {
    const projectNumber = yield getProjectNumber(options);
    const instance = yield firedata.createDatabaseInstance(projectNumber, instanceName);
    logger.info(`created database instance ${instance.instance}`);
    return instance;
}));
//# sourceMappingURL=database-instances-create.js.map