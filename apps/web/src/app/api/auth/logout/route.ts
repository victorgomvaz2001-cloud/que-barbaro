import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ data: null })
  response.cookies.set('token', '', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
  return response
}
