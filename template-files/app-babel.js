import {
  htmlRoute, route, postRoute, notFound,
  helpers,
  request,
  storage,
  redirect,
  inject,
  start,
  back
} from 'js-web'

const { local, mysql } = storage

const users = local.table('users')

htmlRoute('/','html/index.html',(input, session) => {
  return { hello: 'World' }
})

start()
