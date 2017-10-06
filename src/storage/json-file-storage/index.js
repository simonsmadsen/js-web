const fs = require('fs')

const readFile = () => JSON.parse(fs.readFileSync('db.json', 'utf-8'))
const saveFile = content => fs.writeFileSync('db.json', JSON.stringify(content))

const ensureFile = () => {
  if (!fs.existsSync('db.json')) {
    saveFile({})
  }
}

const ensureTable = (table) => {
  const file = readFile()
  if (!file[table]) {
    file[table] = []
    saveFile(file)
  }
  return file[table]
}

const overrideTable = (table, arr) => {
  const file = readFile()
  file[table] = arr
  saveFile(file)
  return arr
}

const create = (table, obj) => overrideTable(
table,
  ensureTable(table).concat([obj])
)
const select = (table, where) => {
  const result = ensureTable(table)
  if (where) {
    return whereFilter(result, where)
  }
  return result
}

const truncate = (table) => {
  overrideTable(table, [])
}

const whereFilter = (arr, filter) => {
  const filterKeys = Object.keys(filter)
  return arr.filter(item =>
    filterKeys.every(key => filter[key] == item[key]))
}

const _delete = (table, where) => {
  const tableData = ensureTable(table)

  whereFilter(tableData, where).forEach((obj) => {
    const index = tableData.indexOf(obj)
    if (index > -1) {
      tableData.splice(index, 1)
    }
  })

  overrideTable(table, tableData)
}

const find = (table, filter) => {
  const result = whereFilter(ensureTable(table), filter)
  return result.length > 0 ? result[0] : null
}

const update = (table, updates, where) => {
  const tableData = ensureTable(table)

  whereFilter(tableData, where).forEach((obj) => {
    const index = tableData.indexOf(obj)
    if (index > -1) {
      Object.keys(updates).forEach((key) => {
        tableData[index][key] = updates[key]
      })
    }
  })

  overrideTable(table, tableData)
}

export const table = (table) => {
  ensureFile()

  return {
    delete: where => _delete(table, where),
    find: where => find(table, where),
    select: (where = null) => select(table, where),
    update: (updates, where) => update(table, updates, where),
    truncate: () => truncate(table),
    create: obj => create(table, obj)
  }
}
