
-- 013_module_seed_phishing.sql
-- Module 2: Phishing Awareness and Email Safety
-- Topic 1.0 – Recognizing Phishing Attacks (3 subtopics + checkpoint)
-- Topic 2.0 – Safe Email Practices (2 subtopics + checkpoint)
-- Final Exam: 15 MCQs


DO $$
DECLARE
  v_mod UUID := gen_random_uuid();

  v_c10 UUID := gen_random_uuid(); v_c11 UUID := gen_random_uuid(); v_c11q UUID := gen_random_uuid();
  v_c12 UUID := gen_random_uuid(); v_c12q UUID := gen_random_uuid();
  v_c13 UUID := gen_random_uuid(); v_c13q UUID := gen_random_uuid();
  v_c20 UUID := gen_random_uuid(); v_c21 UUID := gen_random_uuid(); v_c21q UUID := gen_random_uuid();
  v_c22 UUID := gen_random_uuid(); v_c22q UUID := gen_random_uuid();

  v_cp1 UUID := gen_random_uuid(); v_cp2 UUID := gen_random_uuid(); v_fe UUID := gen_random_uuid();
  v_cS0 UUID := gen_random_uuid(); v_cS1 UUID := gen_random_uuid();
  vq UUID; va UUID; vb UUID; vc UUID; vd UUID;
BEGIN

INSERT INTO public.modules (id, title, description, status, order_index, duration_mins) VALUES (
  v_mod, 'Phishing Awareness and Email Safety',
  'Learn to identify, analyze, and correctly respond to phishing attacks. Email is the most common initial attack vector targeting bank employees. This module provides practical skills for recognizing deceptive communications and handling them safely.',
  'published', 2, 45
);
INSERT INTO public.module_role_access (module_id, role_id) SELECT v_mod, id FROM public.roles;

-- ═══ TOPIC 1: Recognizing Phishing Attacks ═══════════════════════════════════

INSERT INTO public.module_content (id, module_id, title, content_type, content_body, order_index, section_number, learning_objectives) VALUES (
  v_c10, v_mod, 'Recognizing Phishing Attacks', 'text',
  '<p>Phishing is the leading initial access method in cyberattacks against financial institutions. This topic teaches you to recognize phishing in its various forms before it causes harm.</p>',
  10, '1.0',
  ARRAY['Identify the defining characteristics of a phishing email','Distinguish between phishing, spear phishing, and whaling','Explain why phishing is effective against even security-aware individuals']
);

-- 1.1
INSERT INTO public.module_content (id, module_id, title, content_type, content_body, order_index, section_number) VALUES (
  v_c11, v_mod, 'What is Phishing?', 'text',
  '<p>Phishing is a social engineering attack that uses deceptive electronic communications, primarily email, to trick recipients into revealing credentials, transferring money, or installing malware. The name derives from "fishing": casting a wide net and waiting for victims to take the bait.</p>
<h3>How Phishing Works</h3>
<p>A phishing attack typically follows this pattern:</p>
<ol>
  <li>The attacker crafts a message that appears to come from a trusted source: a bank, IT department, regulator, or colleague.</li>
  <li>The message creates urgency or exploits authority to pressure the recipient into acting quickly without thinking.</li>
  <li>The recipient clicks a link leading to a fake site, opens a malicious attachment, or directly provides credentials or funds.</li>
  <li>The attacker uses what they obtained to access accounts, steal data, or sell credentials.</li>
</ol>
<h3>Why Phishing Succeeds</h3>
<p>Phishing exploits human psychology, not technical vulnerabilities. It works because:</p>
<ul>
  <li><strong>Authority:</strong> people tend to comply with requests from perceived authority figures.</li>
  <li><strong>Urgency:</strong> artificial time pressure reduces careful thinking. "Your account will be closed in 24 hours."</li>
  <li><strong>Familiarity:</strong> logos, email signatures, and language copied from legitimate sources are convincing.</li>
  <li><strong>Fear:</strong> threats of consequences ("Your account has been compromised") trigger reactive behavior.</li>
</ul>
<h3>Scale of the Problem</h3>
<p>Over 90% of cyberattacks that result in a data breach begin with a phishing email. No amount of technical security can fully compensate for an employee who clicks a malicious link. Your recognition of phishing is the most critical control at this stage.</p>
<figure style="margin:1.5rem 0"><img src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&auto=format&fit=crop&q=80" alt="Email phishing concept" style="width:100%;border-radius:8px;max-height:280px;object-fit:cover" /><figcaption style="font-size:0.75rem;color:#94a3b8;margin-top:0.5rem;font-style:italic;text-align:center">Phishing emails arrive through normal channels and are designed to look indistinguishable from legitimate communications.</figcaption></figure>',
  20, '1.1'
);
INSERT INTO public.module_content (id, module_id, title, content_type, content_body, order_index, section_number) VALUES (
  v_c11q, v_mod, 'Quiz: What is Phishing?', 'knowledge_check',
  '{"questions":[
    {"id":"q1","text":"Which psychological principle do phishing attackers most commonly exploit to pressure victims into acting without thinking?","options":[
      {"id":"a","text":"Curiosity about new information","correct":false,"explanation":"While curiosity can be exploited, urgency and authority are the primary and most effective levers."},
      {"id":"b","text":"Artificial urgency combined with perceived authority","correct":true,"explanation":"Phishing messages routinely create false deadlines and impersonate authority figures to bypass careful thinking."},
      {"id":"c","text":"The victim''s desire for financial gain","correct":false,"explanation":"This applies to some fraud schemes but is not the primary phishing mechanism targeting employees."},
      {"id":"d","text":"Technical confusion about how email works","correct":false,"explanation":"Phishing exploits psychology, not technical confusion."}
    ]},
    {"id":"q2","text":"What percentage of data breaches begin with a phishing email?","options":[
      {"id":"a","text":"Around 20%","correct":false,"explanation":"The actual figure is far higher, making phishing the dominant initial attack vector."},
      {"id":"b","text":"Around 50%","correct":false,"explanation":"Phishing is responsible for a much higher proportion of breaches."},
      {"id":"c","text":"Over 90%","correct":true,"explanation":"More than 90% of cyberattacks resulting in data breaches begin with phishing, making it the single most important threat for employees to recognize."},
      {"id":"d","text":"Around 70%","correct":false,"explanation":"The figure is higher than 70%."}
    ]},
    {"id":"q3","text":"A phishing email appears to come from the bank''s IT department, asking you to verify your credentials. The email logo and formatting look identical to real IT communications. What should you do?","options":[
      {"id":"a","text":"Enter your credentials: the email looks legitimate","correct":false,"explanation":"Attackers intentionally copy legitimate branding. Appearance alone cannot confirm authenticity."},
      {"id":"b","text":"Reply to the email asking if it is legitimate","correct":false,"explanation":"If the account is compromised, replying confirms your engagement to the attacker."},
      {"id":"c","text":"Do not click anything. Contact IT directly through a known, verified phone number or internal channel to confirm","correct":true,"explanation":"Verification through a separate, known channel is the only reliable way to confirm the legitimacy of an unexpected credential request."},
      {"id":"d","text":"Forward the email to your manager for their opinion","correct":false,"explanation":"Forwarding a potentially malicious email risks spreading it. Report to the security team directly."}
    ]}
  ]}',
  30, '1.1'
);

