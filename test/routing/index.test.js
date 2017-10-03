import { route, htmlRoute, postRoute, app } from './../../src/routing'

const request = require('supertest')

test('get route (route)', async () => {
  const jsonResponse = { simon: 'my name2' }
  route('/test', () => (jsonResponse))

  const result = await request(app).get('/test')

  expect(result.status).toBe(200)
  expect(result.body).toEqual(jsonResponse)
})

test('post route (postRoute)', async () => {
  const jsonResponse = { simon: 'my name2' }
  postRoute('/test-post', () => (jsonResponse))

  const result = await request(app).post('/test-post')

  expect(result.status).toBe(200)
  expect(result.body).toEqual(jsonResponse)
})

test('html route (htmlRoute)', async () => {
  const htmlFile = 'test/routing/html-test-file.html'
  htmlRoute('/test-html', htmlFile, async () => {
    return {name: 'Simon'}
  })

  const result = await request(app).get('/test-html')
  expect(result.status).toBe(200)
  expect(result.text.indexOf('<h1>Hi Simon</h1>') > -1).toBeTruthy()
})

test('html route2 (htmlRoute)', async () => {
  const htmlFile = 'test/routing/html-test-file.html'
  htmlRoute('/test-html2', htmlFile, async () => {
    return {name: 'Simon2'}

  })
  const result = await request(app).get('/test-html2')
  expect(result.status).toBe(200)
  expect(result.text.indexOf('<h1>Hi Simon</h1>') === -1).toBeTruthy()
})