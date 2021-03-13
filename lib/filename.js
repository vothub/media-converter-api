const path = require('path');

const mimetypes = {
  mp4: 'video/mp4',
};

function extractExtension(filename) {
  // contains dot
  return path.extname(filename);
}

function getFileBasename(filename) {
  const ext = extractExtension(filename);
  return path.basename(filename, ext);
}

function extractMimetype(filename) {
  const ext = extractExtension(filename);
  return mimetypes[ext] || null;
}

const filenameLib = {
  getFileBasename,
  extractExtension,
  extractMimetype
};

module.exports = filenameLib;