-- 1.2
INSERT INTO public.module_content (id, module_id, title, content_type, content_body, order_index, section_number) VALUES (
  v_c12, v_mod, 'Anatomy of a Phishing Email', 'text',
  '<p>Recognizing a phishing email requires knowing what to look for. Attackers are skilled at creating convincing messages, but they consistently leave detectable indicators.</p>
<h3>Sender Address</h3>
<p>The display name can say anything, such as "IT Department" or "CEO John Smith", but the actual email address behind it reveals the truth. Common tactics include:</p>
<ul>
  <li>Using a domain that looks similar: <code>support@fortibank-security.com</code> instead of <code>@fortibank.com</code></li>
  <li>Adding words to a real domain: <code>fortibank.helpdesk.com</code></li>
  <li>Using a legitimate service to send: <code>fortibank-it@gmail.com</code></li>
</ul>
<h3>Urgency and Pressure Language</h3>
<p>Phrases such as "Immediate action required," "Your account will be suspended," or "Verify within 24 hours" are designed to short-circuit careful evaluation. Legitimate organizations rarely demand immediate action on account security via email.</p>
<h3>Links and URLs</h3>
<p>The visible text of a link can say anything, but the actual URL it leads to is what matters. Before clicking any link, hover over it (on desktop) to preview the destination URL. Signs of a malicious link include:</p>
<ul>
  <li>A domain that does not match the organization</li>
  <li>Random character strings or numbers in the domain</li>
  <li>HTTP instead of HTTPS</li>
  <li>URL shorteners that hide the destination</li>
</ul>
<h3>Attachments</h3>
<p>Malicious attachments commonly appear as invoices, statements, delivery notifications, or shared documents. Dangerous formats include: .exe, .zip containing executables, macro-enabled Office files (.docm, .xlsm), and password-protected archives (the password is provided in the email to bypass email scanning).</p>
<h3>Grammar and Tone</h3>
<p>While sophisticated attacks are grammatically correct, many phishing emails contain unusual phrasing, incorrect salutations (e.g., "Dear Valued Customer" instead of your name), or slightly off-brand language. Compare the email tone against how the purported sender normally communicates.</p>
<figure style="margin:1.5rem 0"><img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80" alt="Cybersecurity threat analysis" style="width:100%;border-radius:8px;max-height:280px;object-fit:cover" /><figcaption style="font-size:0.75rem;color:#94a3b8;margin-top:0.5rem;font-style:italic;text-align:center">Training yourself to examine sender addresses, URLs, and language patterns converts a deceptive message into an obvious threat.</figcaption></figure>',
  40, '1.2'
);
INSERT INTO public.module_content (id, module_id, title, content_type, content_body, order_index, section_number) VALUES (
  v_c12q, v_mod, 'Quiz: Anatomy of a Phishing Email', 'knowledge_check',
  '{"questions":[
    {"id":"q1","text":"An email from ''IT Support'' asks you to reset your password. The sender address shows: it-support@fortibank-helpdesk.net. What does this indicate?","options":[
      {"id":"a","text":"The email is from the official IT team , the name says IT Support","correct":false,"explanation":"Display names can be set to anything. The domain fortibank-helpdesk.net is not the bank''s domain and indicates a spoofed sender."},
      {"id":"b","text":"The domain is suspicious and it is not the bank''s official domain, suggesting this is a phishing attempt","correct":true,"explanation":"The actual sending domain must match the organization''s official domain. A domain like fortibank-helpdesk.net is a classic impersonation tactic."},
      {"id":"c","text":"The email is likely legitimate if the formatting and logo look correct","correct":false,"explanation":"Attackers copy legitimate branding. The sender domain is a more reliable indicator than visual appearance."},
      {"id":"d","text":"Only IT can send from .net domains, so this is fine","correct":false,"explanation":"This is incorrect. Domain extensions have no security significance. The domain itself is what matters."}
    ]},
    {"id":"q2","text":"You receive an email with a link labeled ''Click here to verify your account''. Before clicking, what is the safest action?","options":[
      {"id":"a","text":"Click the link: the label says it is a verification link","correct":false,"explanation":"Link labels can be set to any text regardless of where the link leads."},
      {"id":"b","text":"Hover over the link to preview the destination URL and verify it matches the organization''s official domain","correct":true,"explanation":"The actual URL behind the label is what determines the destination. Hover to preview before clicking."},
      {"id":"c","text":"Copy and paste the link label into the browser","correct":false,"explanation":"The label text is not the URL. Copying the label would not navigate to the link''s actual destination."},
      {"id":"d","text":"Check that the email uses HTTPS before clicking","correct":false,"explanation":"Email messages themselves do not use HTTPS. It is the destination URL that should be checked."}
    ]},
    {"id":"q3","text":"An email arrives with a password-protected ZIP file attachment. The password is provided in the email body. Why is this specifically dangerous?","options":[
      {"id":"a","text":"ZIP files are always malicious","correct":false,"explanation":"ZIP files are a common and legitimate format. The concern here is more specific."},
      {"id":"b","text":"The password protection prevents email security scanners from analyzing the attachment''s contents, allowing malware to bypass detection","correct":true,"explanation":"This is a deliberate attacker technique. By providing the password in the email, they ensure the recipient can open it while the security scanner cannot inspect it."},
      {"id":"c","text":"Passwords in emails are always stolen by attackers","correct":false,"explanation":"This is not the specific risk here. The risk is that the password prevents security scanners from inspecting the attachment."},
      {"id":"d","text":"ZIP files cannot be scanned by antivirus software","correct":false,"explanation":"Unencrypted ZIP files can be scanned. The problem here is the encryption, not the format."}
    ]}
  ]}',
  50, '1.2'
);

