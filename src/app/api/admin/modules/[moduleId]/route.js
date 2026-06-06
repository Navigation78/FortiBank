// src/app/api/admin/modules/[moduleId]/route.js
// PUT    - update a module
// DELETE - delete a module

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'
import { notifyUsersWithRoles, NOTIFICATION_TYPES } from '@/lib/notificationService'
import { withApiHandler } from '@/lib/apiHandler'
import { ValidationError } from '@/lib/errors'

async function verifyAdmin(request) {
  const { user, networkError } = await getRouteUser(request)
  if (!user) return networkError ? unauthorizedResponse(true) : null
  const { data: roleData } = await supabaseAdmin
    .from('user_roles').select('roles(name)').eq('user_id', user.id).single()
  if (roleData?.roles?.name !== 'system_admin') return null
  return user
}

export const PUT = withApiHandler(async (request, { params }) => {
  const admin = await verifyAdmin(request)
  if (admin instanceof Response) return admin
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { moduleId } = await params
  const body = await request.json()
  const { title, description, duration_mins, status, content_blocks, role_ids } = body

  if (!title) {
    throw new ValidationError('Title is required', { field: 'title' })
  }
  if (!Array.isArray(role_ids) || role_ids.length === 0) {
    throw new ValidationError('Select at least one role for this module', { field: 'role_ids' })
  }

  const uniqueRoleIds = [...new Set(role_ids.map(roleId => Number(roleId)).filter(Number.isInteger))]
  if (uniqueRoleIds.length === 0) {
    throw new ValidationError('Select at least one valid role for this module', { field: 'role_ids' })
  }

  const { data: existingModule, error: fetchError } = await supabaseAdmin
    .from('modules')
    .select('id, status, title')
    .eq('id', moduleId)
    .single()

  if (fetchError || !existingModule) {
    return NextResponse.json({ error: 'Module not found' }, { status: 404 })
  }

  const { data: updatedModule, error: moduleError } = await supabaseAdmin
    .from('modules')
    .update({ title, description, duration_mins, status: status || 'draft' })
    .eq('id', moduleId)
    .select()
    .single()

  if (moduleError) return NextResponse.json({ error: moduleError.message }, { status: 500 })

  const { error: deleteContentError } = await supabaseAdmin
    .from('module_content')
    .delete()
    .eq('module_id', moduleId)

  if (deleteContentError) {
    return NextResponse.json({ error: deleteContentError.message }, { status: 500 })
  }

  const blocks = (content_blocks || [])
    .filter(block => block.title)
    .map((block, index) => ({
      module_id:           moduleId,
      title:               block.title,
      content_type:        block.content_type,
      content_url:         block.content_url  || null,
      content_body:        block.content_body || null,
      order_index:         index,
      section_number:      block.section_number      || null,
      learning_objectives: block.learning_objectives || [],
      image_caption:       block.image_caption       || null,
    }))

  if (blocks.length > 0) {
    const { error: contentError } = await supabaseAdmin.from('module_content').insert(blocks)
    if (contentError) return NextResponse.json({ error: contentError.message }, { status: 500 })
  }

  const { error: deleteAccessError } = await supabaseAdmin
    .from('module_role_access')
    .delete()
    .eq('module_id', moduleId)

  if (deleteAccessError) {
    return NextResponse.json({ error: deleteAccessError.message }, { status: 500 })
  }

  const { error: roleAccessError } = await supabaseAdmin
    .from('module_role_access')
    .insert(uniqueRoleIds.map(roleId => ({ module_id: moduleId, role_id: roleId })))

  if (roleAccessError) {
    return NextResponse.json({ error: roleAccessError.message }, { status: 500 })
  }

  const wasPublished = existingModule.status !== 'published' && (status || 'draft') === 'published'
  if (wasPublished && uniqueRoleIds.length > 0) {
    await notifyUsersWithRoles(uniqueRoleIds, {
      title:   `New module available: ${title}`,
      message: description
        ? `A new training module has been assigned to you: "${title}". ${description}`
        : `A new training module has been assigned to you: "${title}". Log in to start learning.`,
      type:    NOTIFICATION_TYPES.MODULE,
      link:    `/modules/${moduleId}`,
    })
  }

  return NextResponse.json({ module: updatedModule })
})

export const DELETE = withApiHandler(async (request, { params }) => {
  const admin = await verifyAdmin(request)
  if (admin instanceof Response) return admin
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { moduleId } = await params

  const { error } = await supabaseAdmin
    .from('modules')
    .delete()
    .eq('id', moduleId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
})
