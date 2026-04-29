import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { DEFAULT_ROLE_DEFINITIONS, ROLES } from '@/constants/roles'

async function getAuthenticatedAdmin() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: cookiesToSet => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const { data: adminCheck, error: roleError } = await supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', user.id)
    .single()

  if (roleError || adminCheck?.roles?.name !== ROLES.SYSTEM_ADMIN) {
    return { error: NextResponse.json({ error: 'Admin access required' }, { status: 403 }) }
  }

  return { user }
}

export async function GET() {
  const auth = await getAuthenticatedAdmin()

  if (auth.error) {
    return auth.error
  }

  const { data: existingRoles, error: fetchError } = await supabaseAdmin
    .from('roles')
    .select('id, name, display_name, category')
    .order('id')

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  const shouldSyncDefaults =
    !existingRoles ||
    existingRoles.length < DEFAULT_ROLE_DEFINITIONS.length ||
    DEFAULT_ROLE_DEFINITIONS.some(defaultRole => {
      const existingRole = existingRoles.find(role => role.name === defaultRole.name)
      return !existingRole ||
        existingRole.display_name !== defaultRole.display_name ||
        existingRole.category !== defaultRole.category
    })

  if (shouldSyncDefaults) {
    const { error: upsertError } = await supabaseAdmin
      .from('roles')
      .upsert(DEFAULT_ROLE_DEFINITIONS, { onConflict: 'name' })

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 })
    }
  }

  const { data: roles, error: refreshedError } = await supabaseAdmin
    .from('roles')
    .select('id, name, display_name, category')
    .order('id')

  if (refreshedError) {
    return NextResponse.json({ error: refreshedError.message }, { status: 500 })
  }

  return NextResponse.json({ roles })
}