-- 1.3
INSERT INTO public.module_content (id, module_id, title, content_type, content_body, order_index, section_number) VALUES (
  v_c13, v_mod, 'Spear Phishing, Whaling, and Business Email Compromise', 'text',
  '<p>Beyond mass phishing campaigns, attackers use highly targeted variants that are significantly harder to detect. These attacks are researched and personalized, making them far more convincing than generic phishing.</p>
<h3>Spear Phishing</h3>
<p>A targeted phishing attack aimed at a specific individual or small group. The attacker researches the target first, using LinkedIn, company websites, social media, and previous data breaches, to make the message appear credible and personally relevant.</p>
<p><strong>Example:</strong> An attacker identifies that a bank relationship manager named Sarah handles corporate accounts. They send her an email appearing to be from one of her actual clients, referencing a real project name and asking her to review an attached document.</p>
<h3>Whaling</h3>
<p>Spear phishing directed at senior executives the "big fish." Executives are targeted because they have high authority, access to sensitive information, and the ability to authorize large transactions. They are also often less subject to normal security controls due to their seniority.</p>
<h3>Business Email Compromise (BEC)</h3>
<p>A sophisticated attack in which the attacker either compromises a legitimate executive email account or spoofs it convincingly, then uses it to instruct employees to transfer funds or send sensitive data. BEC causes billions in losses globally each year.</p>
<p><strong>Common BEC scenarios:</strong></p>
<ul>
  <li>CEO instructs finance team to wire funds to a new account urgently and confidentially</li>
  <li>CFO requests W-2 or payroll data from HR</li>
  <li>Supplier email account compromised; attacker changes bank details for the upcoming payment</li>
</ul>
<h3>Defending Against Targeted Phishing</h3>
<p>Because these attacks are personalized, generic suspicion is not enough. The key defense is process: verify any unusual financial request or credential request through a second, independent communication channel, regardless of how legitimate the email appears.</p>
<figure style="margin:1.5rem 0"><img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80" alt="Business communication security" style="width:100%;border-radius:8px;max-height:280px;object-fit:cover" /><figcaption style="font-size:0.75rem;color:#94a3b8;margin-top:0.5rem;font-style:italic;text-align:center">Spear phishing and BEC attacks succeed because they blend into normal business communication. Process, not instinct, is the reliable defense.</figcaption></figure>',
  60, '1.3'
);
INSERT INTO public.module_content (id, module_id, title, content_type, content_body, order_index, section_number) VALUES (
  v_c13q, v_mod, 'Quiz: Targeted Phishing', 'knowledge_check',
  '{"questions":[
    {"id":"q1","text":"What distinguishes spear phishing from a standard phishing attack?","options":[
      {"id":"a","text":"Spear phishing uses more sophisticated malware","correct":false,"explanation":"The distinguishing feature of spear phishing is targeting and personalization, not necessarily the malware used."},
      {"id":"b","text":"Spear phishing is a mass-distributed campaign with no personalization","correct":false,"explanation":"The opposite is true. Mass distribution without personalization describes standard phishing."},
      {"id":"c","text":"Spear phishing targets a specific individual using personal research to make the message appear credible and relevant","correct":true,"explanation":"Spear phishing is targeted and personalized, making it much harder to detect than generic phishing."},
      {"id":"d","text":"Spear phishing only targets executives","correct":false,"explanation":"Whaling targets executives specifically. Spear phishing can target anyone."}
    ]},
    {"id":"q2","text":"Your CFO emails you requesting the payroll data file urgently; the CFO is travelling and needs it sent to their personal email address. What is the correct response?","options":[
      {"id":"a","text":"Send the file the request came from the CFO","correct":false,"explanation":"This is a classic BEC pattern. The email may be spoofed or the account compromised. Sending payroll data to a personal email address is a serious risk."},
      {"id":"b","text":"Call the CFO on their known mobile number to verbally confirm the request before sending anything","correct":true,"explanation":"Unusual requests, especially those involving sensitive data sent to non-standard addresses, must be verified through a separate, known channel regardless of how legitimate the email appears."},
      {"id":"c","text":"Reply to the email asking for confirmation","correct":false,"explanation":"If the email account is compromised, the attacker will reply confirming the request."},
      {"id":"d","text":"CC your manager and send the file","correct":false,"explanation":"This does not verify the request. Copying your manager does not make an unverified data transfer safe."}
    ]},
    {"id":"q3","text":"Why are senior executives specifically targeted by whaling attacks?","options":[
      {"id":"a","text":"Executives are less technically capable","correct":false,"explanation":"Technical capability is not the primary factor. Seniority and access are."},
      {"id":"b","text":"Executives have the authority to approve large transactions and access sensitive information, and are sometimes subject to fewer security controls due to their position","correct":true,"explanation":"Executives represent high-value targets: they can authorize fund transfers, access strategic data, and sometimes bypass security controls that apply to other staff."},
      {"id":"c","text":"Executive email accounts are easier to compromise","correct":false,"explanation":"Executive accounts often have stronger security. The attraction is the authority they carry, not the ease of compromise."},
      {"id":"d","text":"Executives travel frequently, making their location unpredictable","correct":false,"explanation":"While travel can create plausible cover stories, it is not the primary reason executives are targeted."}
    ]}
  ]}',
  70, '1.3'
);

