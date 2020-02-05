"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.speakersWrite = exports.scheduleWrite = exports.sessionsWrite = void 0;

var functions = _interopRequireWildcard(require("firebase-functions"));

var _firebaseAdmin = require("firebase-admin");

var _speakersSessionsScheduleMap = _interopRequireDefault(require("./schedule-generator/speakers-sessions-schedule-map"));

var _speakersSessionsMap = _interopRequireDefault(require("./schedule-generator/speakers-sessions-map"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const sessionsWrite = functions.firestore.document('sessions/{sessionId}').onWrite(async () => {
  return generateAndSaveData();
});
exports.sessionsWrite = sessionsWrite;
const scheduleWrite = functions.firestore.document('schedule/{scheduleId}').onWrite(async () => {
  const scheduleConfig = functions.config().schedule;

  if (!scheduleConfig || typeof scheduleConfig.enabled === 'undefined') {
    console.error('Schedule config is NOT set! Run `firebase functions:config:set schedule.enabled=true`, redeploy functions and try again.');
    return null;
  }

  if (scheduleConfig.enabled === 'true') {
    return generateAndSaveData();
  }

  return null;
});
exports.scheduleWrite = scheduleWrite;
const speakersWrite = functions.firestore.document('speakers/{speakerId}').onWrite(async (change, context) => {
  const changedSpeaker = change.after.exists ? _objectSpread({
    id: context.params.speakerId
  }, change.after.data()) : null;
  return generateAndSaveData(changedSpeaker);
});
exports.speakersWrite = speakersWrite;

async function generateAndSaveData(changedSpeaker) {
  const sessionsPromise = (0, _firebaseAdmin.firestore)().collection('sessions').get();
  const schedulePromise = (0, _firebaseAdmin.firestore)().collection('schedule').orderBy('date', 'desc').get();
  const speakersPromise = (0, _firebaseAdmin.firestore)().collection('speakers').get();
  const [sessionsSnapshot, scheduleSnapshot, speakersSnapshot] = await Promise.all([sessionsPromise, schedulePromise, speakersPromise]);
  const sessions = {};
  const schedule = {};
  const speakers = {};
  sessionsSnapshot.forEach(doc => {
    sessions[doc.id] = doc.data();
  });
  scheduleSnapshot.forEach(doc => {
    schedule[doc.id] = doc.data();
  });
  speakersSnapshot.forEach(doc => {
    speakers[doc.id] = doc.data();
  });
  let generatedData = {};
  const scheduleConfig = functions.config().schedule;

  if (!scheduleConfig || typeof scheduleConfig.enabled === 'undefined') {
    console.error('Schedule config is NOT set! Run `firebase functions:config:set schedule.enabled=true`, redeploy functions and try again.');
    return null;
  }

  const scheduleEnabled = scheduleConfig.enabled === 'true';

  if (!Object.keys(sessions).length) {
    generatedData = _objectSpread({}, speakers);
  } else if (!scheduleEnabled || !Object.keys(schedule).length) {
    generatedData = (0, _speakersSessionsMap.default)(sessions, speakers);
  } else {
    generatedData = (0, _speakersSessionsScheduleMap.default)(sessions, speakers, schedule);
  } // If changed speaker does not have assigned session(s) yet


  if (changedSpeaker && !generatedData.speakers[changedSpeaker.id]) {
    generatedData.speakers[changedSpeaker.id] = changedSpeaker;
  }

  saveGeneratedData(generatedData.sessions, 'generatedSessions');
  saveGeneratedData(generatedData.speakers, 'generatedSpeakers');
  saveGeneratedData(generatedData.schedule, 'generatedSchedule');
}

function saveGeneratedData(data, collectionName) {
  if (!data || !Object.keys(data).length) return;

  for (let index = 0; index < Object.keys(data).length; index++) {
    const key = Object.keys(data)[index];
    (0, _firebaseAdmin.firestore)().collection(collectionName).doc(key).set(data[key]);
  }
}
//# sourceMappingURL=generate-sessions-speakers-schedule.js.map