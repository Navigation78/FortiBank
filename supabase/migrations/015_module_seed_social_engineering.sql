-- 015_module_seed_social_engineering.sql
-- Module 4: Social Engineering Tactics
-- Topic 1.0 – Understanding Social Engineering (2 subtopics + checkpoint)
-- Topic 2.0 – Attack Scenarios and Defenses (3 subtopics + checkpoint)
-- Final Exam: 15 MCQs

DO $$
DECLARE
  v_mod UUID:=gen_random_uuid();
  v_c10 UUID:=gen_random_uuid(); v_c11 UUID:=gen_random_uuid(); v_c11q UUID:=gen_random_uuid();
  v_c12 UUID:=gen_random_uuid(); v_c12q UUID:=gen_random_uuid();
  v_c20 UUID:=gen_random_uuid(); v_c21 UUID:=gen_random_uuid(); v_c21q UUID:=gen_random_uuid();
  v_c22 UUID:=gen_random_uuid(); v_c22q UUID:=gen_random_uuid();
  v_c23 UUID:=gen_random_uuid(); v_c23q UUID:=gen_random_uuid();
  v_cp1 UUID:=gen_random_uuid(); v_cp2 UUID:=gen_random_uuid(); v_fe UUID:=gen_random_uuid();
  v_cS0 UUID:=gen_random_uuid(); v_cS1 UUID:=gen_random_uuid();
  vq UUID; va UUID; vb UUID; vc UUID; vd UUID;
BEGIN

INSERT INTO public.modules (id,title,description,status,order_index,duration_mins) VALUES (
  v_mod,'Social Engineering Tactics',
  'Attackers exploit human psychology more reliably than software vulnerabilities. This module covers the psychological principles behind social engineering, the most common attack scenarios in banking environments, and practical defenses against manipulation.',
  'published',4,50
);
INSERT INTO public.module_role_access (module_id,role_id) SELECT v_mod,id FROM public.roles;

-- ═══ TOPIC 1 

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number,learning_objectives) VALUES (
  v_c10,v_mod,'Understanding Social Engineering','text',
  '<p>Social engineering attacks manipulate people rather than systems. This topic explains the psychology that makes these attacks effective and why even experienced, intelligent people fall victim to them.</p>',
  10,'1.0',
  ARRAY['Define social engineering and explain why it is more reliable than technical attacks','Identify the six psychological principles most commonly exploited by social engineers','Describe the role of pretexting in establishing credibility for an attack']
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c11,v_mod,'The Psychology of Manipulation','text',
  '<p>Social engineering is the manipulation of people into performing actions or revealing information that benefits the attacker. It is often described as "hacking humans": exploiting the predictable patterns of human behavior rather than software vulnerabilities.</p>
<h3>Why Social Engineering Works</h3>
<p>Humans are social creatures with deeply ingrained behavioral tendencies. These are normally adaptive, helping us function in society, but attackers exploit them systematically. Recognizing these principles in action is the first step to resisting them.</p>
<h3>The Six Principles of Influence Used in Attacks</h3>
<ul>
  <li><strong>Authority:</strong> People comply with requests from those they perceive as authorities: managers, IT teams, regulators, law enforcement. Attackers impersonate these roles to bypass scrutiny. "This is the IT department. We need your password immediately to prevent a breach."</li>
  <li><strong>Urgency:</strong> Time pressure reduces careful thinking. "You must act now or your account will be deleted." The urgency is artificial: a manufactured reason to skip verification.</li>
  <li><strong>Social Proof:</strong> People follow the behavior of others. "Everyone else in the department has already submitted their credentials to the new system."</li>
  <li><strong>Liking:</strong> We comply more readily with people we like or find familiar. Attackers build rapport, use your name, mention shared connections, or reference real internal projects.</li>
  <li><strong>Reciprocity:</strong> When someone does something for us, we feel obligated to return the favor. An attacker who "helps" you first creates a sense of obligation.</li>
  <li><strong>Scarcity:</strong> People value things that appear rare or time-limited. "This is the only opportunity to resolve this before your access is permanently revoked."</li>
</ul>
<h3>Cognitive Load and Decision Quality</h3>
<p>When we are busy, stressed, or multitasking, we make faster, less careful decisions. Attackers time their contacts deliberately, end of day, before a deadline, during a system incident, to exploit reduced cognitive capacity. Slow down. Verify. The urgency is almost always false.</p>
<figure style="margin:1.5rem 0"><img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop&q=80" alt="Social influence and human manipulation concept" style="width:100%;border-radius:8px;max-height:280px;object-fit:cover" /><figcaption style="font-size:0.75rem;color:#94a3b8;margin-top:0.5rem;font-style:italic;text-align:center">Social engineers study human behavior to identify and exploit the predictable ways people respond to authority, urgency, and trust.</figcaption></figure>',
  20,'1.1'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c11q,v_mod,'Quiz: Psychology of Social Engineering','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"An attacker calls claiming to be a regulator conducting an urgent audit and needs system access immediately. Which two psychological principles are being exploited?","options":[
      {"id":"a","text":"Social proof and scarcity","correct":false,"explanation":"Social proof involves others'' behavior; scarcity involves limited availability. The key factors here are the authority of the regulator and the urgency."},
      {"id":"b","text":"Authority and urgency","correct":true,"explanation":"Impersonating a regulator exploits authority. ''Immediately'' exploits urgency. Together, they bypass careful thinking."},
      {"id":"c","text":"Liking and reciprocity","correct":false,"explanation":"Liking involves rapport-building; reciprocity involves obligation from prior favors. These are not the primary principles here."},
      {"id":"d","text":"Reciprocity and social proof","correct":false,"explanation":"Neither applies here. Authority and urgency are the operative factors."}
    ]},
    {"id":"q2","text":"Why do social engineers deliberately contact targets near the end of the workday or during busy periods?","options":[
      {"id":"a","text":"Security monitoring is reduced outside business hours","correct":false,"explanation":"Monitoring schedules are not the reason attackers target end-of-day timing from a psychological perspective."},
      {"id":"b","text":"Mental fatigue and cognitive load reduce the quality of decision-making, making targets more likely to comply without careful verification","correct":true,"explanation":"Cognitive load is a key attacker tool. Tired, stressed people make faster, less careful decisions. Attackers time their approaches to exploit this."},
      {"id":"c","text":"IT staff are less available to help employees verify requests","correct":false,"explanation":"While IT availability may vary, this is not the primary psychological reason for the timing."},
      {"id":"d","text":"Employees are more distracted by personal matters near the end of the day","correct":false,"explanation":"This is too vague. The specific mechanism is cognitive load from work-related pressure."}
    ]},
    {"id":"q3","text":"A colleague mentions to the attacker that the bank is rolling out a new IT system. The attacker later uses this detail in a phishing email. Which principle is exploited?","options":[
      {"id":"a","text":"Scarcity","correct":false,"explanation":"Scarcity involves creating a sense of limited availability. Using inside information to build credibility is different."},
      {"id":"b","text":"Liking: using familiar, relevant details to build rapport and credibility","correct":true,"explanation":"Referencing real internal information creates familiarity and trust, reducing the target''s skepticism. This is the liking and familiarity principle."},
      {"id":"c","text":"Authority","correct":false,"explanation":"Authority involves impersonating a person of power, not using insider knowledge. Though insider knowledge can support an authority claim."},
      {"id":"d","text":"Reciprocity","correct":false,"explanation":"Reciprocity involves obligation from a prior favor. Using internal information to build credibility is about familiarity/liking."}
    ]}
  ]}',
  30,'1.1'
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c12,v_mod,'Pretexting: Building the False Scenario','text',
  '<p>A pretext is a fabricated scenario created by the attacker to establish credibility and justify their requests. Pretexting is present in virtually every social engineering attack; it is the narrative that makes the manipulation believable.</p>
