"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var functions = _interopRequireWildcard(require("firebase-functions"));

var _md = _interopRequireDefault(require("md5"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const mailchimpSubscribe = functions.firestore.document('/subscribers/{id}').onCreate(snapshot => {
  const mailchimpConfig = functions.config().mailchimp;

  if (!mailchimpConfig) {
    console.log('Can\'t subscribe user, Mailchimp config is empty.');
  }

  const subscriber = snapshot.data();
  const subscriberData = {
    email_address: subscriber.email,
    status: 'subscribed',
    merge_fields: {
      FNAME: subscriber.firstName,
      LNAME: subscriber.lastName
    }
  };
  return subscribeToMailchimp(mailchimpConfig, subscriberData);
});

function subscribeToMailchimp(mailchimpConfig, subscriberData, emailHash) {
  const uri = `https://${mailchimpConfig.dc}.api.mailchimp.com/3.0/lists/${mailchimpConfig.listid}/members`;
  const url = emailHash ? `${uri}/${emailHash}` : uri;
  const method = emailHash ? 'PATCH' : 'POST';
  const subscribePromise = (0, _nodeFetch.default)(url, {
    method,
    body: JSON.stringify(subscriberData),
    headers: {
      'Authorization': `apiKey ${mailchimpConfig.apikey}`,
      'Content-Type': 'application/json'
    }
  });
  return subscribePromise.then(res => res.json()).then(({
    status,
    title
  }) => {
    if (status === 400 && title === 'Member Exists') {
      subscriberData.status = 'pending';
      const hash = (0, _md.default)(subscriberData.email_address);
      return subscribeToMailchimp(mailchimpConfig, subscriberData, hash);
    } else if (method === 'POST') {
      console.log(`${subscriberData.email_address} was added to subscribe list.`);
    } else if (method === 'PATCH') {
      console.log(`${subscriberData.email_address} was updated in subscribe list.`);
    }
  }).catch(error => console.error(`Error occured during Mailchimp subscription: ${error}`));
}

var _default = mailchimpSubscribe;
exports.default = _default;
//# sourceMappingURL=mailchimp-subscribe.js.map