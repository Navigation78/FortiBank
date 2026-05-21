-- 016_module_seed_data_privacy.sql
-- Module 5: Data Handling and Privacy Regulations
-- Topic 1.0 – Data Classification and Secure Handling (2 subtopics + checkpoint)
-- Topic 2.0 – Privacy Regulations and Compliance (2 subtopics + checkpoint)
-- Final Exam: 15 MCQs

DO $$
DECLARE
  v_mod UUID:=gen_random_uuid();
  v_c10 UUID:=gen_random_uuid(); v_c11 UUID:=gen_random_uuid(); v_c11q UUID:=gen_random_uuid();
  v_c12 UUID:=gen_random_uuid(); v_c12q UUID:=gen_random_uuid();
  v_c20 UUID:=gen_random_uuid(); v_c21 UUID:=gen_random_uuid(); v_c21q UUID:=gen_random_uuid();
  v_c22 UUID:=gen_random_uuid(); v_c22q UUID:=gen_random_uuid();
  v_cp1 UUID:=gen_random_uuid(); v_cp2 UUID:=gen_random_uuid(); v_fe UUID:=gen_random_uuid();
  vq UUID; va UUID; vb UUID; vc UUID; vd UUID;
BEGIN

INSERT INTO public.modules (id,title,description,status,order_index,duration_mins) VALUES (
  v_mod,'Data Handling and Privacy Regulations',
  'Banks are custodians of highly sensitive personal and financial data. This module covers how to classify, handle, and protect data correctly, and explains the regulatory framework that governs data privacy in the financial sector.',
  'published',5,45
);
INSERT INTO public.module_role_access (module_id,role_id) SELECT v_mod,id FROM public.roles;

