
-- 012_module_seed_intro_cybersecurity.sql
-- Module 1: Introduction to Cybersecurity
-- Structure:
--   Topic 1.0 – The Cybersecurity Landscape (3 subtopics + checkpoint)
--   Topic 2.0 – Threat Actors and Attack Methods (2 subtopics + checkpoint)
--   Topic 3.0 – Cybersecurity in Banking (3 subtopics + checkpoint)
--   Final Exam (15 MCQs)


DO $$
DECLARE
  v_module_id        UUID := gen_random_uuid();

  -- content IDs
  v_c10   UUID := gen_random_uuid();   -- 1.0 topic header
  v_c11   UUID := gen_random_uuid();   -- 1.1 content
  v_c11q  UUID := gen_random_uuid();   -- 1.1 quiz
  v_c12   UUID := gen_random_uuid();   -- 1.2 content
  v_c12q  UUID := gen_random_uuid();   -- 1.2 quiz
  v_c13   UUID := gen_random_uuid();   -- 1.3 content
  v_c13q  UUID := gen_random_uuid();   -- 1.3 quiz

  v_c20   UUID := gen_random_uuid();   -- 2.0 topic header
  v_c21   UUID := gen_random_uuid();   -- 2.1 content
  v_c21q  UUID := gen_random_uuid();   -- 2.1 quiz
  v_c22   UUID := gen_random_uuid();   -- 2.2 content
  v_c22q  UUID := gen_random_uuid();   -- 2.2 quiz

  v_c30   UUID := gen_random_uuid();   -- 3.0 topic header
  v_c31   UUID := gen_random_uuid();   -- 3.1 content
  v_c31q  UUID := gen_random_uuid();   -- 3.1 quiz
  v_c32   UUID := gen_random_uuid();   -- 3.2 content
  v_c32q  UUID := gen_random_uuid();   -- 3.2 quiz
  v_c33   UUID := gen_random_uuid();   -- 3.3 content
  v_c33q  UUID := gen_random_uuid();   -- 3.3 quiz

  -- quiz IDs
  v_cp1   UUID := gen_random_uuid();   -- checkpoint topic 1
  v_cp2   UUID := gen_random_uuid();   -- checkpoint topic 2
  v_cp3   UUID := gen_random_uuid();   -- checkpoint topic 3
  v_fe    UUID := gen_random_uuid();   -- final exam

  -- question / option scratch vars
  vq UUID; va UUID; vb UUID; vc UUID; vd UUID;
BEGIN

-- ── Module ────────────────────────────────────────────────────────────────────
INSERT INTO public.modules (id, title, description, status, order_index, duration_mins)
VALUES (
  v_module_id,
  'Introduction to Cybersecurity',
  'Understand what cybersecurity is, who the threat actors are, and how these threats specifically affect the banking sector. This module establishes the foundational knowledge required for all subsequent security training.',
  'published',
  1,
  60
);

-- ── Role access (all roles) ───────────────────────────────────────────────────
INSERT INTO public.module_role_access (module_id, role_id)
SELECT v_module_id, id FROM public.roles;

-- TOPIC 1: The Cybersecurity Landscape

INSERT INTO public.module_content
  (id, module_id, title, content_type, content_body, order_index, section_number, learning_objectives)
VALUES (
  v_c10, v_module_id,
  'The Cybersecurity Landscape',
  'text',
  '<p>This topic introduces you to the field of cybersecurity: what it means, why it matters, and the foundational concepts that underpin all security thinking.</p>',
  10, '1.0',
  ARRAY[
    'Define cybersecurity and explain its importance in modern organizations',
    'Identify the three components of the CIA Triad',
    'Distinguish between different categories of cyber threats'
  ]
);

-- 1.1 What is Cybersecurity?
INSERT INTO public.module_content
  (id, module_id, title, content_type, content_body, order_index, section_number)
VALUES (
  v_c11, v_module_id,
  'What is Cybersecurity?',
  'text',
  '<p>Cybersecurity is the practice of protecting systems, networks, and data from digital attacks, unauthorized access, damage, or disruption. It encompasses the technologies, processes, and controls designed to defend against threats targeting information and the infrastructure that stores and transmits it.</p>

<h3>Why Cybersecurity Matters</h3>
<p>Digital systems now underpin virtually every aspect of modern life; banking transactions, medical records, government services, and personal communications. A successful attack on any of these can result in:</p>
<ul>
  <li><strong>Financial loss:</strong> direct theft, regulatory fines, or remediation costs</li>
  <li><strong>Reputational damage:</strong> loss of customer trust that is difficult to recover</li>
  <li><strong>Operational disruption:</strong> systems taken offline, services unavailable</li>
  <li><strong>Legal liability:</strong> breaches of data protection laws carry severe penalties</li>
</ul>

<h3>The Scale of the Problem</h3>
<p>Cybercrime costs the global economy over $8 trillion annually. The financial sector is the most targeted industry, experiencing significantly more attacks per organization than any other sector. Every employee, regardless of role, is a potential entry point for an attacker.</p>

<h3>Security is Everyone''s Responsibility</h3>
<p>Technical controls alone cannot protect an organization. The majority of successful attacks exploit human behavior: clicking a link in a phishing email, reusing a weak password, or sharing credentials. Security awareness at every level of the organization is the most effective defense.</p>',
  20, '1.1'
);

-- 1.1 Quiz
INSERT INTO public.module_content
  (id, module_id, title, content_type, content_body, order_index, section_number)
VALUES (
  v_c11q, v_module_id,
  'Quiz: What is Cybersecurity?',
  'knowledge_check',
  '{"questions":[
    {
      "id":"q1",
      "text":"Which of the following best describes cybersecurity?",
      "options":[
        {"id":"a","text":"Installing antivirus software on company computers","correct":false,"explanation":"Antivirus is one tool, but cybersecurity is a broader discipline."},
        {"id":"b","text":"The practice of protecting systems, networks, and data from digital attacks and unauthorized access","correct":true,"explanation":"Cybersecurity encompasses technologies, processes, and human practices designed to protect digital assets."},
        {"id":"c","text":"A department responsible for IT infrastructure maintenance","correct":false,"explanation":"Cybersecurity is a discipline, not just a department."},
        {"id":"d","text":"Encrypting all company files to prevent access","correct":false,"explanation":"Encryption is one control within cybersecurity, not the definition of the field."}
      ]
    },
    {
      "id":"q2",
      "text":"What is the most common way attackers successfully compromise organizations?",
      "options":[
        {"id":"a","text":"Exploiting unpatched software vulnerabilities","correct":false,"explanation":"While this is a method, it is not the most common path."},
        {"id":"b","text":"Breaking encryption algorithms","correct":false,"explanation":"Modern encryption is computationally infeasible to break directly."},
        {"id":"c","text":"Exploiting human behavior through social engineering and phishing","correct":true,"explanation":"The majority of successful breaches involve a human element, typically an employee tricked into taking an action that opens a door for the attacker."},
        {"id":"d","text":"Physical theft of servers","correct":false,"explanation":"Physical attacks are rare compared to remote exploitation of human behavior."}
      ]
    },
    {
      "id":"q3",
      "text":"Which consequence of a cyberattack is the most difficult to recover from?",
      "options":[
        {"id":"a","text":"Financial loss from direct theft","correct":false,"explanation":"Financial losses, while serious, can often be quantified and recovered."},
        {"id":"b","text":"Reputational damage and loss of customer trust","correct":true,"explanation":"Customer trust, once lost, is extremely difficult to rebuild. Organizations have collapsed after major breaches eroded confidence."},
        {"id":"c","text":"Temporary system downtime","correct":false,"explanation":"Systems can be restored; trust is much harder to recover."},
        {"id":"d","text":"Cost of hiring additional IT staff","correct":false,"explanation":"This is an operational cost, not the hardest consequence to reverse."}
      ]
    }
  ]}',
  30, '1.1'
);

