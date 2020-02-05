"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var functions = _interopRequireWildcard(require("firebase-functions"));

var _firebaseAdmin = require("firebase-admin");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const sendGeneralNotification = functions.firestore.document('/notifications/{timestamp}').onCreate(async (snapshot, context) => {
  const timestamp = context.params.timestamp;
  const message = snapshot.data();
  if (!message) return null;
  console.log('New message added at ', timestamp, ' with payload ', message);
  const deviceTokensPromise = (0, _firebaseAdmin.firestore)().collection('notificationsSubscribers').get();
  const notificationsConfigPromise = (0, _firebaseAdmin.firestore)().collection('config').doc('notifications').get();
  const [tokensSnapshot, notificationsConfigSnapshot] = await Promise.all([deviceTokensPromise, notificationsConfigPromise]);
  const notificationsConfig = notificationsConfigSnapshot.exists ? notificationsConfigSnapshot.data() : {};
  const tokens = tokensSnapshot.docs.map(doc => doc.id);

  if (!tokens.length) {
    console.log('There are no notification tokens to send to.');
    return null;
  }

  console.log('There are', tokens.length, 'tokens to send notifications to.');
  const payload = {
    data: Object.assign({}, message, {
      icon: message.icon || notificationsConfig.icon
    })
  };
  const tokensToRemove = [];
  const messagingResponse = await (0, _firebaseAdmin.messaging)().sendToDevice(tokens, payload);
  messagingResponse.results.forEach((result, index) => {
    const error = result.error;

    if (error) {
      console.error('Failure sending notification to', tokens[index], error);

      if (error.code === 'messaging/invalid-registration-token' || error.code === 'messaging/registration-token-not-registered') {
        tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
      }
    }
  });
  return Promise.all(tokensToRemove);
});
var _default = sendGeneralNotification;
exports.default = _default;
//# sourceMappingURL=notifications.js.map