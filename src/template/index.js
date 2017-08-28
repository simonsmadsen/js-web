const handlebars = require('handlebars')
const fs = require('fs')

handlebars.registerHelper('include', (filename, data) => {
  const file = fs.readFileSync(filename, 'utf-8')
  return handlebars.compile(file)(data.name && data.name === 'include' ? data.data.root : data)
})

export default function template(htmlFile) {
  const fileContent = fs.readFileSync(htmlFile, 'utf-8')
  const fileTemplate = handlebars.compile(fileContent)
  return data => fileTemplate(data)
}
