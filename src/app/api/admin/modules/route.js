// src/app/api/admin/modules/route.js
// GET  — all modules with content and role access
// POST — create new module with content blocks and role access

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import supabaseAdmin from '@/lib/supabaseAdmin'

async function verifyAdmin(cookieStore) {
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
  if (!user) return null
  const { data: roleData } = await supabaseAdmin
    .from('user_roles').select('roles(name)').eq('user_id', user.id).single()
  if (roleData?.roles?.name !== 'system_admin') return null
  return user
}

export async function GET() {
  const cookieStore = await cookies()
  const admin = await verifyAdmin(cookieStore)
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
}

export async function POST(request) {
  const cookieStore = await cookies()
  const admin = await verifyAdmin(cookieStore)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { title, description, duration_mins, status, content_blocks, role_ids } = body

  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

  // 1. Get next order_index
  const { data: lastModule } = await supabaseAdmin
    .from('modules').select('order_index').order('order_index', { ascending: false }).limit(1).single()
  const orderIndex = (lastModule?.order_index || 0) + 1

  // 2. Create module
  const { data: module, error: moduleError } = await supabaseAdmin
    .from('modules')
    .insert({ title, description, duration_mins, status: status || 'draft', order_index: orderIndex, created_by: admin.id })
    .select()
    .single()

  if (moduleError) return NextResponse.json({ error: moduleError.message }, { status: 500 })

  // 3. Insert content blocks
  if (content_blocks && content_blocks.length > 0) {
    const blocks = content_blocks
      .filter(b => b.title)
      .map((b, i) => ({
        module_id:    module.id,
        title:        b.title,
        content_type: b.content_type,
        content_url:  b.content_url || null,
        content_body: b.content_body || null,
        order_index:  i,
      }))

    if (blocks.length > 0) {
      await supabaseAdmin.from('module_content').insert(blocks)
    }
  }

  // 4. Assign role access
  if (role_ids && role_ids.length > 0) {
    await supabaseAdmin
      .from('module_role_access')
      .insert(role_ids.map(roleId => ({ module_id: module.id, role_id: roleId })))
  }

  return NextResponse.json({ module }, { status: 201 })
}