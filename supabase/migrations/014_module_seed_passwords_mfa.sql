
-- 014_module_seed_passwords_mfa.sql
-- Module 3: Password Security and Multi-Factor Authentication
-- Topic 1.0 – Password Security Fundamentals (2 subtopics + checkpoint)
-- Topic 2.0 – Multi-Factor Authentication (2 subtopics + checkpoint)
-- Final Exam: 15 MCQs


DO $body$
DECLARE
  v_mod UUID := gen_random_uuid();
  v_c10 UUID:=gen_random_uuid(); v_c11 UUID:=gen_random_uuid(); v_c11q UUID:=gen_random_uuid();
  v_c12 UUID:=gen_random_uuid(); v_c12q UUID:=gen_random_uuid();
  v_c20 UUID:=gen_random_uuid(); v_c21 UUID:=gen_random_uuid(); v_c21q UUID:=gen_random_uuid();
  v_c22 UUID:=gen_random_uuid(); v_c22q UUID:=gen_random_uuid();
  v_cp1 UUID:=gen_random_uuid(); v_cp2 UUID:=gen_random_uuid(); v_fe UUID:=gen_random_uuid();
  v_cS0 UUID:=gen_random_uuid(); v_cS1 UUID:=gen_random_uuid();
  vq UUID; va UUID; vb UUID; vc UUID; vd UUID;
BEGIN

INSERT INTO public.modules (id,title,description,status,order_index,duration_mins) VALUES (
  v_mod,'Password Security and Multi-Factor Authentication',
  'Passwords remain the primary authentication mechanism for most systems. This module explains why passwords fail, how to create and manage strong credentials, and how multi-factor authentication provides a critical second layer of defense.',
  'published',3,40
);
INSERT INTO public.module_role_access (module_id,role_id) SELECT v_mod,id FROM public.roles;

