// POST — uploads a profile avatar to Supabase Storage and returns the public URL.
// Accepts: multipart/form-data with a single "file" field (images only, max 5 MB).

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { getRouteUser } from '@/lib/supabaseRoute'

const MAX_SIZE    = 5 * 1024 * 1024
const ALLOWED     = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const BUCKET      = 'avatars'

export async function POST(request) {
  const { user } = await getRouteUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file     = formData.get('file')

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Maximum size is 5 MB.' }, { status: 400 })
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: 'Only JPEG, PNG, WebP and GIF images are allowed.' }, { status: 400 })
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

  // Bust CDN cache by appending a timestamp query param
  const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`

  return NextResponse.json({ url: publicUrl })
}