-- 1.2 Types of Cyber Threats
INSERT INTO public.module_content
  (id, module_id, title, content_type, content_body, order_index, section_number)
VALUES (
  v_c12, v_module_id,
  'Types of Cyber Threats',
  'text',
  '<p>Understanding the categories of threats that exist is essential for recognizing them when they occur. Cyber threats are not monolithic; they vary in method, target, and intent.</p>

<h3>Malware</h3>
<p>Malicious software designed to damage, disrupt, or gain unauthorized access to systems. Key types include:</p>
<ul>
  <li><strong>Ransomware:</strong> malware that encrypts the victim''s files and demands payment for the decryption key. Major ransomware attacks have shut down hospitals, pipelines, and financial institutions.</li>
  <li><strong>Trojans:</strong> malware disguised as legitimate software. The user installs it willingly, not realizing what it contains.</li>
  <li><strong>Spyware:</strong> software that silently monitors and transmits user activity, including keystrokes and credentials.</li>
</ul>

<h3>Phishing</h3>
<p>Fraudulent communications typically email that impersonate a trusted source to trick recipients into revealing credentials, installing malware, or authorizing fraudulent transactions. Phishing is the most common initial attack vector against organizations.</p>

<h3>Man-in-the-Middle Attacks</h3>
<p>The attacker secretly intercepts and potentially alters communications between two parties. Common on unsecured Wi-Fi networks. The parties believe they are communicating directly with each other, unaware a third party is monitoring or modifying the exchange.</p>

<h3>Denial of Service (DoS / DDoS)</h3>
<p>Attacks that flood a system with traffic to make it unavailable to legitimate users. Distributed DoS (DDoS) uses thousands of compromised devices simultaneously. These attacks are used to extort organizations or as a distraction while another attack proceeds.</p>

<h3>Insider Threats</h3>
<p>Threats originating from within the organization, including employees, contractors, and former staff. Insiders may act maliciously (data theft, sabotage) or inadvertently (accidental disclosure, mishandling of data). Insider threats are particularly dangerous because insiders already have legitimate access.</p>',
  40, '1.2'
);

-- 1.2 Quiz
INSERT INTO public.module_content
  (id, module_id, title, content_type, content_body, order_index, section_number)
VALUES (
  v_c12q, v_module_id,
  'Quiz: Types of Cyber Threats',
  'knowledge_check',
  '{"questions":[
    {
      "id":"q1",
      "text":"An employee receives an email that appears to be from the bank''s IT department, asking them to reset their password via a link. The link leads to a fake login page that captures their credentials. What type of attack is this?",
      "options":[
        {"id":"a","text":"Ransomware","correct":false,"explanation":"Ransomware encrypts files. This attack captures credentials through deception."},
        {"id":"b","text":"Phishing","correct":true,"explanation":"This is a classic phishing attack: a fraudulent communication impersonating a trusted source to steal credentials."},
        {"id":"c","text":"Denial of Service","correct":false,"explanation":"DoS attacks disrupt availability, not steal credentials."},
        {"id":"d","text":"Man-in-the-Middle","correct":false,"explanation":"A MitM attack intercepts communication in transit. This attack uses a fake page to capture input directly."}
      ]
    },
    {
      "id":"q2",
      "text":"Which type of malware encrypts a victim''s files and demands payment to restore access?",
      "options":[
        {"id":"a","text":"Spyware","correct":false,"explanation":"Spyware silently monitors activity. It does not encrypt files."},
        {"id":"b","text":"Trojan","correct":false,"explanation":"A Trojan is disguised as legitimate software. The defining feature is deception, not encryption."},
        {"id":"c","text":"Ransomware","correct":true,"explanation":"Ransomware encrypts the victim''s data and holds it hostage until a ransom is paid."},
        {"id":"d","text":"Adware","correct":false,"explanation":"Adware displays unwanted advertisements. It does not encrypt files."}
      ]
    },
    {
      "id":"q3",
      "text":"Why are insider threats considered especially dangerous compared to external attacks?",
      "options":[
        {"id":"a","text":"Insiders use more sophisticated hacking tools","correct":false,"explanation":"Insiders often do not need technical hacking skills; they already have access."},
        {"id":"b","text":"Insider attacks always involve malicious intent","correct":false,"explanation":"Many insider incidents are accidental mistakes, not malice."},
        {"id":"c","text":"Insiders already have legitimate access to systems and data, making their actions harder to detect","correct":true,"explanation":"Because insiders are authorized users, their activities blend in with normal behavior, making malicious or careless actions much harder to detect."},
        {"id":"d","text":"External attackers are always caught quickly","correct":false,"explanation":"External attackers often go undetected for months. This is not the reason insiders are more dangerous."}
      ]
    }
  ]}',
  50, '1.2'
);

-- 1.3 The CIA Triad
INSERT INTO public.module_content
  (id, module_id, title, content_type, content_body, order_index, section_number)
VALUES (
  v_c13, v_module_id,
  'The CIA Triad: Confidentiality, Integrity, Availability',
  'text',
  '<p>The CIA Triad is the foundational model of information security. Every security decision and control can be evaluated against these three properties: Confidentiality, Integrity, and Availability.</p>

<h3>Confidentiality</h3>
<p>Ensuring that information is accessible only to those authorized to access it. Violations of confidentiality include unauthorized data access, credential theft, and eavesdropping on communications.</p>
<p><strong>Banking example:</strong> A customer''s account balance and transaction history should only be visible to the customer and authorized bank staff, not to other customers, competitors, or attackers.</p>

<h3>Integrity</h3>
<p>Ensuring that information is accurate and has not been altered without authorization. Integrity violations occur when data is modified, corrupted, or deleted, either by attackers or due to system errors.</p>
<p><strong>Banking example:</strong> A transaction record must reflect exactly what occurred. If an attacker can alter the amount of a wire transfer in transit, the integrity of the financial record is compromised.</p>

<h3>Availability</h3>
<p>Ensuring that systems and data are accessible to authorized users when needed. Availability violations include denial-of-service attacks, hardware failures, and ransomware that locks users out of their systems.</p>
<p><strong>Banking example:</strong> Customers must be able to access online banking 24/7. A DDoS attack that takes down the bank''s website violates availability, even if no data is stolen.</p>

<h3>Balancing the Triad</h3>
<p>These three properties are sometimes in tension. Maximum security often restricts availability; maximum availability can weaken security. Security professionals must find the right balance for each context. All three must be maintained to achieve genuine security.</p>',
  60, '1.3'
);

