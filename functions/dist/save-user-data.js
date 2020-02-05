"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firebaseFunctions = require("firebase-functions");

var _firebaseAdmin = require("firebase-admin");

const saveUserData = _firebaseFunctions.auth.user().onCreate(userRecord => {
  const uid = userRecord.uid || userRecord.providerData[0].uid;
  const userData = {
    email: userRecord.email || userRecord.providerData[0].email || '',
    displayName: userRecord.displayName || userRecord.providerData[0].displayName || '',
    photoURL: userRecord.photoURL || userRecord.providerData[0].photoURL || ''
  };
  return (0, _firebaseAdmin.firestore)().collection('users').doc(uid).set(userData);
});

var _default = saveUserData;
exports.default = _default;
//# sourceMappingURL=save-user-data.js.map