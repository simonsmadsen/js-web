'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hash = hash;
exports.compareHash = compareHash;
const bcrypt = require('bcrypt');

const takeFirst = exports.takeFirst = arr => arr.length > 0 ? arr[0] : [];

async function hash(password) {
  return bcrypt.hash(password, 10);
}

async function compareHash(password, hashValue) {
  return bcrypt.compare(password, hashValue);
}