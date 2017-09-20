import {
  htmlRoute, route, postRoute, notFound,
  storage,
  redirect,
  start,
  back
} from 'js-web'

const { local, mysql } = storage

const users = local.table('users')

route('/', async (input, session) => {
  return { hello: 'world' }
})

start()
