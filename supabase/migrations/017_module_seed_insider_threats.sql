-- 017_module_seed_insider_threats.sql
-- Module 6: Insider Threats and Access Control
-- Topic 1.0 – Understanding Insider Threats (2 subtopics + checkpoint)
-- Topic 2.0 – Access Control Principles (2 subtopics + checkpoint)
-- Final Exam: 15 MCQs

DO $$
DECLARE
  v_mod UUID:=gen_random_uuid();
  v_c10 UUID:=gen_random_uuid(); v_c11 UUID:=gen_random_uuid(); v_c11q UUID:=gen_random_uuid();
  v_c12 UUID:=gen_random_uuid(); v_c12q UUID:=gen_random_uuid();
  v_c20 UUID:=gen_random_uuid(); v_c21 UUID:=gen_random_uuid(); v_c21q UUID:=gen_random_uuid();
  v_c22 UUID:=gen_random_uuid(); v_c22q UUID:=gen_random_uuid();
  v_cp1 UUID:=gen_random_uuid(); v_cp2 UUID:=gen_random_uuid(); v_fe UUID:=gen_random_uuid();
  v_cS0 UUID:=gen_random_uuid(); v_cS1 UUID:=gen_random_uuid();
  vq UUID; va UUID; vb UUID; vc UUID; vd UUID;
BEGIN

INSERT INTO public.modules (id,title,description,status,order_index,duration_mins) VALUES (
  v_mod,'Insider Threats and Access Control',
  'Threats from within the organization are among the most damaging and hardest to detect. This module covers the categories of insider threats, how to recognize warning signs, and the access control principles that limit damage when insider incidents occur.',
  'published',6,45
);
INSERT INTO public.module_role_access (module_id,role_id) SELECT v_mod,id FROM public.roles;

