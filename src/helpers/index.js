const bcrypt = require('bcrypt')

export const takeFirst = arr =>
  (arr.length > 0 ? arr[0] : [])


export async function hash(password) {
  return bcrypt.hash(password, 10)
}

export async function compareHash(password, hashValue) {
  return bcrypt.compare(password, hashValue)
}
