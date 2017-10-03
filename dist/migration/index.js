'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migration = undefined;

var _jsMysql = require('js-mysql');

var mysql = _interopRequireWildcard(_jsMysql);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const migration = exports.migration = {
  mysql: mysql.migration
};