-- 1.3 Quiz
INSERT INTO public.module_content
  (id, module_id, title, content_type, content_body, order_index, section_number)
VALUES (
  v_c13q, v_module_id,
  'Quiz: The CIA Triad',
  'knowledge_check',
  '{"questions":[
    {
      "id":"q1",
      "text":"A DDoS attack floods the bank''s online banking portal, making it inaccessible to customers for four hours. Which property of the CIA Triad has been violated?",
      "options":[
        {"id":"a","text":"Confidentiality","correct":false,"explanation":"Confidentiality relates to unauthorized access to data. No data was exposed here."},
        {"id":"b","text":"Integrity","correct":false,"explanation":"Integrity relates to data accuracy. No data was modified here."},
        {"id":"c","text":"Availability","correct":true,"explanation":"Availability ensures systems are accessible to authorized users when needed. A DDoS that blocks access is a direct availability attack."},
        {"id":"d","text":"All three equally","correct":false,"explanation":"The primary impact here is on availability, not confidentiality or integrity."}
      ]
    },
    {
      "id":"q2",
      "text":"An attacker intercepts a wire transfer instruction and changes the destination account number before it reaches the processing system. Which CIA Triad property is primarily violated?",
      "options":[
        {"id":"a","text":"Confidentiality","correct":false,"explanation":"The data was not merely read ;it was altered. Confidentiality covers unauthorized reading, not modification."},
        {"id":"b","text":"Integrity","correct":true,"explanation":"Integrity ensures data is accurate and has not been altered without authorization. Modifying a transaction in transit is a direct integrity violation."},
        {"id":"c","text":"Availability","correct":false,"explanation":"The system remained available. The issue is the accuracy of the data it processed."},
        {"id":"d","text":"None of the above","correct":false,"explanation":"This is a textbook integrity violation."}
      ]
    },
    {
      "id":"q3",
      "text":"Which statement best describes the relationship between the three CIA Triad properties?",
      "options":[
        {"id":"a","text":"They are independent ,protecting one does not affect the others","correct":false,"explanation":"The three properties are often in tension with each other."},
        {"id":"b","text":"Availability is the most important, the other two are secondary","correct":false,"explanation":"All three are essential. Prioritizing one absolutely over the others creates vulnerabilities."},
        {"id":"c","text":"They are sometimes in tension; security requires balancing all three for the given context","correct":true,"explanation":"Maximizing one property can compromise another. For example, strict access controls improve confidentiality but can reduce availability. Effective security balances all three."},
        {"id":"d","text":"Confidentiality always takes precedence over the other two","correct":false,"explanation":"This is not a universal rule. The balance depends on the specific system and risk profile."}
      ]
    }
  ]}',
  70, '1.3'
);

-- ── Checkpoint Quiz: Topic 1 ──────────────────────────────────────────────────
INSERT INTO public.quizzes (id, module_id, title, description, pass_score, max_attempts, quiz_type, section_number)
VALUES (
  v_cp1, v_module_id,
  'Topic 1 Checkpoint: The Cybersecurity Landscape',
  'This checkpoint covers the foundational concepts from Topic 1. You must achieve 70% to unlock Topic 2.',
  70, 3, 'checkpoint', '1.0'
);

-- CP1 questions
vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_cp1, 'Which of the following is NOT a component of the CIA Triad?', 'multiple_choice', 1, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Confidentiality', false, 1),
  (vb, vq, 'Integrity', false, 2),
  (vc, vq, 'Availability', false, 3),
  (vd, vq, 'Authentication', true, 4);

vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_cp1, 'A bank employee accidentally sends a spreadsheet containing customer account numbers to the wrong email address. Which CIA Triad property has been violated?', 'multiple_choice', 2, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Confidentiality', true, 1),
  (vb, vq, 'Integrity', false, 2),
  (vc, vq, 'Availability', false, 3),
  (vd, vq, 'None: it was an accident', false, 4);

vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_cp1, 'Ransomware encrypts an organization''s files and demands payment. Which type of threat does this represent?', 'multiple_choice', 3, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Phishing', false, 1),
  (vb, vq, 'Malware', true, 2),
  (vc, vq, 'Man-in-the-Middle', false, 3),
  (vd, vq, 'Insider threat', false, 4);

vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_cp1, 'What is the primary reason cybersecurity is considered a shared responsibility across all employees?', 'multiple_choice', 4, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'All employees have administrator access to critical systems', false, 1),
  (vb, vq, 'Human behavior is a major attack vector: any employee can be targeted and exploited', true, 2),
  (vc, vq, 'Technical controls are too expensive to implement fully', false, 3),
  (vd, vq, 'Regulators require all employees to have cybersecurity certifications', false, 4);

vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_cp1, 'A DDoS attack successfully takes the bank''s online portal offline for two hours. No data is accessed or modified. What is the primary impact?', 'multiple_choice', 5, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Integrity violation: data may have been altered', false, 1),
  (vb, vq, 'Confidentiality violation: customer data was exposed', false, 2),
  (vc, vq, 'Availability violation: legitimate users could not access the service', true, 3),
  (vd, vq, 'No violation: no data was lost', false, 4);

-- TOPIC 2: Threat Actors and Attack Methods

INSERT INTO public.module_content
  (id, module_id, title, content_type, content_body, order_index, section_number, learning_objectives)
VALUES (
  v_c20, v_module_id,
  'Threat Actors and Attack Methods',
  'text',
  '<p>Understanding who conducts cyberattacks and how they operate is essential for recognizing the patterns and motivations behind the threats you will encounter.</p>',
  80, '2.0',
  ARRAY[
    'Identify the main categories of threat actors and their motivations',
    'Describe the most common attack methods used against financial institutions',
    'Explain the concept of the attack chain and why early detection matters'
  ]
);

-- 2.1 Who are Threat Actors?
INSERT INTO public.module_content
  (id, module_id, title, content_type, content_body, order_index, section_number)
VALUES (
  v_c21, v_module_id,
  'Who are Threat Actors?',
  'text',
  '<p>A threat actor is any individual or group that intentionally carries out a cyberattack. Understanding who they are helps predict what they will target and how they will behave.</p>

<h3>Cybercriminals</h3>
<p>Financially motivated attackers are the most common threat to financial institutions. They operate like businesses: targeting victims systematically, using automated tools, and selling stolen data or access on underground markets. Organized crime groups run ransomware-as-a-service operations and large-scale fraud campaigns.</p>

<h3>Nation-State Actors</h3>
<p>Government-sponsored groups conducting espionage, sabotage, or destabilization campaigns. They are sophisticated, well-resourced, and patient, willing to maintain access inside a network for months or years without triggering detection. Their targets include financial institutions for economic intelligence and infrastructure disruption.</p>

<h3>Hacktivists</h3>
<p>Politically or ideologically motivated attackers who use cyber techniques to promote a cause. Common tactics include defacing websites, leaking sensitive data, or DDoS attacks to disrupt services. Banks are frequent targets due to their symbolic association with financial systems.</p>

<h3>Insider Threats</h3>
<p>Employees, contractors, or former staff who misuse their authorized access. Insiders can be:</p>
<ul>
  <li><strong>Malicious:</strong> deliberately stealing data for personal gain or on behalf of a competitor</li>
  <li><strong>Negligent:</strong> unknowingly creating vulnerabilities through careless behavior</li>
  <li><strong>Compromised:</strong> coerced by external actors who exploit their access</li>
</ul>

<h3>Script Kiddies</h3>
<p>Low-skill attackers using pre-built tools without deep technical understanding. While less sophisticated, they can still cause real damage, and the automated tools they use are often powerful. Their high volume of attacks makes them a meaningful threat to organizations with weak security hygiene.</p>',
  90, '2.1'
);

