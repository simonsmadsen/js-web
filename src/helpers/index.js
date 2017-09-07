const bcrypt = require('bcrypt-node')

export const takeFirst = arr =>
  (arr.length > 0 ? arr[0] : [])

export function hash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5))
}

export function compareHash(password, hashValue) {
  return bcrypt.compareSync(password, hashValue)
}
