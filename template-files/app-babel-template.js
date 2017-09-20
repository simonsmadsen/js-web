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

  const injections = [
    inject.style('style/main.css'),
    inject.script('script/main.js')
  ]

  htmlRoute('/','html/index.html',(input, session) => {
    return { hello: 'World' }
  }, injections)

  start()
