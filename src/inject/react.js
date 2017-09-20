import * as pack from 'js-pack'

const path = require('path')
const fs = require('fs')

const noExt = file => file.replace(path.extname(file), '')
const link = (file, linkId) => `import App from '.${noExt(file)}' ` +
  '\n ReactDOM.render( ' +
  '  React.createElement(App), ' +
  `  document.getElementById('${linkId}')` +
  ')'

export function react(index, linkId, dev = false) {
  if (!fs.existsSync(index)) {
    console.log(`${index} - file not exists!`)
    return pack.scriptRAW('')
  }
  const filePath = path.dirname(index)
  const linkedFile = `${filePath}/js-web-linked.js`
  fs.writeFileSync(linkedFile, link(index.replace(filePath, ''), linkId))
  if(dev){
    return [
      pack.scriptCDN('https://unpkg.com/react@15/dist/react.js'),
      pack.scriptCDN('https://unpkg.com/react-dom@15/dist/react-dom.js'),
      pack.jsx(filePath, 'js-web-linked.js')
    ]
  }
  return [
    pack.scriptCDN('https://unpkg.com/react@15/dist/react.min.js'),
    pack.scriptCDN('https://unpkg.com/react-dom@15/dist/react-dom.min.js'),
    pack.jsx(filePath, 'js-web-linked.js')
  ]
}

export function babel(index) {
  if (!fs.existsSync(index)) {
    console.log(`${index} - file not exists!`)
    return pack.scriptRAW('')
  }
  const filePath = path.dirname(index)

  return [
    pack.babel(filePath, index.replace(filePath, '').replace('/', '').replace('\\', ''))
  ]
}