<h3>What Pretexting Looks Like</h3>
<p>Examples from banking environments:</p>
<ul>
  <li>An attacker poses as a new IT contractor from a specific vendor the bank uses, calling to "set up VPN access" and needing network credentials.</li>
  <li>An attacker poses as a police officer investigating fraud, claiming they need to access a customer account urgently as part of an active investigation.</li>
  <li>An attacker poses as an HR representative distributing payroll forms that contain a malware payload.</li>
  <li>An attacker poses as a colleague from another branch who has locked themselves out of a system and needs temporary credentials while IT is unavailable.</li>
</ul>
<h3>How Pretexts Are Researched</h3>
<p>Good pretexts are built on real information. Attackers research:</p>
<ul>
  <li>The bank''s known IT vendors from job postings and press releases</li>
  <li>Employee names, roles, and reporting lines from LinkedIn</li>
  <li>Internal terminology from documents in the public domain</li>
  <li>Ongoing projects or events from social media and news</li>
</ul>
<p>The more realistic the pretext, the harder it is to detect. A caller who knows your manager''s name, your team''s project, and the correct internal terminology is far more convincing than a generic impersonator.</p>
<h3>Verifying Before Acting</h3>
<p>The defense against pretexting is process, not intuition. A convincing pretext is designed to bypass your instincts. Process does not care how convincing the caller is:</p>
<ul>
  <li>Any request for credentials, access, or sensitive data → Verify through a separate, known channel</li>
  <li>Any request that bypasses normal approval process → Escalate for authorization</li>
  <li>Any caller you cannot independently verify → Do not comply until verified</li>