--TOPIC 1 ------

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number,learning_objectives) VALUES (
  v_c10,v_mod,'Data Classification and Secure Handling','text',
  '<p>Not all data requires the same level of protection. Knowing how data is classified, and how each classification must be handled, is a fundamental compliance skill for every bank employee.</p>',
  10,'1.0',
  ARRAY['Apply the bank''s data classification levels to real scenarios','Describe the correct handling requirements for each classification level','Identify the most common data handling mistakes and their consequences']
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c11,v_mod,'Data Classification Framework','text',
  '<p>A data classification framework defines how data should be labeled and handled based on its sensitivity and the harm that could result from its unauthorized disclosure. All data the bank generates, receives, or processes must be classified.</p>
<h3>Classification Levels</h3>
<ul>
  <li><strong>Public:</strong> Information approved for unrestricted external distribution. Press releases, published annual reports, general marketing materials. Even public information must originate from authorized sources; not all employees are authorized to make public statements.</li>
  <li><strong>Internal:</strong> Information intended for use within the organization but not classified as sensitive. General internal communications, non-sensitive policies, meeting notes. Should not be shared externally without authorization but disclosure is low risk.</li>
  <li><strong>Confidential:</strong> Sensitive business information. Customer data, financial reports, audit findings, strategic plans, employee records, contract terms. Must be protected from unauthorized internal and external access. Access on a need-to-know basis.</li>
  <li><strong>Restricted / Highly Confidential:</strong> The most sensitive information. System credentials, encryption keys, merger and acquisition information before public announcement, law enforcement cooperation details, critical infrastructure documentation. Strictest access controls, encryption required, access logged.</li>
</ul>
<h3>How to Apply Classification</h3>
<p>When creating or receiving a document, ask: who is authorized to see this, and what would happen if this were disclosed without authorization? Answer those questions consistently with the framework.</p>
<p>When in doubt, classify at the higher level and verify with your manager or data protection officer before downgrading.</p>
<h3>Classification in Practice</h3>
<ul>
  <li>Email containing customer account numbers → Confidential. Encrypt before sending. Use only approved email channels.</li>
  <li>Internal system architecture diagram → Restricted. Access on need-to-know only. Do not email externally.</li>
  <li>Bank''s publicly listed branch addresses → Public. No special handling required.</li>
  <li>HR salary information → Confidential to Restricted depending on scope.</li>
</ul>',
  20,'1.1'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c11q,v_mod,'Quiz: Data Classification','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"A spreadsheet contains names, account numbers, and balances for 5,000 customers. What classification should this receive?","options":[
      {"id":"a","text":"Public: it is just customer data we hold","correct":false,"explanation":"Customer financial data is highly sensitive. Public means approved for unrestricted external distribution, which this is not."},
      {"id":"b","text":"Internal: it is for use within the bank","correct":false,"explanation":"Internal classification is for non-sensitive organizational information. Customer financial data requires stricter protection."},
      {"id":"c","text":"Confidential: it contains sensitive personal and financial data requiring restricted access and secure handling","correct":true,"explanation":"Customer account numbers and balances are personal financial data requiring confidential classification and appropriate handling controls."},
      {"id":"d","text":"Classification is only required for printed documents","correct":false,"explanation":"Classification applies to all data in all formats: digital files, emails, printed documents, and verbal communications."}
    ]},
    {"id":"q2","text":"An employee needs to email a customer account report to a colleague in another branch. What is the correct approach for a Confidential document?","options":[
      {"id":"a","text":"Send it as a standard email attachment: internal email is secure","correct":false,"explanation":"Internal email is not automatically encrypted. Confidential data sent by email must use approved secure channels or be encrypted."},
      {"id":"b","text":"Send it via the bank''s approved secure file transfer method or encrypted email","correct":true,"explanation":"Confidential data must be protected in transit. Approved secure channels (encrypted email, internal secure file transfer) are required."},
      {"id":"c","text":"Copy the data into the email body rather than attaching a file","correct":false,"explanation":"This does not change the classification or the need for secure transmission. The data remains confidential regardless of format."},
      {"id":"d","text":"Send it only if the recipient confirms receipt in advance","correct":false,"explanation":"Advance confirmation of receipt does not address the security of the transmission itself."}
    ]},
    {"id":"q3","text":"When in doubt about the correct classification level for a document, what should you do?","options":[
      {"id":"a","text":"Use the lowest classification to avoid over-restricting access","correct":false,"explanation":"Under-classification risks unauthorized disclosure. When in doubt, classify higher and verify."},
      {"id":"b","text":"Classify at the higher level and verify with your manager or data protection officer before downgrading","correct":true,"explanation":"The cost of over-classification is minor access friction. The cost of under-classification can be a data breach. Default higher and verify."},
      {"id":"c","text":"Do not classify until you are certain","correct":false,"explanation":"Unclassified data has no handling controls. Apply the higher classification temporarily while verifying."},
      {"id":"d","text":"Ask the recipient what classification they would prefer","correct":false,"explanation":"The recipient''s preference does not determine classification. Classification is determined by the data''s sensitivity."}
    ]}
  ]}',
  30,'1.1'
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c12,v_mod,'Secure Data Handling Practices','text',
  '<p>Knowing a document''s classification is only half the picture. You must also know how to handle it correctly throughout its lifecycle: creation, storage, transmission, use, and disposal.</p>
<h3>Common Data Handling Failures</h3>
<p>Most data breaches in financial institutions involve one or more of these failures:</p>
<ul>
  <li><strong>Misdirected emails:</strong> Sending customer data to the wrong recipient. Check addresses carefully, especially when autocomplete suggests contacts.</li>
  <li><strong>Unauthorized cloud storage:</strong> Copying work files to personal cloud services (Dropbox, personal Google Drive) for convenience. Consumer cloud storage is not an approved channel for sensitive data.</li>
  <li><strong>Unsecured printing:</strong> Leaving printed confidential documents in printers, on desks, or in common areas. Collect printouts immediately. Use secure print-release where available.</li>
  <li><strong>Improper disposal:</strong> Discarding confidential documents in general waste rather than secure shredding. All confidential printed material must be shredded.</li>
  <li><strong>Unencrypted removable media:</strong> Copying sensitive data to unencrypted USB drives. Only encrypted, organization-approved devices may be used for sensitive data.</li>
  <li><strong>Screen visibility:</strong> Working on sensitive data in locations where others can view your screen, such as in open offices, public transport, or client-facing areas. Use privacy screens and position your monitor to minimize visibility.</li>
