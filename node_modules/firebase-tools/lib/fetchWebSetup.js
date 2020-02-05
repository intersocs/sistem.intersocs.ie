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
const api = require("./api");
const getProjectId = require("./getProjectId");
function fetchWebSetup(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectId = getProjectId(options, false);
        const response = yield api.request("GET", `/v1beta1/projects/${projectId}/webApps/-/config`, {
            auth: true,
            origin: api.firebaseApiOrigin,
        });
        return response.body;
    });
}
exports.fetchWebSetup = fetchWebSetup;
//# sourceMappingURL=fetchWebSetup.js.map