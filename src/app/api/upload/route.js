// src/app/api/upload/route.js
// POST — uploads a file to Supabase Storage for module content
// Accepts: multipart/form-data with file + moduleId

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import supabaseAdmin from '@/lib/supabaseAdmin'

export async function POST(request) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify admin
  const { data: roleData } = await supabaseAdmin
    .from('user_roles').select('roles(name)').eq('user_id', user.id).single()
  if (roleData?.roles?.name !== 'system_admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const formData = await request.formData()
  const file     = formData.get('file')
  const moduleId = formData.get('moduleId') || 'general'

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // Validate file size (max 50MB)
  const MAX_SIZE = 50 * 1024 * 1024
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Maximum size is 50MB.' }, { status: 400 })
  }

  // Validate file type
  const ALLOWED_TYPES = [
    'application/pdf',
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm',
  ]
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'File type not allowed. Use PDF, image or video.' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer      = new Uint8Array(arrayBuffer)
  const fileName    = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const filePath    = `${moduleId}/${fileName}`

  const { error: uploadError } = await supabaseAdmin.storage
    .from('module-content')
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert:      false,
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: urlData } = supabaseAdmin.storage
    .from('module-content')
    .getPublicUrl(filePath)

  return NextResponse.json({
    url:      urlData.publicUrl,
    filePath,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  })
}