-- TOPIC 1 --
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number,learning_objectives) VALUES (
  v_c10,v_mod,'Understanding Insider Threats','text',
  '<p>Insider threats are unique because the threat actor already has authorized access. This makes them harder to detect and potentially more damaging than external attacks.</p>',
  10,'1.0',
  ARRAY['Distinguish between malicious, negligent, and compromised insider threats','Identify behavioral and technical indicators of insider threat activity','Explain why insider threats are particularly difficult to detect and contain']
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c11,v_mod,'Categories and Motivations of Insider Threats','text',
  '<p>An insider threat is any security risk that originates from within the organization: employees, contractors, partners, or former staff with existing access. They can be more damaging than external attackers because they already have legitimate access to systems and data, know the organization''s processes, and understand where valuable information is stored.</p>
<h3>Three Categories</h3>
<ul>
  <li><strong>Malicious Insiders:</strong> Deliberately misuse their access for personal gain, revenge, or to benefit a competitor or external party. Examples include: stealing customer data to sell to a competitor, committing fraud using system access, or deliberately sabotaging systems before resigning.</li>
  <li><strong>Negligent Insiders:</strong> Unintentionally create risks through careless behavior, lack of awareness, or failure to follow policy. This is the most common category. Examples include: sending data to the wrong recipient, failing to update software, leaving sensitive documents unsecured.</li>
  <li><strong>Compromised Insiders:</strong> Employees whose credentials or accounts have been taken over by an external attacker. The employee is not acting maliciously; their identity is being used without their knowledge.</li>
</ul>
<h3>Common Motivations for Malicious Insiders</h3>
<ul>
  <li><strong>Financial gain:</strong> Selling customer data, committing account fraud, or accepting payment from external parties</li>
  <li><strong>Grievance:</strong> Disgruntled employees who feel mistreated or facing disciplinary action</li>
  <li><strong>Competitive intelligence:</strong> Taking information to a new employer</li>
  <li><strong>Coercion:</strong> External attackers who pressure, blackmail, or pay insiders to act on their behalf</li>
</ul>
<h3>Why Insiders Are Difficult to Detect</h3>
<p>Insiders use legitimate credentials and access, so their activity blends with normal behavior. Security controls designed to stop external attackers (firewalls, perimeter defenses) do not prevent insiders from acting. Detection requires behavioral monitoring, access logging, and attention to anomalous patterns, and even these can be difficult to distinguish from legitimate activity.</p>
<figure style="margin:1.5rem 0"><img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop&q=80" alt="Insider threat and workplace security" style="width:100%;border-radius:8px;max-height:280px;object-fit:cover" /><figcaption style="font-size:0.75rem;color:#94a3b8;margin-top:0.5rem;font-style:italic;text-align:center">Insider threats are uniquely difficult to detect because the threat actor uses legitimate, authorized access that looks identical to normal work activity.</figcaption></figure>',
  20,'1.1'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c11q,v_mod,'Quiz: Insider Threat Categories','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"An employee facing redundancy downloads the bank''s client list and takes it to their new employer. Which category of insider threat does this represent?","options":[
      {"id":"a","text":"Negligent insider","correct":false,"explanation":"Negligent insiders act carelessly, not deliberately. Taking client data to a competitor is deliberate."},
      {"id":"b","text":"Compromised insider","correct":false,"explanation":"A compromised insider has their account taken over externally. This employee is acting of their own volition."},
      {"id":"c","text":"Malicious insider: deliberate theft of organizational data for personal benefit","correct":true,"explanation":"This is a deliberate act for personal gain (competitive advantage at a new employer). It is a clear malicious insider threat."},
      {"id":"d","text":"External threat: the new employer is the threat actor","correct":false,"explanation":"The threat originates from within, from the employee using their existing access. This is an insider threat."}
    ]},
    {"id":"q2","text":"A contractor''s credentials are used to access customer records at 2am on a Saturday. The contractor has no memory of doing this. What is the most likely explanation?","options":[
      {"id":"a","text":"The contractor is lying","correct":false,"explanation":"While possible, the more common explanation for unusual access with no memory is credential compromise."},
      {"id":"b","text":"The contractor''s account has been compromised: an external attacker is using their credentials","correct":true,"explanation":"Access outside working hours using insider credentials without the credential owner''s awareness is a classic indicator of a compromised insider scenario."},
      {"id":"c","text":"The access log has an error","correct":false,"explanation":"Access logs are a key security control. Dismissing anomalous log entries without investigation is a dangerous assumption."},
      {"id":"d","text":"A system automated process ran under the contractor''s account","correct":false,"explanation":"Automated processes have their own service accounts and do not run under individual user credentials."}
    ]},
    {"id":"q3","text":"Why is negligent insider behavior considered the most common category of insider threat?","options":[
      {"id":"a","text":"Most employees are dishonest","correct":false,"explanation":"Negligence is not dishonesty. Most employees are acting in good faith but without sufficient awareness or care."},
      {"id":"b","text":"Most organizations have inadequate technical controls","correct":false,"explanation":"Technical controls can reduce but not eliminate negligent behavior."},
      {"id":"c","text":"Human error and lack of security awareness are widespread and create security gaps without malicious intent","correct":true,"explanation":"Mistakes are universal. Sending data to the wrong address, failing to lock a screen, or mishandling a file are common events that create real security risks without any malicious motivation."},
      {"id":"d","text":"Negligent employees are easier to prosecute than malicious ones","correct":false,"explanation":"This is not a reason for the frequency of negligent insider incidents."}
    ]}
  ]}',
  30,'1.1'
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c12,v_mod,'Recognizing Warning Signs and Responding Correctly','text',
  '<p>While insider threats are difficult to detect, certain behaviors can serve as indicators. Recognizing and appropriately responding to these signs, without prejudging colleagues, is an important organizational defense.</p>
<h3>Behavioral Warning Signs</h3>
<ul>
  <li>Sudden unexplained interest in data or systems outside their normal role</li>
  <li>Attempting to access areas or systems they have no business reason to access</li>
  <li>Working unusual hours, especially after hours or on weekends, without clear reason</li>
  <li>Downloading or copying large amounts of data, especially near a departure date</li>
  <li>Expressing significant grievances about the organization, colleagues, or management</li>
  <li>Financial difficulties or significant unexplained changes in lifestyle</li>
  <li>Attempts to circumvent security controls or disable monitoring</li>
