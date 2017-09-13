const bcrypt = require('bcrypt-node')

export const takeFirst = arr =>
  (arr.length > 0 ? arr[0] : [])

export const hash = password =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(5))

export const compareHash = (password, hash) =>
  bcrypt.compareSync(password, hash)
