--
-- seed.sql
-- Sample data for development & testing
-- 
-- NOTE: Run AFTER all migrations. Uses Supabase admin client
-- to create auth users, then seeds public tables.
-- 

-- ── Sample Modules ───────────────────────────────────────────
INSERT INTO public.modules (id, title, description, status, order_index, duration_mins)
VALUES
  ('11111111-0000-0000-0000-000000000001', 'Introduction to Cybersecurity',         'Core concepts every bank employee must know.',                    'published', 1, 20),
  ('11111111-0000-0000-0000-000000000002', 'Phishing Awareness & Email Safety',     'Recognising and reporting phishing attempts.',                     'published', 2, 30),
  ('11111111-0000-0000-0000-000000000003', 'Password Security & Multi-Factor Auth', 'Best practices for credentials and MFA setup.',                   'published', 3, 25),
  ('11111111-0000-0000-0000-000000000004', 'Social Engineering Tactics',            'How attackers manipulate people — not just systems.',             'published', 4, 30),
  ('11111111-0000-0000-0000-000000000005', 'Data Handling & Privacy Regulations',   'GDPR, PCI-DSS, and safe data practices.',                         'published', 5, 35),
  ('11111111-0000-0000-0000-000000000006', 'Insider Threats & Access Control',      'Recognising and preventing insider threat scenarios.',             'published', 6, 30),
  ('11111111-0000-0000-0000-000000000007', 'Executive Cyber Risk Management',       'Strategic cyber risk for senior leadership.',                     'published', 7, 40),
  ('11111111-0000-0000-0000-000000000008', 'Incident Response Procedures',          'What to do when a security incident occurs.',                     'published', 8, 25);

-- ── Module Role Access ───────────────────────────────────────
-- All roles get modules 1-3 (universal basics)
-- Teller: + module 4 (social engineering)
-- Loan Officer: + modules 4, 5 (social eng + data privacy)
-- Manager: + modules 4, 5, 6 (+ insider threats)
-- Executive: + modules 5, 6, 7 (data, insider, exec risk)
-- IT/Admin: + modules 6, 8 (insider + incident response)

DO $$
DECLARE
  teller_id        INT := (SELECT id FROM public.roles WHERE name = 'teller');
  loan_officer_id  INT := (SELECT id FROM public.roles WHERE name = 'loan_officer');
  manager_id       INT := (SELECT id FROM public.roles WHERE name = 'manager');
  executive_id     INT := (SELECT id FROM public.roles WHERE name = 'executive');
  admin_id         INT := (SELECT id FROM public.roles WHERE name = 'admin');
  it_id            INT := (SELECT id FROM public.roles WHERE name = 'it_professional');
  admin_role_id    INT := (SELECT id FROM public.roles WHERE name = 'administration');
BEGIN
  -- Universal modules 1-3 for all roles
  INSERT INTO public.module_role_access (module_id, role_id)
  SELECT m.id, r.id
  FROM public.modules m, public.roles r
  WHERE m.order_index BETWEEN 1 AND 3
  ON CONFLICT DO NOTHING;

  -- Teller: module 4
  INSERT INTO public.module_role_access (module_id, role_id) VALUES
    ('11111111-0000-0000-0000-000000000004', teller_id)
  ON CONFLICT DO NOTHING;

  -- Loan Officer: modules 4, 5
  INSERT INTO public.module_role_access (module_id, role_id) VALUES
    ('11111111-0000-0000-0000-000000000004', loan_officer_id),
    ('11111111-0000-0000-0000-000000000005', loan_officer_id)
  ON CONFLICT DO NOTHING;

  -- Manager: modules 4, 5, 6
  INSERT INTO public.module_role_access (module_id, role_id) VALUES
    ('11111111-0000-0000-0000-000000000004', manager_id),
    ('11111111-0000-0000-0000-000000000005', manager_id),
    ('11111111-0000-0000-0000-000000000006', manager_id)
  ON CONFLICT DO NOTHING;

  -- Executive: modules 5, 6, 7
  INSERT INTO public.module_role_access (module_id, role_id) VALUES
    ('11111111-0000-0000-0000-000000000005', executive_id),
    ('11111111-0000-0000-0000-000000000006', executive_id),
    ('11111111-0000-0000-0000-000000000007', executive_id)
  ON CONFLICT DO NOTHING;

  -- IT Professional: modules 6, 8
  INSERT INTO public.module_role_access (module_id, role_id) VALUES
    ('11111111-0000-0000-0000-000000000006', it_id),
    ('11111111-0000-0000-0000-000000000008', it_id)
  ON CONFLICT DO NOTHING;

  -- Admin: all modules
  INSERT INTO public.module_role_access (module_id, role_id)
  SELECT m.id, admin_id FROM public.modules m
  ON CONFLICT DO NOTHING;
