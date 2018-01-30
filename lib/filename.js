const path = require('path');

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
  return mimeTypes[ext] || null;
}

const filenameLib = {
  getFileBasename,
  extractExtension,
  extractMimetype
}

module.exports = filenameLib;