-- 2.1 Quiz
INSERT INTO public.module_content
  (id, module_id, title, content_type, content_body, order_index, section_number)
VALUES (
  v_c21q, v_module_id,
  'Quiz: Who are Threat Actors?',
  'knowledge_check',
  '{"questions":[
    {
      "id":"q1",
      "text":"Which type of threat actor is primarily motivated by financial gain and commonly targets financial institutions?",
      "options":[
        {"id":"a","text":"Nation-state actors","correct":false,"explanation":"Nation-state actors are primarily motivated by espionage, political goals, or strategic disruption."},
        {"id":"b","text":"Cybercriminals","correct":true,"explanation":"Cybercriminals are financially motivated and treat attacks as a business. Banks are prime targets because of the direct access to money."},
        {"id":"c","text":"Hacktivists","correct":false,"explanation":"Hacktivists are ideologically motivated, not primarily financial."},
        {"id":"d","text":"Script kiddies","correct":false,"explanation":"Script kiddies are typically seeking notoriety rather than financial gain."}
      ]
    },
    {
      "id":"q2",
      "text":"A bank''s IT security team discovers that an attacker has had undetected access to internal systems for eight months. What type of threat actor is most likely responsible?",
      "options":[
        {"id":"a","text":"Script kiddies","correct":false,"explanation":"Script kiddies lack the sophistication for long-term undetected access."},
        {"id":"b","text":"Hacktivists","correct":false,"explanation":"Hacktivists generally want their actions to be visible; staying hidden contradicts their goals."},
        {"id":"c","text":"Nation-state actors","correct":true,"explanation":"Nation-state actors are known for persistent, low-and-slow attacks where they maintain access for extended periods to gather intelligence or wait for the right moment to act."},
        {"id":"d","text":"Cybercriminals conducting ransomware","correct":false,"explanation":"Ransomware operators typically act quickly once inside. Eight months of quiet access points to intelligence gathering by a sophisticated state actor."}
      ]
    },
    {
      "id":"q3",
      "text":"An employee who is unaware of security policies accidentally leaves a sensitive spreadsheet in a shared folder accessible to all staff. How would you classify this?",
      "options":[
        {"id":"a","text":"A malicious insider threat","correct":false,"explanation":"Malicious insiders act deliberately. This employee was unaware and made a mistake."},
        {"id":"b","text":"A negligent insider threat","correct":true,"explanation":"Negligent insiders cause incidents through careless behavior rather than malicious intent. Lack of awareness is the key driver."},
        {"id":"c","text":"A nation-state attack","correct":false,"explanation":"There is no external actor here. This is an internal, accidental disclosure."},
        {"id":"d","text":"Not a threat. It was not intentional","correct":false,"explanation":"Intent does not determine impact. Accidental disclosures can cause the same harm as deliberate ones and are a recognized threat category."}
      ]
    }
  ]}',
  100, '2.1'
);

-- 2.2 How Attacks Unfold: The Attack Chain
INSERT INTO public.module_content
  (id, module_id, title, content_type, content_body, order_index, section_number)
VALUES (
  v_c22, v_module_id,
  'How Attacks Unfold: The Attack Chain',
  'text',
  '<p>Cyberattacks rarely happen in a single instant. Most follow a recognizable sequence of stages, often called the attack chain or kill chain. Understanding these stages reveals where defenses are most effective and why early detection is critical.</p>

<h3>Stage 1: Reconnaissance</h3>
<p>The attacker researches the target before acting. This includes gathering information from public sources (social media, company websites, job postings), identifying employees and their roles, and probing for technical vulnerabilities. From your perspective: every piece of information you share publicly contributes to an attacker''s reconnaissance.</p>

<h3>Stage 2: Initial Access</h3>
<p>The attacker gains their first foothold inside the organization. Common methods include phishing emails, exploiting unpatched software, using stolen credentials, or compromising a third-party supplier. This is the critical stage where employee vigilance is most important.</p>

<h3>Stage 3: Establishing Persistence</h3>
<p>Once inside, the attacker plants tools that allow them to maintain access even if their initial entry point is closed. They create backdoors, add new user accounts, or install malware that calls home regularly.</p>

<h3>Stage 4: Lateral Movement</h3>
<p>The attacker moves from their initial foothold to other systems within the network, escalating privileges and expanding their access. They look for more valuable targets: finance systems, customer databases, administrative accounts.</p>

<h3>Stage 5: Execution of Objective</h3>
<p>The attacker achieves their goal: stealing data, encrypting files for ransom, transferring funds fraudulently, or disrupting operations. By this stage, the attacker may have been inside the network for weeks.</p>

<h3>Why Early Detection Matters</h3>
<p>Stopping an attack at Stage 1 or 2 prevents all subsequent damage. Detecting and responding at Stage 4 or 5 is far more costly. This is why reporting suspicious emails immediately, before clicking, is the single most impactful security behavior an employee can practice.</p>',
  110, '2.2'
);

-- 2.2 Quiz
INSERT INTO public.module_content
  (id, module_id, title, content_type, content_body, order_index, section_number)
VALUES (
  v_c22q, v_module_id,
  'Quiz: The Attack Chain',
  'knowledge_check',
  '{"questions":[
    {
      "id":"q1",
      "text":"During which stage of the attack chain does an employee clicking a phishing link typically occur?",
      "options":[
        {"id":"a","text":"Reconnaissance","correct":false,"explanation":"Reconnaissance is about gathering information before the attack. Clicking a link is the attacker gaining access."},
        {"id":"b","text":"Lateral movement","correct":false,"explanation":"Lateral movement occurs after the attacker is already inside the network."},
        {"id":"c","text":"Initial access","correct":true,"explanation":"Phishing is the most common method for initial access; it is the attacker''s primary entry point into the organization."},
        {"id":"d","text":"Establishing persistence","correct":false,"explanation":"Persistence comes after initial access is gained."}
      ]
    },
    {
      "id":"q2",
      "text":"Why is it important to detect and stop an attack during reconnaissance or initial access rather than later stages?",
      "options":[
        {"id":"a","text":"Later stages of attacks are technically simpler to execute","correct":false,"explanation":"Later stages are not simpler; this is not the reason early detection matters."},
        {"id":"b","text":"Early detection prevents all subsequent damage, while late detection means the attacker has already achieved much of their objective","correct":true,"explanation":"Stopping an attack at Stage 1 or 2 prevents all downstream harm. By Stage 4 or 5, significant damage has likely already occurred."},
        {"id":"c","text":"Reconnaissance is illegal, so attackers can be arrested at that stage","correct":false,"explanation":"While some reconnaissance activities may be illegal, this is not the primary security reason to detect attacks early."},
        {"id":"d","text":"Later stage attacks automatically stop if early stages are missed","correct":false,"explanation":"Attacks do not self-terminate. Missing early stages allows the attacker to progress unchecked."}
      ]
    },
    {
      "id":"q3",
      "text":"An attacker who has gained access to one employee''s workstation begins accessing other servers and systems within the network. Which stage does this represent?",
      "options":[
        {"id":"a","text":"Initial access","correct":false,"explanation":"Initial access is the first foothold. Moving between systems after that is a distinct stage."},
        {"id":"b","text":"Reconnaissance","correct":false,"explanation":"Reconnaissance happens before the attacker is inside the network."},
        {"id":"c","text":"Lateral movement","correct":true,"explanation":"Lateral movement is the stage where the attacker expands from their initial foothold to other systems, seeking more valuable targets."},
        {"id":"d","text":"Execution of objective","correct":false,"explanation":"Execution is the final stage where the goal is achieved. Moving between systems is the precursor to that."}
      ]
    }
  ]}',
  120, '2.2'
);