-- TOPIC 1: Password Security Fundamentals

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number,learning_objectives) VALUES (
  v_c10,v_mod,'Password Security Fundamentals','text',
  '<p>Passwords are the most widely exploited authentication control. Understanding how they fail is the foundation for using them effectively.</p>',
  10,'1.0',
  ARRAY['Explain the primary methods attackers use to compromise passwords','Construct a strong, memorable password using current best practices','Describe the risks of password reuse across multiple accounts']
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c11,v_mod,'How Passwords Are Compromised','text',
  '<p>Before understanding how to create good passwords, it is important to understand how attackers obtain or crack them. This knowledge shapes every password decision you make.</p>
<h3>Credential Stuffing</h3>
<p>Attackers obtain large databases of username/password combinations from previous data breaches (these are freely available on the dark web). They then systematically try these credentials against banking systems, email platforms, and other services. If you reuse a password from a breached site, any service using that password is now at risk.</p>
<p><strong>Scale:</strong> There are billions of compromised credentials in circulation. Automated tools can test thousands of login attempts per minute.</p>
<h3>Brute Force Attacks</h3>
<p>Systematic trial of every possible combination until the correct password is found. Against offline password databases, modern hardware can test billions of combinations per second. A 6-character password can be cracked in seconds. An 8-character password can be cracked in hours.</p>
<h3>Dictionary Attacks</h3>
<p>Using lists of common words, phrases, and known password patterns. People predictably use words from their language, followed by numbers (Password123), or substitute letters with numbers (P@ssw0rd). These patterns are all included in modern attack dictionaries.</p>
<h3>Phishing for Credentials</h3>
<p>The simplest method: trick you into typing your password into a fake site. No cracking required; you hand it over directly.</p>
<h3>Shoulder Surfing</h3>
<p>Physically observing someone enter their password. Relevant in open-plan offices, public spaces, and when using devices on public transport.</p>
<h3>The Reuse Problem</h3>
<p>Password reuse is the most dangerous habit. A breach of your personal email, which likely has weaker security than your work environment, gives attackers a credential they can try against every other service you use. One password compromised becomes all passwords compromised.</p>
<figure style="margin:1.5rem 0"><img src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=80" alt="Login screen and password security" style="width:100%;border-radius:8px;max-height:280px;object-fit:cover" /><figcaption style="font-size:0.75rem;color:#94a3b8;margin-top:0.5rem;font-style:italic;text-align:center">Attackers have automated tools that can test billions of password combinations per second, making weak or reused passwords highly vulnerable.</figcaption></figure>',
  20,'1.1'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c11q,v_mod,'Quiz: How Passwords Are Compromised','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"What is credential stuffing?","options":[
      {"id":"a","text":"Using high-performance computers to guess random passwords","correct":false,"explanation":"This describes brute force. Credential stuffing is more targeted."},
      {"id":"b","text":"Using username and password combinations from previous data breaches to attempt logins across multiple services","correct":true,"explanation":"Credential stuffing exploits password reuse: if you use the same password on multiple sites, a breach of one exposes all of them."},
      {"id":"c","text":"Sending phishing emails to steal passwords","correct":false,"explanation":"Phishing is a separate attack method. Credential stuffing uses already-stolen credentials."},
      {"id":"d","text":"Installing keyloggers to capture passwords as they are typed","correct":false,"explanation":"Keylogging captures new passwords. Credential stuffing reuses already-stolen ones."}
    ]},
    {"id":"q2","text":"Why is a password like ''Password123'' considered weak despite containing uppercase, lowercase, and numbers?","options":[
      {"id":"a","text":"It is too long","correct":false,"explanation":"Length is a strength factor, not a weakness. Password123 is 11 characters."},
      {"id":"b","text":"It follows a predictable pattern.Common word with numbers appended ,that is included in all modern attack dictionaries","correct":true,"explanation":"Complexity requirements (uppercase, numbers, symbols) are easily satisfied by predictable patterns. Attackers know these patterns and include them in dictionary attacks."},
      {"id":"c","text":"It contains the word ''password'' which is a reserved system term","correct":false,"explanation":"There is no such reserved term. The issue is predictability."},
      {"id":"d","text":"All passwords under 12 characters are automatically weak","correct":false,"explanation":"Length is important, but the primary issue here is the predictable pattern."}
    ]},
    {"id":"q3","text":"An employee uses the same password for their work email, personal email, and online shopping account. Their personal email is breached. What is the risk to the bank?","options":[
      {"id":"a","text":"None: personal accounts are separate from work systems","correct":false,"explanation":"If the same password is used, the breach of the personal account gives attackers the work account password."},
      {"id":"b","text":"The attacker now has the employee''s work email password and can attempt to access bank systems","correct":true,"explanation":"Password reuse means one breach compromises all accounts using that password. Personal email breaches are a common pathway to corporate account compromise."},
      {"id":"c","text":"The risk is limited to the shopping account","correct":false,"explanation":"The risk extends to every account using that password, including work accounts."},
      {"id":"d","text":"The bank''s system will automatically detect the reused password and block access","correct":false,"explanation":"Banks cannot detect that a password is reused from an external site."}
    ]}
  ]}',
  30,'1.1'
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c12,v_mod,'Creating and Managing Strong Passwords','text',
  '<p>Modern password guidance has evolved significantly. Understanding current best practices helps you create credentials that are both secure and manageable.</p>
<h3>What Makes a Password Strong</h3>
<p>Current guidance from security standards prioritizes <strong>length over complexity</strong>. A long passphrase is more secure than a short, complex password:</p>
<ul>
  <li><strong>Length:</strong> Aim for at least 12 characters; 16+ is better. Each additional character exponentially increases crack time.</li>
  <li><strong>Unpredictability:</strong> Avoid words from the dictionary, names, dates, and common substitutions (@ for a, 0 for o).</li>
  <li><strong>Uniqueness:</strong> Every account must have a different password.</li>
</ul>
<h3>The Passphrase Approach</h3>
<p>A passphrase is a sequence of random words .It is long, memorable, and highly resistant to cracking. Example: <strong>correct-horse-battery-staple</strong> (four random words) has more entropy than most complex short passwords and is far easier to remember.</p>
<h3>What to Avoid</h3>
<ul>
  <li>Your name, children''s names, or pet names</li>
  <li>Birth dates, anniversaries, or other personal dates</li>
  <li>Your organization''s name or commonly known information about you</li>
  <li>Sequential patterns: 1234, abcd, qwerty</li>
  <li>Common substitutions: P@ssw0rd, S3cur1ty</li>
