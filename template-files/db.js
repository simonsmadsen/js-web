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

 const migrate = async _ => {
   await db.table('users',{
     id: 'id',
     name: 'string'
   })
   process.exit()
 }
 migrate()