END $$;

-- ── Sample Quizzes ───────────────────────────────────────────
INSERT INTO public.quizzes (id, module_id, title, pass_score, max_attempts, time_limit_mins)
VALUES
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Cybersecurity Basics Quiz',       70, 3, 10),
  ('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000002', 'Phishing Awareness Quiz',         75, 3, 15),
  ('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000003', 'Password & MFA Quiz',             70, 3, 10),
  ('22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000004', 'Social Engineering Quiz',         75, 3, 15),
  ('22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000005', 'Data Privacy & PCI-DSS Quiz',     80, 3, 15),
  ('22222222-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000006', 'Insider Threat Quiz',             80, 3, 15),
  ('22222222-0000-0000-0000-000000000007', '11111111-0000-0000-0000-000000000007', 'Executive Risk Management Quiz',  80, 3, 20);

-- ── Sample Questions for Phishing Quiz ───────────────────────
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, explanation, order_index, points)
VALUES
  ('33333333-0000-0000-0000-000000000001',
   '22222222-0000-0000-0000-000000000002',
   'An email from "IT-Support@b4nk-secure.com" asks you to reset your password urgently. What should you do?',
   'multiple_choice',
   'Legitimate IT departments never use urgency tactics or unofficial domains. Always verify via a known phone number.',
   1, 2),

  ('33333333-0000-0000-0000-000000000002',
   '22222222-0000-0000-0000-000000000002',
   'Which of the following are red flags in a phishing email? (Select all that apply)',
   'multi_select',
   'Urgency, misspelled domains, unexpected attachments, and generic greetings are all classic phishing indicators.',
   2, 3),

  ('33333333-0000-0000-0000-000000000003',
   '22222222-0000-0000-0000-000000000002',
   'Hovering over a link before clicking it can reveal its true destination.',
   'true_false',
   'True — always hover before clicking. If the URL looks suspicious or mismatched, do not click.',
   3, 1);

-- Options for Q1
INSERT INTO public.quiz_options (question_id, option_text, is_correct, order_index) VALUES
  ('33333333-0000-0000-0000-000000000001', 'Click the link immediately to avoid account lockout',         FALSE, 1),
  ('33333333-0000-0000-0000-000000000001', 'Report the email to IT security and delete it',               TRUE,  2),
  ('33333333-0000-0000-0000-000000000001', 'Forward it to colleagues to warn them',                       FALSE, 3),
  ('33333333-0000-0000-0000-000000000001', 'Reply asking for more details',                               FALSE, 4);

-- Options for Q2 (multi-select)
INSERT INTO public.quiz_options (question_id, option_text, is_correct, order_index) VALUES
  ('33333333-0000-0000-0000-000000000002', 'Urgent language like "Act Now!" or "Your account will be closed"', TRUE,  1),
  ('33333333-0000-0000-0000-000000000002', 'Sender email domain is slightly misspelled',                       TRUE,  2),
  ('33333333-0000-0000-0000-000000000002', 'Email is from your manager''s correct address',                    FALSE, 3),
  ('33333333-0000-0000-0000-000000000002', 'Unexpected attachment from an unknown sender',                     TRUE,  4);

-- Options for Q3 (true/false)
INSERT INTO public.quiz_options (question_id, option_text, is_correct, order_index) VALUES
  ('33333333-0000-0000-0000-000000000002', 'True',  TRUE,  1),
  ('33333333-0000-0000-0000-000000000002', 'False', FALSE, 2);

-- ── Sample Phishing Campaign ─────────────────────────────────
INSERT INTO public.phishing_campaigns (
  id, name, description, status,
  email_subject, email_sender_name, email_sender_addr, email_body_html,
  target_role_ids
)
VALUES (
  '44444444-0000-0000-0000-000000000001',
  'Q1 IT Password Reset Campaign',
  'Simulated IT helpdesk phishing targeting all front-line staff.',
  'draft',
  'URGENT: Your bank account password expires in 24 hours',
  'IT Helpdesk',
  'helpdesk@bank-it-support.com',
  '<p>Dear {{name}},</p>
   <p>Our security system has detected that your password will expire in <strong>24 hours</strong>.</p>
   <p>To avoid losing access to banking systems, please reset your password immediately:</p>
   <p><a href="{{phishing_link}}">Reset My Password Now</a></p>
   <p>If you do not reset within 24 hours, your account will be locked.</p>
   <p>IT Helpdesk Team</p>',
  ARRAY[
    (SELECT id FROM public.roles WHERE name = 'teller'),
    (SELECT id FROM public.roles WHERE name = 'loan_officer')
  ]
);