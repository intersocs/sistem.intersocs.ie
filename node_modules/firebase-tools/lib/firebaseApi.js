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
const API_VERSION = "v1beta1";
function listProjects(nextPageToken, projectsList = []) {
    return __awaiter(this, void 0, void 0, function* () {
        let path = `/${API_VERSION}/projects?page_size=100`;
        if (nextPageToken) {
            path += `&page_token=${nextPageToken}`;
        }
        const response = yield api.request("GET", path, {
            auth: true,
            origin: api.firebaseApiOrigin,
        });
        projectsList = projectsList.concat(response.body.results);
        if (response.body.nextPageToken) {
            return listProjects(response.body.nextPageToken, projectsList);
        }
        return projectsList;
    });
}
exports.listProjects = listProjects;
function getProject(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield api.request("GET", `/${API_VERSION}/projects/${projectId}`, {
            auth: true,
            origin: api.firebaseApiOrigin,
        });
        return response.body;
    });
}
exports.getProject = getProject;
//# sourceMappingURL=firebaseApi.js.map