</ul>
<h3>Password Managers</h3>
<p>No human can memorize unique, strong passwords for every account. Password managers solve this by generating and storing unique, complex passwords for every service. You need to remember only one strong master password. Your organization may provide an approved password manager; use it if available. Consumer password managers (1Password, Bitwarden) are far better than reusing passwords.</p>
<h3>Mandatory Change Practices</h3>
<p>Change your password immediately when:</p>
<ul>
  <li>You suspect it may have been compromised</li>
  <li>You have shared it with someone (even IT i.e legitimate IT staff will never ask for your password)</li>
  <li>A service you use reports a data breach</li>
</ul>
<figure style="margin:1.5rem 0"><img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=80" alt="Password manager and strong credentials concept" style="width:100%;border-radius:8px;max-height:280px;object-fit:cover" /><figcaption style="font-size:0.75rem;color:#94a3b8;margin-top:0.5rem;font-style:italic;text-align:center">A password manager enables you to use a unique, randomly generated password for every account without memorizing them all.</figcaption></figure>',
  40,'1.2'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c12q,v_mod,'Quiz: Strong Password Practices','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"Which of the following passwords is the strongest?","options":[
      {"id":"a","text":"P@ssw0rd!2024","correct":false,"explanation":"Despite the complexity symbols, this follows a predictable pattern (common word, substitutions, year) found in all attack dictionaries."},
      {"id":"b","text":"thunder-canyon-marble-eclipse","correct":true,"explanation":"Four random words create a long passphrase with high entropy that is resistant to dictionary attacks and easy to remember."},
      {"id":"c","text":"JohnSmith1985!","correct":false,"explanation":"This uses personal information (name and birth year) that an attacker who researched you could easily guess."},
      {"id":"d","text":"Qwerty123$","correct":false,"explanation":"Qwerty is a keyboard pattern. Common patterns are always in attacker dictionaries."}
    ]},
    {"id":"q2","text":"IT support contacts you by phone and asks for your password to resolve an account issue. What is the correct response?","options":[
      {"id":"a","text":"Provide the password: they need it to help you","correct":false,"explanation":"Legitimate IT staff never need your password. They have administrative tools that do not require your credentials."},
      {"id":"b","text":"Refuse to provide it: legitimate IT staff never require your password to perform their work","correct":true,"explanation":"A request for your password is always a red flag, whether by phone, email, or in person. Report such requests to your security team."},
      {"id":"c","text":"Provide only the first half of your password","correct":false,"explanation":"Any portion of your password should not be shared. Partial disclosure is still a security risk."},
      {"id":"d","text":"Change your password immediately and give them the new one","correct":false,"explanation":"This does not solve the problem. The request itself is the issue; report it."}
    ]},
    {"id":"q3","text":"What is the primary advantage of using a password manager?","options":[
      {"id":"a","text":"Password managers generate passwords that are immune to brute force attacks","correct":false,"explanation":"No password is immune to brute force, though very long passwords are practically infeasible. The primary benefit is enabling unique passwords."},
      {"id":"b","text":"It enables you to use a unique, complex password for every account without having to memorize them all","correct":true,"explanation":"Password reuse is the primary password risk. A manager solves this by generating and storing unique passwords, requiring you to remember only one master password."},
      {"id":"c","text":"Password managers encrypt your identity, making you anonymous online","correct":false,"explanation":"Password managers do not provide anonymity. They manage credentials."},
      {"id":"d","text":"They prevent phishing attacks by blocking access to fake websites","correct":false,"explanation":"Some password managers warn about unrecognized sites, but preventing phishing is not their primary function."}
    ]}
  ]}',
  50,'1.2'
);

