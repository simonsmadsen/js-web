'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = exports.htmlRoute = exports.unpackArr = exports.app = undefined;
exports.route = route;
exports.back = back;
exports.onSocketDisconnect = onSocketDisconnect;
exports.onSocketConnection = onSocketConnection;
exports.redirect = redirect;
exports.postRoute = postRoute;
exports.notFound = notFound;
exports.socket = socket;

var _inject = require('../inject');

var inject = _interopRequireWildcard(_inject);

var _template = require('../template');

var _template2 = _interopRequireDefault(_template);

var _config = require('./../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const fs = require('fs');
const express = require('express');
const session = require('express-session');

const app = exports.app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const bundleCSS = _config2.default.bundleCSS || 'bundle.css';
const bundleScript = _config2.default.bundleScript || 'bunde.css';
const assetsFolder = _config2.default.assetsFolder || 'assets';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(`/${assetsFolder}`, express.static(assetsFolder));
app.use(cookieParser(_config2.default.app_key));
app.use(session({
  secret: _config2.default.app_key,
  resave: true,
  saveUninitialized: true
}));
app.use(helmet());

const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
};

let onSocketConnectionFunction = null;
let onSocketDisconnectFunction = null;

if (_config2.default.allowCrossDomain === 'true') {
  app.use(allowCrossDomain);
}

const serverConfig = _config2.default.https !== 'true' ? {} : {
  key: fs.readFileSync(_config2.default.https_privkey),
  cert: fs.readFileSync(_config2.default.https_cert),
  ca: fs.readFileSync(_config2.default.https_fullchain)
};

const sendError = res => e => {
  res.sendStatus(500);
  console.log(['err in route', res.req.url, e]);
};

const setCookie = (key, val, days, res) => {
  const options = {
    maxAge: 1000 * 60 * 60 * 24 * days,
    httpOnly: true,
    signed: true
  };
  res.cookie(key, val, options);
};

const getUserImputs = req => {
  let params = Object.assign({}, req.body, req.params);
  params = Object.assign({}, params, req.query);
  params.take = allowedKeys => {
    const newObj = {};
    Object.keys(params).forEach(key => {
      if (allowedKeys.indexOf(key) > -1) {
        newObj[key] = params[key];
      }
    });
    return newObj;
  };
  params.only = params.take;
  return params;
};

const runFunc = (respondFunc, output, res, req) => respond(respondFunc, output(getUserImputs(req), {
  get: (key, std) => req.session[key] ? req.session[key] : std,
  set: (key, val) => {
    req.session[key] = val;
  },
  getFlash: (key, std) => req.session[`_FLASH_${key}`] ? req.session[`_FLASH_${key}`] : std,
  setFlash: (key, val) => {
    req.session[`_FLASH_${key}`] = val;
  }
}, {
  get: (key, std) => req.signedCookies[key] ? req.signedCookies[key] : std,
  set: (key, val, days = 1) => setCookie(key, val, days, res)
}), res, req);

const respond = (respondFunc, output, res, req) => {
  if (!output) {
    console.log('! No return in route !');
    output = {};
  }
  switch (output.constructor.name) {
    case 'AsyncFunction':
      runFunc(respondFunc, output, res, req);
      break;
    case 'Function':
      runFunc(respondFunc, output, res, req);
      break;
    case 'Promise':
      output.then(r => respond(respondFunc, r, res, req)).catch(sendError(res));
      break;
    case 'Redirect':
      if (output.headers) {
        res.set(output.headers);
      }
      res.redirect(output.route);
      break;
    case 'Back':
      res.redirect(backUrl(req));
      break;
    default:
      respondFunc(clearFlashedData(req, output));
  }
};

const flashedKeys = req => Object.keys(req.session).filter(k => k.indexOf('_FLASH_') > -1);

const flashedData = req => {
  const flashKeys = flashedKeys(req);
  const data = {};
  flashKeys.forEach(k => {
    data[k.replace('_FLASH_', '')] = req.session[k];
  });
  return data;
};
const clearFlashedData = (req, d) => {
  if (req.session) {
    const flashKeys = flashedKeys(req);
    flashKeys.forEach(k => delete req.session[k]);
  }
  return d;
};
const backUrl = req => req.header('Referer') || '/';