</ul>
<h3>Technical Indicators</h3>
<ul>
  <li>Access to systems outside normal working hours</li>
  <li>Large-scale data downloads or exports not related to current work</li>
  <li>Sending large volumes of email to external addresses</li>
  <li>Accessing data unrelated to their role</li>
  <li>Multiple failed access attempts to restricted systems</li>
  <li>Use of personal devices or storage media for organizational data</li>
</ul>
<h3>How to Respond</h3>
<p>Behavioral indicators do not prove wrongdoing. They are signals that warrant attention and, where appropriate, reporting to security or HR through proper channels. Do not:</p>
<ul>
  <li>Confront the individual directly: this may alert them and allow them to cover their tracks</li>
  <li>Share your suspicions with other colleagues: this creates rumors and may compromise an investigation</li>
  <li>Ignore what you have observed: unexplained behavior warrants appropriate follow-up</li>
</ul>
<p><strong>Do:</strong> Report concerns confidentially to your line manager, HR, or the security team. Provide factual observations, not interpretations.</p>
<figure style="margin:1.5rem 0"><img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&auto=format&fit=crop&q=80" alt="Security monitoring and behavioral analysis" style="width:100%;border-radius:8px;max-height:280px;object-fit:cover" /><figcaption style="font-size:0.75rem;color:#94a3b8;margin-top:0.5rem;font-style:italic;text-align:center">Behavioral and technical warning signs rarely occur in isolation. A pattern of anomalous activity is more significant than any single indicator.</figcaption></figure>',
  40,'1.2'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c12q,v_mod,'Quiz: Warning Signs and Response','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"You notice a colleague accessing customer account records in systems unrelated to their role and copying data to a USB drive. What is the correct response?","options":[
      {"id":"a","text":"Ask the colleague directly what they are doing","correct":false,"explanation":"Direct confrontation may alert the individual, allowing them to destroy evidence or cover their actions."},
      {"id":"b","text":"Report the specific factual observations confidentially to your manager or security team","correct":true,"explanation":"Report factual observations through appropriate channels. Do not confront, do not speculate, and do not share with colleagues. Let the security or HR team investigate."},
      {"id":"c","text":"Do nothing: there may be a legitimate reason","correct":false,"explanation":"Unexplained access to out-of-role systems and data copying warrant reporting. Investigation will determine whether the explanation is legitimate."},
      {"id":"d","text":"Tell colleagues in the team so they can keep an eye on the situation","correct":false,"explanation":"Sharing suspicions with colleagues creates rumors, may reach the subject, and could compromise an investigation."}
    ]},
    {"id":"q2","text":"Which combination of behaviors is the most significant indicator of a potential malicious insider threat?","options":[
      {"id":"a","text":"Working late occasionally and taking work home","correct":false,"explanation":"Working late and taking work home are common behaviors without security significance."},
      {"id":"b","text":"Downloading large volumes of customer data in the weeks before a known resignation date","correct":true,"explanation":"Large-scale data downloads near a departure date is one of the most common patterns preceding malicious insider data theft."},
      {"id":"c","text":"Asking questions about other departments'' work","correct":false,"explanation":"Curiosity about other teams is not inherently suspicious."},
      {"id":"d","text":"Occasionally accessing systems after hours to finish urgent work","correct":false,"explanation":"After-hours access for legitimate urgent work is common. The combination with other indicators would raise the concern."}
    ]},
    {"id":"q3","text":"Why should behavioral warning signs be reported as factual observations rather than interpretations?","options":[
      {"id":"a","text":"Security teams do not understand behavioral language","correct":false,"explanation":"This is not the reason."},
      {"id":"b","text":"Factual observations enable a proper investigation, while interpretations may prejudge the outcome and could be wrong","correct":true,"explanation":"Reporting ''I observed X and Y'' is appropriate. Reporting ''I think X is stealing data'' is an interpretation that may be incorrect and could create liability or unfair accusations."},
      {"id":"c","text":"Legal requirements prohibit employees from making interpretive statements","correct":false,"explanation":"While legal considerations may apply, the primary reason is investigative integrity and accuracy."},
      {"id":"d","text":"Interpretations are less likely to be taken seriously by security teams","correct":false,"explanation":"This is not the reason. Factual observations are preferred because they are accurate and enable proper investigation."}
    ]}
  ]}',
  50,'1.2'
);