</ul>
<h3>The Principle of Minimum Necessary Access</h3>
<p>Access only the data you need to perform your specific task. Do not access customer records out of curiosity or for reasons unrelated to your role. Unnecessary data access is a compliance violation even when it does not result in disclosure; audit logs record all access.</p>
<h3>Data Retention and Deletion</h3>
<p>Data should only be retained for as long as required for the business purpose and regulatory requirement. Storing data beyond its required retention period increases risk without benefit. Follow your organization''s data retention schedule and dispose of data securely when the retention period ends.</p>',
  40,'1.2'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c12q,v_mod,'Quiz: Secure Data Handling','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"An employee copies a customer database export to their personal Dropbox account to work from home over the weekend. What is wrong with this?","options":[
      {"id":"a","text":"Nothing: the employee owns the data they work with","correct":false,"explanation":"Employees do not own customer data. The bank is the data controller and is responsible for how it is stored and accessed."},
      {"id":"b","text":"Personal cloud storage is not an approved channel for sensitive data: it is outside the bank''s security controls and creates a compliance violation","correct":true,"explanation":"Consumer cloud storage does not meet the security and compliance requirements for customer data. Storing data there removes the bank''s control over access, encryption, and deletion."},
      {"id":"c","text":"It is acceptable if the employee uses a strong password on their Dropbox account","correct":false,"explanation":"Password strength does not make an unapproved storage channel compliant. The issue is the service itself, not the access credential."},
      {"id":"d","text":"It is only a problem if the Dropbox account is shared with others","correct":false,"explanation":"Even a private personal cloud account is not an approved channel for bank customer data."}
    ]},
    {"id":"q2","text":"What is the correct disposal method for a printed document containing customer account details?","options":[
      {"id":"a","text":"Fold it and place it in the general office recycling bin","correct":false,"explanation":"Recycling bins are accessible to many people and the paper can be read or retrieved. This is not a secure disposal method."},
      {"id":"b","text":"Shred it in a cross-cut shredder or place it in a designated confidential waste bin for secure shredding","correct":true,"explanation":"Confidential printed material must be shredded securely. Cross-cut shredding prevents reconstruction of documents."},
      {"id":"c","text":"Lock it in your desk drawer until you have time to shred it","correct":false,"explanation":"This is acceptable as a temporary measure if a secure shredder is unavailable, but the document must ultimately be shredded, not simply stored."},
      {"id":"d","text":"Overwrite the sensitive fields with a marker pen","correct":false,"explanation":"Marker pen can sometimes be seen through on paper, and this does not constitute secure disposal."}
    ]},
    {"id":"q3","text":"A bank employee accesses a customer account record out of curiosity about a public figure who banks with the institution. No data is shared externally. Is this a problem?","options":[
      {"id":"a","text":"No: the employee is authorized to access the system and the data was not shared","correct":false,"explanation":"Authorization to access a system does not authorize access to all data within it. Access should be limited to business need."},
      {"id":"b","text":"Yes: accessing data without a legitimate business purpose violates the principle of minimum necessary access and is a compliance violation even if nothing is shared","correct":true,"explanation":"Unauthorized access, even read-only and without disclosure, is a data protection violation. Audit logs record all access, and accessing customer data for personal curiosity is misconduct."},
      {"id":"c","text":"Only a problem if the customer finds out","correct":false,"explanation":"The violation occurs at the point of unauthorized access, not when it is discovered. Detection does not determine the violation."},
      {"id":"d","text":"Acceptable since public figures have reduced privacy expectations","correct":false,"explanation":"Public figures retain the same data protection rights as any other customer. Their public profile does not reduce the bank''s obligations."}
    ]}
  ]}',
  50,'1.2'
);