</ul>
<figure style="margin:1.5rem 0"><img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=80" alt="Phone call social engineering" style="width:100%;border-radius:8px;max-height:280px;object-fit:cover" /><figcaption style="font-size:0.75rem;color:#94a3b8;margin-top:0.5rem;font-style:italic;text-align:center">Pretexts are researched and realistic. Knowing the correct vendor name or your manager''s title is not proof of legitimacy.</figcaption></figure>',
  40,'1.2'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c12q,v_mod,'Quiz: Pretexting','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"An attacker calls your team claiming to be from Cisco Systems, which is your bank''s known network vendor. They say they need remote access credentials for a scheduled maintenance window. The caller knows your manager''s name and uses correct internal system names. What should you do?","options":[
      {"id":"a","text":"Provide the credentials: the caller clearly knows the organization","correct":false,"explanation":"Knowing internal details proves the attacker researched the organization, not that they are legitimate. Never provide credentials based on the caller''s apparent knowledge."},
      {"id":"b","text":"Ask the caller to hold, then verify the request by calling Cisco on their published number and confirming the maintenance window with your manager","correct":true,"explanation":"Internal knowledge can be researched. Verification through an independent channel, such as calling the vendor directly and confirming with your manager, is the only reliable check."},
      {"id":"c","text":"Provide read-only credentials instead of full access credentials","correct":false,"explanation":"Providing any credentials to an unverified caller is a security risk, regardless of the access level."},
      {"id":"d","text":"Email the caller''s stated email address to confirm their identity","correct":false,"explanation":"The attacker controls the email address they provided. Contacting them through the same channel does not verify their identity."}
    ]},
    {"id":"q2","text":"What is the fundamental defense against pretexting attacks, regardless of how convincing the scenario appears?","options":[
      {"id":"a","text":"Trusting your instincts about whether the caller seems genuine","correct":false,"explanation":"Pretexting is specifically designed to bypass instincts. Skilled social engineers are highly convincing. Instinct is not a reliable defense."},
      {"id":"b","text":"Following process: verify any unusual request through a separate, independently established channel before acting","correct":true,"explanation":"Process does not care how convincing the pretext is. If the process says verify before providing credentials, the caller''s credibility is irrelevant."},
      {"id":"c","text":"Only speaking with people you have met in person","correct":false,"explanation":"This is impractical in a large organization and does not address all social engineering scenarios."},
      {"id":"d","text":"Asking the caller for an employee ID number to verify their identity","correct":false,"explanation":"An attacker can easily provide a fake employee ID. This does not constitute verification."}
    ]},
    {"id":"q3","text":"An attacker researches a bank''s job postings to find out which IT vendors are used. Why is this information valuable for a social engineering attack?","options":[
      {"id":"a","text":"It helps them identify which systems have known software vulnerabilities","correct":false,"explanation":"While this could be a secondary benefit, the primary value for social engineering is identity credibility."},
      {"id":"b","text":"It allows them to impersonate a legitimate, known vendor, making their pretext far more credible","correct":true,"explanation":"Impersonating a vendor the target already works with is significantly more convincing than impersonating an unknown party. Job postings unintentionally reveal vendor relationships."},
      {"id":"c","text":"It tells them how much the bank spends on security","correct":false,"explanation":"Budget information is not the primary value of vendor intelligence for social engineering."},
      {"id":"d","text":"It identifies which employees to contact based on their technical skills","correct":false,"explanation":"While role targeting is useful for attackers, the vendor information value here is for building credible pretexts."}
    ]}
  ]}',
  50,'1.2'
);

