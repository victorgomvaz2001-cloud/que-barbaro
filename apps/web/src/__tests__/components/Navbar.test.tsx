import { render, screen } from '@testing-library/react'
import Navbar from '@/components/layout/Navbar'

describe('Navbar', () => {
  it('renders default branding', () => {
    render(<Navbar />)
    expect(screen.getByText('Falcanna')).toBeInTheDocument()
  })

  it('renders region-specific branding for us-wa', () => {
    render(<Navbar region="us-wa" />)
    expect(screen.getByText('Falcanna US-WA')).toBeInTheDocument()
  })

  it('renders region-specific branding for us-ok', () => {
    render(<Navbar region="us-ok" />)
    expect(screen.getByText('Falcanna US-OK')).toBeInTheDocument()
  })

  it('renders custom sections', () => {
    render(<Navbar sections={['strains', 'about-us']} />)
    expect(screen.getByText('Strains')).toBeInTheDocument()
    expect(screen.getByText('About Us')).toBeInTheDocument()
  })

  it('generates correct href for region sections', () => {
    render(<Navbar region="us-wa" sections={['strains']} />)
    const link = screen.getByText('Strains').closest('a')
    expect(link?.getAttribute('href')).toBe('/us-wa/strains')
  })
})