-- CP1
INSERT INTO public.quizzes (id,module_id,title,description,pass_score,max_attempts,quiz_type,section_number) VALUES (
  v_cp1,v_mod,'Topic 1 Checkpoint: Understanding Insider Threats',
  'Covers insider threat categories, motivations, and warning signs. 70% required to continue.',70,3,'checkpoint','1.0'
);
vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'Which insider threat category poses the highest detection challenge to security teams?','multiple_choice',1,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Negligent insiders: they are most common',false,1),(vb,vq,'Malicious insiders with legitimate access who act slowly and deliberately over time',true,2),(vc,vq,'Compromised insiders: because they are external attackers',false,3),(vd,vq,'New employees: because they are unfamiliar with systems',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'An employee under financial pressure begins accessing customer data outside their normal role. This is most consistent with:','multiple_choice',2,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Normal behavior: financial pressure affects everyone',false,1),(vb,vq,'A combination of warning signs that warrant reporting to the security team',true,2),(vc,vq,'A technical system error assigning incorrect data access',false,3),(vd,vq,'A compromised insider scenario',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'What makes compromised insiders particularly dangerous from a security monitoring perspective?','multiple_choice',3,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'They have administrator access to all systems',false,1),(vb,vq,'Their activity appears as legitimate user behavior, making it difficult to distinguish from normal access',true,2),(vc,vq,'They cannot be prosecuted because they are not acting intentionally',false,3),(vd,vq,'They always operate from external networks',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'A colleague asks you to use your credentials to access a system because they forgot theirs. What should you do?','multiple_choice',4,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Help them out: it is a minor favour',false,1),(vb,vq,'Refuse: credentials are personal and must not be shared; direct them to IT to reset theirs',true,2),(vc,vq,'Use your credentials but log out immediately afterward',false,3),(vd,vq,'Report them to management',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'Why should you not directly confront a colleague you suspect of insider threat behavior?','multiple_choice',5,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'You may be wrong and embarrass yourself',false,1),(vb,vq,'Direct confrontation may alert the subject, enabling them to destroy evidence or take evasive action before a formal investigation can begin',true,2),(vc,vq,'It is not your responsibility as a non-security employee',false,3),(vd,vq,'You could be held legally liable for making an accusation',false,4);

--  TOPIC 2 --
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number,learning_objectives) VALUES (
  v_c20,v_mod,'Access Control Principles','text',
  '<p>Access control is the technical and procedural mechanism that limits what each user can do within a system. Strong access control limits the damage that any single insider, malicious or negligent, can cause.</p>',
  60,'2.0',
  ARRAY['Explain the principle of least privilege and how it limits insider threat impact','Describe the role of access reviews in maintaining secure access','Identify correct procedures for managing access when employees change roles or leave']
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c21,v_mod,'Least Privilege and Need-to-Know','text',
  '<p>Access control is governed by two foundational principles that limit both the opportunity for insider threats and the blast radius when any incident occurs.</p>
<h3>Principle of Least Privilege</h3>
<p>Every user, system, and process should have the minimum level of access required to perform their function, and nothing more. A customer service representative needs access to customer accounts in their region. They do not need access to payroll systems, IT infrastructure, or accounts in other regions.</p>
<p><strong>Why it matters:</strong> If a least-privilege account is compromised or misused, the damage is limited to what that account can access. A privileged account with excessive rights creates disproportionate risk.</p>
<h3>Need-to-Know</h3>
<p>Even within authorized systems, access to specific data should be limited to those with a legitimate business need to see it. This applies within teams as well as across departments.</p>
<p><strong>Examples:</strong></p>
<ul>
  <li>An analyst working on retail lending does not need access to corporate banking client data</li>
  <li>A junior member of a project team does not need access to the full financial model; only the sections relevant to their task</li>
  <li>A customer service agent should not have access to salary information for other employees</li>
</ul>
<h3>Separation of Duties</h3>
<p>No single person should be able to initiate and approve a financial transaction, create and authorize a new payee, or modify and verify their own access rights. Requiring two people to complete sensitive processes eliminates a single point of failure and prevents certain forms of fraud.</p>
<h3>Privileged Access Management</h3>
<p>Administrative and privileged accounts have elevated access to systems and data. These accounts must be:</p>
<ul>
  <li>Used only for the specific tasks requiring elevated access, not for routine work like reading email</li>
  <li>Protected with MFA</li>
  <li>Logged and monitored at a higher level than standard accounts</li>
  <li>Reviewed regularly to ensure ongoing need</li>
</ul>',
  70,'2.1'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c21q,v_mod,'Quiz: Least Privilege and Separation of Duties','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"A new loan officer is given administrator access to all banking systems to make their onboarding easier. What principle does this violate?","options":[
      {"id":"a","text":"Separation of duties",false,"explanation":"Separation of duties is about preventing single individuals from controlling entire processes. This is a different issue."},
      {"id":"b","text":"Least privilege: the employee should receive only the access required for their specific role, not universal administrator access","correct":true,"explanation":"Granting excessive access violates least privilege. If this account is compromised or misused, the entire system is at risk, far beyond what the role requires."},
      {"id":"c","text":"Data minimization","correct":false,"explanation":"Data minimization is a data protection principle about what data is collected. This is an access control issue."},
      {"id":"d","text":"No principle: onboarding convenience is a valid reason for broad access","correct":false,"explanation":"Convenience does not override security principles. Excessive access creates disproportionate risk."}
    ]},
    {"id":"q2","text":"The payment authorization process requires one employee to create a payment and a different employee to approve it. This is an example of:","options":[
      {"id":"a","text":"Least privilege","correct":false,"explanation":"Least privilege is about limiting individual access levels. This is about requiring two people for a process."},
      {"id":"b","text":"Separation of duties: requiring two independent individuals to complete a sensitive process","correct":true,"explanation":"Separation of duties prevents any single person from controlling an entire high-risk process. This is a standard fraud prevention control in payment systems."},
      {"id":"c","text":"Multi-factor authentication","correct":false,"explanation":"MFA is an identity authentication control. This is a process control requiring two people."},
      {"id":"d","text":"Data classification","correct":false,"explanation":"Data classification is about labeling data by sensitivity, not about process controls."}
    ]},
    {"id":"q3","text":"An employee uses their administrator account to read their work email throughout the day, rather than using their standard account. Why is this a problem?","options":[
      {"id":"a","text":"Administrator accounts cannot access email systems","correct":false,"explanation":"This is a technical constraint on some systems but not universally true. The security issue is different."},
      {"id":"b","text":"Using a privileged account for routine tasks unnecessarily exposes that account to compromise, through phishing or credential theft, with significantly higher impact than a standard account","correct":true,"explanation":"Privileged accounts should be used only for tasks requiring elevated access. Using them for routine work (email, web browsing) exposes them to common attack vectors, and compromise of a privileged account has far greater consequences."},
      {"id":"c","text":"It slows down the email system for other users","correct":false,"explanation":"Performance impact is not the security concern here."},
      {"id":"d","text":"Administrator accounts require MFA for email access","correct":false,"explanation":"This may be a control, but the underlying security principle is about not using privileged accounts for routine work."}
    ]}
  ]}',
  80,'2.1'
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c22,v_mod,'Managing Access Throughout the Employee Lifecycle','text',
  '<p>Access control is not a one-time event at onboarding. It must be actively managed throughout the employee''s lifecycle, and critically, when they leave.</p>
