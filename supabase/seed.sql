-- ============================================================
-- seed.sql
-- Sample data for development & testing
-- ============================================================

-- ── Sample Modules ───────────────────────────────────────────
INSERT INTO public.modules (id, title, description, status, order_index, duration_mins)
VALUES
  ('11111111-0000-0000-0000-000000000001', 'Introduction to Cybersecurity',
   'Core concepts every bank employee must know.', 'published', 1, 20),

  ('11111111-0000-0000-0000-000000000002', 'Phishing Awareness & Email Safety',
   'Recognising and reporting phishing attempts.', 'published', 2, 30),

  ('11111111-0000-0000-0000-000000000003', 'Password Security & Multi-Factor Auth',
   'Best practices for credentials and MFA setup.', 'published', 3, 25),

  ('11111111-0000-0000-0000-000000000004', 'Social Engineering Tactics',
   'How attackers manipulate people — not just systems.', 'published', 4, 30),

  ('11111111-0000-0000-0000-000000000005', 'Data Handling & Privacy Regulations',
   'Data protection, confidentiality and safe handling practices.', 'published', 5, 35),

  ('11111111-0000-0000-0000-000000000006', 'Document Fraud & Identity Verification',
   'Spotting fraudulent documents and identity theft in credit and account processes.', 'published', 6, 30),

  ('11111111-0000-0000-0000-000000000007', 'Insider Threats & Access Control',
   'Recognising and preventing insider threat scenarios.', 'published', 7, 30),

  ('11111111-0000-0000-0000-000000000008', 'Branch Leadership & Cyber Risk Management',
   'Strategic cyber risk oversight for branch leadership.', 'published', 8, 40),

  ('11111111-0000-0000-0000-000000000009', 'Customer Interaction Security',
   'Securing customer-facing interactions and protecting sensitive data at the counter.', 'published', 9, 25),

  ('11111111-0000-0000-0000-000000000010', 'Vault & Cash Handling Security',
   'Physical and cyber security procedures for vault custodians and head tellers.', 'published', 10, 25);

-- ── Module Role Access ───────────────────────────────────────
-- Modules 1-3: Universal — every employee role gets these
-- Additional modules assigned by role category

DO $$
DECLARE
  -- Leadership
  v_branch_manager          INT := (SELECT id FROM public.roles WHERE name = 'branch_manager');
  v_asst_branch_manager     INT := (SELECT id FROM public.roles WHERE name = 'assistant_branch_manager');

  -- Departmental Heads
  v_credit_manager          INT := (SELECT id FROM public.roles WHERE name = 'credit_manager');
  v_cs_manager              INT := (SELECT id FROM public.roles WHERE name = 'customer_service_manager');
  v_relationship_manager    INT := (SELECT id FROM public.roles WHERE name = 'relationship_manager');

  -- Professional Staff
  v_relationship_officer    INT := (SELECT id FROM public.roles WHERE name = 'relationship_officer');
  v_credit_officer          INT := (SELECT id FROM public.roles WHERE name = 'credit_officer');
  v_service_recovery_officer INT := (SELECT id FROM public.roles WHERE name = 'service_recovery_officer');

  -- Frontline
  v_head_teller             INT := (SELECT id FROM public.roles WHERE name = 'head_teller');
  v_teller                  INT := (SELECT id FROM public.roles WHERE name = 'teller');
  v_cs_assistant            INT := (SELECT id FROM public.roles WHERE name = 'customer_service_assistant');

