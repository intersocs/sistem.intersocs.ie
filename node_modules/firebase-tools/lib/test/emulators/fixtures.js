"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functionsEmulatorShared_1 = require("../../emulator/functionsEmulatorShared");
exports.TIMEOUT_LONG = 10000;
exports.TIMEOUT_MED = 5000;
const cwd = functionsEmulatorShared_1.findModuleRoot("firebase-tools", __dirname);
exports.FunctionRuntimeBundles = {
    template: {
        ports: {},
        cwd,
        triggerId: "function_id",
        projectId: "fake-project-id",
    },
    onCreate: {
        ports: {
            firestore: 8080,
        },
        cwd,
        proto: {
            data: {
                value: {
                    name: "projects/fake-project-id/databases/(default)/documents/test/test",
                    fields: {
                        when: {
                            timestampValue: "2019-04-15T16:55:48.150Z",
                        },
                    },
                    createTime: "2019-04-15T16:56:13.737Z",
                    updateTime: "2019-04-15T16:56:13.737Z",
                },
                updateMask: {},
            },
            context: {
                eventId: "7ebfb089-f549-4e1f-8312-fe843efc8be7",
                timestamp: "2019-04-15T16:56:13.737Z",
                eventType: "providers/cloud.firestore/eventTypes/document.create",
                resource: {
                    name: "projects/fake-project-id/databases/(default)/documents/test/test",
                    service: "firestore.googleapis.com",
                },
            },
        },
        triggerId: "function_id",
        projectId: "fake-project-id",
    },
    onWrite: {
        ports: {
            firestore: 8080,
        },
        cwd,
        proto: {
            data: {
                value: {
                    name: "projects/fake-project-id/databases/(default)/documents/test/test",
                    fields: {
                        when: {
                            timestampValue: "2019-04-15T16:55:48.150Z",
                        },
                    },
                    createTime: "2019-04-15T16:56:13.737Z",
                    updateTime: "2019-04-15T16:56:13.737Z",
                },
                updateMask: {},
            },
            context: {
                eventId: "7ebfb089-f549-4e1f-8312-fe843efc8be7",
                timestamp: "2019-04-15T16:56:13.737Z",
                eventType: "providers/cloud.firestore/eventTypes/document.write",
                resource: {
                    name: "projects/fake-project-id/databases/(default)/documents/test/test",
                    service: "firestore.googleapis.com",
                },
            },
        },
        triggerId: "function_id",
        projectId: "fake-project-id",
    },
    onDelete: {
        ports: {
            firestore: 8080,
        },
        cwd,
        proto: {
            data: {
                oldValue: {
                    name: "projects/fake-project-id/databases/(default)/documents/test/test",
                    fields: {
                        when: {
                            timestampValue: "2019-04-15T16:55:48.150Z",
                        },
                    },
                    createTime: "2019-04-15T16:56:13.737Z",
                    updateTime: "2019-04-15T16:56:13.737Z",
                },
                updateMask: {},
            },
            context: {
                eventId: "7ebfb089-f549-4e1f-8312-fe843efc8be7",
                timestamp: "2019-04-15T16:56:13.737Z",
                eventType: "providers/cloud.firestore/eventTypes/document.delete",
                resource: {
                    name: "projects/fake-project-id/databases/(default)/documents/test/test",
                    service: "firestore.googleapis.com",
                },
            },
        },
        triggerId: "function_id",
        projectId: "fake-project-id",
    },
    onUpdate: {
        ports: {
            firestore: 8080,
        },
        cwd,
        proto: {
            data: {
                oldValue: {
                    name: "projects/fake-project/databases/(default)/documents/test/test",
                    fields: {
                        new: {
                            stringValue: "old-value",
                        },
                    },
                    createTime: "2019-05-14T23:04:30.459119Z",
                    updateTime: "2019-05-15T16:21:15.148831Z",
                },
                updateMask: {
                    fieldPaths: ["new"],
                },
                value: {
                    name: "projects/fake-project/databases/(default)/documents/test/test",
                    fields: {
                        new: {
                            stringValue: "new-value",
                        },
                    },
                    createTime: "2019-05-14T23:04:30.459119Z",
                    updateTime: "2019-05-15T16:21:15.148831Z",
                },
            },
            context: {
                eventId: "c0fdb141-bc01-49e7-98c8-9bc7f861de47-0",
                eventType: "providers/cloud.firestore/eventTypes/document.write",
                resource: {
                    name: "projects/fake-project/databases/(default)/documents/test/test",
                    service: "firestore.googleapis.com",
                },
                timestamp: "2019-05-15T16:21:15.148831Z",
            },
        },
        triggerId: "function_id",
        projectId: "fake-project-id",
    },
    onRequest: {
        ports: {
            firestore: 8080,
        },
        cwd,
        triggerId: "function_id",
        projectId: "fake-project-id",
    },
};
//# sourceMappingURL=fixtures.js.map