-- CP1
INSERT INTO public.quizzes (id,module_id,title,description,pass_score,max_attempts,quiz_type,section_number) VALUES (
  v_cp1,v_mod,'Topic 1 Checkpoint: Password Security',
  'Covers password attack methods and best practices. 70% required to continue.',70,3,'checkpoint','1.0'
);
vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'Which password attack method uses lists of previously breached username and password combinations?','multiple_choice',1,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Brute force',false,1),(vb,vq,'Credential stuffing',true,2),(vc,vq,'Dictionary attack',false,3),(vd,vq,'Shoulder surfing',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'Which of the following is the strongest password?','multiple_choice',2,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'S3cur1ty!2024',false,1),(vb,vq,'swift-lantern-puzzle-forest-bridge',true,2),(vc,vq,'FortiBank@123',false,3),(vd,vq,'MyP@ssword99',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'A colleague''s personal email is breached. They use the same password for personal email and their work account. What should happen immediately?','multiple_choice',3,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Nothing: personal and work accounts are separate systems',false,1),(vb,vq,'The work account password must be changed immediately, and IT security should be informed',true,2),(vc,vq,'The colleague should update the personal email security settings',false,3),(vd,vq,'Wait to see if any suspicious activity occurs on the work account',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'Someone calls claiming to be from IT and asks for your password to fix a login issue. What is the correct response?','multiple_choice',4,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Provide the password if they can verify their employee ID',false,1),(vb,vq,'Refuse: IT never requires a user''s password. Report the call to the security team',true,2),(vc,vq,'Give them a temporary version of the password',false,3),(vd,vq,'Change the password immediately and give them the new one',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'Why does current password guidance prioritize length over complexity (special characters, mixed case)?','multiple_choice',5,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Longer passwords are easier to type correctly',false,1),(vb,vq,'Complexity requirements are met by predictable patterns; length exponentially increases crack time regardless of patterns used',true,2),(vc,vq,'Special characters cause problems with some systems',false,3),(vd,vq,'Users remember long passwords better than complex short ones',false,4);