-- ── Checkpoint Quiz: Topic 2 ──────────────────────────────────────────────────
INSERT INTO public.quizzes (id, module_id, title, description, pass_score, max_attempts, quiz_type, section_number)
VALUES (
  v_cp2, v_module_id,
  'Topic 2 Checkpoint: Threat Actors and Attack Methods',
  'This checkpoint covers threat actor categories and the attack chain. You must achieve 70% to unlock Topic 3.',
  70, 3, 'checkpoint', '2.0'
);

vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_cp2, 'Which stage of the attack chain involves an attacker planting tools to maintain access after their initial entry point is discovered and closed?', 'multiple_choice', 1, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Reconnaissance', false, 1),
  (vb, vq, 'Initial access', false, 2),
  (vc, vq, 'Establishing persistence', true, 3),
  (vd, vq, 'Execution', false, 4);

vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_cp2, 'A group of attackers publishes stolen bank employee data on public websites to expose what they claim is unethical lending practices. This is most consistent with which type of threat actor?', 'multiple_choice', 2, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Nation-state actors', false, 1),
  (vb, vq, 'Cybercriminals', false, 2),
  (vc, vq, 'Hacktivists', true, 3),
  (vd, vq, 'Script kiddies', false, 4);

vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_cp2, 'What information gathered during reconnaissance is most useful to an attacker targeting a specific bank employee?', 'multiple_choice', 3, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'The bank''s stock price', false, 1),
  (vb, vq, 'The employee''s role, manager''s name, and work email, found on LinkedIn', true, 2),
  (vc, vq, 'The number of ATMs the bank operates', false, 3),
  (vd, vq, 'The bank''s annual report', false, 4);

vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_cp2, 'A contractor''s credentials are used to log in outside business hours and access sensitive customer records. The contractor claims they did not do this. What is the most likely explanation?', 'multiple_choice', 4, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'The system made an error', false, 1),
  (vb, vq, 'The contractor''s credentials were compromised by an external attacker who is now using them', true, 2),
  (vc, vq, 'A nation-state is conducting reconnaissance', false, 3),
  (vd, vq, 'The access logs are incorrect', false, 4);

vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_cp2, 'From a defender''s perspective, at which attack chain stage should the priority of detection and response be highest?', 'multiple_choice', 5, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Execution: this is when the damage is done', false, 1),
  (vb, vq, 'Lateral movement: this is when more systems are compromised', false, 2),
  (vc, vq, 'Reconnaissance and initial access: stopping the attack before it progresses prevents all subsequent damage', true, 3),
  (vd, vq, 'Persistence: this is the hardest stage to detect', false, 4);


-- TOPIC 3: Cybersecurity in the Banking Sector

INSERT INTO public.module_content
  (id, module_id, title, content_type, content_body, order_index, section_number, learning_objectives)
VALUES (
  v_c30, v_module_id,
  'Cybersecurity in the Banking Sector',
  'text',
  '<p>Banks occupy a unique position in the cybersecurity landscape: they hold high-value financial assets, process millions of transactions daily, and maintain sensitive personal data for large customer bases. This makes them among the most heavily targeted organizations in the world.</p>',
  130, '3.0',
  ARRAY[
    'Explain why financial institutions are high-priority targets for cyberattacks',
    'Describe the key regulatory frameworks that govern bank cybersecurity',
    'Identify the individual behaviors that most directly reduce organizational cyber risk'
  ]
);

-- 3.1 Why Banks are Targeted
INSERT INTO public.module_content
  (id, module_id, title, content_type, content_body, order_index, section_number)
VALUES (
  v_c31, v_module_id,
  'Why Financial Institutions are Targeted',
  'text',
  '<p>Banks are not targeted randomly:they are targeted because they present an exceptional combination of value, connectivity, and complexity.</p>

<h3>Direct Access to Money</h3>
<p>Unlike most industries where attackers must convert stolen data into cash, banks hold the cash directly. A successful attack on payment systems, SWIFT messaging, or internal transfer mechanisms can result in direct, immediate financial loss, sometimes in the hundreds of millions of dollars.</p>

<h3>Vast Stores of Personal Data</h3>
<p>Banks hold comprehensive financial profiles on their customers: account balances, transaction history, credit scores, salary information, identification documents. This data is valuable both for identity theft and for enabling more targeted attacks against high-value individuals.</p>

<h3>Systemic Importance</h3>
<p>Banks are interconnected with each other and with the broader economy. Disrupting one institution can have cascading effects. Nation-state actors and sophisticated criminal groups understand that attacking financial infrastructure creates disproportionate impact.</p>

<h3>Large Attack Surface</h3>
<p>Modern banks operate thousands of branches, ATMs, mobile apps, online platforms, and integrations with third-party suppliers. Each connection point is a potential vulnerability. A third-party supplier with weak security is a common entry point.</p>

<h3>High Regulatory Stakes</h3>
<p>Banks operate under strict regulatory frameworks. Attackers know that successful breaches force banks into expensive remediation, regulatory reporting, and potential fines, compounding the financial impact beyond the direct losses.</p>',
  140, '3.1'
);

-- 3.1 Quiz
INSERT INTO public.module_content
  (id, module_id, title, content_type, content_body, order_index, section_number)
