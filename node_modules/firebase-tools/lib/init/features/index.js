"use strict";
module.exports = {
    database: require("./database"),
    firestore: require("./firestore").doSetup,
    functions: require("./functions"),
    hosting: require("./hosting"),
    storage: require("./storage").doSetup,
    project: require("./project").doSetup,
};
//# sourceMappingURL=index.js.map