-- Checkpoint 1
INSERT INTO public.quizzes (id, module_id, title, description, pass_score, max_attempts, quiz_type, section_number) VALUES (
  v_cp1, v_mod, 'Topic 1 Checkpoint: Recognizing Phishing Attacks',
  'Covers phishing fundamentals, email indicators, and targeted phishing variants. 70% required to continue.', 70, 3, 'checkpoint', '1.0'
);
vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'An email from "CEO@fortibank-global.net" instructs you to wire $50,000 to a new vendor. Your CEO''s real address is @fortibank.com. What should you do?','multiple_choice',1,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Process the wire: the email references the CEO by name',false,1),(vb,vq,'Email the CEO at @fortibank.com asking for confirmation',false,2),(vc,vq,'Do not process the wire; verify by calling the CEO directly on a known number, and report the email to security',true,3),(vd,vq,'Ask a colleague if they received a similar email',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'Which of these email subject lines is most consistent with a phishing attempt?','multiple_choice',2,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Monthly team meeting agenda',false,1),(vb,vq,'URGENT: Your account has been locked, verify immediately or lose access',true,2),(vc,vq,'Updated project timeline for Q3',false,3),(vd,vq,'Office closure schedule: public holiday',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'You hover over a link in an email that says "Click here for your secure document". The URL preview shows: http://docs-fortibank.secure-access123.com/view. What does this indicate?','multiple_choice',3,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'The link is safe, as it mentions "secure" in the URL',false,1),(vb,vq,'The domain secure-access123.com is not the bank''s domain, and the URL uses HTTP rather than HTTPS; this is suspicious',true,2),(vc,vq,'The link is safe because it includes "fortibank" in the subdomain',false,3),(vd,vq,'URL length is the only reliable indicator of phishing',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'What is Business Email Compromise (BEC)?','multiple_choice',4,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Malware that infects email servers',false,1),(vb,vq,'An attack where a legitimate or convincingly spoofed executive email account is used to instruct employees to transfer funds or data',true,2),(vc,vq,'Bulk phishing emails sent to thousands of recipients simultaneously',false,3),(vd,vq,'Encrypting email attachments to bypass security scanning',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'Why is a personalized email referencing your manager''s name and a real project more dangerous than a generic phishing email?','multiple_choice',5,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'It contains more complex malware',false,1),(vb,vq,'Personalization increases credibility, making the recipient less likely to question the email''s legitimacy',true,2),(vc,vq,'It bypasses email spam filters automatically',false,3),(vd,vq,'Generic phishing is now illegal so attackers switched to personalized attacks',false,4);

-- ═══ TOPIC 2: Safe Email Practices ═══════════════════════════════════════════

INSERT INTO public.module_content (id, module_id, title, content_type, content_body, order_index, section_number, learning_objectives) VALUES (
  v_c20, v_mod, 'Safe Email Practices', 'text',
  '<p>Knowing how to handle email safely is as important as recognizing threats. This topic covers the practical actions that reduce risk before, during, and after receiving a suspicious email.</p>',
  80, '2.0',
  ARRAY['Apply a systematic approach to evaluating unexpected emails','Demonstrate correct procedures for reporting and handling suspicious emails','Describe secure practices for email attachments and links']
);

-- 2.1
INSERT INTO public.module_content (id, module_id, title, content_type, content_body, order_index, section_number) VALUES (
  v_c21, v_mod, 'Evaluating and Verifying Unexpected Emails', 'text',
  '<p>Safe email handling begins with a systematic evaluation approach. Apply this process whenever you receive an unexpected, unusual, or high-stakes email.</p>
<h3>The SLAM Method</h3>
<p>Use SLAM as a quick mental checklist:</p>
<ul>
  <li><strong>S - Sender:</strong> Does the sender address match the organization it claims to be from? Is the domain exactly correct?</li>
  <li><strong>L - Links:</strong> Hover over any links before clicking. Does the URL destination match the expected organization?</li>
  <li><strong>A - Attachments:</strong> Were you expecting this attachment? Is the file type appropriate? When in doubt, do not open.</li>
  <li><strong>M - Message:</strong> Does the message create unusual urgency, request unusual actions, or ask for credentials or financial transfers?</li>
</ul>
<h3>When to Verify Out-of-Band</h3>
<p>Any email that requests one of the following must be verified through a separate communication channel before acting:</p>
<ul>
  <li>A financial transfer or payment to a new account</li>
  <li>Your login credentials or personal information</li>
  <li>Access to sensitive data or systems</li>
  <li>Confidential action that bypasses normal process</li>
</ul>
<h3>Out-of-Band Verification</h3>
<p>Contact the purported sender through a channel you know is legitimate: call their known phone number (do not use a number provided in the suspicious email), contact them in person, or message them through an internal system. Never rely on replying to the email itself.</p>
<h3>If You Are Unsure</h3>
<p>Uncertainty is reason enough to report. The cost of an unnecessary report to the security team is zero. The cost of not reporting a real attack can be catastrophic. When in doubt, report.</p>
<figure style="margin:1.5rem 0"><img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&auto=format&fit=crop&q=80" alt="Person evaluating email security" style="width:100%;border-radius:8px;max-height:280px;object-fit:cover" /><figcaption style="font-size:0.75rem;color:#94a3b8;margin-top:0.5rem;font-style:italic;text-align:center">Applying SLAM before acting on any unexpected email takes seconds and can prevent a serious security incident.</figcaption></figure>',
  90, '2.1'
);
INSERT INTO public.module_content (id, module_id, title, content_type, content_body, order_index, section_number) VALUES (
  v_c21q, v_mod, 'Quiz: Evaluating Suspicious Emails', 'knowledge_check',
  '{"questions":[
    {"id":"q1","text":"According to the SLAM method, what does the ''A'' stand for and what should you check?","options":[
      {"id":"a","text":"Authority: check if the sender appears to be in a position of authority","correct":false,"explanation":"Authority is a psychological principle, not a SLAM component."},
      {"id":"b","text":"Attachments: check whether the attachment was expected and whether the file type is appropriate before opening","correct":true,"explanation":"The A in SLAM stands for Attachments. Unexpected attachments, especially executable files or macro-enabled documents, are a primary malware delivery mechanism."},
      {"id":"c","text":"Address: check the recipient address to confirm the email was intended for you","correct":false,"explanation":"The recipient address check is not part of SLAM. Sender address (S) is the relevant check."},
      {"id":"d","text":"Action: check what action the email is requesting","correct":false,"explanation":"This is covered by Message (M) in SLAM."}
    ]},
    {"id":"q2","text":"You receive an urgent email from your bank''s supplier requesting a change to their payment bank details. What is the correct procedure?","options":[
      {"id":"a","text":"Update the bank details in the system, the email came from the supplier''s known address","correct":false,"explanation":"Supplier email accounts are frequently compromised. Changing payment details based on an email is one of the most common BEC fraud scenarios."},
      {"id":"b","text":"Call the supplier on their registered phone number to verbally confirm the change before updating any records","correct":true,"explanation":"Payment detail changes must always be verified by calling the supplier on a number already on file, never one provided in the email requesting the change."},
      {"id":"c","text":"Ask a colleague if they have received any communication from this supplier","correct":false,"explanation":"This does not verify the request. Only direct verbal confirmation with the genuine supplier is sufficient."},
      {"id":"d","text":"Reply to the email and ask for written confirmation on company letterhead","correct":false,"explanation":"If the account is compromised, the attacker can send any document in reply. Verification must be through a separate, known channel."}
    ]},
    {"id":"q3","text":"What is the correct action when you receive an email that you suspect is phishing but are not completely certain?","options":[
      {"id":"a","text":"Delete it immediately and take no further action","correct":false,"explanation":"Deleting the email removes evidence and prevents the security team from investigating and protecting others."},
      {"id":"b","text":"Report it to the security team through the designated reporting channel, without clicking any links or opening attachments","correct":true,"explanation":"Report and let the security team determine legitimacy. The cost of an unnecessary report is zero. Missing a real attack is costly."},
      {"id":"c","text":"Click the link to check if it leads to a real site","correct":false,"explanation":"Clicking potentially malicious links can trigger downloads, credential theft, or malware installation."},
      {"id":"d","text":"Forward it to your manager for a second opinion","correct":false,"explanation":"Forwarding a potentially malicious email could spread the threat. Report to security, not to colleagues."}
    ]}
  ]}',
  100, '2.1'
);

