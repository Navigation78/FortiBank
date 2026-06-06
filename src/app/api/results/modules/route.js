// src/app/api/results/modules/route.js
// GET /api/results/modules - full learning journey results for current user

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'
import { withApiHandler } from '@/lib/apiHandler'

export const GET = withApiHandler(async (request) => {
  const { user, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  const [progressRes, quizRes, kcRes] = await Promise.all([
    supabaseAdmin
      .from('user_module_progress')
      .select('module_id, status, progress_pct, started_at, completed_at')
      .eq('user_id', user.id),

    supabaseAdmin
      .from('quiz_attempts')
      .select(`
        id, score_pct, passed, attempt_number, submitted_at, pass_score,
        quizzes ( id, title, quiz_type, section_number, module_id, pass_score, max_attempts )
      `)
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false }),

    supabaseAdmin
      .from('knowledge_check_attempts')
      .select('id, module_id, content_id, section_number, content_title, score_pct, passed, correct_count, total_count, submitted_at')
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false }),
  ])

  const moduleIdSet = new Set([
    ...(progressRes.data  || []).map(p => p.module_id),
    ...(quizRes.data      || []).filter(a => a.quizzes?.module_id).map(a => a.quizzes.module_id),
    ...(kcRes.data        || []).map(a => a.module_id),
  ])

  if (moduleIdSet.size === 0) return NextResponse.json({ modules: [] })

  const { data: modules, error: modError } = await supabaseAdmin
    .from('modules')
    .select(`
      id, title, order_index,
      module_content ( id, title, content_type, section_number, order_index ),
      quizzes ( id, title, quiz_type, section_number, pass_score, max_attempts )
    `)
    .in('id', [...moduleIdSet])
    .eq('status', 'published')

  if (modError || !modules) return NextResponse.json({ modules: [] })

  const progressByModule = Object.fromEntries(
    (progressRes.data || []).map(p => [p.module_id, p])
  )

  const bestByQuizId  = {}
  const countByQuizId = {}
  for (const a of quizRes.data || []) {
    const qId = a.quizzes?.id
    if (!qId) continue
    countByQuizId[qId] = (countByQuizId[qId] || 0) + 1
    if (!bestByQuizId[qId] || a.score_pct > bestByQuizId[qId].score_pct) {
      bestByQuizId[qId] = a
    }
  }

  const bestKcByKey = {}
  for (const kc of kcRes.data || []) {
    const key = kc.content_id || `${kc.module_id}:${kc.section_number}`
    if (!bestKcByKey[key] || kc.score_pct > bestKcByKey[key].score_pct) {
      bestKcByKey[key] = kc
    }
  }

  const result = modules.map(mod => {
    const content    = [...(mod.module_content || [])].sort((a, b) => a.order_index - b.order_index)
    const allQuizzes = mod.quizzes || []
    const checkpoints = allQuizzes.filter(q => q.quiz_type === 'checkpoint')
    const finalExam   = allQuizzes.find(q => !q.quiz_type || q.quiz_type === 'final_exam') || null
    const progress    = progressByModule[mod.id] || { status: 'not_started', progress_pct: 0 }

    const topics = []
    let curTopic = null
    for (const sec of content) {
      const n = (sec.section_number || '').trim()
      if (/^\d+\.0$/.test(n)) {
        curTopic = { number: n, title: sec.title, subtopics: [] }
        topics.push(curTopic)
      } else if (sec.content_type === 'knowledge_check') {
        if (!curTopic) {
          curTopic = { number: '1.0', title: 'Module', subtopics: [] }
          topics.push(curTopic)
        }
        const kcKey = sec.id || `${mod.id}:${sec.section_number}`
        curTopic.subtopics.push({
          content_id:     sec.id,
          section_number: sec.section_number,
          title:          sec.title || 'Knowledge Check',
          kc_result:      bestKcByKey[kcKey] || null,
        })
      }
    }

    for (const topic of topics) {
      const cp = checkpoints.find(q => q.section_number === topic.number)
      topic.checkpoint_quiz          = cp || null
      topic.checkpoint_result        = cp ? (bestByQuizId[cp.id] || null) : null
      topic.checkpoint_attempt_count = cp ? (countByQuizId[cp.id]  || 0)  : 0
    }

    const feResult       = finalExam ? (bestByQuizId[finalExam.id] || null) : null
    const feAttemptCount = finalExam ? (countByQuizId[finalExam.id]  || 0)  : 0

    return {
      id:                       mod.id,
      title:                    mod.title,
      order_index:              mod.order_index,
      progress_pct:             progress.progress_pct  || 0,
      status:                   progress.status        || 'not_started',
      completed_at:             progress.completed_at  || null,
      topics,
      final_exam_quiz:          finalExam,
      final_exam_result:        feResult,
      final_exam_attempt_count: feAttemptCount,
    }
  })

  const ORDER = { in_progress: 0, completed: 1, not_started: 2 }
  result.sort((a, b) => {
    const diff = (ORDER[a.status] ?? 2) - (ORDER[b.status] ?? 2)
    return diff !== 0 ? diff : a.order_index - b.order_index
  })

  return NextResponse.json({ modules: result })
})