-- CP1
INSERT INTO public.quizzes (id,module_id,title,description,pass_score,max_attempts,quiz_type,section_number) VALUES (
  v_cp1,v_mod,'Topic 1 Checkpoint: Data Classification and Handling',
  'Covers data classification levels and secure handling practices. 70% required to continue.',70,3,'checkpoint','1.0'
);
vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'Encryption keys and pre-announcement merger details belong to which classification level?','multiple_choice',1,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Internal',false,1),(vb,vq,'Confidential',false,2),(vc,vq,'Restricted / Highly Confidential',true,3),(vd,vq,'Public',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'An employee leaves a printed customer report on their desk at the end of the day and goes home. What risk does this create?','multiple_choice',2,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'None: the office is secure after hours',false,1),(vb,vq,'Cleaners, maintenance staff, or unauthorized individuals accessing the office after hours could read the confidential document',true,2),(vc,vq,'The document might be damaged by morning',false,3),(vd,vq,'Only a risk if the document is near a window',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'What does the principle of minimum necessary access require?','multiple_choice',3,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Using the minimum password length permitted by policy',false,1),(vb,vq,'Accessing only the data required for your specific task and authorized business purpose',true,2),(vc,vq,'Keeping customer data for the minimum period required by law',false,3),(vd,vq,'Requesting the minimum level of system access available',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'Which handling control is required when transmitting Confidential data by email?','multiple_choice',4,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'No special controls needed for internal email',false,1),(vb,vq,'Encryption or use of an approved secure file transfer channel',true,2),(vc,vq,'Password-protecting the email with a simple password',false,3),(vd,vq,'Sending during business hours only',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp1,'An employee is about to send an email to 15 customers. Email autocomplete fills in addresses. What should they check before sending?','multiple_choice',5,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Nothing: autocomplete is reliable',false,1),(vb,vq,'Verify each recipient address carefully: autocomplete commonly suggests similar but incorrect addresses, causing misdirected sensitive emails',true,2),(vc,vq,'Check the email size to ensure it is within limits',false,3),(vd,vq,'Confirm the email is not going to a junk folder',false,4);

--  TOPIC 2 --

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number,learning_objectives) VALUES (
  v_c20,v_mod,'Privacy Regulations and Compliance','text',
  '<p>Data protection law imposes direct, enforceable obligations on banks and their employees. Understanding these obligations clarifies why data handling policies exist and the consequences of not following them.</p>',
  60,'2.0',
  ARRAY['Describe the core principles of data protection law applicable to banking','Explain the individual rights that customers have over their personal data','Identify the key obligations triggered when a personal data breach occurs']
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c21,v_mod,'Core Data Protection Principles','text',
  '<p>Modern data protection legislation, including the General Data Protection Regulation (GDPR) in Europe and equivalent frameworks globally, establishes binding principles for how personal data must be handled. Banks are "data controllers" subject to these requirements.</p>
<h3>The Core Principles</h3>
<ul>
  <li><strong>Lawfulness, Fairness, and Transparency:</strong> Personal data must be collected and processed with a legitimate legal basis. Customers must be told what data is collected and how it is used.</li>
  <li><strong>Purpose Limitation:</strong> Data collected for one purpose cannot be freely used for another. Customer data collected for account management cannot be used for unrelated marketing without consent.</li>
  <li><strong>Data Minimization:</strong> Collect only the data actually needed for the stated purpose. Collecting more data "in case it is useful later" violates this principle.</li>
  <li><strong>Accuracy:</strong> Data must be kept accurate and up to date. Processes must exist to correct inaccurate data promptly.</li>
  <li><strong>Storage Limitation:</strong> Personal data must not be retained longer than necessary. Data must be securely deleted when its retention period ends.</li>
  <li><strong>Integrity and Confidentiality:</strong> Appropriate security measures must protect personal data against unauthorized access, loss, or destruction.</li>
  <li><strong>Accountability:</strong> The bank must demonstrate compliance, not just assert it. This includes maintaining records, conducting impact assessments, and implementing appropriate controls.</li>
</ul>
<h3>Individual Rights</h3>
<p>Data protection law grants individuals (data subjects) specific rights over their personal data:</p>
<ul>
  <li><strong>Right of Access:</strong> Customers can request a copy of all personal data the bank holds about them.</li>
  <li><strong>Right to Rectification:</strong> Customers can require correction of inaccurate data.</li>
  <li><strong>Right to Erasure:</strong> In certain circumstances, customers can request deletion of their data.</li>
  <li><strong>Right to Object:</strong> Customers can object to processing for certain purposes.</li>
</ul>
<p>These requests must be handled within defined timeframes. Ignoring or delaying them is a regulatory violation.</p>',
  70,'2.1'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c21q,v_mod,'Quiz: Data Protection Principles','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"The bank collects customer email addresses for transaction notifications. The marketing team wants to use these addresses to send promotional emails without obtaining new consent. Which data protection principle does this violate?","options":[
      {"id":"a","text":"Data minimization","correct":false,"explanation":"Data minimization is about collecting only what is needed. The issue here is using data for a different purpose."},
      {"id":"b","text":"Purpose limitation: data collected for one purpose cannot be freely used for a different purpose without a lawful basis","correct":true,"explanation":"Collecting email for transaction alerts and then using it for marketing without consent violates purpose limitation, as the new use goes beyond what customers were told."},
      {"id":"c","text":"Accuracy","correct":false,"explanation":"Accuracy relates to keeping data correct and up to date, not the permitted uses of the data."},
      {"id":"d","text":"Storage limitation","correct":false,"explanation":"Storage limitation relates to retention periods, not the purposes for which data is used."}
    ]},
    {"id":"q2","text":"A customer submits a Subject Access Request (SAR) asking for all personal data the bank holds about them. What must the bank do?","options":[
      {"id":"a","text":"Respond only if the request is submitted in writing on a specific form","correct":false,"explanation":"SARs can be submitted in any form. The bank cannot require a specific form or format."},
      {"id":"b","text":"Provide a copy of all personal data held about the customer within the legally defined timeframe, typically one month","correct":true,"explanation":"The Right of Access means the bank must provide a complete copy of personal data within the required timeframe. Failure to respond is a regulatory violation."},
      {"id":"c","text":"Respond only if the customer can provide a legitimate reason for the request","correct":false,"explanation":"Customers do not need to justify a SAR. The right to access their own data is unconditional."},
      {"id":"d","text":"Provide a summary rather than the full data to protect operational security","correct":false,"explanation":"The bank must provide the actual data, not a summary, subject to specific exemptions that must be legally justified."}
    ]},
    {"id":"q3","text":"The bank retains closed customer account data for 10 years beyond its required retention period because ''it might be useful''. Which principle does this violate?","options":[
      {"id":"a","text":"Accuracy",false,"explanation":"Accuracy concerns data correctness. The issue here is how long data is kept."},
      {"id":"b","text":"Storage limitation: personal data must not be retained longer than necessary for its stated purpose","correct":true,"explanation":"Retaining data beyond its required retention period is a direct violation of the storage limitation principle."},
      {"id":"c","text":"Data minimization","correct":false,"explanation":"Data minimization is about what you collect. Storage limitation is about how long you keep it."},
      {"id":"d","text":"Lawfulness","correct":false,"explanation":"Lawfulness relates to the legal basis for processing. The issue here is excessive retention."}
    ]}
  ]}',
  80,'2.1'
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c22,v_mod,'Data Breach Response and Reporting Obligations','text',
  '<p>A personal data breach is any security incident that leads to accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to personal data. Understanding breach response obligations is critical for every employee with access to customer data.</p>