function route(route, func) {
  app.get(route, (req, res) => {
    respond(r => res.json(r), func, res, req);
  });
}

function Back() {}
function back() {
  return new Back();
}

function Redirect(route, headers) {
  this.route = route;
  this.headers = headers;
}

function onSocketDisconnect(func) {
  onSocketDisconnectFunction = func;
}

function onSocketConnection(func) {
  onSocketConnectionFunction = func;
}

function redirect(route) {
  return new Redirect(route);
}

function postRoute(route, func) {
  app.post(route, (req, res) => {
    respond(r => res.json(r), func, res, req);
  });
}
const isScriptInjected = html => html.indexOf(bundleScript) > -1;

const injectScript = html => {
  if (isScriptInjected(html)) return html;
  const script = `<script src="/${assetsFolder}/${bundleScript}"></script>`;
  let index = html.indexOf('</body>');
  index = index === -1 ? html.length : index;
  return html.substr(0, index) + script + html.substr(index);
};

const isStyleInjected = html => html.indexOf(bundleCSS) > -1;

const injectStyle = html => {
  if (isStyleInjected(html)) return html;
  const style = `<link rel="stylesheet" href="/${assetsFolder}/${bundleCSS}">`;
  let index = html.indexOf('</body>');
  index = index === -1 ? html.length : index;
  return html.substr(0, index) + style + html.substr(index);
};

const handleInjections = (injections, html) => {
  if (!injections) return html;
  return injectScript(injectStyle(html));
};

const unpackArr = exports.unpackArr = (arr = []) => {
  const unpacked = [];
  arr.forEach(a => {
    if (a.constructor.name === 'Array') {
      a.forEach(e => unpacked.push(e));
    } else {
      unpacked.push(a);
    }
  });
  return unpacked;
};

const notFoundRedirect = data => {
  app.get('*', (req, res) => {
    const flashed = flashedData(req);
    respond(null, data, res, req);
  });
};

function notFound(filename, data, injections) {
  if (!filename) {
    return notFoundRedirect(data);
  }
  const templateWithOutData = (0, _template2.default)(filename);

  if (injections) {
    inject.pack(unpackArr(injections), `${assetsFolder}/${bundleScript}`, `${assetsFolder}/${bundleCSS}`);
  }
  app.get('*', (req, res) => {
    const flashed = flashedData(req);
    respond(out => {
      res.status(404).send(handleInjections(unpackArr(injections), templateWithOutData(Object.assign(out, flashed))));
    }, data, res, req);
  });
}

const htmlRoute = exports.htmlRoute = (route, filename, data, injections) => {
  const templateWithOutData = (0, _template2.default)(filename);

  if (injections) {
    inject.pack(unpackArr(injections), `${assetsFolder}/${bundleScript}`, `${assetsFolder}/${bundleCSS}`);
  }
  app.get(route, (req, res) => {
    const flashed = flashedData(req);
    respond(out => {
      res.send(handleInjections(unpackArr(injections), templateWithOutData(Object.assign(out, flashed))));
    }, data, res, req);
  });
};

const socketHandlers = [];
function socket(path, func) {
  socketHandlers.push([path, func]);
}

const start = exports.start = () => {
  const server = _config2.default.https !== 'true' ? require('http').createServer(app) : require('https').createServer(serverConfig, app);
  const io = require('socket.io')(server);

  io.on('connection', socket => {
    socket.on('disconnect', () => {
      if (onSocketDisconnectFunction) {
        onSocketDisconnectFunction(socket);
      }
    });

    for (let i = 0; i < socketHandlers.length; i++) {
      socket.on(socketHandlers[i][0], msg => {
        socketHandlers[i][1](msg, socket);
      });
    }

    if (onSocketConnectionFunction) {
      onSocketConnectionFunction(socket);
    }
  });

  server.listen(_config2.default.port);
  console.log(`Listen on: ${_config2.default.port}`);
};