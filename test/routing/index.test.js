import { route,app } from './../../src/routing'
const request = require('supertest')

test('json get route', async () => {

  route('/test', () => ({simon: 'my name'}))

  request(app)
  .get('/test')
  .expect('Content-Type', /json/)
  .expect('Content-Length', '15')
  .expect(200)
  .end(function(err, res) {
    if (err) throw err

    expect(res).toMatch({simon: 'my name'})
    done()
  })

})