<h3>Access Reviews</h3>
<p>Access rights accumulate over time. An employee who moves between roles often retains access from previous positions, creating "access creep." Regular access reviews identify and remove access that is no longer needed.</p>
<p><strong>Best practice:</strong> Access rights should be reviewed:</p>
<ul>
  <li>When an employee changes role or department</li>
  <li>At a defined periodic interval (annually for standard accounts; more frequently for privileged accounts)</li>
  <li>Immediately when an employee raises a grievance or is placed under investigation</li>
</ul>
<h3>Offboarding: The Critical Risk Window</h3>
<p>When an employee leaves, especially involuntarily, there is a heightened risk of data theft or sabotage. The period immediately before and after departure is when insider incidents are most likely to occur.</p>
<p><strong>Access must be revoked:</strong></p>
<ul>
  <li>On the employee''s last working day, not after it</li>
  <li>For all systems: corporate email, VPN, cloud services, internal applications, physical access cards</li>
  <li>Immediately if the departure is involuntary (termination, suspension)</li>
</ul>
<h3>Shared Accounts and Credentials</h3>
<p>Shared accounts, where multiple users log in with the same credentials, are a significant access control weakness:</p>
<ul>
  <li>Activity cannot be attributed to a specific individual</li>
  <li>Access cannot be revoked for one user without affecting all users</li>
  <li>Password changes must be communicated to all users, creating exposure risk</li>