-- ═══ TOPIC 2: Multi-Factor Authentication ════════════════════════════════════

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number,learning_objectives) VALUES (
  v_c20,v_mod,'Multi-Factor Authentication','text',
  '<p>Even a perfect password can be compromised through phishing or data breaches. Multi-factor authentication provides a second layer that significantly limits the damage of credential theft.</p>',
  60,'2.0',
  ARRAY['Explain how MFA reduces the risk of credential-based attacks','Identify the three categories of authentication factors','Describe best practices for MFA enrollment and use']
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c21,v_mod,'What is Multi-Factor Authentication and How Does It Work?','text',
  '<p>Multi-factor authentication (MFA) requires users to verify their identity using two or more independent factors from different categories. Even if an attacker has your password, they cannot access your account without also having the second factor.</p>
<h3>The Three Authentication Factors</h3>
<ul>
  <li><strong>Something you know:</strong> a password, PIN, or security question answer. This factor is vulnerable to theft, phishing, and guessing.</li>
  <li><strong>Something you have:</strong> a physical device or token, such as a smartphone with an authenticator app, a hardware security key (YubiKey), or an SMS code sent to your phone. This factor requires the attacker to physically possess or access your device.</li>
  <li><strong>Something you are:</strong> a biometric identifier such as a fingerprint, facial recognition, or retina scan. This factor is inherent to you and difficult to replicate.</li>
</ul>
<h3>Why MFA Works</h3>
<p>MFA works because compromising two independent factors is significantly harder than compromising one. An attacker who steals your password through phishing cannot log in without also stealing your phone or biometric. A thief who steals your phone cannot log in without your password.</p>
<h3>The Impact of MFA</h3>
<p>Microsoft research indicates that MFA blocks over 99.9% of automated credential attacks. The vast majority of account compromises seen in corporate environments involve accounts without MFA enabled. This is one of the single highest-impact security controls available.</p>
<h3>MFA in the Banking Environment</h3>
<p>MFA should be used for:</p>
<ul>
  <li>All email and productivity tool access</li>
  <li>VPN and remote access</li>
  <li>Financial and payment systems</li>
  <li>Administrative and privileged accounts</li>
  <li>Any system accessible from outside the corporate network</li>
</ul>
<figure style="margin:1.5rem 0"><img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80" alt="Multi-factor authentication and secure access" style="width:100%;border-radius:8px;max-height:280px;object-fit:cover" /><figcaption style="font-size:0.75rem;color:#94a3b8;margin-top:0.5rem;font-style:italic;text-align:center">MFA ensures that a stolen password alone is not enough to gain access, requiring attackers to also compromise a second independent factor.</figcaption></figure>',
  70,'2.1'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c21q,v_mod,'Quiz: What is MFA?','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"An attacker successfully phishes an employee''s password. The employee has MFA enabled on their account using an authenticator app on their phone. Can the attacker log in?","options":[
      {"id":"a","text":"Yes: they have the password, which is all that is required","correct":false,"explanation":"With MFA enabled, the password alone is insufficient. The attacker also needs the second factor."},
      {"id":"b","text":"Not without also accessing the employee''s phone to retrieve the authenticator code","correct":true,"explanation":"MFA prevents credential-only attacks. The attacker needs both the password and the time-limited code from the phone, which are significantly harder to obtain simultaneously."},
      {"id":"c","text":"Yes: phishing attacks automatically bypass MFA","correct":false,"explanation":"Standard phishing attacks capture passwords. They do not automatically bypass properly configured MFA."},
      {"id":"d","text":"Only if the attacker acts within the same session","correct":false,"explanation":"The attacker cannot start a new session with a password alone if MFA is required."}
    ]},
    {"id":"q2","text":"Which of the following is an example of ''something you have'' as an authentication factor?","options":[
      {"id":"a","text":"Your fingerprint","correct":false,"explanation":"A fingerprint is ''something you are'': a biometric factor."},
      {"id":"b","text":"Your PIN","correct":false,"explanation":"A PIN is ''something you know'': a knowledge factor."},
      {"id":"c","text":"A hardware security key (such as a YubiKey) that you plug in to authenticate","correct":true,"explanation":"A physical security key is ''something you have'': a possession factor. Authenticator apps and SMS codes also fall in this category."},
      {"id":"d","text":"Your security question answer","correct":false,"explanation":"Security question answers are ''something you know'': a knowledge factor."}
    ]},
    {"id":"q3","text":"According to research, what percentage of automated credential attacks does MFA block?","options":[
      {"id":"a","text":"Around 50%","correct":false,"explanation":"MFA is far more effective than this."},
      {"id":"b","text":"Around 75%","correct":false,"explanation":"MFA blocks significantly more attacks than this figure."},
      {"id":"c","text":"Over 99.9%","correct":true,"explanation":"MFA blocks over 99.9% of automated credential attacks, making it one of the single most impactful security controls available."},
      {"id":"d","text":"Around 90%","correct":false,"explanation":"The actual figure is higher."}
    ]}
  ]}',
  80,'2.1'
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c22,v_mod,'MFA Methods, Risks, and Best Practices','text',
  '<p>Not all MFA methods provide the same level of protection. Understanding the differences helps you choose the strongest available option and avoid common weaknesses.</p>
