'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.react = react;
exports.babel = babel;

var _jsPack = require('js-pack');

var pack = _interopRequireWildcard(_jsPack);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const path = require('path');
const fs = require('fs');

const noExt = file => file.replace(path.extname(file), '');
const link = (file, linkId) => `import App from '.${noExt(file)}' ` + '\n ReactDOM.render( ' + '  React.createElement(App), ' + `  document.getElementById('${linkId}')` + ')';

function react(index, linkId) {
  if (!fs.existsSync(index)) {
    console.log(`${index} - file not exists!`);
    return pack.scriptRAW('');
  }
  const filePath = path.dirname(index);
  const linkedFile = `${filePath}/js-web-linked.js`;
  fs.writeFileSync(linkedFile, link(index.replace(filePath, ''), linkId));

  return [pack.scriptCDN('https://unpkg.com/react@15/dist/react.min.js'), pack.scriptCDN('https://unpkg.com/react-dom@15/dist/react-dom.min.js'), pack.jsx(filePath, 'js-web-linked.js')];
}

function babel(index) {
  if (!fs.existsSync(index)) {
    console.log(`${index} - file not exists!`);
    return pack.scriptRAW('');
  }
  const filePath = path.dirname(index);

  return [pack.babel(filePath, index.replace(filePath, '').replace('/', '').replace('\\', ''))];
}