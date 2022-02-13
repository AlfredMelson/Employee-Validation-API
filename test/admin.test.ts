import request from 'supertest'
import app from '../src/app'
import { expect } from 'chai'

describe('GET /login', () => {
  it('should return 200 OK', () => {
    return request(app).get('/login').expect(200)
  })
})

describe('GET /logout', () => {
  it('should return 200 OK', () => {
    return request(app).get('/logout').expect(200)
  })
})

describe('GET /auth', () => {
  it('should return 200 OK', () => {
    return request(app).get('/auth').expect(200)
  })
})

describe('GET /register', () => {
  it('should return 200 OK', done => {
    request(app)
      .get('/register')
      .expect(200)
      .end(() => done())
  })
})

describe('GET /refresh', () => {
  it('should return 302 Found for redirection', done => {
    request(app)
      .get('/refresh')
      .expect(302)
      .end(() => done())
  })
})