</ul>
<p>Every individual should have their own unique account. Shared credentials are prohibited in secure environments.</p>
<h3>Your Access Responsibilities</h3>
<ul>
  <li>Request only the access you need</li>
  <li>Report access to systems you no longer need so it can be removed</li>
  <li>Never share your credentials with anyone</li>
  <li>Report immediately if you suspect your account has been accessed by someone else</li>
</ul>',
  90,'2.2'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c22q,v_mod,'Quiz: Access Management','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"An employee moves from the retail banking team to the corporate banking team. Their retail system access should be:","options":[
      {"id":"a","text":"Retained in case they need it as a reference","correct":false,"explanation":"Retaining unnecessary access violates least privilege and creates insider threat risk."},
      {"id":"b","text":"Revoked when they transfer: they no longer have a business need for retail system access","correct":true,"explanation":"When an employee changes roles, access from the previous role should be removed. Retaining it creates access creep and unnecessary risk."},
      {"id":"c","text":"Converted to read-only access as a compromise","correct":false,"explanation":"If there is no business need, the access should be fully removed, not reduced. Residual access creates unnecessary risk."},
      {"id":"d","text":"Retained until the employee requests its removal","correct":false,"explanation":"Access management should not be passive. Removing no-longer-needed access is a proactive organizational responsibility."}
    ]},
    {"id":"q2","text":"An employee is dismissed for gross misconduct. When should their system access be revoked?","options":[
      {"id":"a","text":"Within one week, after HR processes are complete","correct":false,"explanation":"One week is too long. An involuntarily terminated employee has heightened insider threat risk during that window."},
      {"id":"b","text":"Immediately, at the same time as or before notifying the employee of dismissal","correct":true,"explanation":"Involuntary departures carry the highest insider threat risk. Access must be revoked immediately, before or simultaneously with the dismissal notification, to prevent retaliatory action or data theft."},
      {"id":"c","text":"On the last day they are legally required to work","correct":false,"explanation":"An employee notified of dismissal who retains access represents significant risk. Revoke immediately."},
      {"id":"d","text":"Only email access: other system access can wait","correct":false,"explanation":"All access must be revoked: email, VPN, cloud services, applications, and physical access cards."}
    ]},
    {"id":"q3","text":"Your team uses a shared account to access a third-party reporting tool. Why is this a security risk?","options":[
      {"id":"a","text":"Shared accounts use weaker encryption","correct":false,"explanation":"Account type does not determine encryption strength."},
      {"id":"b","text":"Activity in a shared account cannot be attributed to a specific individual, making investigations impossible and access revocation for one user impractical","correct":true,"explanation":"Individual accountability requires individual accounts. Shared credentials destroy audit trail integrity and make it impossible to revoke access for a single user without affecting all."},
      {"id":"c","text":"Shared accounts expire more frequently","correct":false,"explanation":"This is not a specific security risk of shared accounts."},
      {"id":"d","text":"The third-party vendor can see who is logged in","correct":false,"explanation":"The vendor''s visibility is not the primary security concern here."}
    ]}
  ]}',
  100,'2.2'
);