<h3>What Constitutes a Personal Data Breach</h3>
<p>Breaches include, but are not limited to:</p>
<ul>
  <li>Sending an email containing customer data to the wrong recipient</li>
  <li>Loss of a laptop, phone, or USB drive containing customer data</li>
  <li>An employee accessing customer records without authorization</li>
  <li>A cyberattack that results in unauthorized access to customer data</li>
  <li>Accidental deletion of customer records without backup</li>
</ul>
<h3>The 72-Hour Rule</h3>
<p>Under GDPR and equivalent regulations, the bank must report personal data breaches to the relevant supervisory authority within 72 hours of becoming aware of them, where the breach is likely to result in a risk to individuals. This creates an urgent obligation to escalate suspected breaches immediately.</p>
<h3>Your Reporting Obligation</h3>
<p>If you discover or suspect a personal data breach:</p>
<ol>
  <li><strong>Report immediately</strong> to your manager and the data protection or security team.</li>
  <li><strong>Do not wait</strong> to confirm all the details; report what you know and continue gathering information.</li>
  <li><strong>Preserve evidence:</strong> do not delete files, emails, or logs that could be relevant to the investigation.</li>
  <li><strong>Do not discuss</strong> the breach with unauthorized parties or on personal devices.</li>
</ol>
<h3>Customer Notification</h3>
<p>If the breach is likely to result in a high risk to customers, those individuals must also be notified without undue delay. The notification must describe what happened, what data was affected, likely consequences, and what steps the bank is taking.</p>
<h3>Consequences of Non-Reporting</h3>
<p>Failure to report a breach within the required timeframe is itself a regulatory violation, compounding the original breach. Regulators take failure to report as seriously as the breach itself, sometimes more so.</p>',
  90,'2.2'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c22q,v_mod,'Quiz: Breach Response','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"An employee accidentally emails a file containing 500 customer account numbers to an external recipient who was not the intended addressee. What is this?","options":[
      {"id":"a","text":"A minor administrative error that does not require formal reporting","correct":false,"explanation":"Sending personal data to an unauthorized recipient is a personal data breach regardless of the number of records involved."},
      {"id":"b","text":"A personal data breach that must be escalated immediately to the data protection team","correct":true,"explanation":"Unauthorized disclosure of personal data, even accidentally, is a breach requiring immediate escalation and possible regulatory notification."},
      {"id":"c","text":"Only a breach if the recipient reads and uses the data","correct":false,"explanation":"The breach occurs at the point of unauthorized disclosure, not at the point of use."},
      {"id":"d","text":"A confidentiality incident, but not a data protection breach","correct":false,"explanation":"These are the same thing in the context of personal data. A confidentiality incident involving personal data is a personal data breach."}
    ]},
    {"id":"q2","text":"Within what timeframe must a personal data breach be reported to the supervisory authority under GDPR (where notification is required)?","options":[
      {"id":"a","text":"Within 7 days of discovering the breach",false,"explanation":"7 days is too long under GDPR. The obligation is faster."},
      {"id":"b","text":"Within 72 hours of becoming aware of the breach","correct":true,"explanation":"The 72-hour rule is a hard regulatory requirement. This is why internal escalation must be immediate; any investigation time consumes the reporting window."},
      {"id":"c","text":"Within 30 days, after a full investigation is completed","correct":false,"explanation":"30 days is far beyond the required timeframe. Reports must be made early, even before the investigation is complete."},
      {"id":"d","text":"Only after remediation is complete","correct":false,"explanation":"Notification must occur regardless of whether remediation is complete. The regulator needs to be informed promptly."}
    ]},
    {"id":"q3","text":"You discover a potential data breach at 4pm on a Friday. The full details are still unclear. What should you do?","options":[
      {"id":"a","text":"Wait until Monday to investigate fully before reporting, to avoid causing unnecessary alarm","correct":false,"explanation":"The 72-hour clock starts from when you became aware. Waiting over a weekend could exhaust the reporting window entirely."},
      {"id":"b","text":"Report what is known immediately to your manager and data protection team: do not wait for full details","correct":true,"explanation":"Report with what is known and continue investigating. The requirement is to report promptly upon awareness, not after a complete investigation."},
      {"id":"c","text":"Gather all details first, then report on Monday morning","correct":false,"explanation":"This approach risks breaching the 72-hour notification requirement and may allow the incident to worsen."},
      {"id":"d","text":"Send an email to your manager flagging it as low priority for Monday review","correct":false,"explanation":"Data breaches are high priority regardless of when they are discovered. Immediate escalation is required."}
    ]}
  ]}',
  100,'2.2'
);

