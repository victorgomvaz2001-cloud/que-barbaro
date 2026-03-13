import request from 'supertest'
import app from '../../app'
import { SEO } from '../../models/SEO.model'

jest.mock('../../models/SEO.model')

const mockSEO = {
  _id: 'seo-id-1',
  route: '/us-wa/strains',
  title: 'Washington Strains',
  description: 'Our WA strain selection',
  og: {},
  twitterCard: {},
}

describe('GET /api/seo', () => {
  it('returns SEO data for a route', async () => {
    ;(SEO.findOne as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockSEO),
    })

    const res = await request(app).get('/api/seo?route=/us-wa/strains')

    expect(res.status).toBe(200)
    expect(res.body.data.route).toBe('/us-wa/strains')
  })

  it('returns 400 when route param is missing', async () => {
    const res = await request(app).get('/api/seo')

    expect(res.status).toBe(400)
  })

  it('returns 404 when route not found', async () => {
    ;(SEO.findOne as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    })

    const res = await request(app).get('/api/seo?route=/nonexistent')

    expect(res.status).toBe(404)
  })
})
