const supertest = require('supertest')
const server = require('../api/server')
const db = require('../database/dbConfig')
const jwt = require('jsonwebtoken')

beforeEach(async () => {
    await db.seed.run()
})
//
// afterAll(async () => {
//     await db.destroy()
// })

describe('Authentication Router Integration Tests', () => {
    it('GET /api/auth - Authentication router is working', async () => {
        const res = await supertest(server).get('/api/auth')
        expect(res.statusCode).toBe(200)
        expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
        expect(res.body.message).toBe('Authentication router is live')
    })
    it('POST /api/auth/register - Account registration is working', async () => {
        jest.setTimeout(30000) //on slow computers you may need more time for the callback function to work.
        const res = await supertest(server).post('/api/auth/register')
            .send({
                username: 'Test User 1',
                password: 'testpassword'
            })
        expect(res.statusCode).toBe(201)
        expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
        expect(res.body.username).toBe('Test User 1')
    })
    it('POST /api/auth/login - Account login requires credentials', async () => {
        jest.setTimeout(30000)
        const res = await supertest(server).post('/api/auth/login')
            .send({
                username: 'nothing',
                password: 'alsonothing'
            })
        expect(res.statusCode).toBe(400)
        expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
        expect(res.body.message).toBe(`Invalid Credentials`);

    })
    it('POST /api/auth/login - Account login successful', async () => {
        jest.setTimeout(30000)
        const r = await supertest(server).post('/api/auth/register')
            .send({
                username: 'Test User 2',
                password: 'TestPassword'
            })
        const res = await supertest(server).post('/api/auth/login')
            .send({
                username: 'Test User 2',
                password: 'TestPassword'
            })
            const secret = process.env.JWT_SECRET
            const payload = {
                userId: 2,
                username: 'Test User 2',
                userRole: 'normal',
            }
            const token = jwt.sign(payload, secret)
        console.log(res.body)
        expect(res.statusCode).toBe(200)
        expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
        expect(res.body.token).toEqual(token)
    })
})
describe('Jokes Router Integration Tests', () => {
    it('GET /api/jokes - Fails without authentication', async () => {
        const res = await supertest(server).get('/api/jokes')
        expect(res.statusCode).toBe(400)
        expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
    })
    it('GET /api/jokes - Succeeds with authentication', async () => {
        jest.setTimeout(30000)
        const r = await supertest(server).post('/api/auth/register')
            .send({
                username: 'Test User 2',
                password: 'TestPassword'
            })
        const re = await supertest(server).post('/api/auth/login')
            .send({
                username: 'Test User 2',
                password: 'TestPassword'
            })
        const secret = process.env.JWT_SECRET
        const payload = {
            userId: 2,
            username: 'Test User 2',
            userRole: 'normal',
        }
        const token = jwt.sign(payload, secret)
        const res = await supertest(server).get('/api/jokes')
            .set('Authorization', token)

        expect(res.statusCode).toBe(200)
        expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
        expect.arrayContaining(res.body)
    })
})