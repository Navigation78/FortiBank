// src/lib/storage.js
// Supabase Storage helpers for file upload and URL generation


import supabaseAdmin from '@/lib/supabaseAdmin'

const BUCKETS = {
  CERTIFICATES: 'certificates',
  MODULES:      'module-content',
}

/**
 * Uploads a certificate PDF to Supabase Storage
 * Returns the public URL
 */
export async function uploadCertificate({ userId, certificateNo, pdfBytes }) {
  const fileName = `${certificateNo}.pdf`
  const filePath = `${userId}/${fileName}`

  const { error } = await supabaseAdmin.storage
    .from(BUCKETS.CERTIFICATES)
    .upload(filePath, pdfBytes, {
      contentType: 'application/pdf',
      upsert: true,
    })

  if (error) {
    console.error('Certificate upload error:', error)
    return { url: null, error: error.message }
  }

  const { data } = supabaseAdmin.storage
    .from(BUCKETS.CERTIFICATES)
    .getPublicUrl(filePath)

  return { url: data.publicUrl, error: null }
}

/**
 * Uploads a module content file (PDF, image, video)
 * Returns the public URL
 */
export async function uploadModuleContent({ moduleId, file, fileName, contentType }) {
  const filePath = `${moduleId}/${Date.now()}-${fileName}`

  const { error } = await supabaseAdmin.storage
    .from(BUCKETS.MODULES)
    .upload(filePath, file, { contentType, upsert: false })

  if (error) {
    return { url: null, error: error.message }
  }

  const { data } = supabaseAdmin.storage
    .from(BUCKETS.MODULES)
    .getPublicUrl(filePath)

  return { url: data.publicUrl, error: null }
}

/**
 * Deletes a file from Supabase Storage
 */
export async function deleteFile({ bucket, filePath }) {
  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .remove([filePath])

  return { error: error?.message || null }
}