BEGIN
  -- ── Universal modules 1-3 for all employee roles ─────────
  INSERT INTO public.module_role_access (module_id, role_id)
  SELECT m.id, r.id
  FROM public.modules m
  CROSS JOIN public.roles r
  WHERE m.order_index BETWEEN 1 AND 3
    AND r.has_modules = TRUE
  ON CONFLICT DO NOTHING;

  -- ── Leadership: modules 4, 5, 7, 8 ──────────────────────
  -- Social engineering, data handling, insider threats, leadership risk
  INSERT INTO public.module_role_access (module_id, role_id) VALUES
    ('11111111-0000-0000-0000-000000000004', v_branch_manager),
    ('11111111-0000-0000-0000-000000000005', v_branch_manager),
    ('11111111-0000-0000-0000-000000000007', v_branch_manager),
    ('11111111-0000-0000-0000-000000000008', v_branch_manager),

    ('11111111-0000-0000-0000-000000000004', v_asst_branch_manager),
    ('11111111-0000-0000-0000-000000000005', v_asst_branch_manager),
    ('11111111-0000-0000-0000-000000000007', v_asst_branch_manager),
    ('11111111-0000-0000-0000-000000000008', v_asst_branch_manager)
  ON CONFLICT DO NOTHING;

  -- ── Credit Manager: modules 4, 5, 6, 7 ──────────────────
  -- Social engineering, data, document fraud, insider threats
  INSERT INTO public.module_role_access (module_id, role_id) VALUES
    ('11111111-0000-0000-0000-000000000004', v_credit_manager),
    ('11111111-0000-0000-0000-000000000005', v_credit_manager),
    ('11111111-0000-0000-0000-000000000006', v_credit_manager),
    ('11111111-0000-0000-0000-000000000007', v_credit_manager)
  ON CONFLICT DO NOTHING;

  -- ── Customer Service Manager: modules 4, 5, 7, 9 ────────
  -- Social engineering, data, insider threats, customer interaction
  INSERT INTO public.module_role_access (module_id, role_id) VALUES
    ('11111111-0000-0000-0000-000000000004', v_cs_manager),
    ('11111111-0000-0000-0000-000000000005', v_cs_manager),
    ('11111111-0000-0000-0000-000000000007', v_cs_manager),
    ('11111111-0000-0000-0000-000000000009', v_cs_manager)
  ON CONFLICT DO NOTHING;

  -- ── Relationship Manager: modules 4, 5, 6, 7 ────────────
  -- Social engineering, data, document fraud, insider threats
  INSERT INTO public.module_role_access (module_id, role_id) VALUES
    ('11111111-0000-0000-0000-000000000004', v_relationship_manager),
    ('11111111-0000-0000-0000-000000000005', v_relationship_manager),
    ('11111111-0000-0000-0000-000000000006', v_relationship_manager),
    ('11111111-0000-0000-0000-000000000007', v_relationship_manager)
  ON CONFLICT DO NOTHING;

  -- ── Relationship Officer: modules 4, 5, 6 ───────────────
  -- Social engineering, data handling, document fraud
  INSERT INTO public.module_role_access (module_id, role_id) VALUES
    ('11111111-0000-0000-0000-000000000004', v_relationship_officer),
    ('11111111-0000-0000-0000-000000000005', v_relationship_officer),
    ('11111111-0000-0000-0000-000000000006', v_relationship_officer)
  ON CONFLICT DO NOTHING;

  -- ── Credit Officer: modules 4, 5, 6 ─────────────────────
  -- Social engineering, data handling, document fraud
  INSERT INTO public.module_role_access (module_id, role_id) VALUES
    ('11111111-0000-0000-0000-000000000004', v_credit_officer),
    ('11111111-0000-0000-0000-000000000005', v_credit_officer),
    ('11111111-0000-0000-0000-000000000006', v_credit_officer)
  ON CONFLICT DO NOTHING;

  -- ── Service Recovery Officer: modules 4, 5, 9 ───────────
  -- Social engineering, data handling, customer interaction
  INSERT INTO public.module_role_access (module_id, role_id) VALUES
    ('11111111-0000-0000-0000-000000000004', v_service_recovery_officer),
    ('11111111-0000-0000-0000-000000000005', v_service_recovery_officer),
    ('11111111-0000-0000-0000-000000000009', v_service_recovery_officer)
  ON CONFLICT DO NOTHING;

  -- ── Head Teller: modules 4, 9, 10 ───────────────────────
  -- Social engineering, customer interaction, vault security
  INSERT INTO public.module_role_access (module_id, role_id) VALUES
    ('11111111-0000-0000-0000-000000000004', v_head_teller),
    ('11111111-0000-0000-0000-000000000009', v_head_teller),
    ('11111111-0000-0000-0000-000000000010', v_head_teller)
  ON CONFLICT DO NOTHING;

  -- ── Teller: modules 4, 9 ────────────────────────────────
  -- Social engineering, customer interaction security
  INSERT INTO public.module_role_access (module_id, role_id) VALUES
    ('11111111-0000-0000-0000-000000000004', v_teller),
    ('11111111-0000-0000-0000-000000000009', v_teller)
  ON CONFLICT DO NOTHING;

  -- ── Customer Service Assistant: modules 4, 9 ────────────
  -- Social engineering, customer interaction security
  INSERT INTO public.module_role_access (module_id, role_id) VALUES
    ('11111111-0000-0000-0000-000000000004', v_cs_assistant),
    ('11111111-0000-0000-0000-000000000009', v_cs_assistant)
  ON CONFLICT DO NOTHING;