-- CP1
INSERT INTO public.quizzes (id,module_id,title,description,pass_score,max_attempts,quiz_type,section_number) VALUES (
  v_cp1,v_mod,'Topic 1 Checkpoint: Understanding Social Engineering',
  'Covers psychological principles and pretexting. 70% required to continue.',70,3,'checkpoint','1.0'
);
vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'Which psychological principle involves manufacturing a false time constraint to pressure the target into acting without careful thought?','multiple_choice',1,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Authority',false,1),(vb,vq,'Social proof',false,2),(vc,vq,'Urgency',true,3),(vd,vq,'Reciprocity',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'Why do social engineers research their targets before making contact?','multiple_choice',2,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'To identify which systems to hack technically',false,1),(vb,vq,'To build a realistic pretext using genuine internal details that increase credibility and reduce the target''s suspicion',true,2),(vc,vq,'To learn the target''s schedule for physical access',false,3),(vd,vq,'To find out which employees have administrator access',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'An attacker says: "I helped you with that system issue last month, so I''m sure you''ll help me now with this access request." Which principle is being used?','multiple_choice',3,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Authority',false,1),(vb,vq,'Reciprocity: creating a sense of obligation based on a prior favor',true,2),(vc,vq,'Social proof',false,3),(vd,vq,'Scarcity',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'What is a pretext in the context of social engineering?','multiple_choice',4,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'A technical tool used to fake email addresses',false,1),(vb,vq,'A fabricated scenario created by the attacker to establish credibility and justify their requests',true,2),(vc,vq,'The technical infrastructure used to deliver a phishing email',false,3),(vd,vq,'A legal warning given before attempting access',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'A caller claims that everyone in your department has already submitted their updated login credentials to the new system and you are the only one remaining. Which principle is this?','multiple_choice',5,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Scarcity',false,1),(vb,vq,'Authority',false,2),(vc,vq,'Social proof: using the implied behavior of peers to normalize compliance',true,3),(vd,vq,'Liking',false,4);

-- ═══ TOPIC 2 

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number,learning_objectives) VALUES (
  v_c20,v_mod,'Social Engineering Attack Scenarios','text',
  '<p>Social engineering attacks take many forms. This topic covers the most common scenarios encountered in banking environments, with practical guidance on recognizing and responding to each.</p>',
  60,'2.0',
  ARRAY['Identify the defining characteristics of vishing, smishing, and physical social engineering','Describe appropriate responses to social engineering attempts in each scenario','Explain how to report social engineering attempts effectively']
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c21,v_mod,'Vishing: Voice-Based Social Engineering','text',
  '<p>Vishing (voice phishing) uses phone calls to manipulate targets. It is particularly effective because people extend more trust and emotional engagement to voice interaction than to email.</p>
<h3>Common Vishing Scenarios in Banking</h3>
<ul>
  <li><strong>IT Support Impersonation:</strong> "This is IT. We''ve detected unusual activity on your account. I''ll need your password to secure it." Legitimate IT never asks for your password.</li>
  <li><strong>Executive Impersonation:</strong> An attacker calls posing as a senior executive, often while that executive is known to be travelling or unavailable. They request an urgent fund transfer or information disclosure.</li>
  <li><strong>Regulatory Impersonation:</strong> "This is the Financial Conduct Authority. We are conducting an audit and require immediate access to certain customer records." Real regulators follow formal written processes; they do not cold-call for immediate system access.</li>
  <li><strong>Vendor Impersonation:</strong> An attacker poses as a known technology supplier needing access credentials for a "scheduled maintenance" that was never scheduled.</li>
</ul>
<h3>Caller ID Spoofing</h3>
<p>Caller ID can be manipulated to display any number, including internal bank numbers or government agencies. The displayed number is not reliable proof of the caller''s identity.</p>
<h3>Responding to Suspicious Calls</h3>
<ol>
  <li>Do not provide credentials, data, or access during the call.</li>
  <li>Tell the caller you need to verify their identity before assisting. Legitimate callers will not object.</li>
  <li>Hang up and call back on a number you find independently, from the company website or internal directory. Do not use a callback number provided by the caller.</li>
  <li>Report the call to the security team regardless of how the call ended.</li>
</ol>
<figure style="margin:1.5rem 0"><img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&auto=format&fit=crop&q=80" alt="Verifying caller identity through independent channel" style="width:100%;border-radius:8px;max-height:280px;object-fit:cover" /><figcaption style="font-size:0.75rem;color:#94a3b8;margin-top:0.5rem;font-style:italic;text-align:center">Always call back on a number you independently look up. A number provided by the caller cannot verify who the caller is.</figcaption></figure>',
  70,'2.1'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c21q,v_mod,'Quiz: Vishing','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"A caller claims to be from your bank''s IT department and displays an internal extension number on your caller ID. They say your account has been compromised and need your password immediately. What should you do?","options":[
      {"id":"a","text":"Provide your password: the internal number confirms they are from IT","correct":false,"explanation":"Caller ID can be spoofed to display any number. An internal extension does not confirm the caller''s identity."},
      {"id":"b","text":"Do not provide your password. Tell the caller you will call IT back on the number in the internal directory, then report the call to security","correct":true,"explanation":"Caller ID is not a reliable identity check. Hang up and independently initiate contact with IT. Legitimate IT will never need your password."},
      {"id":"c","text":"Provide only part of your password to verify your identity","correct":false,"explanation":"Any portion of your password should never be shared over the phone with an inbound caller."},
      {"id":"d","text":"Ask the caller to send an email confirming the request before proceeding","correct":false,"explanation":"An email from the same attacker does not add verification. Independent callback is required."}
    ]},
    {"id":"q2","text":"Why is caller ID not a reliable way to verify the identity of an unexpected caller?","options":[
      {"id":"a","text":"Caller ID only works on mobile phones, not landlines","correct":false,"explanation":"This is factually incorrect. The security concern is spoofing, not the type of phone."},
      {"id":"b","text":"Caller ID can be spoofed to display any number, including internal bank extensions and government agency numbers","correct":true,"explanation":"Caller ID spoofing is widely available and used routinely in vishing attacks to create a false sense of legitimacy."},
      {"id":"c","text":"Caller ID numbers are blocked by corporate phone systems","correct":false,"explanation":"This is not universally true and not the security reason why caller ID is unreliable."},
      {"id":"d","text":"Caller ID is delayed and may not match the actual caller","correct":false,"explanation":"The issue is spoofing, not a timing or delay problem."}
    ]},
    {"id":"q3","text":"A caller claiming to be a regulator is aggressive and insists you provide customer records immediately, saying they will escalate to your CEO if you refuse. What does this behavior indicate?","options":[
      {"id":"a","text":"The regulator has serious concerns that require immediate cooperation","correct":false,"explanation":"Real regulators follow formal written processes. Aggressive phone demands for immediate data access are inconsistent with legitimate regulatory practice."},
      {"id":"b","text":"This is likely a social engineering attack exploiting authority and urgency; real regulators use formal written channels, not aggressive phone demands","correct":true,"explanation":"Aggressive pressure, urgency, and threats of escalation are social engineering tactics. Legitimate regulators issue formal written requests through established channels."},
      {"id":"c","text":"You should comply immediately to avoid legal consequences","correct":false,"explanation":"Compliance without verification exposes you and the bank. Verify through official channels before providing any data."},
      {"id":"d","text":"Transfer the call to your manager immediately","correct":false,"explanation":"Transferring the call passes the social engineering pressure to your manager without resolving the verification problem."}
    ]}
  ]}',
  80,'2.1'
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c22,v_mod,'Smishing and Physical Social Engineering','text',
  '<p>Social engineering extends beyond email and phone calls. SMS-based attacks and physical intrusion techniques target employees through channels they may be less prepared for.</p>