<h3>MFA Methods Ranked by Security</h3>
<table style="border-collapse:collapse;width:100%;font-size:0.85em">
<tr style="border-bottom:1px solid #334155"><th style="text-align:left;padding:6px 8px;color:#94a3b8">Method</th><th style="text-align:left;padding:6px 8px;color:#94a3b8">Strength</th><th style="text-align:left;padding:6px 8px;color:#94a3b8">Risk</th></tr>
<tr style="border-bottom:1px solid #1e293b"><td style="padding:6px 8px;color:#e2e8f0">Hardware security key (FIDO2)</td><td style="padding:6px 8px;color:#4ade80">Strongest</td><td style="padding:6px 8px;color:#94a3b8">Physical loss only</td></tr>
<tr style="border-bottom:1px solid #1e293b"><td style="padding:6px 8px;color:#e2e8f0">Authenticator app (TOTP)</td><td style="padding:6px 8px;color:#4ade80">Strong</td><td style="padding:6px 8px;color:#94a3b8">Device theft; MFA fatigue</td></tr>
<tr style="border-bottom:1px solid #1e293b"><td style="padding:6px 8px;color:#e2e8f0">Push notification (approve/deny)</td><td style="padding:6px 8px;color:#facc15">Moderate</td><td style="padding:6px 8px;color:#94a3b8">MFA fatigue attacks</td></tr>
<tr><td style="padding:6px 8px;color:#e2e8f0">SMS code</td><td style="padding:6px 8px;color:#f87171">Weakest</td><td style="padding:6px 8px;color:#94a3b8">SIM swapping; interception</td></tr>
</table>
<h3>MFA Fatigue Attacks</h3>
<p>Attackers who have your password can bombard you with MFA push notifications, hoping you will approve one to make them stop, or simply out of confusion. This is called an MFA fatigue (or MFA bombing) attack.</p>
<p><strong>Rule:</strong> Never approve an MFA push notification you did not initiate. If you receive unexpected MFA prompts, deny them and immediately change your password and report to security.</p>
<h3>SIM Swapping</h3>
<p>Attackers can convince a mobile carrier to transfer your phone number to a SIM card they control, allowing them to receive your SMS verification codes. This is why SMS is the weakest MFA method. Use an authenticator app instead of SMS wherever possible.</p>
<h3>Enrollment Security</h3>
<ul>
  <li>Set up MFA as soon as a new account is created; do not defer it.</li>
  <li>Keep your MFA recovery codes in a secure location (not email).</li>
  <li>Register a backup device if the system allows it.</li>
  <li>Report immediately if you lose access to your MFA device.</li>
</ul>',
  90,'2.2'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c22q,v_mod,'Quiz: MFA Methods and Best Practices','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"You receive 15 unexpected MFA push approval notifications in two minutes. What is the most likely explanation and the correct response?","options":[
      {"id":"a","text":"A system error: approve one to stop the notifications","correct":false,"explanation":"Approving is exactly what the attacker wants. This is an MFA fatigue attack."},
      {"id":"b","text":"An MFA fatigue attack: deny all notifications, change your password immediately, and report to security","correct":true,"explanation":"MFA fatigue attacks flood users with push notifications hoping they will approve one to stop the disruption. The correct response is to deny all, then treat your password as compromised."},
      {"id":"c","text":"A test by the IT security team: approve the last one","correct":false,"explanation":"Security teams conducting tests would inform you through formal channels. Unexpected push floods should be treated as attacks."},
      {"id":"d","text":"Your phone is malfunctioning: restart it","correct":false,"explanation":"Restarting the phone does not address the cause. The notifications indicate an authentication attempt, not a phone malfunction."}
    ]},
    {"id":"q2","text":"Why is SMS-based MFA considered weaker than using an authenticator app?","options":[
      {"id":"a","text":"SMS codes are shorter and therefore easier to guess","correct":false,"explanation":"Code length is not the primary weakness."},
      {"id":"b","text":"SMS codes can be intercepted through SIM swapping, where an attacker transfers your phone number to their own SIM card","correct":true,"explanation":"SIM swapping allows attackers to receive your SMS codes by convincing your carrier to transfer your number. Authenticator app codes are generated locally on your device and cannot be intercepted this way."},
      {"id":"c","text":"SMS requires internet access, which is unreliable","correct":false,"explanation":"SMS uses cellular networks, not internet. This is not the security concern."},
      {"id":"d","text":"SMS messages are stored permanently on your carrier''s servers","correct":false,"explanation":"Storage is not the primary security concern with SMS-based MFA."}
    ]},
    {"id":"q3","text":"Which MFA method provides the strongest protection against phishing?","options":[
      {"id":"a","text":"SMS code","correct":false,"explanation":"SMS codes can be phished or intercepted via SIM swapping."},
      {"id":"b","text":"Email-based one-time code","correct":false,"explanation":"Email codes are vulnerable if the email account is compromised, and can be phished."},
      {"id":"c","text":"Hardware security key using FIDO2/WebAuthn","correct":true,"explanation":"FIDO2 hardware keys are cryptographically bound to the specific website, making them immune to phishing; the key will not authenticate on a fake site."},
      {"id":"d","text":"Push notification approval","correct":false,"explanation":"Push notifications are vulnerable to MFA fatigue attacks."}
    ]}
  ]}',
  100,'2.2'
);

