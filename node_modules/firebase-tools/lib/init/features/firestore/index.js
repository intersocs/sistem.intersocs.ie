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
const ensureCloudResourceLocation_1 = require("../../../ensureCloudResourceLocation");
const requireAccess = require("../../../requireAccess");
const rules = require("./rules");
const indexes = require("./indexes");
function doSetup(setup, config) {
    return __awaiter(this, void 0, void 0, function* () {
        setup.config.firestore = {};
        ensureCloudResourceLocation_1.ensureLocationSet(setup.projectLocation, "Cloud Firestore");
        yield requireAccess.requireAccess({ project: setup.projectId });
        yield rules.initRules(setup, config);
        yield indexes.initIndexes(setup, config);
    });
}
exports.doSetup = doSetup;
//# sourceMappingURL=index.js.map