// src/app/api/profile/avatar/route.js
// POST - uploads a profile avatar to Supabase Storage and returns the public URL.

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'
import { withApiHandler } from '@/lib/apiHandler'
import { ValidationError } from '@/lib/errors'

const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED  = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const BUCKET   = 'avatars'

export const POST = withApiHandler(async (request) => {
  const { user, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  const formData = await request.formData()
  const file     = formData.get('file')

  if (!file || typeof file === 'string') {
    throw new ValidationError('No file provided', { field: 'file' })
  }
  if (file.size > MAX_SIZE) {
    throw new ValidationError('File too large. Maximum size is 5 MB.', { field: 'file', maxSize: MAX_SIZE })
  }
  if (!ALLOWED.includes(file.type)) {
    throw new ValidationError('Only JPEG, PNG, WebP and GIF images are allowed.', { field: 'file', type: file.type })
  }

  const ext      = file.type.split('/')[1].replace('jpeg', 'jpg')
  const filePath = `${user.id}/avatar.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer      = new Uint8Array(arrayBuffer)

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filePath, buffer, { contentType: file.type, upsert: true })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: urlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filePath)
  const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`

  await supabaseAdmin
    .from('users')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id)

  return NextResponse.json({ url: publicUrl })
})