-- 2.2
INSERT INTO public.module_content (id, module_id, title, content_type, content_body, order_index, section_number) VALUES (
  v_c22, v_mod, 'Safe Handling of Links and Attachments', 'text',
  '<p>Email links and attachments are the two primary mechanisms through which phishing attacks deliver their payload. Correct handling of both is a foundational security skill.</p>
<h3>Handling Links Safely</h3>
<ul>
  <li><strong>Hover before you click:</strong> On desktop, hovering over a link previews the destination URL in the status bar. Verify the domain is correct before clicking.</li>
  <li><strong>Type directly when in doubt:</strong> If an email asks you to visit your bank account or an internal portal, type the address directly in the browser rather than clicking the email link.</li>
  <li><strong>Be skeptical of redirects:</strong> Shortened URLs (bit.ly, tinyurl) hide the true destination. Do not click shortened URLs in unexpected emails.</li>
  <li><strong>Check the full domain:</strong> fortibank.secure-login.com is NOT the same as fortibank.com. The controlling domain is the one before the top-level domain (.com, .net). In the first example, the controlling domain is secure-login.com.</li>
</ul>
<h3>Handling Attachments Safely</h3>
<ul>
  <li><strong>Were you expecting it?</strong> If you were not expecting an attachment, treat it as suspicious regardless of who sent it.</li>
  <li><strong>High-risk file types:</strong> Executable files (.exe, .bat, .cmd), Office files with macros (.docm, .xlsm, .pptm), script files (.js, .vbs), and compressed archives (.zip, .rar) can all deliver malware.</li>
  <li><strong>Never enable macros:</strong> Legitimate documents sent by your organization through approved channels do not require you to enable macros. A prompt to "Enable Editing" or "Enable Content" in an unexpected document is a warning sign.</li>
  <li><strong>Use preview tools:</strong> Many email platforms allow you to preview documents without downloading them. Use this where available.</li>
</ul>
<h3>If You Clicked a Link or Opened an Attachment</h3>
<p>Act immediately:</p>
<ol>
  <li>Do not enter any credentials or personal information.</li>
  <li>Disconnect from the network if you believe malware may have been installed.</li>
  <li>Report to the IT security team immediately, include what happened, what you clicked or opened, and when.</li>
  <li>Change your passwords from a different, unaffected device.</li>
</ol>
<p>Reporting quickly, even after a mistake, allows the security team to contain the damage before it spreads.</p>',
  110, '2.2'
);
INSERT INTO public.module_content (id, module_id, title, content_type, content_body, order_index, section_number) VALUES (
  v_c22q, v_mod, 'Quiz: Handling Links and Attachments', 'knowledge_check',
  '{"questions":[
    {"id":"q1","text":"An email contains the link text ''Login to Fortibank Online Banking''. When you hover over it, the URL shows: http://fortibank.account-verify.net/login. What should you conclude?","options":[
      {"id":"a","text":"The link is safe the text says Fortibank","correct":false,"explanation":"Link text is set by the sender and can say anything. The actual URL is what matters."},
      {"id":"b","text":"The link leads to account-verify.net, not fortibank.com this is a spoofed phishing page; do not click","correct":true,"explanation":"The controlling domain is account-verify.net. Fortibank appears as a subdomain, which anyone can create. The link does not lead to the bank''s actual domain."},
      {"id":"c","text":"The link is suspicious only because it uses HTTP rather than HTTPS","correct":false,"explanation":"HTTP is also a concern, but the fake domain is the primary indicator here."},
      {"id":"d","text":"Hover previews can be faked, so this check is unreliable","correct":false,"explanation":"While sophisticated attacks can sometimes manipulate hover previews, checking the URL remains an important first step."}
    ]},
    {"id":"q2","text":"You receive an unexpected Word document (.docm). On opening it, a banner appears: ''This document contains macros. Enable content to view.'' What should you do?","options":[
      {"id":"a","text":"Enable content, macros are needed to display the document properly","correct":false,"explanation":"Legitimate documents sent through official channels do not require enabling macros. This is a standard social engineering technique to execute malicious code."},
      {"id":"b","text":"Close the document without enabling macros, and report the email to the security team","correct":true,"explanation":"The Enable Content prompt is one of the most common ways malware is executed by users. Never enable macros in an unexpected document."},
      {"id":"c","text":"Enable content but run a virus scan immediately afterward","correct":false,"explanation":"Enabling the macros executes the malicious code before any scan can intervene."},
      {"id":"d","text":"Forward the document to IT to check it first, then enable content when they approve","correct":false,"explanation":"Do not forward potentially malicious attachments to colleagues. Send the email details to IT but do not forward the file."}
    ]},
    {"id":"q3","text":"You accidentally clicked a link in a phishing email that opened a login page. You did not enter your credentials. What is the correct next action?","options":[
      {"id":"a","text":"No action needed , you did not enter any credentials","correct":false,"explanation":"Simply loading a malicious page can trigger drive-by downloads. The security team must be notified to investigate."},
      {"id":"b","text":"Report the incident to the security team immediately, including what you clicked and when, so they can investigate whether any payload was delivered","correct":true,"explanation":"Even without entering credentials, clicking a malicious link may trigger a drive-by download or other payload. Prompt reporting allows the security team to investigate and contain any compromise."},
      {"id":"c","text":"Clear your browser history and cookies to remove any traces","correct":false,"explanation":"Clearing history destroys evidence the security team needs to investigate. Report first; let them advise on remediation."},
      {"id":"d","text":"Run a Google search to see if the site has been reported as malicious","correct":false,"explanation":"This delays proper reporting and does not help contain any compromise already in progress."}
    ]}
  ]}',
  120, '2.2'
);