-- CP2
INSERT INTO public.quizzes (id,module_id,title,description,pass_score,max_attempts,quiz_type,section_number) VALUES (
  v_cp2,v_mod,'Topic 2 Checkpoint: Multi-Factor Authentication',
  'Covers MFA principles, methods, and best practices. 70% required to unlock the final exam.',70,3,'checkpoint','2.0'
);
vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'What are the three categories of authentication factors?','multiple_choice',1,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Username, password, and security question',false,1),(vb,vq,'Something you know, something you have, and something you are',true,2),(vc,vq,'PIN, biometric, and email code',false,3),(vd,vq,'Password, phone, and location',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'A colleague says they keep declining MFA setup because it slows them down. How should you respond?','multiple_choice',2,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Agree: MFA adds friction and may not be worth it for low-risk accounts',false,1),(vb,vq,'Explain that MFA blocks over 99.9% of automated account attacks and is one of the highest-impact security steps available',true,2),(vc,vq,'Suggest they use SMS codes which are faster to enter',false,3),(vd,vq,'Report them to IT for non-compliance',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'You lose your phone, which has the authenticator app for your work accounts. What is the first thing you should do?','multiple_choice',3,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Buy a new phone and reinstall the app',false,1),(vb,vq,'Report the loss to IT security immediately so they can revoke access and prevent unauthorized authentication',true,2),(vc,vq,'Wait to see if the phone turns up before taking any action',false,3),(vd,vq,'Log in from a computer and disable MFA temporarily',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'What does an MFA fatigue attack exploit?','multiple_choice',4,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Vulnerabilities in authenticator app software',false,1),(vb,vq,'The tendency of users to approve push notifications to stop repeated prompts or out of confusion',true,2),(vc,vq,'Weaknesses in SMS delivery networks',false,3),(vd,vq,'Biometric scanners that can be fooled by photographs',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'A fingerprint scan used to authenticate a user is an example of which authentication factor category?','multiple_choice',5,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Something you know',false,1),(vb,vq,'Something you have',false,2),(vc,vq,'Something you are',true,3),(vd,vq,'Something you do',false,4);

-- ═══ TOPIC 3: Module Summary ═════════════════════════════════════════════════

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number,learning_objectives) VALUES (
  v_cS0,v_mod,'Module Summary','text',
  '<p>You have completed all core topics in this module. Watch the video below for a concise recap of the key concepts covered, then proceed to the final exam.</p>',
  200,'3.0',
  ARRAY['Review and consolidate the key concepts from this module before the final exam']
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,content_url,image_caption,order_index,section_number) VALUES (
  v_cS1,v_mod,'Password Security and MFA: Summary Video','video',
  NULL,'https://www.youtube.com/watch?v=hGRii5f_uSc',
  'This video summarizes password attack methods, strong credential practices, and multi-factor authentication covered in this module.',
  210,'3.1'
);

-- ═══ FINAL EXAM ══════════════════════════════════════════════════════════════
INSERT INTO public.quizzes (id,module_id,title,description,pass_score,max_attempts,time_limit_mins,quiz_type) VALUES (
  v_fe,v_mod,'Password Security and MFA: Final Exam',
  'Covers all topics in the module. 70% required to pass. 25-minute time limit.',70,2,25,'final_exam'
);

