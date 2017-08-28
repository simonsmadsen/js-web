const db = require('js-web').migration.mysql

/*
  Fieldtypes:
  id (auto increment),
  string,
  int,
  datetime,
  bool,
  text
 */

db.table('users',{
  id: 'id',
  name: 'string'
})
