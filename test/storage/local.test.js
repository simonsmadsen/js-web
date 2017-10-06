import { local } from './../../src/storage'

test('Simple CRUD test', async () => {
  const users = local.table('users')
  users.truncate()
  users.create({ name: 'Simon', age: 24 })
  users.create({ name: 'Peter', age: 25 })
  expect(users.select().length).toBe(2)
  const simon = users.select({ name: 'Simon' })[0]
  expect(simon.age).toBe(24)
  users.update({ age: 27 }, { name: 'Simon' })
  const updatedSimon = users.select({ name: 'Simon' })[0]
  expect(updatedSimon.age).toBe(27)
})