END $$;

-- ── Sample Quizzes ───────────────────────────────────────────
INSERT INTO public.quizzes (id, module_id, title, pass_score, max_attempts, time_limit_mins)
VALUES
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Cybersecurity Basics Quiz',             70, 3, 10),
  ('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000002', 'Phishing Awareness Quiz',               75, 3, 15),
  ('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000003', 'Password & MFA Quiz',                   70, 3, 10),
  ('22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000004', 'Social Engineering Quiz',               75, 3, 15),
  ('22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000005', 'Data Handling Quiz',                    80, 3, 15),
  ('22222222-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000006', 'Document Fraud Quiz',                   80, 3, 15),
  ('22222222-0000-0000-0000-000000000007', '11111111-0000-0000-0000-000000000007', 'Insider Threat Quiz',                   80, 3, 15),
  ('22222222-0000-0000-0000-000000000008', '11111111-0000-0000-0000-000000000008', 'Leadership Cyber Risk Quiz',            80, 3, 20),
  ('22222222-0000-0000-0000-000000000009', '11111111-0000-0000-0000-000000000009', 'Customer Interaction Security Quiz',    75, 3, 10),
  ('22222222-0000-0000-0000-000000000010', '11111111-0000-0000-0000-000000000010', 'Vault & Cash Handling Security Quiz',   80, 3, 10);

-- ── Sample Questions for Phishing Quiz ───────────────────────
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, explanation, order_index, points)
VALUES
  ('33333333-0000-0000-0000-000000000001',
   '22222222-0000-0000-0000-000000000002',
   'You receive an email from "IT-Support@fortib4nk.com" asking you to reset your password urgently. What should you do?',
   'multiple_choice',
   'Legitimate IT departments never use urgency tactics or unofficial domains. Always verify through a known internal channel.',
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
  ('33333333-0000-0000-0000-000000000001', 'Click the link immediately to avoid account lockout',  FALSE, 1),
  ('33333333-0000-0000-0000-000000000001', 'Report the email to IT security and delete it',         TRUE,  2),
  ('33333333-0000-0000-0000-000000000001', 'Forward it to colleagues to warn them',                 FALSE, 3),
  ('33333333-0000-0000-0000-000000000001', 'Reply asking for more details',                         FALSE, 4);

-- Options for Q2 (multi-select)
INSERT INTO public.quiz_options (question_id, option_text, is_correct, order_index) VALUES
  ('33333333-0000-0000-0000-000000000002', 'Urgent language like "Act Now!" or "Your account will be closed"', TRUE,  1),
  ('33333333-0000-0000-0000-000000000002', 'Sender email domain is slightly misspelled',                       TRUE,  2),
  ('33333333-0000-0000-0000-000000000002', 'Email is from your manager''s correct address',                    FALSE, 3),
  ('33333333-0000-0000-0000-000000000002', 'Unexpected attachment from an unknown sender',                     TRUE,  4);

-- Options for Q3 (true/false)
INSERT INTO public.quiz_options (question_id, option_text, is_correct, order_index) VALUES
  ('33333333-0000-0000-0000-000000000003', 'True',  TRUE,  1),
  ('33333333-0000-0000-0000-000000000003', 'False', FALSE, 2);

-- ── Sample Phishing Campaign ─────────────────────────────────
INSERT INTO public.phishing_campaigns (
  id, name, description, status,
  email_subject, email_sender_name, email_sender_addr, email_body_html,
  target_role_ids
)
VALUES (
  '44444444-0000-0000-0000-000000000001',
  'Q1 IT Password Reset Campaign',
  'Simulated IT helpdesk phishing targeting frontline and professional staff.',
  'draft',
  'URGENT: Your bank system password expires in 24 hours',
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
    (SELECT id FROM public.roles WHERE name = 'customer_service_assistant'),
    (SELECT id FROM public.roles WHERE name = 'head_teller'),
    (SELECT id FROM public.roles WHERE name = 'relationship_officer'),
    (SELECT id FROM public.roles WHERE name = 'credit_officer')
  ]
);