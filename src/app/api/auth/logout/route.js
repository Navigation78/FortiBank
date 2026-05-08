// src/app/api/auth/logout/route.js
// POST - acknowledges tab-scoped logout.

import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ success: true })
}
