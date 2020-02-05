"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function sessionsSpeakersMap(sessionsRaw, speakersRaw) {
  const sessions = {};
  const speakers = {};

  for (let index = 0; index < Object.keys(sessionsRaw).length; index++) {
    const sessionId = Object.keys(sessionsRaw)[index];
    const currentSession = sessionsRaw[sessionId];
    const sessionSpeakers = [];
    const mainTag = currentSession.tags ? currentSession.tags[0] : 'General';
    currentSession.speakers && currentSession.speakers.forEach(speakerId => {
      if (!speakersRaw[speakerId]) return;
      sessionSpeakers.push(_objectSpread({
        id: speakerId
      }, speakersRaw[speakerId]));
      const generatedSpeaker = speakers[speakerId];

      const sessionBySpeaker = _objectSpread({
        id: sessionId,
        mainTag: mainTag
      }, currentSession);

      if (generatedSpeaker) {
        const speakerTags = generatedSpeaker.tags ? [...generatedSpeaker.tags] : [];
        sessionBySpeaker.tags && sessionBySpeaker.tags.forEach(tag => {
          if (!speakerTags.includes(tag)) speakerTags.push(tag);
        });
        const speakerSessions = generatedSpeaker.sessions ? [...generatedSpeaker.sessions, sessionBySpeaker] : [sessionBySpeaker];
        speakers[speakerId] = _objectSpread({}, generatedSpeaker, {
          tags: [...speakerTags],
          sessions: speakerSessions
        });
      } else {
        speakers[speakerId] = _objectSpread({}, speakersRaw[speakerId], {
          id: speakerId,
          tags: sessionBySpeaker.tags,
          sessions: [sessionBySpeaker]
        });
      }
    });
    sessions[sessionId] = _objectSpread({}, currentSession, {
      id: sessionId,
      mainTag: mainTag,
      speakers: sessionSpeakers
    });
  }

  ;
  return {
    sessions,
    speakers
  };
}

var _default = sessionsSpeakersMap;
exports.default = _default;
//# sourceMappingURL=speakers-sessions-map.js.map