<h3>Smishing (SMS Phishing)</h3>
<p>Smishing uses text messages to deliver malicious links or extract information. Common scenarios include:</p>
<ul>
  <li>Fake delivery notifications with a link to "reschedule delivery"</li>
  <li>Bank fraud alerts asking you to verify your account via a link</li>
  <li>Prize or reward notifications requiring personal information to claim</li>
  <li>Urgent messages appearing to be from your employer about payroll or HR systems</li>
</ul>
<p>Apply the same skepticism to SMS links as to email links. Do not click unexpected SMS links. Navigate directly to the service by typing the address in your browser.</p>
<h3>Tailgating and Piggybacking</h3>
<p>Physical social engineering involves gaining unauthorized physical access to secure areas.</p>
<ul>
  <li><strong>Tailgating:</strong> Following an authorized person through a controlled door before it closes, without their knowledge.</li>
  <li><strong>Piggybacking:</strong> The authorized person knowingly allows someone through, often out of politeness when someone approaches with their hands full or appears to belong.</li>
</ul>
<p>Every employee is responsible for controlled access. Challenge anyone in a secure area who does not display a valid ID badge. It is not rude; it is expected security behavior. Politely ask: "Can I see your badge?" This is a professional and normal security practice.</p>
<h3>Baiting</h3>
<p>Leaving infected USB drives, QR codes, or physical media in locations where curious employees will find them. The bait may be labeled "Salary Review 2024" or "Redundancy List" to exploit curiosity. Never plug in unknown USB devices. Never scan QR codes from unknown physical sources in a work context.</p>
<figure style="margin:1.5rem 0"><img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80" alt="Physical security and access control" style="width:100%;border-radius:8px;max-height:280px;object-fit:cover" /><figcaption style="font-size:0.75rem;color:#94a3b8;margin-top:0.5rem;font-style:italic;text-align:center">Social engineering extends beyond screens. Physical tailgating, baiting, and smishing attacks exploit the same human tendencies as email-based attacks.</figcaption></figure>',
  90,'2.2'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c22q,v_mod,'Quiz: Smishing and Physical Attacks','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"You find a USB drive in the car park labeled ''Staff Salary Review Q4''. What is the correct action?","options":[
      {"id":"a","text":"Plug it in to identify the owner and return it","correct":false,"explanation":"This is a classic baiting attack. Plugging in an unknown USB drive can install malware instantly."},
      {"id":"b","text":"Hand it to IT security without plugging it in","correct":true,"explanation":"Unknown USB drives should be treated as potentially malicious and handed to IT security for safe inspection, never plugged directly into a work device."},
      {"id":"c","text":"Plug it into a personal device instead of a work device","correct":false,"explanation":"Malware on a USB drive can infect personal devices too, and those devices may be connected to work accounts."},
      {"id":"d","text":"Leave it where you found it so the owner can retrieve it","correct":false,"explanation":"Leaving it in place means another employee may plug it in. Hand it to security."}
    ]},
    {"id":"q2","text":"A person approaches a controlled door behind you as you swipe your badge. They are carrying several boxes and say ''thanks, just hold the door; I left my badge at my desk.'' What should you do?","options":[
      {"id":"a","text":"Hold the door: they seem genuine and have their hands full","correct":false,"explanation":"This is piggybacking. Carrying items to appear helpless is a deliberate tactic. Politely refuse and direct them to reception."},
      {"id":"b","text":"Politely refuse entry and direct them to reception to be issued a visitor pass, or to collect their badge from their desk","correct":true,"explanation":"All access to secure areas must be through proper channels. Politeness does not override security. Challenging an unverified person is expected behavior, not rudeness."},
      {"id":"c","text":"Allow entry only if they show you their work ID, even without their badge","correct":false,"explanation":"A work ID does not verify their right to access this specific secure area at this time. Direct them to the proper process."},
      {"id":"d","text":"Ask a colleague to escort them to their desk to verify their identity","correct":false,"explanation":"This still grants unauthorized access. The correct process is reception or security, not ad-hoc escort."}
    ]},
    {"id":"q3","text":"You receive an SMS from a number claiming to be your bank''s fraud team, saying your account has been compromised and including a link to ''secure your account now''. What should you do?","options":[
      {"id":"a","text":"Click the link: your bank''s fraud team would only contact you about real fraud","correct":false,"explanation":"Banks are frequently impersonated in smishing attacks. The SMS itself cannot be trusted."},
      {"id":"b","text":"Do not click the link. Call your bank on the number on the back of your card to verify whether there is actually an issue","correct":true,"explanation":"Navigate to your bank through a channel you control: call the number you already have or type the address in your browser. Do not use links from unexpected messages."},
      {"id":"c","text":"Reply to the SMS to confirm whether it is legitimate","correct":false,"explanation":"Replying to a smishing message confirms your number is active and may trigger further contact. Do not engage with the message."},
      {"id":"d","text":"Forward the SMS to a colleague to check if they received the same message","correct":false,"explanation":"Forwarding spreads the threat and does not verify legitimacy."}
    ]}
  ]}',
  100,'2.2'
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c23,v_mod,'Reporting and Organizational Defense','text',
  '<p>Individual recognition of social engineering is valuable. But organizational defense requires that these attempts are reported and responded to systematically, not handled in isolation.</p>
