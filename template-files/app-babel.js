import {
  htmlRoute, route, postRoute,
  helpers,
  request,
  storage,
  inject,
  start
} from 'js-web'

const { local, mysql } = storage

const users = local.table('users')

htmlRoute('/','html/index.html',(input, session) => {
  return { hello: 'World' }
})

start()