VALUES (
  v_c31q, v_module_id,
  'Quiz: Why Banks are Targeted',
  'knowledge_check',
  '{"questions":[
    {
      "id":"q1",
      "text":"What distinguishes banks from most other industries as targets for financially motivated cybercriminals?",
      "options":[
        {"id":"a","text":"Banks have weaker security than other sectors","correct":false,"explanation":"Banks actually invest heavily in security. The attraction is the value they hold, not security weakness."},
        {"id":"b","text":"Attacking banks provides direct access to money, rather than requiring data to be converted to cash","correct":true,"explanation":"Banks hold the money directly. Successful attacks on payment systems can result in immediate, large-scale financial theft."},
        {"id":"c","text":"Banks do not have security teams","correct":false,"explanation":"Banks have extensive security teams. This is factually incorrect."},
        {"id":"d","text":"Banks are easy to compromise due to outdated systems","correct":false,"explanation":"While legacy systems can be a risk, this is not the primary reason banks are targeted."}
      ]
    },
    {
      "id":"q2",
      "text":"A cybercriminal sells a database of customer records stolen from a bank on the dark web. What makes this data particularly valuable?",
      "options":[
        {"id":"a","text":"It includes the bank''s internal IT infrastructure details","correct":false,"explanation":"Internal IT details are valuable for further attacks, but customer records have broader criminal utility."},
        {"id":"b","text":"Comprehensive financial profiles enable identity theft, targeted fraud, and social engineering against high-value individuals","correct":true,"explanation":"Bank customer records include financial history, identification data, and personal information, enabling a wide range of downstream crimes."},
        {"id":"c","text":"It helps attackers understand the bank''s marketing strategy","correct":false,"explanation":"Marketing information has little criminal value."},
        {"id":"d","text":"Financial data can be used to predict stock prices","correct":false,"explanation":"While insider data could theoretically be misused, this is not the criminal utility of stolen customer records."}
      ]
    },
    {
      "id":"q3",
      "text":"How does a third-party supplier with weak security represent a risk to the bank itself?",
      "options":[
        {"id":"a","text":"Suppliers may charge higher prices if they experience security incidents","correct":false,"explanation":"Commercial pricing is not the security risk."},
        {"id":"b","text":"The supplier''s systems are often integrated with bank systems, creating a pathway for attackers to reach bank infrastructure through the supplier","correct":true,"explanation":"Third-party risk is one of the most significant threat vectors. Attackers target less-secure suppliers to gain access to the better-protected bank."},
        {"id":"c","text":"Weak supplier security violates banking regulations directly","correct":false,"explanation":"This may be true in some contexts, but it is not the primary security risk described."},
        {"id":"d","text":"Suppliers store copies of all bank data on their own servers","correct":false,"explanation":"Suppliers may have some access to bank data, but the risk is about network connectivity, not data copying."}
      ]
    }
  ]}',
  150, '3.1'
);

-- 3.2 The Regulatory Framework
INSERT INTO public.module_content
  (id, module_id, title, content_type, content_body, order_index, section_number)
VALUES (
  v_c32, v_module_id,
  'Regulatory and Compliance Obligations',
  'text',
  '<p>Banks operate within a dense regulatory environment that directly mandates cybersecurity standards. Understanding these obligations clarifies why certain security policies exist and what happens when they are not followed.</p>

<h3>Why Regulations Exist</h3>
<p>Financial regulators impose cybersecurity requirements because the consequences of bank failures extend beyond individual institutions. A breach that destroys public confidence in the banking system has economy-wide implications. Regulations establish minimum standards that protect customers, markets, and the broader financial system.</p>

<h3>Key Regulatory Areas</h3>
<ul>
  <li><strong>Data Protection:</strong> Banks must protect personal customer data under data protection legislation. Breaches must be reported within strict timeframes. Fines for non-compliance can reach tens of millions.</li>
  <li><strong>Operational Resilience:</strong> Regulators require banks to demonstrate they can withstand and recover from cyber incidents. This includes maintaining business continuity plans and regularly testing incident response procedures.</li>
  <li><strong>Third-Party Risk:</strong> Banks are responsible for the security of their suppliers. They cannot outsource their security obligations by using a third party.</li>
  <li><strong>Reporting Obligations:</strong> Material cyber incidents must be reported to regulators within specified timeframes, sometimes as little as 72 hours. Failing to report is itself a regulatory violation.</li>
</ul>

<h3>The Cost of Non-Compliance</h3>
<p>Beyond regulatory fines, non-compliance creates legal liability, triggers customer compensation claims, and generates sustained negative media coverage. The total cost of a major breach, including direct losses, regulatory fines, legal costs, and reputational damage, routinely exceeds hundreds of millions.</p>

<h3>Your Role in Compliance</h3>
<p>Regulatory obligations apply to individual employee behavior. Following data handling policies, reporting incidents promptly, and maintaining access controls are compliance requirements, not optional guidelines.</p>',
  160, '3.2'
);

-- 3.2 Quiz
INSERT INTO public.module_content
  (id, module_id, title, content_type, content_body, order_index, section_number)
VALUES (
  v_c32q, v_module_id,
  'Quiz: Regulatory Obligations',
  'knowledge_check',
  '{"questions":[
    {
      "id":"q1",
      "text":"Why do financial regulators impose cybersecurity requirements on banks, beyond just protecting the bank''s own interests?",
      "options":[
        {"id":"a","text":"To generate revenue through fines","correct":false,"explanation":"Regulatory fines are a consequence of non-compliance, not the purpose of regulation."},
        {"id":"b","text":"Because the failure of a major financial institution due to a cyberattack can have economy-wide consequences","correct":true,"explanation":"Banks are systemic; their failure or disruption affects the entire economy. Regulation exists to maintain public confidence and systemic stability."},
        {"id":"c","text":"To ensure banks spend money on technology","correct":false,"explanation":"Technology spending is a means, not the regulatory goal."},
        {"id":"d","text":"To keep cybersecurity vendors in business","correct":false,"explanation":"This is not a regulatory motivation."}
      ]
    },
    {
      "id":"q2",
      "text":"A bank suffers a data breach at midnight. When must this typically be reported to regulators?",
      "options":[
        {"id":"a","text":"Within the next annual report","correct":false,"explanation":"Annual reporting is for general disclosures. Breach notifications are required much sooner."},
        {"id":"b","text":"Only if the media reports on it first","correct":false,"explanation":"Reporting obligations exist independently of media coverage."},
        {"id":"c","text":"Within a defined short timeframe, often 72 hours or less regardless of whether the full investigation is complete","correct":true,"explanation":"Regulators require prompt notification of material incidents. The requirement is to notify early, even before the full picture is known, then update as the investigation proceeds."},
        {"id":"d","text":"Within 30 days, after a full investigation is complete","correct":false,"explanation":"30 days would be too late under most regulatory frameworks. The obligation is to notify promptly."}
      ]
    },
    {
      "id":"q3",
      "text":"The bank uses a third-party cloud provider to process customer data. The provider suffers a breach. Who bears regulatory responsibility for the breach?",
      "options":[
        {"id":"a","text":"The cloud provider caused the breach","correct":false,"explanation":"While the provider may face its own liability, the bank cannot transfer its regulatory obligations to a third party."},
        {"id":"b","text":"No one. The breach is accidental","correct":false,"explanation":"Intent does not affect regulatory responsibility."},
        {"id":"c","text":"The bank  cannot outsource its regulatory obligations to a third party","correct":true,"explanation":"Banks are responsible for third-party risk. Using a supplier does not transfer regulatory obligations. The bank must ensure its suppliers meet required security standards."},
        {"id":"d","text":"The regulator approved the cloud arrangement","correct":false,"explanation":"Regulatory approval of an arrangement does not transfer compliance responsibility to the regulator."}
      ]
    }
  ]}',
  170, '3.2'
);

-- 3.3 Your Role in Cybersecurity
INSERT INTO public.module_content
  (id, module_id, title, content_type, content_body, order_index, section_number)