<h3>Why Reporting Matters</h3>
<p>When you recognize and report a social engineering attempt, you provide the security team with:</p>
<ul>
  <li>Early warning of an active campaign targeting the organization</li>
  <li>Intelligence about the attacker''s methods and pretext, useful for alerting others</li>
  <li>Evidence for investigation and law enforcement</li>
  <li>Data to improve defenses and awareness training</li>
</ul>
<p>A single employee who reports a vishing call may prevent the same attack from succeeding against a more junior colleague the next day.</p>
<h3>What to Include in a Report</h3>
<ul>
  <li>The date, time, and method of contact (call, email, in person)</li>
  <li>What the attacker claimed (their identity, the pretext)</li>
  <li>What they requested</li>
  <li>What information, if any, was provided</li>
  <li>Any identifying information: phone number, email address, physical description</li>
</ul>
<h3>The No-Blame Culture</h3>
<p>Social engineering attacks succeed against intelligent, security-aware people. Reporting an incident, including one where you were partially deceived, is essential for organizational security. Organizations with strong security cultures actively encourage reporting without blame. Fear of reporting makes the organization more vulnerable, not less.</p>
<h3>Protecting Colleagues</h3>
<p>If you notice a colleague responding to what appears to be a social engineering attempt, intervene. A simple "let''s just verify this before we proceed" can break the psychological pressure the attacker is applying and give your colleague the space to think clearly.</p>',
  110,'2.3'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c23q,v_mod,'Quiz: Reporting Social Engineering','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"An employee receives a vishing call and, before realizing it was an attack, confirms their first name and department. They are embarrassed and consider not reporting it. What is the correct guidance?","options":[
      {"id":"a","text":"Not reporting is fine: minimal information was shared","correct":false,"explanation":"Even limited information can be used to build a more convincing subsequent attack. All social engineering contacts must be reported."},
      {"id":"b","text":"Report it immediately: even limited disclosure gives the security team important intelligence, and prompt reporting is always the right action","correct":true,"explanation":"Any social engineering contact should be reported. The team can assess the risk, alert others, and take action. A blame-free reporting culture is essential for security."},
      {"id":"c","text":"Report only if they gave out sensitive financial information","correct":false,"explanation":"Name and department, while seemingly low-risk, enable more targeted follow-up attacks. All contacts should be reported."},
      {"id":"d","text":"Change their work contact details to prevent follow-up calls","correct":false,"explanation":"This is not a security response and does not address the incident. Report first."}
    ]},
    {"id":"q2","text":"What is the most important reason for reporting a social engineering attempt even when it was unsuccessful?","options":[
      {"id":"a","text":"It fulfills a mandatory reporting obligation under data protection law","correct":false,"explanation":"Reporting obligations vary; more importantly, the intelligence value is the primary reason to report."},
      {"id":"b","text":"It provides the security team with intelligence about active attack campaigns and methods, enabling them to protect others","correct":true,"explanation":"One employee''s report can prevent the same attack from succeeding against another. Intelligence from failed attempts is as valuable as from successful ones."},
      {"id":"c","text":"It allows the organization to prosecute the attacker","correct":false,"explanation":"While reports contribute to evidence, prosecution is rare and not the primary reason to report."},
      {"id":"d","text":"It protects the employee from disciplinary action if the attack later succeeds through another vector","correct":false,"explanation":"This is not the correct motivation for reporting."}
    ]},
    {"id":"q3","text":"You notice a colleague is on the phone with someone and appears to be about to read out sensitive account details under pressure. What is the appropriate action?","options":[
      {"id":"a","text":"Do not interfere: it may be a legitimate call","correct":false,"explanation":"A brief, non-disruptive check, such as asking ''do you need a moment to verify that call?'', can prevent a serious incident without causing significant disruption to a legitimate call."},
      {"id":"b","text":"Quietly signal to your colleague and suggest verifying the call before providing any information","correct":true,"explanation":"Intervening early can break the social engineering pressure cycle. A simple ''let''s just verify this first'' gives the colleague space to reconsider."},
      {"id":"c","text":"Immediately report the call to security and let them handle it","correct":false,"explanation":"Reporting is correct, but immediate intervention is more time-sensitive when sensitive data is about to be disclosed. Do both: intervene and report."},
      {"id":"d","text":"Loudly announce that the call might be fraudulent","correct":false,"explanation":"A disruptive announcement may not be the most effective approach and could embarrass your colleague. A quiet, calm intervention is more appropriate."}
    ]}
  ]}',
  120,'2.3'
);

