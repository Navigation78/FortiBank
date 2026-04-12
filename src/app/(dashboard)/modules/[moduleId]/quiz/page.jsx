// src/app/(dashboard)/modules/[moduleId]/quiz/page.jsx
import { redirect } from 'next/navigation'
export default function QuizPage({ params }) {
  redirect(`/modules/${params.moduleId}`)
}