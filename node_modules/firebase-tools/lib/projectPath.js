"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const detectProjectRoot = require("./detectProjectRoot");
function resolveProjectPath(cwd, filePath) {
    return path.resolve(detectProjectRoot(cwd), filePath);
}
exports.resolveProjectPath = resolveProjectPath;
//# sourceMappingURL=projectPath.js.map