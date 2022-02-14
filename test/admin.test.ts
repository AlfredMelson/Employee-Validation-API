import request from 'supertest'
import app from '../src/app'

describe('GET /admin/logout', () => {
  it('should return 200 OK', () => {
    return request(app).get('/admin/logout').expect(200)
  })
})

describe('GET /admin/auth', () => {
  it('should return 200 OK', () => {
    return request(app).get('/admin/auth').expect(200)
  })
})

describe('GET /admin/register', () => {
  it('should return 200 OK', done => {
    request(app)
      .get('/admin/register')
      .expect(200)
      .end(() => done())
  })
})

describe('GET /admin/refresh', () => {
  it('should return 302 Found for redirection', done => {
    request(app)
      .get('/admin/refresh')
      .expect(302)
      .end(() => done())
  })
})