-- Checkpoint 2
INSERT INTO public.quizzes (id, module_id, title, description, pass_score, max_attempts, quiz_type, section_number) VALUES (
  v_cp2, v_mod, 'Topic 2 Checkpoint: Safe Email Practices',
  'Covers the SLAM method, out-of-band verification, and safe handling of links and attachments. 70% required to unlock the final exam.', 70, 3, 'checkpoint', '2.0'
);
vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'Which action provides the most reliable verification that an unexpected email requesting a bank transfer is legitimate?','multiple_choice',1,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Checking that the email domain looks correct',false,1),(vb,vq,'Calling the sender on a phone number already on file, not one provided in the email',true,2),(vc,vq,'Replying to the email and asking if it is legitimate',false,3),(vd,vq,'Checking whether the email has the company logo',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'In the SLAM method, what does checking the Message (M) involve?','multiple_choice',2,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Checking the message length for signs of automation',false,1),(vb,vq,'Evaluating whether the message creates unusual urgency, requests unusual actions, or asks for credentials or financial transfers',true,2),(vc,vq,'Checking if the message is encrypted',false,3),(vd,vq,'Checking whether the message was delivered to your spam folder',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'You open an unexpected .docm file before realizing it could be malicious. You have not enabled macros. What should you do immediately?','multiple_choice',3,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Close the file and delete it: no macros were enabled so no harm was done',false,1),(vb,vq,'Report the incident to IT security immediately so they can verify whether any code ran on file open',true,2),(vc,vq,'Run a full antivirus scan and continue working',false,3),(vd,vq,'Disconnect from the network and shut down your computer',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'An email contains a bit.ly shortened link. Why should shortened links in unexpected emails be treated with caution?','multiple_choice',4,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Shortened links are slower to load',false,1),(vb,vq,'Shortened links hide the true destination, preventing you from verifying where the link actually leads',true,2),(vc,vq,'Bit.ly is a known phishing domain',false,3),(vd,vq,'Shortened links always contain viruses',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'Why is reporting a suspicious email that turns out to be legitimate still the correct action?','multiple_choice',5,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'It is not correct: unnecessary reports waste the security team''s time',false,1),(vb,vq,'The cost of a false positive report is near-zero, while the cost of not reporting a real phishing email can be catastrophic',true,2),(vc,vq,'It helps the security team understand how many emails employees receive',false,3),(vd,vq,'It fulfills a regulatory requirement to log all emails',false,4);