-- CP2
INSERT INTO public.quizzes (id,module_id,title,description,pass_score,max_attempts,quiz_type,section_number) VALUES (
  v_cp2,v_mod,'Topic 2 Checkpoint: Social Engineering Scenarios',
  'Covers vishing, smishing, physical attacks, and reporting. 70% required to unlock the final exam.',70,3,'checkpoint','2.0'
);
vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'A caller ID shows your bank''s internal IT extension. The caller asks for your system password for a security upgrade. What should you do?','multiple_choice',1,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Provide the password: the caller ID confirms they are internal IT',false,1),(vb,vq,'Refuse: caller ID can be spoofed. Hang up and call IT on a number from the internal directory',true,2),(vc,vq,'Provide a temporary password',false,3),(vd,vq,'Transfer the call to your manager',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'What is tailgating in a physical security context?','multiple_choice',2,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Monitoring an employee''s computer activity without their knowledge',false,1),(vb,vq,'Following an authorized person through a controlled door before it closes, without their awareness',true,2),(vc,vq,'Reading confidential documents over someone''s shoulder',false,3),(vd,vq,'Installing a keylogger on someone''s device',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'A colleague was partially deceived by a vishing call and gave out their department name before realizing it was suspicious. They want to handle it quietly. Why is this the wrong approach?','multiple_choice',3,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'It violates their employment contract',false,1),(vb,vq,'The security team needs intelligence about the attack to protect others, and even limited disclosure enables more targeted follow-up attacks',true,2),(vc,vq,'The bank must report all social engineering attempts to regulators',false,3),(vd,vq,'It is only worth reporting if financial information was shared',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'Which describes a baiting attack?','multiple_choice',4,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Offering a financial reward in return for account credentials',false,1),(vb,vq,'Leaving an infected USB drive or other media where employees will find it, hoping curiosity leads to compromise',true,2),(vc,vq,'Sending bulk phishing emails to all employees simultaneously',false,3),(vd,vq,'Following someone through a secure door',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'An SMS claims to be from the bank''s security team, saying your work credentials will expire in one hour and provides a link to renew them. What is the correct action?','multiple_choice',5,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Click the link immediately to avoid losing access',false,1),(vb,vq,'Do not click the link. Contact IT through a known internal channel to verify whether any credential action is actually required',true,2),(vc,vq,'Forward the SMS to your manager for a decision',false,3),(vd,vq,'Reply to the SMS asking for more information',false,4);

-- ═══ TOPIC 3: Module Summary ═════════════════════════════════════════════════

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number,learning_objectives) VALUES (
  v_cS0,v_mod,'Module Summary','text',
  '<p>You have completed all core topics in this module. Watch the video below for a concise recap of the key concepts covered, then proceed to the final exam.</p>',
  200,'3.0',
  ARRAY['Review and consolidate the key concepts from this module before the final exam']
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,content_url,image_caption,order_index,section_number) VALUES (
  v_cS1,v_mod,'Social Engineering Tactics: Summary Video','video',
  NULL,'https://www.youtube.com/watch?v=lc7scxvKQOo',
  'This video summarizes the psychological principles, pretexting techniques, and attack scenarios covered in this module.',
  210,'3.1'
);

