import * as inject from '../inject'
import template from '../template'
import config from './../config'

const fs = require('fs')
const express = require('express')
const session = require('express-session')

export const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')

const bundleCSS = config.bundleCSS || 'bundle.css'
const bundleScript = config.bundleScript || 'bunde.css'
const assetsFolder = config.assetsFolder || 'assets'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(`/${assetsFolder}`, express.static(assetsFolder))
app.use(cookieParser(config.app_key))
app.use(session({
  secret: config.app_key,
  resave: true,
  saveUninitialized: true
}))
app.use(helmet())

const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
}

let onSocketConnectionFunction = null
let onSocketDisconnectFunction = null

if (config.allowCrossDomain == 'true') {
  app.use(allowCrossDomain)
}

const serverConfig = config.https !== 'true' ? {} :
  {
    key: fs.readFileSync(config.https_privkey),
    cert: fs.readFileSync(config.https_cert),
    ca: fs.readFileSync(config.https_fullchain)
  }

const sendError = res => (e) => {
  res.sendStatus(500)
  console.log(['err in route', res.req.url, e])
}

const setCookie = (key, val, days, res) => {
  const options = {
    maxAge: 1000 * 60 * 60 * 24 * days,
    httpOnly: true,
    signed: true
  }
  res.cookie(key, val, options)
}

const getUserImputs = (req) => {
  let params = Object.assign({}, req.body, req.params)
  params = Object.assign({}, params, req.query)
  params.take = (allowedKeys) => {
    const newObj = {}
    Object.keys(params).forEach((key) => {
      if (allowedKeys.indexOf(key) > -1) {
        newObj[key] = params[key]
      }
    })
    return newObj
  }
  params.only = params.take
  return params
}

const runFunc = (respondFunc, output, res, req) => respond(respondFunc, output(
  getUserImputs(req),
  {
    get: (key, std) => (req.session[key] ? req.session[key] : std),
    set: (key, val) => { req.session[key] = val },
    getFlash: (key, std) => (req.session[`_FLASH_${key}`] ? req.session[`_FLASH_${key}`] : std),
    setFlash: (key, val) => { req.session[`_FLASH_${key}`] = val }
  },
  {
    get: (key, std) => (req.signedCookies[key] ? req.signedCookies[key] : std),
    set: (key, val, days = 1) => setCookie(key, val, days, res)
  }
), res, req)

const respond = (respondFunc, output, res, req) => {
  if (!output) {
    console.log('! No return in route !')
    output = {}
  }
  switch (output.constructor.name) {
  case 'AsyncFunction':
    runFunc(respondFunc, output, res, req)
    break
  case 'Function':
    runFunc(respondFunc, output, res, req)
    break
  case 'Promise':
    output
      .then(r => respond(respondFunc, r, res, req))
      .catch(sendError(res))
    break
  case 'Redirect':
    if (output.headers) {
      res.set(output.headers)
    }
    res.redirect(output.route)
    break
  case 'Back':
    res.redirect(backUrl(req))
    break
  default:
    respondFunc(clearFlashedData(req, output))
  }
}

const flashedKeys = req => Object.keys(req.session).filter(k => k.indexOf('_FLASH_') > -1)

const flashedData = (req) => {
  const flashKeys = flashedKeys(req)
  const data = {}
  flashKeys.forEach((k) => {
    data[k.replace('_FLASH_', '')] = req.session[k]
  })
  return data
}
const clearFlashedData = (req, d) => {
  if (req.session) {
    const flashKeys = flashedKeys(req)
    flashKeys.forEach(k => delete req.session[k])
  }
  return d
}
const backUrl = req => req.header('Referer') || '/'

export function route(route, func) {
  app.get(route, (req, res) => {
    respond(r => res.json(r), func, res, req)
  })
}

function Back() {

}
export function back() {
  return new Back()
}

function Redirect(route, headers) {
  this.route = route
  this.headers = headers
}

export function onSocketDisconnect(func) {
  onSocketDisconnectFunction = func
}

export function onSocketConnection(func) {
  onSocketConnectionFunction = func
}

export function redirect(route) {
  return new Redirect(route)
}

export function postRoute(route, func) {
  app.post(route, (req, res) => {
    respond(r => res.json(r), func, res, req)
  })
}
const isScriptInjected = html => html.indexOf(bundleScript) > -1

const injectScript = (html) => {
  if (isScriptInjected(html)) return html
  const script = `<script src="/${assetsFolder}/${bundleScript}"></script>`
  let index = html.indexOf('</body>')
  index = index === -1 ? html.length : index
  return html.substr(0, index) + script + html.substr(index)
}

const isStyleInjected = html => html.indexOf(bundleCSS) > -1

const injectStyle = (html) => {
  if (isStyleInjected(html)) return html
  const style = `<link rel="stylesheet" href="/${assetsFolder}/${bundleCSS}">`
  let index = html.indexOf('</body>')
  index = index === -1 ? html.length : index
  return html.substr(0, index) + style + html.substr(index)
}

const handleInjections = (injections, html) => {
  if (!injections) return html
  return injectScript(injectStyle(html))
}

export const unpackArr = (arr = []) => {
  const unpacked = []
  arr.forEach((a) => {
    if (a.constructor.name === 'Array') {
      a.forEach(e => unpacked.push(e))
    } else {
      unpacked.push(a)
    }
  })
  return unpacked
}

export function htmlRoute(route, filename, data, injections) {
  const templateWithOutData = template(filename)

  if (injections) {
    inject.pack(unpackArr(injections),
      `${assetsFolder}/${bundleScript}`,
      `${assetsFolder}/${bundleCSS}`
    )
  }
  app.get(route, (req, res) => {
    const flashed = flashedData(req)
    respond((out) => {
      res.send(
        handleInjections(
          unpackArr(injections),
          templateWithOutData(Object.assign(out, flashed))
        )
      )
    }, data, res, req)
  })
}

const socketHandlers = []
export function socket(path, func) {
  socketHandlers.push([path, func])
}

export function start() {
  const server = config.https !== 'true' ? require('http').createServer(app) :
    require('https').createServer(serverConfig, app)
  const io = require('socket.io')(server)

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      if (onSocketDisconnectFunction) {
        onSocketDisconnectFunction(socket)
      }
    })

    for (let i = 0; i < socketHandlers.length; i++) {
      socket.on(socketHandlers[i][0], (msg) => {
        socketHandlers[i][1](msg, socket)
      })
    }

    if (onSocketConnectionFunction) {
      onSocketConnectionFunction(socket)
    }
  })

  server.listen(config.port)
  console.log(`Listen on: ${config.port}`)
}