-- ═══ TOPIC 3: Module Summary ═════════════════════════════════════════════════

INSERT INTO public.module_content (id, module_id, title, content_type, content_body, order_index, section_number, learning_objectives) VALUES (
  v_cS0, v_mod, 'Module Summary', 'text',
  '<p>You have completed all core topics in this module. Watch the video below for a concise recap of the key concepts covered, then proceed to the final exam.</p>',
  200, '3.0',
  ARRAY['Review and consolidate the key concepts from this module before the final exam']
);

INSERT INTO public.module_content (id, module_id, title, content_type, content_body, content_url, image_caption, order_index, section_number) VALUES (
  v_cS1, v_mod, 'Phishing Awareness and Email Safety: Summary Video', 'video',
  NULL, 'https://www.youtube.com/watch?v=XBkzBrXlle0',
  'This video summarizes the key phishing tactics, email indicators, and safe handling practices covered in this module.',
  210, '3.1'
);

-- ═══ FINAL EXAM ════════════════════════════════════════════════════════════════
INSERT INTO public.quizzes (id, module_id, title, description, pass_score, max_attempts, time_limit_mins, quiz_type) VALUES (
  v_fe, v_mod, 'Phishing Awareness: Final Exam',
  'Covers all topics in the module. 70% required to pass. 25-minute time limit.', 70, 2, 25, 'final_exam'
);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'What is the primary reason phishing attacks are effective against even security-aware individuals?','multiple_choice',1,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Phishing uses encryption that bypasses email filters',false,1),(vb,vq,'Phishing exploits human psychology, specifically urgency, authority, and familiarity, rather than technical vulnerabilities',true,2),(vc,vq,'Phishing emails are always grammatically perfect and visually convincing',false,3),(vd,vq,'Most people do not know how email works',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'In the SLAM phishing check, what does the ''S'' stand for?','multiple_choice',2,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Subject',false,1),(vb,vq,'Sender',true,2),(vc,vq,'Security',false,3),(vd,vq,'Spam',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'A password-protected ZIP file arrives from an unknown sender. The password is in the email body. What is the specific security risk?','multiple_choice',3,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'ZIP files spread faster on a network than other file types',false,1),(vb,vq,'The encryption prevents email security scanners from inspecting the attachment for malware',true,2),(vc,vq,'ZIP files cannot be opened by corporate devices',false,3),(vd,vq,'Sending passwords in emails is against data protection law',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'What makes spear phishing more dangerous than generic mass phishing?','multiple_choice',4,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Spear phishing always carries ransomware',false,1),(vb,vq,'Personalized details make the email appear credible, reducing the victim''s ability to recognize it as fraudulent',true,2),(vc,vq,'Spear phishing bypasses email spam filters',false,3),(vd,vq,'Spear phishing is sent from government email addresses',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Which domain represents the controlling domain in this URL: https://fortibank.login.secure-access.net/verify?','multiple_choice',5,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'fortibank',false,1),(vb,vq,'login',false,2),(vc,vq,'secure-access.net',true,3),(vd,vq,'verify',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Your supplier emails to say their bank account details have changed and requests you update payment records before the next payment run. What is the correct procedure?','multiple_choice',6,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Update the details: the email came from a known supplier address',false,1),(vb,vq,'Call the supplier on their registered number to verbally confirm before making any changes',true,2),(vc,vq,'Email the supplier asking them to confirm in writing',false,3),(vd,vq,'Update the details but notify your manager after',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'An executive receives a targeted phishing email that references their actual job title, manager''s name, and a real internal project. This is an example of:','multiple_choice',7,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Generic phishing',false,1),(vb,vq,'Spear phishing, where personal research was used to make the message more convincing',true,2),(vc,vq,'Smishing',false,3),(vd,vq,'A vishing attack',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'An email prompts you to "Enable Content" when you open the attached document. What does this prompt typically mean?','multiple_choice',8,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'The document is in an older format and needs updating',false,1),(vb,vq,'The document contains macros that, once enabled, can execute malicious code',true,2),(vc,vq,'Your computer does not have the required software to open the file',false,3),(vd,vq,'The document requires you to log in to view it',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'What distinguishes whaling from spear phishing?','multiple_choice',9,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Whaling uses more sophisticated technical exploits',false,1),(vb,vq,'Whaling specifically targets senior executives who have greater authority and access',true,2),(vc,vq,'Whaling always involves phone calls rather than email',false,3),(vd,vq,'Whaling targets entire departments rather than individuals',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'You clicked a link in a phishing email and were taken to a fake login page, but did not enter any credentials. What should you do?','multiple_choice',10,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'No action needed: nothing was submitted',false,1),(vb,vq,'Report to IT security immediately: loading the page may have triggered a drive-by download',true,2),(vc,vq,'Run a browser cache clear and continue working',false,3),(vd,vq,'Change only the password for the site the link impersonated',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'What percentage of cyberattacks resulting in data breaches begin with a phishing email?','multiple_choice',11,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Around 30%',false,1),(vb,vq,'Around 60%',false,2),(vc,vq,'Over 90%',true,3),(vd,vq,'Around 50%',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'When should you use out-of-band verification for an email request?','multiple_choice',12,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Only when the email comes from an external address',false,1),(vb,vq,'Any time an email requests a financial transfer, credentials, sensitive data, or an action that bypasses normal process',true,2),(vc,vq,'Only for emails marked as high priority',false,3),(vd,vq,'Only when you do not recognize the sender''s name',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Why is replying to a suspicious email asking "Is this legitimate?" an ineffective verification method?','multiple_choice',13,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'It is rude to question a senior colleague',false,1),(vb,vq,'If the account is compromised, the attacker will reply confirming the request',true,2),(vc,vq,'Email replies take too long to receive',false,3),(vd,vq,'Security policy prohibits replying to suspected phishing',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'An email from "IT-Department@fortibank-support.org" warns that your account will expire. Fortibank''s real domain is fortibank.com. What should you do?','multiple_choice',14,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Follow the email instructions: the IT name is correct',false,1),(vb,vq,'Do not act on the email. The domain is not fortibank.com. Report it to IT security',true,2),(vc,vq,'Forward to your manager to decide',false,3),(vd,vq,'Check if the email has a signature block before deciding',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Which describes the most effective organizational defense against phishing attacks?','multiple_choice',15,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Deploying email spam filters that block 100% of phishing emails',false,1),(vb,vq,'Training employees to recognize phishing indicators and report suspicious emails promptly, combined with technical controls',true,2),(vc,vq,'Restricting all external email to prevent phishing',false,3),(vd,vq,'Requiring employees to forward all emails to IT for approval before reading',false,4);

END $$;
