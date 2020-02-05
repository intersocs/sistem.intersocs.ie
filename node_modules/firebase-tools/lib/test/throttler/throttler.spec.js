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
const sinon = require("sinon");
const chai_1 = require("chai");
const queue_1 = require("../../throttler/queue");
const stack_1 = require("../../throttler/stack");
const timeout_error_1 = require("../../throttler/errors/timeout-error");
const retries_exhausted_error_1 = require("../../throttler/errors/retries-exhausted-error");
const TEST_ERROR = new Error("foobar");
const throttlerTest = (throttlerConstructor) => {
    it("should have no waiting task after creation", () => {
        const queue = new throttlerConstructor({});
        chai_1.expect(queue.hasWaitingTask()).to.equal(false);
    });
    it("should return the task as the task name", () => {
        const handler = sinon.stub().resolves();
        const q = new throttlerConstructor({
            handler,
        });
        const stringTask = "test task";
        q.add(stringTask);
        chai_1.expect(q.taskName(0)).to.equal(stringTask);
    });
    it("should return the index as the task name", () => {
        const handler = sinon.stub().resolves();
        const q = new throttlerConstructor({
            handler,
        });
        q.add(2);
        chai_1.expect(q.taskName(0)).to.equal("index 0");
    });
    it("should return 'finished task' as the task name", () => {
        const handler = sinon.stub().resolves();
        const q = new throttlerConstructor({
            handler,
        });
        q.add(2);
        q.close();
        return q.wait().then(() => {
            chai_1.expect(q.taskName(0)).to.equal("finished task");
        });
    });
    it("should handle function tasks", () => {
        const task = sinon.stub().resolves();
        const q = new throttlerConstructor({});
        q.add(task);
        q.close();
        return q.wait().then(() => {
            chai_1.expect(task.callCount).to.equal(1);
            chai_1.expect(q.complete).to.equal(1);
            chai_1.expect(q.success).to.equal(1);
            chai_1.expect(q.errored).to.equal(0);
            chai_1.expect(q.retried).to.equal(0);
            chai_1.expect(q.total).to.equal(1);
        });
    });
    it("should handle tasks", () => {
        const handler = sinon.stub().resolves();
        const q = new throttlerConstructor({
            handler,
        });
        q.add(4);
        q.close();
        return q.wait().then(() => {
            chai_1.expect(handler.callCount).to.equal(1);
            chai_1.expect(q.complete).to.equal(1);
            chai_1.expect(q.success).to.equal(1);
            chai_1.expect(q.errored).to.equal(0);
            chai_1.expect(q.retried).to.equal(0);
            chai_1.expect(q.total).to.equal(1);
        });
    });
    it("should not retry", () => {
        const handler = sinon.stub().rejects(TEST_ERROR);
        const q = new throttlerConstructor({
            handler,
            retries: 0,
        });
        q.add(4);
        q.close();
        return q
            .wait()
            .then(() => {
            throw new Error("handler should have rejected");
        })
            .catch((err) => {
            chai_1.expect(err).to.be.an.instanceof(retries_exhausted_error_1.default);
            chai_1.expect(err.original).to.equal(TEST_ERROR);
            chai_1.expect(err.message).to.equal("Task index 0 failed: retries exhausted after 1 attempts");
        })
            .then(() => {
            chai_1.expect(handler.callCount).to.equal(1);
            chai_1.expect(q.complete).to.equal(1);
            chai_1.expect(q.success).to.equal(0);
            chai_1.expect(q.errored).to.equal(1);
            chai_1.expect(q.retried).to.equal(0);
            chai_1.expect(q.total).to.equal(1);
        });
    });
    it("should retry the number of retries, plus one", () => {
        const handler = sinon.stub().rejects(TEST_ERROR);
        const q = new throttlerConstructor({
            backoff: 0,
            handler,
            retries: 3,
        });
        q.add(4);
        q.close();
        return q
            .wait()
            .then(() => {
            throw new Error("handler should have rejected");
        })
            .catch((err) => {
            chai_1.expect(err).to.be.an.instanceof(retries_exhausted_error_1.default);
            chai_1.expect(err.original).to.equal(TEST_ERROR);
            chai_1.expect(err.message).to.equal("Task index 0 failed: retries exhausted after 4 attempts");
        })
            .then(() => {
            chai_1.expect(handler.callCount).to.equal(4);
            chai_1.expect(q.complete).to.equal(1);
            chai_1.expect(q.success).to.equal(0);
            chai_1.expect(q.errored).to.equal(1);
            chai_1.expect(q.retried).to.equal(3);
            chai_1.expect(q.total).to.equal(1);
        });
    });
    it("should handle tasks in concurrency", () => {
        const callCountMap = new Map();
        const handler = (task) => {
            let count = callCountMap.get(task);
            if (!count) {
                count = 0;
            }
            count += 1;
            callCountMap.set(task, count);
            if (count > 2) {
                return Promise.resolve();
            }
            return Promise.reject();
        };
        const q = new throttlerConstructor({
            backoff: 0,
            concurrency: 2,
            handler,
            retries: 2,
        });
        q.add("1");
        q.add("2");
        q.add("3");
        q.close();
        return q
            .wait()
            .catch((err) => {
            throw new Error("handler should have passed ");
        })
            .then(() => {
            chai_1.expect(q.complete).to.equal(3);
            chai_1.expect(q.success).to.equal(3);
            chai_1.expect(q.errored).to.equal(0);
            chai_1.expect(q.retried).to.equal(6);
            chai_1.expect(q.total).to.equal(3);
        });
    });
    it("should retry the number of retries for mutiple identical tasks", () => {
        const handler = sinon
            .stub()
            .rejects(TEST_ERROR)
            .onCall(2)
            .resolves(0)
            .onCall(5)
            .resolves(0)
            .onCall(8)
            .resolves(0);
        const q = new throttlerConstructor({
            backoff: 0,
            concurrency: 1,
            handler,
            retries: 2,
        });
        q.add(5);
        q.add(5);
        q.add(5);
        q.close();
        return q
            .wait()
            .catch((err) => {
            throw new Error("handler should have passed");
        })
            .then(() => {
            chai_1.expect(handler.callCount).to.equal(9);
            chai_1.expect(q.complete).to.equal(3);
            chai_1.expect(q.success).to.equal(3);
            chai_1.expect(q.errored).to.equal(0);
            chai_1.expect(q.retried).to.equal(6);
            chai_1.expect(q.total).to.equal(3);
        });
    });
    it("should return the result of task", () => {
        const handler = (task) => {
            return Promise.resolve(`result: ${task}`);
        };
        const q = new throttlerConstructor({
            handler,
        });
        chai_1.expect(q.run(2)).to.eventually.to.equal("result: 2");
        chai_1.expect(q.run(3)).to.eventually.to.equal("result: 3");
    });
    it("should resolve if task finishes before timeout", () => __awaiter(this, void 0, void 0, function* () {
        const handler = (task) => {
            return Promise.resolve(`result: ${task}`);
        };
        const q = new queue_1.default({
            handler,
        });
        chai_1.expect(yield q.run(2, 20000000)).to.equal("result: 2");
        chai_1.expect(q.complete).to.equal(1);
        chai_1.expect(q.success).to.equal(1);
        chai_1.expect(q.errored).to.equal(0);
        chai_1.expect(q.retried).to.equal(0);
        chai_1.expect(q.total).to.equal(1);
    }));
    it("should reject if timeout", () => __awaiter(this, void 0, void 0, function* () {
        const handler = (task) => new Promise((resolve) => {
            setTimeout(() => {
                resolve(`result: ${task}`);
            }, 150);
        });
        const q = new queue_1.default({
            handler,
        });
        let err;
        try {
            yield q.run(2, 100);
        }
        catch (e) {
            err = e;
        }
        chai_1.expect(err).to.be.instanceOf(timeout_error_1.default);
        chai_1.expect(err.message).to.equal("Task index 0 failed: timed out after 100ms.");
    }));
    it("should reject with RetriesExhaustedError if last trial is rejected before timeout", () => __awaiter(this, void 0, void 0, function* () {
        const handler = sinon.stub().rejects(TEST_ERROR);
        const q = new queue_1.default({
            handler,
            retries: 2,
            backoff: 10,
        });
        let err;
        try {
            yield q.run(2, 200);
        }
        catch (e) {
            err = e;
        }
        chai_1.expect(err).to.be.instanceOf(retries_exhausted_error_1.default);
        chai_1.expect(err.original).to.equal(TEST_ERROR);
        chai_1.expect(err.message).to.equal("Task index 0 failed: retries exhausted after 3 attempts");
        chai_1.expect(handler.callCount).to.equal(3);
        chai_1.expect(q.complete).to.equal(1);
        chai_1.expect(q.success).to.equal(0);
        chai_1.expect(q.errored).to.equal(1);
        chai_1.expect(q.retried).to.equal(2);
        chai_1.expect(q.total).to.equal(1);
    }));
    it("should reject with TimeoutError if timeout while retrying", () => __awaiter(this, void 0, void 0, function* () {
        const handler = sinon.stub().rejects(TEST_ERROR);
        const q = new queue_1.default({
            handler,
            retries: 1000,
            backoff: 5,
        });
        let err;
        try {
            yield q.run(2, 100);
        }
        catch (e) {
            err = e;
        }
        chai_1.expect(err).to.be.instanceOf(timeout_error_1.default);
        chai_1.expect(handler.callCount).to.be.at.least(2);
        chai_1.expect(err.message).to.equal("Task index 0 failed: timed out after 100ms.");
        chai_1.expect(q.complete).to.equal(1);
        chai_1.expect(q.success).to.equal(0);
        chai_1.expect(q.errored).to.equal(1);
        chai_1.expect(q.retried).to.be.at.least(3);
        chai_1.expect(q.total).to.equal(1);
    }));
    it("should reject with TimeoutError when waiting", () => __awaiter(this, void 0, void 0, function* () {
        const handler = sinon
            .stub()
            .rejects(TEST_ERROR)
            .onFirstCall()
            .resolves(0);
        const q = new queue_1.default({
            handler,
            retries: 4,
            backoff: 20,
        });
        q.add(2);
        q.add(3, 10);
        q.add(4, 500);
        q.close();
        let err;
        try {
            yield q.wait();
        }
        catch (e) {
            err = e;
        }
        chai_1.expect(err).to.be.instanceOf(timeout_error_1.default);
        chai_1.expect(err.message).to.equal("Task index 1 failed: timed out after 10ms.");
        chai_1.expect(handler.callCount).to.equal(3);
        chai_1.expect(q.complete).to.equal(2);
        chai_1.expect(q.success).to.equal(1);
        chai_1.expect(q.errored).to.equal(1);
        chai_1.expect(q.total).to.equal(3);
    }));
    it("should reject with RetriesExhaustedError when waiting", () => __awaiter(this, void 0, void 0, function* () {
        const handler = sinon
            .stub()
            .rejects(TEST_ERROR)
            .onFirstCall()
            .resolves(0);
        const q = new queue_1.default({
            handler,
            retries: 1,
            backoff: 10,
        });
        q.add(2);
        q.add(3, 100);
        q.close();
        let err;
        try {
            yield q.wait();
        }
        catch (e) {
            err = e;
        }
        chai_1.expect(err).to.be.instanceOf(retries_exhausted_error_1.default);
        chai_1.expect(err.message).to.equal("Task index 1 failed: retries exhausted after 2 attempts");
        chai_1.expect(handler.callCount).to.equal(3);
        chai_1.expect(q.complete).to.equal(2);
        chai_1.expect(q.success).to.equal(1);
        chai_1.expect(q.errored).to.equal(1);
        chai_1.expect(q.retried).to.equal(1);
        chai_1.expect(q.total).to.equal(2);
    }));
};
describe("Throttler", () => {
    describe("Queue", () => {
        throttlerTest(queue_1.default);
    });
    describe("Stack", () => {
        throttlerTest(stack_1.default);
    });
});
exports.createTask = (name, resolved) => {
    return new Promise((res) => {
        let resolve = () => {
            throw new Error("resolve is not set");
        };
        let reject = () => {
            throw new Error("reject is not set");
        };
        let startExecute = () => {
            throw new Error("startExecute is not set");
        };
        const promise = new Promise((s, j) => {
            resolve = s;
            reject = j;
        });
        const startExecutePromise = new Promise((s, j) => {
            startExecute = s;
        });
        res({
            name,
            promise,
            resolve,
            reject,
            startExecute,
            startExecutePromise,
        });
        if (resolved) {
            resolve();
        }
    });
};
exports.createHandler = (orderList) => {
    return (task) => {
        task.startExecute();
        return task.promise.then(() => {
            orderList.push(task.name);
        });
    };
};
//# sourceMappingURL=throttler.spec.js.map