-- CP2
INSERT INTO public.quizzes (id,module_id,title,description,pass_score,max_attempts,quiz_type,section_number) VALUES (
  v_cp2,v_mod,'Topic 2 Checkpoint: Privacy Regulations and Breach Response',
  'Covers data protection principles, individual rights, and breach reporting. 70% required to unlock the final exam.',70,3,'checkpoint','2.0'
);
vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'Which data protection principle requires the bank to collect only data that is actually needed for the stated purpose?','multiple_choice',1,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Purpose limitation',false,1),(vb,vq,'Data minimization',true,2),(vc,vq,'Storage limitation',false,3),(vd,vq,'Accuracy',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'A customer asks for all the personal data the bank holds about them. This is an exercise of which right?','multiple_choice',2,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Right to erasure',false,1),(vb,vq,'Right of access (Subject Access Request)',true,2),(vc,vq,'Right to rectification',false,3),(vd,vq,'Right to portability',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'A laptop containing unencrypted customer data is lost on public transport. What should happen immediately?','multiple_choice',3,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Report to HR as a disciplinary matter',false,1),(vb,vq,'Escalate to the data protection and security team immediately: this is a personal data breach requiring urgent investigation and possible regulatory notification',true,2),(vc,vq,'Wait to see if the laptop is recovered before reporting',false,3),(vd,vq,'Notify only the customers whose data was on the laptop',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'The bank retains customer data "just in case it is useful in the future" beyond the defined retention period. Which principle is violated?','multiple_choice',4,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Accuracy',false,1),(vb,vq,'Storage limitation',true,2),(vc,vq,'Lawfulness',false,3),(vd,vq,'Transparency',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_cp2,'A breach is discovered on a Tuesday evening. The 72-hour reporting window for the regulator expires at what time?','multiple_choice',5,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'The following Monday morning',false,1),(vb,vq,'Friday evening of the same week',true,2),(vc,vq,'30 days later',false,3),(vd,vq,'After the internal investigation is complete',false,4);