-- ═══ FINAL EXAM
INSERT INTO public.quizzes (id,module_id,title,description,pass_score,max_attempts,time_limit_mins,quiz_type) VALUES (
  v_fe,v_mod,'Social Engineering Tactics: Final Exam',
  'Covers all topics. 70% required to pass. 25-minute time limit.',70,2,25,'final_exam'
);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Social engineering primarily targets which vulnerability?','multiple_choice',1,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Unpatched software',false,1),(vb,vq,'Human psychology and predictable behavioral tendencies',true,2),(vc,vq,'Weak encryption protocols',false,3),(vd,vq,'Misconfigured firewalls',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Which principle does an attacker use when saying "Everyone in your team already completed this; you''re the last one"?','multiple_choice',2,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Authority',false,1),(vb,vq,'Urgency',false,2),(vc,vq,'Social proof',true,3),(vd,vq,'Scarcity',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'What is vishing?','multiple_choice',3,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'A malware variant that steals voice recordings',false,1),(vb,vq,'A social engineering attack conducted by voice call to manipulate targets into disclosing information or granting access',true,2),(vc,vq,'A video-based phishing attack using deepfake technology',false,3),(vd,vq,'An attack that exploits VoIP system vulnerabilities',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'A convincing social engineering pretext is built using real internal details. Where do attackers most commonly gather this information?','multiple_choice',4,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'From hacking HR databases',false,1),(vb,vq,'From public sources: LinkedIn, company websites, press releases, and job postings',true,2),(vc,vq,'From previous employees they have hired',false,3),(vd,vq,'From purchasing corporate intelligence reports',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'What is piggybacking in a physical security context?','multiple_choice',5,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Secretly following someone through a door they did not notice',false,1),(vb,vq,'An authorized employee knowingly allowing an unauthorized person through a secure door, often out of politeness',true,2),(vc,vq,'Carrying concealed recording equipment into a secure area',false,3),(vd,vq,'Using someone else''s access card',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'A regulator calls demanding immediate access to customer records as part of an unscheduled audit. What should you do?','multiple_choice',6,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Comply: failing to assist a regulator has legal consequences',false,1),(vb,vq,'Do not provide access. Verify by calling the regulator on their officially published number and consult your compliance team',true,2),(vc,vq,'Transfer the call to IT to handle the access request',false,3),(vd,vq,'Ask the regulator to email first, then comply with the phone request while awaiting the email',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Which psychological principle is exploited when an attacker first helps the target with a minor issue before making their actual request?','multiple_choice',7,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Urgency',false,1),(vb,vq,'Scarcity',false,2),(vc,vq,'Reciprocity: creating a sense of obligation',true,3),(vd,vq,'Authority',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'You find a USB drive labeled ''Executive Bonus List'' on your desk. What is the correct action?','multiple_choice',8,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Plug it in to identify whose it is and return it',false,1),(vb,vq,'Hand it to IT security without plugging it in',true,2),(vc,vq,'Leave it on the desk in case the owner returns',false,3),(vd,vq,'Plug it into a sandboxed device to check the contents',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Why is cognitive load reduction a key attacker strategy?','multiple_choice',9,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'It reduces system monitoring effectiveness',false,1),(vb,vq,'People under stress or time pressure make faster, less careful decisions and are more likely to comply without verification',true,2),(vc,vq,'It disables multi-factor authentication prompts',false,3),(vd,vq,'It makes victims forget the security training they received',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'An employee was deceived by a social engineering call and is too embarrassed to report it. What is the most significant organizational risk of not reporting?','multiple_choice',10,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'The employee may face disciplinary action later',false,1),(vb,vq,'The security team loses intelligence about the active attack, making other employees vulnerable to the same tactic',true,2),(vc,vq,'The regulator will be notified automatically',false,3),(vd,vq,'The incident will appear in the next security audit',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Smishing is best described as:','multiple_choice',11,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Phishing conducted through social media platforms',false,1),(vb,vq,'Phishing conducted through SMS text messages',true,2),(vc,vq,'Phishing that uses smiling profile photos to build trust',false,3),(vd,vq,'A combination of SMS and email phishing sent simultaneously',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Which of the following is the most reliable defense against social engineering regardless of the attack method?','multiple_choice',12,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Intuition about whether the person seems genuine',false,1),(vb,vq,'Following established verification procedures: independently verifying requests before acting, regardless of perceived credibility',true,2),(vc,vq,'Only accepting requests from people you recognize',false,3),(vd,vq,'Requiring all requests to be in writing',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'An attacker claims to be a new employee who has forgotten their badge. They are well-dressed, know several team members'' names, and seem to belong. You hold the door for them. What risk does this create?','multiple_choice',13,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Minimal risk: they clearly belong to the organization',false,1),(vb,vq,'An unauthorized person gains physical access, potentially enabling device access, document theft, or installation of physical attack hardware',true,2),(vc,vq,'A compliance violation only; no direct security risk',false,3),(vd,vq,'The risk is only significant if the person gains access to server rooms',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'What should you include when reporting a social engineering attempt to the security team?','multiple_choice',14,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Only the final outcome: whether you complied or not',false,1),(vb,vq,'Date, time, method of contact, the pretext used, what was requested, any information provided, and any identifying details about the attacker',true,2),(vc,vq,'A written account of your emotional state during the incident',false,3),(vd,vq,'Only report if you provided information; failed attempts are not worth reporting',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'An attacker poses as a new IT contractor and calls to "set up VPN access", needing network credentials. They mention a real vendor name and your manager. What is the correct response?','multiple_choice',15,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Provide the credentials: they know the vendor and your manager',false,1),(vb,vq,'Do not provide credentials. Put the call on hold, verify with your manager and the actual vendor through known contact details, then report the call to security',true,2),(vc,vq,'Provide read-only credentials as a compromise',false,3),(vd,vq,'Ask for the caller''s employee ID and proceed if it checks out',false,4);

END $$;
