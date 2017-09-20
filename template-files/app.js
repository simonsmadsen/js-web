const web = require('js-web')
const db = web.storage.mysql

/**
 * Tables!
*/
const users = db.table('users')

/**
 * Injections
*/
const injections = [
  web.inject.jquery(),
  web.inject.style('style/main.css'),
  web.inject.script('script/main.js')
]

/**
 * Routes
*/
web.htmlRoute('/','html/index.html', async (input,session,cookie) => {
  return {
    hello:'World'
  }
},injections)

web.start()
