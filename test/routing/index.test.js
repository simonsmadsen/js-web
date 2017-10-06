import request from 'supertest'

import { route, htmlRoute, postRoute, app } from './../../src/routing'

// process.on('unhandledRejection', (reason, p) => {
//   console.log(p)
// })

describe('routing', () => {
  let server

  beforeEach(() => {
    server = app.listen()
  })

  afterEach((done) => {
    server.close()
    done()
  })

  it('get route (route)', async () => {
    const jsonResponse = { simon: 'my name2' }
    await route('/test', () => (jsonResponse))

    const result = await request(server).get('/test')
    expect(result.status).toBe(200)
    expect(result.body).toEqual(jsonResponse)
  })

  it('get route (route) empty data', async () => {
    await route('/test-empty')

    const result = await request(server).get('/test-empty')
    expect(result.status).toBe(200)
    expect(result.body).toEqual({})
  })

  it('post route (postRoute)', async () => {
    const jsonResponse = { simon: 'my name2' }
    await postRoute('/test-post', () => (jsonResponse))

    const result = await request(server).post('/test-post').send(jsonResponse)
    expect(result.status).toBe(200)
    expect(result.body).toEqual(jsonResponse)
  })

  it('html route (htmlRoute)', async () => {
    const htmlFile = 'test/routing/html-test-file.html'
    await htmlRoute('/test-html', htmlFile, async () => ({ name: 'Simon' }))

    const result = await request(server).get('/test-html')
    expect(result.status).toBe(200)
    expect(result.text.includes('<h1>Hi Simon</h1>')).toBeTruthy()
  })

  it('html route file not exists', async () => {
    const htmlFile = 'test/routing/fake-file.html'
    await htmlRoute('/test-html3', htmlFile, async () => ({ name: 'Simon' }))

    const result = await request(server).get('/test-html3')
    expect(result.status).toBe(404)
  })
})