-- FINAL EXAM --
INSERT INTO public.quizzes (id,module_id,title,description,pass_score,max_attempts,time_limit_mins,quiz_type) VALUES (
  v_fe,v_mod,'Data Handling and Privacy: Final Exam',
  'Covers all topics. 70% required to pass. 25-minute time limit.',70,2,25,'final_exam'
);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Encryption keys and pre-announcement M&A information belong to which data classification level?','multiple_choice',1,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Internal',false,1),(vb,vq,'Confidential',false,2),(vc,vq,'Restricted / Highly Confidential',true,3),(vd,vq,'Public',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Which data protection principle is violated when customer data is retained indefinitely "in case it becomes useful"?','multiple_choice',2,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Purpose limitation',false,1),(vb,vq,'Storage limitation',true,2),(vc,vq,'Data minimization',false,3),(vd,vq,'Accuracy',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'A data breach must be reported to the supervisory authority within how many hours under GDPR?','multiple_choice',3,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'24 hours',false,1),(vb,vq,'72 hours',true,2),(vc,vq,'7 days',false,3),(vd,vq,'30 days',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'An employee copies customer data to a personal USB drive for convenience. Why is this a risk?','multiple_choice',4,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'USB drives are slower than network transfers',false,1),(vb,vq,'An unencrypted USB drive containing customer data can be lost or stolen, creating a personal data breach',true,2),(vc,vq,'USB drives cannot handle large datasets',false,3),(vd,vq,'Using a personal USB drive slows down the corporate network',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Which action correctly applies the principle of data minimization?','multiple_choice',5,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Collecting all available customer data fields during account opening in case any are needed later',false,1),(vb,vq,'Collecting only the specific data fields required to open the account and service the customer',true,2),(vc,vq,'Deleting all customer data every 12 months',false,3),(vd,vq,'Storing data in the smallest file format possible',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'A customer requests all personal data the bank holds about them. This right is called:','multiple_choice',6,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Right to erasure',false,1),(vb,vq,'Right of access: Subject Access Request',true,2),(vc,vq,'Right to rectification',false,3),(vd,vq,'Right to object',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'An employee accesses a celebrity customer''s account out of curiosity but does not share any information. Is this a problem?','multiple_choice',7,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'No: the data was not shared',false,1),(vb,vq,'Yes: accessing data without a legitimate business purpose is a compliance violation and misconduct regardless of sharing',true,2),(vc,vq,'Only a problem if the celebrity is a politically exposed person',false,3),(vd,vq,'Only a problem if the employee has restricted access rights',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'The correct method to dispose of a printed document containing customer account details is:','multiple_choice',8,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Place it in the general office waste bin',false,1),(vb,vq,'Shred it in a cross-cut shredder or place it in a designated confidential waste bin',true,2),(vc,vq,'Tear it into pieces and dispose of it in the recycling bin',false,3),(vd,vq,'Return it to the document''s originator for disposal',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Customer email addresses collected for account notifications are used to send marketing emails without new consent. Which principle is violated?','multiple_choice',9,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Storage limitation',false,1),(vb,vq,'Purpose limitation',true,2),(vc,vq,'Accuracy',false,3),(vd,vq,'Data minimization',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'When is the correct time to report a suspected data breach to the data protection team?','multiple_choice',10,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'After a full investigation confirms the breach occurred',false,1),(vb,vq,'Immediately upon suspicion: do not wait for full confirmation',true,2),(vc,vq,'Within 30 days of discovery',false,3),(vd,vq,'Only if customer data was actually accessed by an unauthorized party',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'What is the bank''s classification of "Internal" data intended to convey?','multiple_choice',11,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Data that can be freely shared with any customer',false,1),(vb,vq,'Data for use within the organization, not approved for external sharing without authorization, but not highly sensitive',true,2),(vc,vq,'Data that must be encrypted at rest and in transit',false,3),(vd,vq,'Data that can only be accessed by management',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Failure to report a data breach to the regulator within the required timeframe results in:','multiple_choice',12,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'No additional consequences if the breach is eventually reported',false,1),(vb,vq,'A separate regulatory violation in addition to the original breach, potentially compounding fines and reputational damage',true,2),(vc,vq,'An automatic warning but no additional penalty',false,3),(vd,vq,'Criminal prosecution of the employee who discovered the breach',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'An employee working on a train is reviewing a customer financial report on their laptop. A passenger in the adjacent seat can see the screen. What is the risk and correct action?','multiple_choice',13,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'No risk: the passenger is unlikely to know the customer',false,1),(vb,vq,'Unauthorized disclosure risk: use a privacy screen, reposition the screen, or work on sensitive data only in private locations',true,2),(vc,vq,'Acceptable as long as no photos are taken',false,3),(vd,vq,'Only a risk if the customer''s name is visible',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'The data protection principle of accountability requires the bank to:','multiple_choice',14,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'Only report breaches when specifically asked by the regulator',false,1),(vb,vq,'Demonstrate compliance through records, policies, assessments, and controls, not just assert it',true,2),(vc,vq,'Appoint a CEO with a data protection background',false,3),(vd,vq,'Encrypt all data regardless of classification',false,4);

vq:=gen_random_uuid();va:=gen_random_uuid();vb:=gen_random_uuid();vc:=gen_random_uuid();vd:=gen_random_uuid();
INSERT INTO public.quiz_questions (id,quiz_id,question_text,question_type,order_index,points) VALUES (vq,v_fe,'Which of the following is a personal data breach?','multiple_choice',15,1);
INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,order_index) VALUES (va,vq,'A system outage that makes the banking portal temporarily unavailable',false,1),(vb,vq,'Accidentally emailing a customer''s account statement to the wrong email address',true,2),(vc,vq,'An employee forgetting their own password',false,3),(vd,vq,'A failed external cyberattack that was successfully blocked',false,4);

END $$;
