"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var functions = _interopRequireWildcard(require("firebase-functions"));

var _firebaseAdmin = require("firebase-admin");

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const FORMAT = 'HH:mm';

const removeUserTokens = tokensToUsers => {
  const userTokens = Object.keys(tokensToUsers).reduce((acc, token) => {
    const userId = tokensToUsers[token];
    const userTokens = acc[userId] || [];
    return _objectSpread({}, acc, {
      [userId]: [...userTokens, token]
    });
  }, {});
  const promises = Object.keys(userTokens).map(userId => {
    const ref = (0, _firebaseAdmin.firestore)().collection('notificationsUsers').doc(userId);
    return _firebaseAdmin.firestore.runTransaction(transaction => transaction.get(ref).then(doc => {
      if (!doc.exists) {
        return;
      }

      const val = doc.data();
      const newVal = Object.keys(val).reduce((acc, token) => {
        if (tokensToUsers[token]) return acc;
        return _objectSpread({}, acc, {
          [token]: true
        });
      }, {});
      transaction.set(newVal);
    }));
  });
  return Promise.all(promises);
};

const sendPushNotificationToUsers = async (userIds, payload) => {
  console.log('sendPushNotificationToUsers user ids', userIds, 'with notification', payload);
  const tokensPromise = userIds.map(id => (0, _firebaseAdmin.firestore)().collection('notificationsUsers').doc(id).get());
  const usersTokens = await Promise.all(tokensPromise);
  const tokensToUsers = usersTokens.reduce((aggregator, userTokens) => {
    if (!userTokens.exists) return aggregator;
    const {
      tokens
    } = userTokens.data();
    return _objectSpread({}, aggregator, {
      tokens
    });
  }, {});
  const tokens = Object.keys(tokensToUsers);
  const tokensToRemove = {};
  const messagingResponse = await (0, _firebaseAdmin.messaging)().sendToDevice(tokens, payload);
  messagingResponse.results.forEach((result, index) => {
    const error = result.error;

    if (error) {
      console.error('Failure sending notification to', tokens[index], error);

      if (error.code === 'messaging/invalid-registration-token' || error.code === 'messaging/registration-token-not-registered') {
        const token = tokens[index];
        tokensToRemove[token] = tokensToUsers[token];
      }
    }
  });
  return removeUserTokens(tokensToRemove);
};

const scheduleNotifications = functions.pubsub.topic('schedule-tick').onPublish(async () => {
  const notificationsConfigPromise = (0, _firebaseAdmin.firestore)().collection('config').doc('notifications').get();
  const schedulePromise = (0, _firebaseAdmin.firestore)().collection('schedule').get();
  const [notificationsConfigSnapshot, scheduleSnapshot] = await Promise.all([notificationsConfigPromise, schedulePromise]);
  const notificationsConfig = notificationsConfigSnapshot.exists ? notificationsConfigSnapshot.data() : {};
  const schedule = scheduleSnapshot.docs.reduce((acc, doc) => _objectSpread({}, acc, {
    [doc.id]: doc.data()
  }), {});
  const todayDay = (0, _moment.default)().utcOffset(notificationsConfig.timezone).format('YYYY-MM-DD');

  if (schedule[todayDay]) {
    const beforeTime = (0, _moment.default)().subtract(3, 'minutes');
    const afterTime = (0, _moment.default)().add(3, 'minutes');
    const upcomingTimeslot = schedule[todayDay].timeslots.filter(timeslot => {
      const timeslotTime = (0, _moment.default)(`${timeslot.startTime}${notificationsConfig.timezone}`, `${FORMAT}Z`).subtract(10, 'minutes');
      return timeslotTime.isBetween(beforeTime, afterTime);
    });
    const upcomingSessions = upcomingTimeslot.reduce((result, timeslot) => timeslot.sessions.reduce((aggregatedSessions, current) => [...aggregatedSessions, ...current.items], []));
    const usersIdsSnapshot = await (0, _firebaseAdmin.firestore)().collection('featuredSessions').get();
    upcomingSessions.forEach(async (upcomingSession, sessionIndex) => {
      const sessionInfoSnapshot = await (0, _firebaseAdmin.firestore)().collection('sessions').doc(upcomingSession).get();
      if (!sessionInfoSnapshot.exists) return;
      const usersIds = usersIdsSnapshot.docs.reduce((acc, doc) => _objectSpread({}, acc, {
        [doc.id]: doc.data()
      }), {});
      const userIdsFeaturedSession = Object.keys(usersIds).filter(userId => !!Object.keys(usersIds[userId]).filter(sessionId => sessionId.toString() === upcomingSession.toString()).length);
      const session = sessionInfoSnapshot.data();
      const end = (0, _moment.default)(`${upcomingTimeslot[0].startTime}${notificationsConfig.timezone}`, `${FORMAT}Z`);
      const fromNow = end.fromNow();

      if (userIdsFeaturedSession.length) {
        return sendPushNotificationToUsers(userIdsFeaturedSession, {
          data: {
            title: session.title,
            body: `Starts ${fromNow}`,
            click_action: `/schedule/${todayDay}?sessionId=${upcomingSessions[sessionIndex]}`,
            icon: notificationsConfig.icon
          }
        });
      }

      if (upcomingSessions.length) {
        console.log('Upcoming sessions', upcomingSessions);
      } else {
        console.log('There is no sessions right now');
      }
    });
  } else {
    console.log(todayDay, 'was not found in the schedule');
  }
});
var _default = scheduleNotifications;
exports.default = _default;
//# sourceMappingURL=schedule-notifications.js.map