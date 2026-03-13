import request from 'supertest'
import app from '../../app'

describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/api/health')

    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(res.body.timestamp).toBeDefined()
  })
})

describe('GET /api/unknown', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-route-xyz')

    expect(res.status).toBe(404)
  })
})
