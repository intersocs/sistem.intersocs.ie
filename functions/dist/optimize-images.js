"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firebaseFunctions = require("firebase-functions");

var _storage = _interopRequireDefault(require("@google-cloud/storage"));

var _childProcessPromise = require("child-process-promise");

var _mkdirpPromise = _interopRequireDefault(require("mkdirp-promise"));

var _path = _interopRequireDefault(require("path"));

var _os = _interopRequireDefault(require("os"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const gcs = new _storage.default();

const optimizeImages = _firebaseFunctions.storage.object().onFinalize(object => {
  const {
    contentType
  } = object; // Exit if this is triggered on a file that is not an image.

  if (!contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return null;
  }

  return optimizeImage(object);
});

async function optimizeImage(object) {
  // File and directory paths.
  const filePath = object.name;

  const tempLocalFile = _path.default.join(_os.default.tmpdir(), filePath);

  const tempLocalDir = _path.default.dirname(tempLocalFile); // Cloud Storage files.


  const bucket = gcs.bucket(object.bucket);
  const file = bucket.file(filePath);
  const [metadata] = await file.getMetadata();

  if (metadata.metadata && metadata.metadata.optimized) {
    console.log('Image has been already optimized');
    return null;
  }

  await (0, _mkdirpPromise.default)(tempLocalDir);
  await file.download({
    destination: tempLocalFile
  });
  console.log('The file has been downloaded to', tempLocalFile); // Generate a thumbnail using ImageMagick.

  await (0, _childProcessPromise.spawn)('convert', [tempLocalFile, '-strip', '-interlace', 'Plane', '-quality', '82', tempLocalFile]);
  console.log('Optimized image created at', tempLocalFile); // Uploading the Optimized image.

  const destination = bucket.file(filePath);
  const [newFile] = await bucket.upload(tempLocalFile, {
    destination,
    metadata: {
      metadata: {
        optimized: true
      }
    }
  });
  await newFile.makePublic();
  console.log('Optimized image uploaded to Storage'); // Once the image has been uploaded delete the local files to free up disk space.

  return Promise.all([_fs.default.unlinkSync(tempLocalFile)]);
}

var _default = optimizeImages;
exports.default = _default;
//# sourceMappingURL=optimize-images.js.map