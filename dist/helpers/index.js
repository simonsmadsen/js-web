'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hash = hash;
exports.compareHash = compareHash;
const bcrypt = require('bcrypt-node');

const takeFirst = exports.takeFirst = arr => arr.length > 0 ? arr[0] : [];

function hash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5));
}

function compareHash(password, hashValue) {
  return bcrypt.compareSync(password, hashValue);
}