// src/app/api/upload/route.js
// POST - uploads a file to Supabase Storage for module content (admin only)

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'
import { withApiHandler } from '@/lib/apiHandler'
import { ValidationError, ForbiddenError } from '@/lib/errors'

const MAX_SIZE = 50 * 1024 * 1024
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
  'video/mp4', 'video/webm',
]

export const POST = withApiHandler(async (request) => {
  const { user, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  const { data: roleData } = await supabaseAdmin
    .from('user_roles').select('roles(name)').eq('user_id', user.id).single()
  if (roleData?.roles?.name !== 'system_admin') {
    throw new ForbiddenError('Admin access required')
  }

  const formData = await request.formData()
  const file     = formData.get('file')
  const moduleId = formData.get('moduleId') || 'general'

  if (!file || typeof file === 'string') {
    throw new ValidationError('No file provided', { field: 'file' })
  }
  if (file.size > MAX_SIZE) {
    throw new ValidationError('File too large. Maximum size is 50MB.', { field: 'file', maxSize: MAX_SIZE })
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ValidationError('File type not allowed. Use PDF, image or video.', { field: 'file', type: file.type })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer      = new Uint8Array(arrayBuffer)
  const fileName    = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const filePath    = `${moduleId}/${fileName}`

  const { error: uploadError } = await supabaseAdmin.storage
    .from('module-content')
    .upload(filePath, buffer, { contentType: file.type, upsert: false })

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
})