-- Q1-15
vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Which attack method specifically exploits the reuse of passwords across multiple sites?','multiple_choice',1,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Brute force',false,1),(vb,vq,'Credential stuffing',true,2),(vc,vq,'Shoulder surfing',false,3),(vd,vq,'Keylogging',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Which password is strongest?','multiple_choice',2,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Fortibank2024!',false,1),(vb,vq,'alpine-torch-marble-stream-cloud',true,2),(vc,vq,'P@$$w0rd',false,3),(vd,vq,'123456789Aa!',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'MFA blocks what percentage of automated account compromise attempts?','multiple_choice',3,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'About 60%',false,1),(vb,vq,'About 85%',false,2),(vc,vq,'Over 99.9%',true,3),(vd,vq,'About 95%',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'A phone used to receive an authenticator app code is an example of which MFA factor?','multiple_choice',4,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Something you know',false,1),(vb,vq,'Something you have',true,2),(vc,vq,'Something you are',false,3),(vd,vq,'Something you remember',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'An employee uses "FortiBankManager2024!" as their password. Why is this weak?','multiple_choice',5,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'It is too long',false,1),(vb,vq,'It contains the organization name and a year, both predictable patterns included in targeted attack dictionaries',true,2),(vc,vq,'It contains special characters which confuse some systems',false,3),(vd,vq,'It is not weak; it meets complexity requirements',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'What is SIM swapping and which MFA method does it target?','multiple_choice',6,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Swapping SIM cards between phones; targets hardware security keys',false,1),(vb,vq,'Convincing a carrier to transfer a phone number to an attacker''s SIM; targets SMS-based MFA',true,2),(vc,vq,'Physically removing a SIM card; targets all MFA methods',false,3),(vd,vq,'Cloning a SIM card; targets authenticator apps',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'You receive 20 unexpected MFA push approval requests. What should you do?','multiple_choice',7,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Approve one to stop the notifications',false,1),(vb,vq,'Deny all notifications, change your password immediately, and report to security',true,2),(vc,vq,'Ignore them; they will stop on their own',false,3),(vd,vq,'Approve then immediately log out',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Why should every account have a unique password?','multiple_choice',8,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Security policy requires it but there is no practical security reason',false,1),(vb,vq,'A breach of one account only compromises that account, not all others using the same password',true,2),(vc,vq,'Password managers only work with unique passwords',false,3),(vd,vq,'Reused passwords expire faster on some systems',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Which MFA method is most resistant to phishing attacks?','multiple_choice',9,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'SMS one-time code',false,1),(vb,vq,'Email one-time code',false,2),(vc,vq,'FIDO2 hardware security key',true,3),(vd,vq,'Authenticator app TOTP code',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'IT support asks for your password over the phone to reset your account. The correct response is:','multiple_choice',10,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Provide it: they need it to help you',false,1),(vb,vq,'Refuse and report the request: legitimate IT staff never ask for passwords',true,2),(vc,vq,'Provide it only if they can state your employee ID',false,3),(vd,vq,'Temporarily change your password, provide the new one, then change it again',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'What is the primary advantage of a passphrase over a complex short password?','multiple_choice',11,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Passphrases are easier to type on mobile devices',false,1),(vb,vq,'Length provides greater entropy and crack resistance than complexity, while remaining memorable',true,2),(vc,vq,'Passphrases never need to be changed',false,3),(vd,vq,'Passphrases are exempt from dictionary attacks',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'When must you change your work password immediately?','multiple_choice',12,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Every 30 days as a policy requirement',false,1),(vb,vq,'When you suspect it may have been compromised, after sharing it, or when a service you use reports a breach',true,2),(vc,vq,'Only when prompted by the system',false,3),(vd,vq,'At the start of each calendar year',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'What is the primary purpose of a password manager?','multiple_choice',13,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'To share passwords securely between team members',false,1),(vb,vq,'To generate and store unique, complex passwords for every account so you only need to remember one master password',true,2),(vc,vq,'To automatically change your passwords on a schedule',false,3),(vd,vq,'To encrypt your internet traffic',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'An attacker has both a user''s password and their phone. Which MFA method would still prevent unauthorized access?','multiple_choice',14,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'SMS code sent to that phone',false,1),(vb,vq,'Authenticator app on that phone',false,2),(vc,vq,'A hardware security key registered to the account but not on the phone',true,3),(vd,vq,'A push notification to that phone',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'For which systems should MFA be enabled as a priority in a banking environment?','multiple_choice',15,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Only for administrators and executive accounts',false,1),(vb,vq,'Only for systems accessed outside the office',false,2),(vc,vq,'All email, VPN, financial systems, and any system accessible remotely, regardless of user role',true,3),(vd,vq,'Only for systems that process customer payment data',false,4);

END $body$;