VALUES (
  v_c33, v_module_id,
  'Your Role in Organizational Cybersecurity',
  'text',
  '<p>Cybersecurity is not something that happens to you; it is something you actively participate in, every day. The decisions you make as an individual employee directly affect the bank''s security posture.</p>

<h3>The Human Layer of Security</h3>
<p>Technical controls firewalls, intrusion detection systems, encryption  create barriers, but they cannot make decisions. You do. When you receive an unexpected email asking you to transfer funds urgently, no system will stop you from complying. Your judgment is the final control.</p>

<h3>High-Impact Daily Behaviors</h3>
<p>The following behaviors have a direct and measurable impact on security:</p>
<ul>
  <li><strong>Report suspicious emails immediately:</strong> do not click. Report. Even if you are wrong, reporting costs nothing. Missing a real phishing attack can cost everything.</li>
  <li><strong>Use strong, unique passwords</strong> -Credential reuse means a breach of one account becomes a breach of all accounts.</li>
  <li><strong>Lock your screen when leaving your desk:</strong> physical access to an unlocked screen is the easiest kind of unauthorized access.</li>
  <li><strong>Follow data handling policies:</strong> only store and transmit data through approved channels. Consumer cloud storage is not an approved channel for customer data.</li>
  <li><strong>Question unusual requests:</strong> if a request seems unusual, especially one involving money, credentials, or data, verify it through a separate channel before acting.</li>
</ul>

<h3>The Cost of Inaction</h3>
<p>Choosing to ignore a suspicious email, dismiss a security alert, or postpone a software update each represents a decision to accept risk on behalf of the organization. These seemingly small decisions are the entry points for major attacks.</p>

<h3>Security Culture</h3>
<p>A strong security culture means that these behaviors are the norm, not the exception. When everyone in the organization treats security as part of their job rather than leaving it to the IT department alone, the organization becomes significantly more resilient.</p>',
  180, '3.3'
);

-- 3.3 Quiz
INSERT INTO public.module_content
  (id, module_id, title, content_type, content_body, order_index, section_number)
VALUES (
  v_c33q, v_module_id,
  'Quiz: Your Role in Cybersecurity',
  'knowledge_check',
  '{"questions":[
    {
      "id":"q1",
      "text":"You receive an email that appears to come from a senior manager asking you to urgently transfer funds to a new vendor account. What is the correct first action?",
      "options":[
        {"id":"a","text":"Process the transfer sincethe request came from a senior manager","correct":false,"explanation":"Urgency and authority are hallmarks of Business Email Compromise attacks. Seniority of the sender does not verify legitimacy."},
        {"id":"b","text":"Reply to the email to confirm the request","correct":false,"explanation":"If the email account is compromised, replying to it confirms the action to the attacker. Verification must happen through a separate channel."},
        {"id":"c","text":"Contact the manager directly through a separate, verified channel (phone, in-person) before acting","correct":true,"explanation":"Verify unusual requests through a known, separate channel and not by replying to the email itself. This is the correct procedure for any unusual financial or data-related request."},
        {"id":"d","text":"Forward the email to colleagues to check if they received it too","correct":false,"explanation":"Forwarding a potentially malicious email can spread the threat. Report it to security; do not forward it."}
      ]
    },
    {
      "id":"q2",
      "text":"Which of the following represents the highest-impact daily security behavior an employee can practice?",
      "options":[
        {"id":"a","text":"Keeping their desk tidy","correct":false,"explanation":"A tidy desk is good practice but has low direct security impact."},
        {"id":"b","text":"Reporting suspicious emails immediately without clicking any links","correct":true,"explanation":"Phishing is the most common initial access method. Reporting before clicking stops the attack before it starts; it is the highest leverage point in the attack chain."},
        {"id":"c","text":"Attending cybersecurity conferences","correct":false,"explanation":"Conferences build knowledge, but daily vigilance has more direct security impact."},
        {"id":"d","text":"Using the same strong password for all accounts for consistency","correct":false,"explanation":"Password reuse is a critical vulnerability. A breach of one account compromises all others."}
      ]
    },
    {
      "id":"q3",
      "text":"An employee needs to work on a customer report from home and copies the file to their personal cloud storage account for convenience. Why is this a security concern?",
      "options":[
        {"id":"a","text":"It is not a concern, as cloud storage is inherently secure","correct":false,"explanation":"Consumer cloud storage does not meet banking security and compliance requirements for customer data."},
        {"id":"b","text":"Customer data stored in unapproved personal cloud accounts is outside the bank''s security controls, creating a compliance violation and a data exposure risk","correct":true,"explanation":"Data must only be stored and transmitted through approved, secure channels. Using personal cloud storage removes the bank''s ability to control access, encryption, and deletion, violating both policy and regulatory requirements."},
        {"id":"c","text":"The employee should have used a USB drive instead","correct":false,"explanation":"USB drives also represent an unapproved and insecure method for transferring sensitive data."},
        {"id":"d","text":"This is acceptable as long as the employee does not share the file","correct":false,"explanation":"The problem is not just sharing; it is the storage itself in an unapproved environment, outside the bank''s security controls."}
      ]
    }
  ]}',
  190, '3.3'
);

-- ── Checkpoint Quiz: Topic 3 ──────────────────────────────────────────────────
INSERT INTO public.quizzes (id, module_id, title, description, pass_score, max_attempts, quiz_type, section_number)
VALUES (
  v_cp3, v_module_id,
  'Topic 3 Checkpoint: Cybersecurity in Banking',
  'This checkpoint covers why banks are targeted, regulatory obligations, and individual employee responsibilities.',
  70, 3, 'checkpoint', '3.0'
);

vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_cp3, 'A bank''s SWIFT messaging system is compromised, allowing attackers to submit fraudulent transfer instructions. What makes banks a uniquely attractive target for this type of attack?', 'multiple_choice', 1, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Banks have less cybersecurity investment than other sectors', false, 1),
  (vb, vq, 'Banks provide direct access to money through payment systems, so a successful attack yields immediate financial gain', true, 2),
  (vc, vq, 'SWIFT is not encrypted', false, 3),
  (vd, vq, 'Banks do not monitor their payment systems', false, 4);

vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_cp3, 'What is the bank''s regulatory obligation when a material data breach is discovered?', 'multiple_choice', 2, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Resolve the breach completely before notifying anyone', false, 1),
  (vb, vq, 'Notify affected customers only', false, 2),
  (vc, vq, 'Report to regulators within the required timeframe, typically 72 hours, and notify affected individuals', true, 3),
  (vd, vq, 'Conduct an internal review and decide whether reporting is necessary', false, 4);

vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_cp3, 'An employee notices that a colleague has left their workstation unlocked and unattended in an open-plan office. What should they do?', 'multiple_choice', 3, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Nothing: it is not their responsibility', false, 1),
  (vb, vq, 'Lock the screen on behalf of the colleague and remind them of the policy when they return', true, 2),
  (vc, vq, 'Report the colleague to management immediately', false, 3),
  (vd, vq, 'Post a note on the screen asking the colleague to lock it next time', false, 4);

vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_cp3, 'Why is credential reuse across multiple accounts a critical security risk in a banking environment?', 'multiple_choice', 4, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'It makes it harder to remember passwords', false, 1),
  (vb, vq, 'If one account is breached, attackers can use the same credentials to access all other accounts using those credentials', true, 2),
  (vc, vq, 'It violates software license agreements', false, 3),
  (vd, vq, 'Systems flag reused passwords as suspicious', false, 4);

vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_cp3, 'A colleague tells you they received a suspicious email but are afraid to report it in case they get in trouble for clicking the link. What is the correct guidance?', 'multiple_choice', 5, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Tell them to delete the email and not mention it', false, 1),
  (vb, vq, 'Report it immediately regardless, the security team needs to know to investigate and contain any compromise', true, 2),
  (vc, vq, 'Tell them to check if their computer is working normally before deciding', false, 3),
  (vd, vq, 'Advise them to change their password and not report it', false, 4);

-- FINAL EXAM (15 questions)


INSERT INTO public.quizzes (id, module_id, title, description, pass_score, max_attempts, time_limit_mins, quiz_type)
VALUES (
  v_fe, v_module_id,
  'Introduction to Cybersecurity : Final Exam',
  'This exam covers all three topics from the module. You must achieve 70% to pass. The exam has a 30-minute time limit.',
  70, 2, 30, 'final_exam'
);

-- Q1
vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_fe, 'Which three properties form the CIA Triad?', 'multiple_choice', 1, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Confidentiality, Identity, Access', false, 1),
  (vb, vq, 'Confidentiality, Integrity, Availability', true, 2),
  (vc, vq, 'Control, Integrity, Authentication', false, 3),
  (vd, vq, 'Compliance, Information, Availability', false, 4);

-- Q2
vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_fe, 'The bank''s online portal is taken offline by a DDoS attack for three hours. No data is accessed. Which CIA Triad property is violated?', 'multiple_choice', 2, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Confidentiality', false, 1),
  (vb, vq, 'Integrity', false, 2),
  (vc, vq, 'Availability', true, 3),
  (vd, vq, 'All three equally', false, 4);

-- Q3
vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_fe, 'Which type of malware demands payment in exchange for restoring access to encrypted files?', 'multiple_choice', 3, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Spyware', false, 1),
  (vb, vq, 'Adware', false, 2),
  (vc, vq, 'Ransomware', true, 3),
  (vd, vq, 'Trojan', false, 4);

-- Q4
vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_fe, 'A fraudulent email impersonates the CEO and asks an employee to purchase gift cards urgently. What type of attack is this?', 'multiple_choice', 4, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Ransomware', false, 1),
  (vb, vq, 'Phishing / Business Email Compromise', true, 2),
  (vc, vq, 'Man-in-the-Middle', false, 3),
  (vd, vq, 'SQL injection', false, 4);

-- Q5
vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_fe, 'Which threat actor category is most associated with long-term, undetected access for intelligence-gathering purposes?', 'multiple_choice', 5, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Cybercriminals running ransomware', false, 1),
  (vb, vq, 'Script kiddies', false, 2),
  (vc, vq, 'Nation-state actors', true, 3),
  (vd, vq, 'Hacktivists', false, 4);

-- Q6
vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_fe, 'At which stage of the attack chain does an attacker first gain a foothold inside the organization?', 'multiple_choice', 6, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Reconnaissance', false, 1),
  (vb, vq, 'Initial access', true, 2),
  (vc, vq, 'Lateral movement', false, 3),
  (vd, vq, 'Persistence', false, 4);

-- Q7
vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_fe, 'Why are banks considered high-value targets for cybercriminals compared to other industries?', 'multiple_choice', 7, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Banks have minimal security controls', false, 1),
  (vb, vq, 'Banks provide direct access to financial assets and hold comprehensive personal data on customers', true, 2),
  (vc, vq, 'Banks are required by law to pay ransoms', false, 3),
  (vd, vq, 'Banks cannot prosecute cybercriminals', false, 4);

-- Q8
vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_fe, 'An employee uses their work password for personal email, social media, and their bank account. What is the primary security risk?', 'multiple_choice', 8, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'The password will expire sooner', false, 1),
  (vb, vq, 'A breach of any one of those accounts gives attackers the credentials to access all others, including work systems', true, 2),
  (vc, vq, 'Personal accounts are not covered by the bank''s security team', false, 3),
  (vd, vq, 'The employee may forget which password belongs to which account', false, 4);

-- Q9
vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_fe, 'The bank uses a payment processing company that suffers a cyberattack exposing customer data. Who bears regulatory responsibility?', 'multiple_choice', 9, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'The payment company, as they were the ones breached', false, 1),
  (vb, vq, 'Neither party, as it was an external attack', false, 2),
  (vc, vq, 'The bank: it cannot outsource its regulatory obligations to third parties', true, 3),
  (vd, vq, 'The regulator, as it approved the use of third-party processors', false, 4);

-- Q10
vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_fe, 'An attacker researches a target employee on LinkedIn, identifying their name, role, manager, and work email before sending a targeted phishing email. Which attack chain stage does this research represent?', 'multiple_choice', 10, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Initial access', false, 1),
  (vb, vq, 'Reconnaissance', true, 2),
  (vc, vq, 'Lateral movement', false, 3),
  (vd, vq, 'Persistence', false, 4);

-- Q11
vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_fe, 'A Man-in-the-Middle attack intercepts and alters a payment instruction during transmission. Which CIA property is primarily violated?', 'multiple_choice', 11, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Availability', false, 1),
  (vb, vq, 'Confidentiality', false, 2),
  (vc, vq, 'Integrity', true, 3),
  (vd, vq, 'Authentication', false, 4);

-- Q12
vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_fe, 'What is the correct action when you receive an email that appears unusual but you are not certain it is malicious?', 'multiple_choice', 12, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Click the link to verify whether it leads to a real site', false, 1),
  (vb, vq, 'Delete it and take no further action', false, 2),
  (vc, vq, 'Report it to the security team without clicking any links, and let them investigate', true, 3),
  (vd, vq, 'Forward it to colleagues to see if they received it', false, 4);

-- Q13
vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_fe, 'Which insider threat category best describes an employee who unknowingly sends sensitive data to an external address?', 'multiple_choice', 13, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Malicious insider', false, 1),
  (vb, vq, 'Negligent insider', true, 2),
  (vc, vq, 'Compromised insider', false, 3),
  (vd, vq, 'External attacker', false, 4);

-- Q14
vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_fe, 'What is the most effective point in the attack chain to stop an attack?', 'multiple_choice', 14, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Execution: respond after the attacker''s objective is clear', false, 1),
  (vb, vq, 'Lateral movement: contain the spread before more systems are affected', false, 2),
  (vc, vq, 'Reconnaissance or initial access: preventing entry eliminates all subsequent stages', true, 3),
  (vd, vq, 'Persistence: remove backdoors to cut off the attacker', false, 4);

-- Q15
vq := gen_random_uuid(); va := gen_random_uuid(); vb := gen_random_uuid(); vc := gen_random_uuid(); vd := gen_random_uuid();
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, order_index, points)
VALUES (vq, v_fe, 'Which of the following behaviors most directly contributes to a strong organizational security culture?', 'multiple_choice', 15, 1);
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
  (va, vq, 'Keeping security concerns private to avoid alarming colleagues', false, 1),
  (vb, vq, 'Assuming the IT department will handle all security issues without employee involvement', false, 2),
  (vc, vq, 'Treating security as part of the job: reporting incidents promptly, questioning unusual requests, and following data handling policies consistently', true, 3),
  (vd, vq, 'Memorizing the list of approved applications', false, 4);

END $$;