-- CP2
INSERT INTO public.quizzes (id,module_id,title,description,pass_score,max_attempts,quiz_type,section_number) VALUES (
  v_cp2,v_mod,'Topic 2 Checkpoint: Access Control Principles',
  'Covers least privilege, separation of duties, and access lifecycle management. 70% required to unlock the final exam.',70,3,'checkpoint','2.0'
);
vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'An employee''s access rights from three previous roles are still active. What is this called and why is it a risk?','multiple_choice',1,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Account synchronization: it is normal and expected',false,1),(vb,vq,'Access creep: accumulated permissions increase the blast radius if the account is compromised or misused',true,2),(vc,vq,'Privilege escalation: the employee has hacked their own account',false,3),(vd,vq,'Redundant access: a minor efficiency issue only',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'Why should privileged/administrator accounts not be used for routine tasks such as reading email?','multiple_choice',2,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Privileged accounts cannot access standard applications',false,1),(vb,vq,'Routine tasks expose the account to common attack vectors; compromise of a privileged account has far greater consequences than a standard account',true,2),(vc,vq,'It creates excessive audit log entries',false,3),(vd,vq,'Standard accounts have better performance for non-administrative tasks',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'What is the purpose of separation of duties as an access control?','multiple_choice',3,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'To reduce the number of people who need system access',false,1),(vb,vq,'To prevent any single individual from controlling an entire high-risk process, eliminating a single point of fraud or error',true,2),(vc,vq,'To ensure all employees have equal access to systems',false,3),(vd,vq,'To reduce system load by distributing tasks',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'You realize you still have access to a system from a project that ended six months ago. What should you do?','multiple_choice',4,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Keep the access in case the project restarts',false,1),(vb,vq,'Report the residual access to IT and request that it be removed',true,2),(vc,vq,'Continue using it only when necessary for similar projects',false,3),(vd,vq,'Nothing: if access was granted, it is still authorized',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'A well-liked, long-serving employee who is leaving voluntarily asks if their access could remain active for two weeks after departure "to help with the handover". What is the correct response?','multiple_choice',5,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Allow it: they are trusted and leaving voluntarily',false,1),(vb,vq,'Decline: access must be revoked on the last working day; handover documentation should be completed before departure',true,2),(vc,vq,'Allow limited read-only access for two weeks',false,3),(vd,vq,'Escalate to the CEO for a decision given the employee''s service',false,4);

-- ═══ TOPIC 3: Module Summary ═════════════════════════════════════════════════

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number,learning_objectives) VALUES (
  v_cS0,v_mod,'Module Summary','text',
  '<p>You have completed all core topics in this module. Watch the video below for a concise recap of the key concepts covered, then proceed to the final exam.</p>',
  200,'3.0',
  ARRAY['Review and consolidate the key concepts from this module before the final exam']
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,content_url,image_caption,order_index,section_number) VALUES (
  v_cS1,v_mod,'Insider Threats and Access Control: Summary Video','video',
  NULL,'https://www.youtube.com/watch?v=3mK0OJoNOWM',
  'This video summarizes insider threat categories, behavioral warning signs, and access control principles covered in this module.',
  210,'3.1'
);

