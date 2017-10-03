import { hash, compareHash } from './../../src/helpers'

test('hashing', async () => {
  const password = 'my password'
  const wrongPassword = 'password'
  const hashedPassword = hash(password)
  expect(hashedPassword === password).toBeFalsy()
  const correctResult = compareHash(password, hashedPassword)
  const wrongResult = compareHash(wrongPassword, hashedPassword)

  expect(correctResult).toBeTruthy()
  expect(wrongResult).toBeFalsy()
})