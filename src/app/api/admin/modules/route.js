// src/app/api/admin/modules/route.js
// GET  - all modules with content and role access
// POST - create new module with content blocks and role access

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

export const GET = withApiHandler(async (request) => {
  const admin = await verifyAdmin(request)
  if (admin instanceof Response) return admin
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('modules')
    .select(`
      id, title, description, status, order_index, duration_mins, created_at,
      module_content ( id, title, content_type, order_index ),
      module_role_access ( role_id, roles ( display_name ) )
    `)
    .order('order_index')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ modules: data })
})

export const POST = withApiHandler(async (request) => {
  const admin = await verifyAdmin(request)
  if (admin instanceof Response) return admin
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { title, description, duration_mins, status, content_blocks, role_ids } = body

  if (!title) {
    throw new ValidationError('Title is required', { field: 'title' })
  }
  if (!Array.isArray(role_ids) || role_ids.length === 0) {
    throw new ValidationError('Select at least one role for this module', { field: 'role_ids' })
  }

  const { data: existingModules, error: existingError } = await supabaseAdmin
    .from('modules')
    .select('order_index')
    .order('order_index', { ascending: true })

  if (existingError) return NextResponse.json({ error: existingError.message }, { status: 500 })

  const usedIndexes = (existingModules || [])
    .map(m => Number.isInteger(m.order_index) ? m.order_index : null)
    .filter(Boolean)

  let orderIndex = 1
  while (usedIndexes.includes(orderIndex)) orderIndex += 1

  const { data: module, error: moduleError } = await supabaseAdmin
    .from('modules')
    .insert({ title, description, duration_mins, status: status || 'draft', order_index: orderIndex, created_by: admin.id })
    .select()
    .single()

  if (moduleError) return NextResponse.json({ error: moduleError.message }, { status: 500 })

  if (content_blocks && content_blocks.length > 0) {
    const blocks = content_blocks
      .filter(b => b.title)
      .map((b, i) => ({
        module_id:           module.id,
        title:               b.title,
        content_type:        b.content_type,
        content_url:         b.content_url  || null,
        content_body:        b.content_body || null,
        order_index:         i,
        section_number:      b.section_number      || null,
        learning_objectives: b.learning_objectives || [],
        image_caption:       b.image_caption       || null,
      }))

    if (blocks.length > 0) {
      const { error: contentError } = await supabaseAdmin.from('module_content').insert(blocks)
      if (contentError) {
        await supabaseAdmin.from('modules').delete().eq('id', module.id)
        return NextResponse.json({ error: contentError.message }, { status: 500 })
      }
    }
  }

  const uniqueRoleIds = [...new Set(role_ids.map(roleId => Number(roleId)).filter(Number.isInteger))]
  if (uniqueRoleIds.length === 0) {
    await supabaseAdmin.from('modules').delete().eq('id', module.id)
    return NextResponse.json({ error: 'Select at least one valid role for this module' }, { status: 400 })
  }

  const { error: roleAccessError } = await supabaseAdmin
    .from('module_role_access')
    .insert(uniqueRoleIds.map(roleId => ({ module_id: module.id, role_id: roleId })))

  if (roleAccessError) {
    await supabaseAdmin.from('modules').delete().eq('id', module.id)
    return NextResponse.json({ error: roleAccessError.message }, { status: 500 })
  }

  if ((status || 'draft') === 'published' && uniqueRoleIds.length > 0) {
    await notifyUsersWithRoles(uniqueRoleIds, {
      title:   `New module available: ${title}`,
      message: description
        ? `A new training module has been assigned to you: "${title}". ${description}`
        : `A new training module has been assigned to you: "${title}". Log in to start learning.`,
      type:    NOTIFICATION_TYPES.MODULE,
      link:    `/modules/${module.id}`,
    })
  }

  return NextResponse.json({ module }, { status: 201 })
})
