-- 022_exam_pass_score.sql
-- Raise the pass threshold for all existing final_exam quizzes to 80%.
-- Checkpoints keep their existing pass_score (typically 70%).

UPDATE public.quizzes
  SET pass_score = 80
WHERE quiz_type = 'final_exam'
  AND pass_score < 80;
