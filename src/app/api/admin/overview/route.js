import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { ROLES } from '@/constants/roles'

export async function GET() {
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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: adminCheck, error: roleError } = await supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', user.id)
    .single()

  if (roleError || adminCheck?.roles?.name !== ROLES.SYSTEM_ADMIN) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const [usersRes, modulesRes, campaignsRes, scoresRes] = await Promise.all([
    supabaseAdmin
      .from('users')
      .select('id, is_active, created_at')
      .order('created_at', { ascending: false }),
    supabaseAdmin
      .from('modules')
      .select('id, status'),
    supabaseAdmin
      .from('phishing_campaigns')
      .select('id, status'),
    supabaseAdmin
      .from('risk_scores')
      .select('user_id, composite_score, is_critical, calculated_at')
      .order('calculated_at', { ascending: false }),
  ])

  const firstError =
    usersRes.error ||
    modulesRes.error ||
    campaignsRes.error ||
    scoresRes.error

  if (firstError) {
    return NextResponse.json({ error: firstError.message }, { status: 500 })
  }

  const users = usersRes.data || []
  const modules = modulesRes.data || []
  const campaigns = campaignsRes.data || []
  const scores = scoresRes.data || []

  const latestScores = {}
  scores.forEach(score => {
    if (!latestScores[score.user_id]) {
      latestScores[score.user_id] = score
    }
  })

  const latestScoreList = Object.values(latestScores)
  const criticalUsers = latestScoreList.filter(score => score.is_critical).length
  const avgRiskScore = latestScoreList.length > 0
    ? Math.round(
        latestScoreList.reduce((sum, score) => sum + score.composite_score, 0) /
        latestScoreList.length
      )
    : 0

  return NextResponse.json({
    stats: {
      totalUsers: users.filter(userRow => userRow.is_active).length,
      totalModules: modules.length,
      publishedModules: modules.filter(module => module.status === 'published').length,
      activeCampaigns: campaigns.filter(campaign => campaign.status === 'active').length,
      totalCampaigns: campaigns.length,
      criticalUsers,
      avgRiskScore,
    },
  })
}