-- ═══ FINAL EXAM ══════════════════════════════════════════════════════════════
INSERT INTO public.quizzes (id,module_id,title,description,pass_score,max_attempts,time_limit_mins,quiz_type) VALUES (
  v_fe,v_mod,'Insider Threats and Access Control: Final Exam',
  'Covers all topics. 70% required to pass. 25-minute time limit.',70,2,25,'final_exam'
);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'What are the three categories of insider threats?','multiple_choice',1,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Internal, external, and hybrid',false,1),(vb,vq,'Malicious, negligent, and compromised',true,2),(vc,vq,'Intentional, accidental, and systemic',false,3),(vd,vq,'Employee, contractor, and third-party',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'The principle of least privilege requires that users be granted:','multiple_choice',2,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'The same level of access as their most senior colleague',false,1),(vb,vq,'The minimum access required to perform their specific function',true,2),(vc,vq,'Access to all systems relevant to their department',false,3),(vd,vq,'Access requested by their manager without restriction',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'An employee downloads the bank''s full customer database one month before their known departure to a competitor. Which insider threat category is this?','multiple_choice',3,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Negligent insider',false,1),(vb,vq,'Compromised insider',false,2),(vc,vq,'Malicious insider',true,3),(vd,vq,'External threat actor',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'When should access for an involuntarily terminated employee be revoked?','multiple_choice',4,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Within 24 hours of termination',false,1),(vb,vq,'At the time of or before notifying the employee of their termination',true,2),(vc,vq,'On the last contracted working day',false,3),(vd,vq,'After the employee returns their equipment',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Why are insider threats harder to detect than external attacks?','multiple_choice',5,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Insiders always use encryption to hide their activities',false,1),(vb,vq,'Insiders use legitimate credentials and access, making their activity indistinguishable from normal behavior',true,2),(vc,vq,'Security teams focus only on external threats',false,3),(vd,vq,'Insiders have technical skills that allow them to disable monitoring',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'What is access creep?','multiple_choice',6,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Gradual unauthorized escalation of privileges by an attacker',false,1),(vb,vq,'The accumulation of access rights from previous roles that are not removed when the employee moves on',true,2),(vc,vq,'An employee slowly gaining trust before abusing access',false,3),(vd,vq,'A system bug that expands user permissions over time',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'A colleague asks to borrow your login credentials while IT resets their password. You should:','multiple_choice',7,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Help them: it is a temporary, minor accommodation',false,1),(vb,vq,'Refuse and direct them to IT for a password reset on their own account',true,2),(vc,vq,'Share credentials but change your password immediately after',false,3),(vd,vq,'Allow use but monitor what they access',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Separation of duties requires that creating and approving a payment be performed by:','multiple_choice',8,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'The same person to ensure accuracy',false,1),(vb,vq,'Two different, independent individuals',true,2),(vc,vq,'At least three people for any payment',false,3),(vd,vq,'A manager in all cases',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Which behavior is the highest-risk indicator of an imminent malicious insider incident?','multiple_choice',9,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Working from home more frequently than usual',false,1),(vb,vq,'Large-scale data downloads in the weeks before a known departure date',true,2),(vc,vq,'Asking questions about other teams'' projects',false,3),(vd,vq,'Occasionally accessing systems outside normal hours',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'What is the correct way to report a suspected insider threat?','multiple_choice',10,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Confront the individual directly and ask for an explanation',false,1),(vb,vq,'Report factual observations confidentially to your manager, security team, or HR',true,2),(vc,vq,'Discuss with colleagues to see if they have noticed anything',false,3),(vd,vq,'Monitor the individual yourself for two weeks before reporting',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'An employee inadvertently emails customer records to the wrong recipient. This is an example of:','multiple_choice',11,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Malicious insider threat',false,1),(vb,vq,'Negligent insider threat',true,2),(vc,vq,'Compromised insider threat',false,3),(vd,vq,'External attack',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Why are shared accounts a security risk?','multiple_choice',12,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Shared accounts use weaker passwords by default',false,1),(vb,vq,'Activity cannot be attributed to an individual, and access cannot be revoked for one user without affecting all users of that account',true,2),(vc,vq,'Shared accounts are flagged by security systems as suspicious',false,3),(vd,vq,'Multiple users on one account causes performance degradation',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Access rights should be reviewed when an employee changes roles because:','multiple_choice',13,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'New roles require a complete system rebuild',false,1),(vb,vq,'Previous role access is no longer needed and its retention creates unnecessary risk and violates least privilege',true,2),(vc,vq,'Access systems cannot support multiple role profiles',false,3),(vd,vq,'This is a regulatory requirement for all role changes',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'A security team member notices a user account accessing systems at 3am with no prior history of after-hours access. What should this trigger?','multiple_choice',14,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Automatic account deletion',false,1),(vb,vq,'Investigation to determine whether the access is legitimate or indicates a compromised or malicious insider',true,2),(vc,vq,'An email to the account holder asking if they were working late',false,3),(vd,vq,'No action: after-hours access is common',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'What is the primary purpose of regular access reviews?','multiple_choice',15,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'To ensure employees are using all the access they have been granted',false,1),(vb,vq,'To identify and remove access that is no longer required, maintaining least privilege over time',true,2),(vc,vq,'To monitor employee productivity through system usage',false,3),(vd,vq,'To identify candidates for promotion based on system usage patterns',false,4);

END $$;
