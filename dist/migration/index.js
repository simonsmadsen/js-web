'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migration = undefined;

var _jsMysqlMigration = require('js-mysql-migration');

var mysql = _interopRequireWildcard(_jsMysqlMigration);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const migration = exports.migration = {
  mysql
};