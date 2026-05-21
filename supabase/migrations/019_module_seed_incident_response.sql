-- ============================================================
-- 019_module_seed_incident_response.sql
-- Module 8: Incident Response Procedures
-- Topic 1.0 – Incident Response Fundamentals (2 subtopics + checkpoint)
-- Topic 2.0 – Responding to Incidents (2 subtopics + checkpoint)
-- Final Exam: 15 MCQs
-- ============================================================

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
  v_mod,'Incident Response Procedures',
  'When a security incident occurs, an effective and rapid response can be the difference between a minor disruption and a catastrophic breach. This module covers what constitutes a security incident, the phases of the incident response lifecycle, and the specific actions employees must take when something goes wrong.',
  'published',8,45
);
INSERT INTO public.module_role_access (module_id,role_id) SELECT v_mod,id FROM public.roles;

-- ═══ TOPIC 1 ═════════════════════════════════════════════════════════════════
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number,learning_objectives) VALUES (
  v_c10,v_mod,'Incident Response Fundamentals','text',
  '<p>Every organization will eventually face a security incident. The difference between organizations that recover quickly and those that suffer lasting damage is not whether they had an incident; it is whether they were prepared to respond to one.</p>',
  10,'1.0',
  ARRAY['Define a security incident and distinguish it from a security event','Describe the six phases of the incident response lifecycle','Explain the purpose of an Incident Response Plan and who is responsible for it']
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c11,v_mod,'What is a Security Incident?','text',
  '<p>Not every security alert is a security incident. Understanding the distinction allows the organization to allocate response resources appropriately and avoid both under-reacting (missing real incidents) and over-reacting (treating every alert as a crisis).</p>
<h3>Events vs. Incidents</h3>
<ul>
  <li><strong>Security Event:</strong> Any observable occurrence in a system or network that may be security-relevant. Examples: a failed login attempt, a firewall blocking a connection, an antivirus scan completing. Most events are normal and require no escalation.</li>
  <li><strong>Security Incident:</strong> An event or series of events that actually or potentially compromises the confidentiality, integrity, or availability of information or systems, or violates security policy. Incidents require a formal response.</li>
</ul>
<h3>Examples of Security Incidents in a Banking Context</h3>
<ul>
  <li>An employee''s credentials are used from an unrecognized location while they are known to be in the office</li>
  <li>Malware is detected on a workstation that handles payment transactions</li>
  <li>A customer reports unauthorized transactions on their account</li>
  <li>A phishing email successfully collects credentials from multiple employees</li>
  <li>A laptop containing customer data is lost or stolen</li>
  <li>An employee is observed copying large volumes of data to a personal storage device</li>
  <li>A ransomware attack encrypts files across a business unit</li>
  <li>A third-party supplier notifies you that they have suffered a breach affecting data they hold on your behalf</li>
</ul>
<h3>Severity Classification</h3>
<p>Not all incidents are equal. Most organizations classify incidents by severity to ensure resources are scaled appropriately:</p>
<ul>
  <li><strong>Critical (P1):</strong> Active attack affecting core systems, large-scale data breach, ransomware spreading across the network, payment system compromise. Requires immediate executive escalation and may trigger regulatory notification obligations.</li>
  <li><strong>High (P2):</strong> Confirmed malware on a sensitive system, unauthorized access to customer data affecting a limited number of accounts, suspected insider theft. Requires urgent response within hours.</li>
  <li><strong>Medium (P3):</strong> Phishing email that collected credentials but no confirmed access, policy violations without confirmed data loss. Requires response within the business day.</li>
  <li><strong>Low (P4):</strong> Isolated policy breach with no data impact, suspected but unconfirmed incidents. Requires logging and review.</li>
</ul>',
  20,'1.1'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c11q,v_mod,'Quiz: What is a Security Incident?','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"A bank employee receives 47 failed login alerts on their account overnight, followed by a successful login from a foreign IP address at 3am. How should this be classified?","options":[
      {"id":"a","text":"A security event: failed logins are routine and require no action","correct":false,"explanation":"The failed logins alone might be routine, but a successful login from an unusual location following a brute-force pattern is a confirmed security incident requiring immediate investigation."},
      {"id":"b","text":"A security incident: the pattern indicates a likely account compromise requiring immediate response","correct":true,"explanation":"The combination of repeated failed attempts followed by a successful access from an atypical location is a strong indicator of credential compromise. This meets the definition of a security incident: potential compromise of the confidentiality or integrity of account access."},
      {"id":"c","text":"A false positive: login attempts are automated and can be ignored","correct":false,"explanation":"Dismissing this pattern as a false positive without investigation is a serious response failure. Credential compromise is one of the most common and damaging attack vectors."},
      {"id":"d","text":"A low-severity event requiring review at the next quarterly security meeting","correct":false,"explanation":"Potential account compromise requires urgent investigation, not a deferred review. Delayed response allows attackers to establish persistence or exfiltrate data."}
    ]},
    {"id":"q2","text":"A supplier emails your security team to report they have experienced a breach and that some of your customer data may have been exposed. This should be treated as:","options":[
      {"id":"a","text":"The supplier''s incident, not yours: they are responsible for their own systems","correct":false,"explanation":"Your regulatory obligations as data controller apply regardless of where processing occurs. A breach affecting your customer data is your incident, even if it originated with a supplier."},
      {"id":"b","text":"A security incident for your organization, triggering your incident response process and potential regulatory notification obligations","correct":true,"explanation":"Third-party breaches affecting your data activate your own incident response obligations. You are the data controller and remain accountable to regulators and affected customers."},
      {"id":"c","text":"A medium-priority event, as the breach happened outside your systems","correct":false,"explanation":"The location of the breach does not determine your response priority. Exposure of customer data is a high-priority incident regardless of which system it occurred on."},
      {"id":"d","text":"Informational only: no action is required until the supplier provides a full forensic report","correct":false,"explanation":"Waiting for a forensic report before acting can cause you to miss regulatory notification deadlines (often 72 hours) and delay containment actions."}
    ]},
    {"id":"q3","text":"Which of the following is the correct distinction between a security event and a security incident?","options":[
      {"id":"a","text":"Events are caused by external attackers; incidents are caused by insiders","correct":false,"explanation":"Both events and incidents can be caused by any source. The distinction is not about origin but about confirmed or potential impact."},
      {"id":"b","text":"Events are any observable security-relevant occurrence; incidents are events that actually or potentially compromise systems, data, or policy","correct":true,"explanation":"This is the standard distinction. All incidents start as events, but most events never become incidents. An incident requires confirmed or suspected impact on confidentiality, integrity, or availability."},
      {"id":"c","text":"Events are minor; incidents are major. The difference is only the scale of damage","correct":false,"explanation":"The distinction is about confirmed or potential compromise, not size. A small but confirmed account breach is an incident; a large-scale but purely technical log anomaly may be just an event."},
      {"id":"d","text":"Events require a full incident response; incidents require only logging","correct":false,"explanation":"This has it backwards. Incidents require formal response; events require monitoring but not necessarily formal escalation."}
    ]}
  ]}',
  30,'1.1'
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c12,v_mod,'The Incident Response Lifecycle','text',
  '<p>A structured incident response process ensures that when an incident occurs, the organization responds effectively rather than reactively. The IR lifecycle provides a repeatable framework that works for incidents of any type or severity.</p>
<h3>The Six Phases of Incident Response</h3>
<ol>
  <li><strong>Preparation:</strong> The work done before an incident occurs. This includes developing the Incident Response Plan (IRP), establishing the Incident Response Team (IRT), running tabletop exercises, ensuring logging and monitoring are in place, and building relationships with legal, communications, and regulators. Preparation is the most important phase; a team that has never practiced a response will perform poorly under pressure.</li>
  <li><strong>Identification:</strong> Detecting that an incident has occurred and confirming its nature and scope. Sources include: security monitoring alerts, employee reports, customer complaints, third-party notifications, or regulatory enquiries. Identification ends when the organization has confirmed: this is an incident, here is what we know about its scope, and here is its initial severity classification.</li>
  <li><strong>Containment:</strong> Stopping the incident from spreading or causing further damage. Short-term containment (isolating affected systems, disabling compromised accounts) is immediate. Long-term containment involves more deliberate steps: applying patches, changing credentials, implementing additional monitoring. Containment does not eliminate the threat; it limits its reach while the full investigation proceeds.</li>
  <li><strong>Eradication:</strong> Removing the root cause of the incident from the environment. This includes: deleting malware, closing exploited vulnerabilities, removing unauthorized access, and verifying that the threat actor no longer has a foothold. The organization must be confident the threat is fully removed before moving to recovery.</li>
  <li><strong>Recovery:</strong> Restoring affected systems and services to normal operation. This involves: restoring from clean backups, rebuilding compromised systems, returning systems to production with enhanced monitoring, and verifying that services are functioning normally. Recovery may take hours or weeks depending on incident severity.</li>
  <li><strong>Lessons Learned:</strong> A post-incident review, typically within two weeks of closure, to document what happened, what worked well, what did not, and what changes should be made. Lessons Learned is not a blame exercise; it is a continuous improvement mechanism. Organizations that skip this phase repeat the same mistakes.</li>
</ol>
<h3>The Incident Response Plan</h3>
<p>An IRP is a documented, tested set of procedures that guides the organization through each phase. Key components include: roles and responsibilities (who does what), escalation paths (who to notify and when), communication procedures (internal and external), regulatory notification obligations (timing requirements), and contact lists for IR team members, legal, regulators, and external specialists. The IRP must be kept current and tested regularly; an untested plan is not a plan.</p>',
  40,'1.2'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c12q,v_mod,'Quiz: The Incident Response Lifecycle','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"Ransomware is discovered on a workstation. The security team immediately disconnects the machine from the network. Which IR lifecycle phase does this action represent?","options":[
      {"id":"a","text":"Identification","correct":false,"explanation":"Identification is the phase of detecting and confirming the incident. The incident has already been identified; the team is now acting on it."},
      {"id":"b","text":"Containment","correct":true,"explanation":"Isolating an affected system to prevent the ransomware from spreading is a containment action. Short-term containment stops the immediate spread while the full response is organized."},
      {"id":"c","text":"Eradication","correct":false,"explanation":"Eradication involves removing the threat itself: the malware, the vulnerability, the compromised credentials. Disconnecting the machine limits spread but does not remove the threat."},
      {"id":"d","text":"Recovery","correct":false,"explanation":"Recovery restores systems to normal operation after the threat is removed. Disconnecting a machine is the opposite of recovery; it is isolation."}
    ]},
    {"id":"q2","text":"After resolving a phishing incident, the security team conducts a post-incident review. They find that the phishing email bypassed filters because a domain was recently registered. They recommend updating filtering rules. Which phase of the IR lifecycle does this represent?","options":[
      {"id":"a","text":"Preparation","correct":false,"explanation":"Preparation happens before incidents. This review is happening after the incident closed."},
      {"id":"b","text":"Containment","correct":false,"explanation":"Containment happened during the active incident to limit its spread. This is a retrospective analysis."},
      {"id":"c","text":"Lessons Learned","correct":true,"explanation":"A post-incident review that identifies what happened, what failed, and what should change is the Lessons Learned phase. The recommendation to update filtering rules is a continuous improvement outcome of this phase."},
      {"id":"d","text":"Eradication","correct":false,"explanation":"Eradication removes the active threat. Updating filters after the incident is closed is a preventive improvement, not active threat removal."}
    ]},
    {"id":"q3","text":"Why is the Preparation phase described as the most important phase of the incident response lifecycle?","options":[
      {"id":"a","text":"Most incidents can be prevented entirely through preparation","correct":false,"explanation":"Preparation reduces risk but cannot prevent all incidents. Its importance lies in enabling effective response, not prevention."},
      {"id":"b","text":"A team that has practiced and planned will respond effectively under pressure; an unprepared team will make costly mistakes during an active incident","correct":true,"explanation":"Incident response is a high-stress, time-critical activity. Teams that have documented plans, defined roles, and practiced through exercises perform dramatically better when a real incident occurs. Preparation is an investment that pays off in the quality of every subsequent phase."},
      {"id":"c","text":"Preparation generates compliance documentation required by regulators","correct":false,"explanation":"While IRPs are a compliance requirement, that is not why Preparation is the most important phase. The operational benefit, effective response, is the primary reason."},
      {"id":"d","text":"It is the phase where the root cause of the incident is removed","correct":false,"explanation":"Root cause removal is Eradication. Preparation happens before any incident occurs."}
    ]}
  ]}',
  50,'1.2'
);

-- ─── Topic 1 Checkpoint ───────────────────────────────────────────────────────
INSERT INTO public.quizzes (id,module_id,title,quiz_type,section_number,pass_mark,max_attempts,time_limit_mins) VALUES (
  v_cp1,v_mod,'Topic 1 Checkpoint: Incident Response Fundamentals','checkpoint','1.0',70,3,null
);
INSERT INTO public.quiz_questions (id,quiz_id,question_text,order_index) VALUES
  (gen_random_uuid(),v_cp1,'An employee notices that their computer is running very slowly and their mouse is moving on its own. Which of the following is the most appropriate first action?',10),
  (gen_random_uuid(),v_cp1,'A security incident is confirmed when:',20),
  (gen_random_uuid(),v_cp1,'Which IR lifecycle phase involves verifying that malware has been fully removed and the threat actor no longer has access?',30),
  (gen_random_uuid(),v_cp1,'A bank''s Incident Response Plan has not been tested or updated in three years. What is the primary risk this creates?',40),
  (gen_random_uuid(),v_cp1,'Which of the following best describes the purpose of severity classification in incident response?',50);

DO $inner$
DECLARE
  r RECORD;
BEGIN
  SELECT id INTO r FROM public.quiz_questions WHERE quiz_id=(SELECT id FROM public.quizzes WHERE module_id=(SELECT id FROM public.modules WHERE title='Incident Response Procedures') AND quiz_type='checkpoint' AND section_number='1.0') AND order_index=10;
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),r.id,'Restart the computer to clear any temporary issues',false,'Restarting may destroy forensic evidence and could allow malware to re-establish persistence. Do not restart before the security team assesses.',10),
    (gen_random_uuid(),r.id,'Report it to the security team immediately without touching or powering off the computer',true,'Reporting immediately and leaving the system in its current state preserves forensic evidence. The security team can guide further actions. Taking independent action risks destroying evidence or worsening the situation.',20),
    (gen_random_uuid(),r.id,'Run a personal antivirus scan to confirm whether malware is present',false,'Personal antivirus scans may not detect sophisticated threats and can interfere with forensic investigation. Report first; let the security team investigate.',30),
    (gen_random_uuid(),r.id,'Disconnect the network cable and continue working offline',false,'While network isolation may eventually be appropriate, the employee should not make that decision unilaterally. Reporting to the security team is the correct first action.',40);

  SELECT id INTO r FROM public.quiz_questions WHERE quiz_id=(SELECT id FROM public.quizzes WHERE module_id=(SELECT id FROM public.modules WHERE title='Incident Response Procedures') AND quiz_type='checkpoint' AND section_number='1.0') AND order_index=20;
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),r.id,'A security team member reviews an alert and decides it requires no action',false,'That is the outcome of event triage that results in no incident. An incident is confirmed when impact is established, not when it is ruled out.',10),
    (gen_random_uuid(),r.id,'An event is confirmed to have actually or potentially compromised the confidentiality, integrity, or availability of systems or data',true,'This is the definition of a security incident. The determination of actual or potential compromise moves an event from monitoring to active incident response.',20),
    (gen_random_uuid(),r.id,'The number of affected systems exceeds a defined threshold',false,'Severity thresholds classify incidents, but even a single affected system can constitute a confirmed incident if there is confirmed or potential compromise.',30),
    (gen_random_uuid(),r.id,'A customer reports an issue with their account',false,'Customer reports are one source of incident identification, but a report alone does not confirm an incident. Investigation must establish whether compromise occurred.',40);

  SELECT id INTO r FROM public.quiz_questions WHERE quiz_id=(SELECT id FROM public.quizzes WHERE module_id=(SELECT id FROM public.modules WHERE title='Incident Response Procedures') AND quiz_type='checkpoint' AND section_number='1.0') AND order_index=30;
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),r.id,'Containment',false,'Containment stops spread. Eradication removes the threat itself; these are distinct and sequential phases.',10),
    (gen_random_uuid(),r.id,'Recovery',false,'Recovery restores systems after the threat is removed. Eradication must be completed before recovery begins.',20),
    (gen_random_uuid(),r.id,'Eradication',true,'Eradication is the phase focused on removing the root cause: deleting malware, patching exploited vulnerabilities, revoking unauthorized access, and confirming the threat actor has no remaining foothold.',30),
    (gen_random_uuid(),r.id,'Lessons Learned',false,'Lessons Learned is a retrospective phase that occurs after the incident is fully resolved.',40);

  SELECT id INTO r FROM public.quiz_questions WHERE quiz_id=(SELECT id FROM public.quizzes WHERE module_id=(SELECT id FROM public.modules WHERE title='Incident Response Procedures') AND quiz_type='checkpoint' AND section_number='1.0') AND order_index=40;
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),r.id,'The plan may reference outdated contact details, roles, and systems, rendering it ineffective when needed most',true,'IRPs must reflect the current organization: current staff in defined roles, current systems, current regulatory requirements, and current threat landscape. An untested, outdated plan will not function correctly under the pressure of a real incident.',10),
    (gen_random_uuid(),r.id,'Regulators may fine the organization for the age of the document',false,'While regulators may assess the adequacy of an IRP, the primary risk of an outdated, untested plan is operational failure during an incident, not the document''s age per se.',20),
    (gen_random_uuid(),r.id,'The plan is less likely to be discovered in the event of a breach',false,'Document discoverability is not a security control. An undiscoverable plan is also an unusable plan.',30),
    (gen_random_uuid(),r.id,'There is no significant risk: incident response procedures are largely intuitive',false,'Without documentation, defined roles, and practice, incident response devolves into confusion and ad hoc decision-making under high pressure, with predictably poor outcomes.',40);

  SELECT id INTO r FROM public.quiz_questions WHERE quiz_id=(SELECT id FROM public.quizzes WHERE module_id=(SELECT id FROM public.modules WHERE title='Incident Response Procedures') AND quiz_type='checkpoint' AND section_number='1.0') AND order_index=50;
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),r.id,'To determine which incidents to investigate and which to ignore',false,'All confirmed incidents require a response. Severity classification determines the urgency and scale of response, not whether to respond.',10),
    (gen_random_uuid(),r.id,'To ensure that response resources are scaled appropriately to the nature and impact of each incident',true,'Classification allows the organization to apply the right level of resource, urgency, and escalation to each incident, avoiding both under-response (missing serious incidents) and over-response (treating every alert as a crisis).',20),
    (gen_random_uuid(),r.id,'To rank incidents for annual reporting purposes',false,'While severity data may inform reporting, the primary purpose of real-time classification is operational: guiding the appropriate response.',30),
    (gen_random_uuid(),r.id,'To assign blame and accountability to responsible individuals',false,'Severity classification is an operational decision, not a blame mechanism. Root cause analysis and accountability come later in the Lessons Learned phase.',40);
END $inner$;

-- ═══ TOPIC 2 ═════════════════════════════════════════════════════════════════
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number,learning_objectives) VALUES (
  v_c20,v_mod,'Responding to Incidents','text',
  '<p>Knowing the IR lifecycle is necessary but not sufficient. This topic translates theory into practice: how incidents are detected and reported in a banking environment, what happens during containment and recovery, and what obligations exist for communicating about incidents internally and externally.</p>',
  60,'2.0',
  ARRAY['Describe how to detect and report a suspected security incident','Explain containment and recovery actions for common incident types','Identify regulatory notification obligations and internal communication requirements']
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c21,v_mod,'Detection, Reporting, and Initial Response','text',
  '<p>The speed of detection and reporting is one of the most significant factors in determining the outcome of a security incident. Every hour of undetected attacker presence in a network increases the potential damage.</p>
<h3>How Incidents Are Detected</h3>
<p>Incidents are detected through a combination of technical monitoring and human reporting:</p>
<ul>
  <li><strong>Technical detection:</strong> Security Information and Event Management (SIEM) systems, endpoint detection tools, intrusion detection systems, and anomaly alerts from financial monitoring systems</li>
  <li><strong>Employee reporting:</strong> Staff who notice something unusual: a slow system, an unexpected email, an unfamiliar login alert, or a colleague behaving strangely with data</li>
  <li><strong>Customer reports:</strong> Customers who notice unauthorized transactions or unexpected account changes</li>
  <li><strong>Third-party notifications:</strong> Suppliers, partners, or law enforcement notifying the organization of a breach or compromise</li>
</ul>
<h3>Your Role in Detection</h3>
<p>As an employee, your observation is a critical detection mechanism. Technical systems cannot observe everything. If you notice anything unusual about your systems, accounts, or colleagues'' behavior, you have a responsibility to report it immediately. The cost of a false alarm is minimal. The cost of a delayed real incident is potentially enormous.</p>
<h3>How to Report a Suspected Incident</h3>
<ol>
  <li><strong>Do not attempt to investigate or fix it yourself.</strong> You may destroy evidence or worsen the situation.</li>
  <li><strong>Do not discuss the suspected incident with colleagues</strong> who do not need to know. Speculation spreads and can compromise the investigation.</li>
  <li><strong>Contact the security team immediately</strong> using the designated channel: typically a dedicated hotline, email alias, or ticketing system.</li>
  <li><strong>Preserve your evidence:</strong> Do not delete emails, logs, or files that may be relevant. Do not power off your device unless specifically instructed.</li>
  <li><strong>Document what you observed:</strong> Write down what you saw, when, and on which system. This information helps the security team begin triage immediately.</li>
</ol>
<h3>Initial Triage</h3>
<p>When a report reaches the security team, initial triage establishes: Is this a confirmed incident or a false positive? If confirmed, what is the initial severity classification? What systems or data are potentially affected? What is the immediate containment priority? Triage should be rapid; for critical incidents, measured in minutes, not hours.</p>',
  70,'2.1'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c21q,v_mod,'Quiz: Detection and Reporting','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"You receive an alert that your work email credentials have been used to log in from a country you have never visited. You are currently sitting at your desk. What should you do first?","options":[
      {"id":"a","text":"Change your password immediately using the self-service portal","correct":false,"explanation":"While changing your password is important, doing so unilaterally before notifying the security team may disrupt their investigation and does not address whether the attacker has already taken action."},
      {"id":"b","text":"Contact the security team immediately and describe what you observed, without changing anything yet","correct":true,"explanation":"Immediate reporting allows the security team to begin coordinated containment. They will guide you through credential reset, account isolation, and investigation in the correct sequence to preserve evidence and minimize damage."},
      {"id":"c","text":"Wait to see if any suspicious activity appears before reporting","correct":false,"explanation":"By the time suspicious activity is apparent, significant damage may already be done. Report immediately; do not wait for confirmation of harm."},
      {"id":"d","text":"Forward the alert to your manager and let them decide","correct":false,"explanation":"Security incidents should go directly to the security team, not to management as a first step. Managerial escalation may follow, but it is not the initial action."}
    ]},
    {"id":"q2","text":"A colleague tells you they think they accidentally clicked a phishing link. They ask you to help them investigate before reporting it ''so we can figure out if it''s really a problem first.'' What is the correct response?","options":[
      {"id":"a","text":"Help them investigate: two people looking is better than one","correct":false,"explanation":"Unauthorized investigation by non-security staff risks destroying evidence, triggering further malicious code, or spreading the infection. Only trained responders should investigate.",},
      {"id":"b","text":"Advise them to report it to the security team immediately; do not investigate yourself","correct":true,"explanation":"The security team must be notified immediately, even if the impact is uncertain. Delaying reporting to first determine whether it''s ''really a problem'' wastes critical response time and risks the colleague making the situation worse through uninformed investigation."},
      {"id":"c","text":"Tell them it is probably fine and suggest a restart","correct":false,"explanation":"A clicked phishing link may have delivered malware, harvested credentials, or initiated a download. Dismissing it without investigation is a dangerous assumption."},
      {"id":"d","text":"Report it yourself without telling your colleague","correct":false,"explanation":"Your colleague needs to be part of the reporting process; the security team will need to speak with them directly to understand exactly what happened."}
    ]},
    {"id":"q3","text":"Why is it important NOT to power off an affected device before the security team instructs you to do so?","options":[
      {"id":"a","text":"Powering off may void the warranty on the device","correct":false,"explanation":"Warranty is irrelevant in a security incident. The reason relates to evidence preservation."},
      {"id":"b","text":"Powering off destroys volatile memory (RAM) that may contain forensic evidence critical to the investigation","correct":true,"explanation":"RAM contains running processes, network connections, encryption keys, and other artifacts that exist only while the system is powered. A forensic image of RAM can be invaluable for understanding what happened. Powering off destroys this evidence permanently."},
      {"id":"c","text":"The device needs to remain on to continue sending attack traffic for analysis","correct":false,"explanation":"You would not want the device continuing attack activity. The reason is forensic evidence preservation, not ongoing traffic capture."},
      {"id":"d","text":"Powering off triggers automatic backup processes that could spread malware","correct":false,"explanation":"This is not generally accurate. The reason not to power off is RAM evidence preservation, not a risk of backup-triggered spread."}
    ]}
  ]}',
  80,'2.1'
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c22,v_mod,'Containment, Recovery, and Communication','text',
  '<p>Once an incident is confirmed, the organization must act decisively to contain the damage, restore operations, and meet its obligations to communicate what has happened, to employees, customers, regulators, and potentially the public.</p>
<h3>Containment Strategies</h3>
<p>Containment actions vary by incident type:</p>
<ul>
  <li><strong>Compromised account:</strong> Disable the account, revoke active sessions, reset credentials, review access logs to determine what was accessed</li>
  <li><strong>Malware / ransomware:</strong> Isolate affected systems from the network immediately; do not attempt to pay ransom without legal and executive guidance; preserve forensic evidence before remediation</li>
  <li><strong>Data exfiltration:</strong> Identify the exfiltration pathway and block it; determine what data was accessed and by whom; preserve logs</li>
  <li><strong>Physical device loss:</strong> Remotely wipe the device if enrolled in mobile device management; revoke VPN and email access; determine what data was stored on the device</li>
</ul>
<h3>Recovery Priorities</h3>
<p>Recovery decisions are driven by the criticality of affected systems. Core banking systems and payment processing typically receive highest priority. Recovery follows this sequence:</p>
<ol>
  <li>Confirm eradication is complete before beginning recovery</li>
  <li>Restore from verified clean backups; never restore from a potentially compromised backup</li>
  <li>Rebuild systems that cannot be confidently cleaned</li>
  <li>Return systems to production with enhanced monitoring active</li>
  <li>Verify normal operation and notify affected users</li>
</ol>
<h3>Communication Obligations</h3>
<p>Incident communication is governed by a combination of regulatory requirements and organizational policy:</p>
<ul>
  <li><strong>Internal communication:</strong> Defined escalation paths in the IRP: who is notified at each severity level, and when. Senior leadership is notified for high and critical incidents. The board may need to be informed depending on the incident.</li>
  <li><strong>Regulatory notification:</strong> Under GDPR, personal data breaches must be reported to the relevant data protection authority within <strong>72 hours</strong> of discovery. Banking regulators (ECB, PRA, national authorities) have their own notification requirements, often within 24 hours for significant operational incidents.</li>
  <li><strong>Customer notification:</strong> Affected customers must be notified when their personal data has been breached in a way that creates a high risk to their rights and freedoms, typically including unauthorized access to financial or identity data.</li>
  <li><strong>Public communication:</strong> Major incidents may require public statements, often coordinated with legal counsel and communications teams to balance transparency with operational security during active response.</li>
</ul>
<h3>What Not to Do During an Incident</h3>
<ul>
  <li>Do not delete logs or files, even if you think they contain embarrassing information. Evidence preservation is a legal obligation.</li>
  <li>Do not make unofficial public statements on social media or to the press.</li>
  <li>Do not pay a ransom demand without legal and executive authorization.</li>
  <li>Do not assume the incident is contained without confirmation from the security team.</li>
  <li>Do not discuss incident details with colleagues who are not part of the response team.</li>
</ul>',
  90,'2.2'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c22q,v_mod,'Quiz: Containment, Recovery, and Communication','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"Ransomware begins encrypting files on a workstation. The user notices the file names changing. What is the correct immediate containment action?","options":[
      {"id":"a","text":"Pay the ransom immediately to stop the encryption","correct":false,"explanation":"Ransom payment requires legal and executive authorization and does not guarantee decryption. It should never be an individual employee''s decision. Immediate action should focus on limiting spread."},
      {"id":"b","text":"Isolate the machine from the network (unplug the network cable or disable Wi-Fi) and report to the security team immediately","correct":true,"explanation":"Network isolation stops the ransomware from spreading to other systems or communicating with command-and-control infrastructure. Immediate reporting allows the security team to coordinate a full containment response."},
      {"id":"c","text":"Delete all encrypted files to stop the spread","correct":false,"explanation":"Deleting files destroys data and does not remove the ransomware. The encryption process will continue on remaining files."},
      {"id":"d","text":"Restart the computer: ransomware cannot survive a reboot","correct":false,"explanation":"Modern ransomware is designed to survive reboots and may establish persistence on startup. Restarting may also destroy forensic evidence in RAM."}
    ]},
    {"id":"q2","text":"A bank discovers at 9am on a Tuesday that a breach occurred on Sunday evening, exposing personal data of approximately 2,000 customers. What is the regulatory notification deadline under GDPR?","options":[
      {"id":"a","text":"Within 30 days of discovery",false,"explanation":"30 days is a common misconception. GDPR requires notification to the supervisory authority within 72 hours of becoming aware of a breach, not 30 days."},
      {"id":"b","text":"Within 72 hours of becoming aware of the breach, by approximately 9am Friday",true,"explanation":"GDPR Article 33 requires notification to the data protection authority within 72 hours of becoming aware of the breach. Discovery was at 9am Tuesday; the deadline is approximately 9am Friday. Delays beyond this require documented justification."},
      {"id":"c","text":"There is no fixed deadline: notification should occur when investigation is complete",false,"explanation":"GDPR sets a fixed 72-hour deadline. The organization does not need to wait for investigation completion; an initial notification is made, with updates to follow."},
      {"id":"d","text":"Within 24 hours of discovery",false,"explanation":"Some banking regulators have 24-hour requirements for operational incidents, but the GDPR personal data breach notification deadline is 72 hours."}
    ]},
    {"id":"q3","text":"During an active incident investigation, a manager asks an employee to delete some email logs because they contain messages that are embarrassing to a senior executive. What should the employee do?","options":[
      {"id":"a","text":"Delete the logs as instructed: managers have authority over employee actions","correct":false,"explanation":"Deleting evidence during an active investigation is obstruction of justice regardless of who instructs it. Employee obligations to preserve evidence override managerial instructions in this context."},
      {"id":"b","text":"Refuse and immediately escalate to the security team and legal counsel","correct":true,"explanation":"Evidence preservation is a legal obligation during an incident investigation. Employees must refuse instructions to destroy evidence and immediately report the request to the security team and legal, both to protect themselves and to preserve the investigation."},
      {"id":"c","text":"Archive the logs to a personal drive before deleting them from the system","correct":false,"explanation":"Moving logs to a personal drive does not preserve them appropriately and may itself constitute a policy violation. The correct action is to refuse deletion and escalate."},
      {"id":"d","text":"Delete only the specific emails mentioned and preserve the rest","correct":false,"explanation":"Selectively deleting evidence is still evidence destruction. The instruction itself must be refused and escalated."}
    ]}
  ]}',
  100,'2.2'
);

-- ─── Topic 2 Checkpoint ───────────────────────────────────────────────────────
INSERT INTO public.quizzes (id,module_id,title,quiz_type,section_number,pass_mark,max_attempts,time_limit_mins) VALUES (
  v_cp2,v_mod,'Topic 2 Checkpoint: Responding to Incidents','checkpoint','2.0',70,3,null
);
INSERT INTO public.quiz_questions (id,quiz_id,question_text,order_index) VALUES
  (gen_random_uuid(),v_cp2,'An employee receives an unexpected multi-factor authentication push notification that they did not initiate. They approve it to "make the alert go away." What has likely occurred, and what should they have done?',10),
  (gen_random_uuid(),v_cp2,'During incident containment, the security team decides not to immediately disable an attacker''s compromised account in order to monitor their activity. This technique is known as:',20),
  (gen_random_uuid(),v_cp2,'After a ransomware attack, the organization wants to restore affected systems. What must be confirmed before beginning recovery?',30),
  (gen_random_uuid(),v_cp2,'Which of the following actions is explicitly prohibited during an active incident investigation?',40),
  (gen_random_uuid(),v_cp2,'An employee sees a post on social media from a colleague describing details of an ongoing incident at the bank. What is the most significant risk this creates?',50);

DO $inner2$
DECLARE
  r RECORD;
BEGIN
  SELECT id INTO r FROM public.quiz_questions WHERE quiz_id=(SELECT id FROM public.quizzes WHERE module_id=(SELECT id FROM public.modules WHERE title='Incident Response Procedures') AND quiz_type='checkpoint' AND section_number='2.0') AND order_index=10;
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),r.id,'Nothing: MFA alerts sometimes appear by mistake and can be dismissed',false,'Unsolicited MFA push notifications are a strong indicator of credential compromise. They should never be approved and must always be reported.',10),
    (gen_random_uuid(),r.id,'The employee''s credentials were compromised; approving the push has potentially granted the attacker access. They should have denied the request and immediately reported it to the security team',true,'An unsolicited MFA push means someone knows the employee''s password and is attempting to authenticate. Approving it completes the attacker''s login. The correct response is to deny the push, not touch anything else, and report immediately.',20),
    (gen_random_uuid(),r.id,'The employee should have changed their password before reporting',false,'Changing the password without notifying the security team first disrupts coordinated investigation and may not prevent the attacker''s already-established session.',30),
    (gen_random_uuid(),r.id,'The MFA system has a bug that generates false pushes: IT should be notified',false,'While system bugs are possible, the appropriate response to an unexpected MFA push is always to treat it as a potential credential compromise, not to dismiss it as a technical error.',40);

  SELECT id INTO r FROM public.quiz_questions WHERE quiz_id=(SELECT id FROM public.quizzes WHERE module_id=(SELECT id FROM public.modules WHERE title='Incident Response Procedures') AND quiz_type='checkpoint' AND section_number='2.0') AND order_index=20;
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),r.id,'Eradication delay',false,'Eradication delay would simply mean taking longer to remove the threat; it is not a deliberate strategic technique.',10),
    (gen_random_uuid(),r.id,'Controlled access: monitoring the attacker before intervening to gather intelligence',true,'Sometimes called "controlled observation" or a "honeypot-adjacent" technique, allowing monitored attacker access can reveal the full scope of compromise, the attacker''s objectives, and potentially their identity, before remediation locks them out.',20),
    (gen_random_uuid(),r.id,'Risk acceptance: deciding the account compromise is low severity',false,'This is a specific, active tactical decision to gather intelligence, not a risk acceptance.',30),
    (gen_random_uuid(),r.id,'A violation of incident response procedure: attackers must always be locked out immediately',false,'While many IRPs default to immediate lockout, controlled observation is a legitimate and sometimes valuable technique used by experienced IR teams under controlled conditions.',40);

  SELECT id INTO r FROM public.quiz_questions WHERE quiz_id=(SELECT id FROM public.quizzes WHERE module_id=(SELECT id FROM public.modules WHERE title='Incident Response Procedures') AND quiz_type='checkpoint' AND section_number='2.0') AND order_index=30;
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),r.id,'That the ransom has been paid and decryption keys received',false,'Recovery must not depend on ransom payment. Verified clean backups are the correct restoration source.',10),
    (gen_random_uuid(),r.id,'That eradication is complete and the threat is fully removed from the environment',true,'Beginning recovery while the threat remains active risks re-infection of restored systems. Eradication must be confirmed: the malware removed, the vulnerability patched, the attacker''s access revoked, before any restored system is reconnected.',20),
    (gen_random_uuid(),r.id,'That customer notification has been sent',false,'Customer notification is a parallel obligation, not a prerequisite for technical recovery.',30),
    (gen_random_uuid(),r.id,'That the incident has been closed in the ticketing system',false,'Administrative closure should follow actual recovery, not precede it. The reality of eradication matters, not the ticket status.',40);

  SELECT id INTO r FROM public.quiz_questions WHERE quiz_id=(SELECT id FROM public.quizzes WHERE module_id=(SELECT id FROM public.modules WHERE title='Incident Response Procedures') AND quiz_type='checkpoint' AND section_number='2.0') AND order_index=40;
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),r.id,'Reporting the incident to the security team',false,'Reporting is not just permitted; it is required. This is not a prohibited action.',10),
    (gen_random_uuid(),r.id,'Deleting logs, files, or messages that may be relevant to the investigation',true,'Evidence destruction during an active investigation is legally prohibited and potentially criminal, regardless of who requests it or what the content contains.',20),
    (gen_random_uuid(),r.id,'Changing your own compromised password when instructed by the security team',false,'Password changes directed by the security team as part of a coordinated response are appropriate and expected.',30),
    (gen_random_uuid(),r.id,'Notifying your manager that you have reported a suspected incident',false,'Keeping your manager informed through appropriate channels is acceptable and often encouraged.',40);

  SELECT id INTO r FROM public.quiz_questions WHERE quiz_id=(SELECT id FROM public.quizzes WHERE module_id=(SELECT id FROM public.modules WHERE title='Incident Response Procedures') AND quiz_type='checkpoint' AND section_number='2.0') AND order_index=50;
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),r.id,'It provides useful transparency to the public about the bank''s security practices',false,'Unauthorized disclosure of active incident details is harmful, not helpful. Transparency is managed through authorized communication channels.',10),
    (gen_random_uuid(),r.id,'It may tip off the attacker, compromise the investigation, create regulatory issues, and damage customer trust before the bank can communicate officially',true,'Premature public disclosure of an active incident can: allow the attacker to adapt their tactics; compromise forensic investigation; trigger regulatory scrutiny for unauthorized disclosure; and create panic and reputational damage that authorized communications could have managed.',20),
    (gen_random_uuid(),r.id,'It is only a risk if the post goes viral',false,'Even a small-reach post can reach the wrong person, a journalist, the attacker, or a regulator, and cause disproportionate harm.',30),
    (gen_random_uuid(),r.id,'It is acceptable as long as no customer names are mentioned',false,'Operational details about an active incident are sensitive regardless of whether they include personal data. Disclosing that a bank is currently under a ransomware attack, without naming customers, is itself harmful.',40);
END $inner2$;

-- ═══ FINAL EXAM ══════════════════════════════════════════════════════════════
INSERT INTO public.quizzes (id,module_id,title,quiz_type,pass_mark,max_attempts,time_limit_mins) VALUES (
  v_fe,v_mod,'Final Exam: Incident Response Procedures','final_exam',70,2,25
);

INSERT INTO public.quiz_questions (id,quiz_id,question_text,order_index) VALUES
  (gen_random_uuid(),v_fe,'Which of the following is the correct definition of a security incident?',10),
  (gen_random_uuid(),v_fe,'An employee notices an unknown USB device plugged into a server room workstation. No one is around. What is the correct immediate action?',20),
  (gen_random_uuid(),v_fe,'Which incident response lifecycle phase involves developing the Incident Response Plan and training the response team?',30),
  (gen_random_uuid(),v_fe,'Short-term containment differs from long-term containment in that:',40),
  (gen_random_uuid(),v_fe,'Eradication is considered complete when:',50),
  (gen_random_uuid(),v_fe,'Under GDPR, within how many hours of becoming aware of a personal data breach must an organization notify the supervisory authority?',60),
  (gen_random_uuid(),v_fe,'A phishing attack successfully harvests credentials from 15 employees across three departments. Initial triage must establish:',70),
  (gen_random_uuid(),v_fe,'During a malware incident, the security team instructs you not to power off your laptop. This is primarily to:',80),
  (gen_random_uuid(),v_fe,'What is the correct order of the final three phases of the incident response lifecycle?',90),
  (gen_random_uuid(),v_fe,'A journalist calls the bank asking for comment on "reports of a data breach." You are aware of an ongoing incident investigation. What should you do?',100),
  (gen_random_uuid(),v_fe,'Which of the following best describes the purpose of the Lessons Learned phase?',110),
  (gen_random_uuid(),v_fe,'An attacker has gained access to a database server using compromised credentials. Containment includes which of the following?',120),
  (gen_random_uuid(),v_fe,'A bank classifies an incident where ransomware is actively spreading across the network as Critical (P1). What does this classification trigger?',130),
  (gen_random_uuid(),v_fe,'Recovery must use verified clean backups because:',140),
  (gen_random_uuid(),v_fe,'Which statement about incident response planning is most accurate?',150);

DO $fe$
DECLARE
  r RECORD;
  qids UUID[];
BEGIN
  SELECT ARRAY_AGG(id ORDER BY order_index) INTO qids
  FROM public.quiz_questions
  WHERE quiz_id = (SELECT id FROM public.quizzes WHERE module_id=(SELECT id FROM public.modules WHERE title='Incident Response Procedures') AND quiz_type='final_exam');

  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[1],'Any alert generated by a security monitoring system',false,'Alerts are events, not incidents. An incident requires confirmed or potential compromise of systems, data, or policy.',10),
    (gen_random_uuid(),qids[1],'An event that actually or potentially compromises the confidentiality, integrity, or availability of information or systems, or violates security policy',true,'This is the standard definition. The key elements are: confirmed or potential impact on CIA or policy, moving it beyond a routine security event into an incident requiring formal response.',20),
    (gen_random_uuid(),qids[1],'Any unauthorized access to a system',false,'While unauthorized access typically constitutes an incident, the definition is broader; it includes events that compromise availability or integrity without unauthorized access.',30),
    (gen_random_uuid(),qids[1],'An event caused by an external attacker',false,'Incidents can be caused by insiders, negligent employees, third parties, or compromised credentials, not only external attackers.',40);

  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[2],'Remove the USB device to prevent further risk',false,'Removing the device may destroy evidence of what it contains and what it accessed. Do not touch it.',10),
    (gen_random_uuid(),qids[2],'Leave the device in place, do not touch it, and immediately report it to the security team',true,'An unknown device in a sensitive area is a potential security incident. Leaving it in place preserves evidence and allows the security team to investigate properly. Reporting immediately triggers the right response.',20),
    (gen_random_uuid(),qids[2],'Plug the device into your laptop to see what files are on it',false,'Plugging an unknown USB device into any system risks malware infection. This is exactly the wrong action.',30),
    (gen_random_uuid(),qids[2],'Wait to see if anyone claims ownership of the device',false,'Waiting delays response and allows potential continued access if the device is malicious. Report immediately.',40);

  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[3],'Identification',false,'Identification is the phase of detecting and confirming active incidents. Preparation happens before any incident.',10),
    (gen_random_uuid(),qids[3],'Preparation',true,'Preparation is the pre-incident phase covering all readiness activities: developing the IRP, building the IR team, running exercises, establishing monitoring, and preparing communication templates and contact lists.',20),
    (gen_random_uuid(),qids[3],'Lessons Learned',false,'Lessons Learned is a post-incident phase. Preparation is pre-incident.',30),
    (gen_random_uuid(),qids[3],'Containment',false,'Containment is an active response phase that occurs after an incident is identified.',40);

  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[4],'Short-term containment removes the threat; long-term containment monitors it',false,'Neither containment phase removes the threat; that is eradication. Containment limits spread.',10),
    (gen_random_uuid(),qids[4],'Short-term containment provides immediate damage limitation (e.g., isolating a system); long-term containment involves more deliberate steps while investigation proceeds',true,'Short-term containment is rapid and focused on stopping immediate spread. Long-term containment, through patching, credential changes, and enhanced monitoring, is more measured and occurs while the full investigation and eradication are planned.',20),
    (gen_random_uuid(),qids[4],'Long-term containment is used only for insider threat incidents',false,'Both types of containment apply across incident types. The distinction is about timing and approach, not incident category.',30),
    (gen_random_uuid(),qids[4],'Short-term containment is optional for low-severity incidents',false,'All incidents benefit from appropriate containment. Severity affects the scale and urgency of containment, not whether containment occurs.',40);

  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[5],'Affected systems have been restored from backup',false,'System restoration is recovery, which follows eradication. Eradication must be confirmed complete before recovery begins.',10),
    (gen_random_uuid(),qids[5],'Malware is removed, exploited vulnerabilities are patched, and the threat actor''s access is fully revoked',true,'Eradication is complete only when all three conditions are met. Any remaining malware, open vulnerability, or active attacker account means eradication is not complete; recovery risks re-infecting restored systems.',20),
    (gen_random_uuid(),qids[5],'The incident has been reported to regulators',false,'Regulatory reporting is a parallel obligation, not an eradication criterion.',30),
    (gen_random_uuid(),qids[5],'No new alerts have appeared for 24 hours',false,'24-hour silence is not a reliable eradication indicator. Sophisticated attackers may remain dormant while maintaining access.',40);

  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[6],'24 hours',false,'Some banking regulators have 24-hour requirements for operational incidents, but the GDPR personal data breach notification requirement is 72 hours.',10),
    (gen_random_uuid(),qids[6],'72 hours',true,'GDPR Article 33 requires notification to the data protection supervisory authority within 72 hours of becoming aware of a personal data breach. Initial notification may be made before full investigation is complete, with updates to follow.',20),
    (gen_random_uuid(),qids[6],'30 days',false,'30 days is a common misconception. The GDPR requirement is 72 hours for supervisory authority notification.',30),
    (gen_random_uuid(),qids[6],'After investigation is complete, with no fixed deadline',false,'GDPR sets a fixed 72-hour deadline. Organizations cannot delay notification until investigation is complete.',40);

  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[7],'Whether to pay the phisher to recover credentials',false,'Payment is never a legitimate triage consideration. Triage focuses on scope, severity, and immediate response.',10),
    (gen_random_uuid(),qids[7],'Whether this is a confirmed incident, its initial severity, what systems or data may be affected, and what immediate containment action is required',true,'These are the four core triage questions. Answers determine the urgency and initial actions: disabling accounts, notifying affected employees, and escalating to the appropriate response level.',20),
    (gen_random_uuid(),qids[7],'Which employee clicked the phishing link first, for disciplinary purposes',false,'Root cause and accountability analysis happen in Lessons Learned, after the incident. Triage is focused on rapid response, not blame.',30),
    (gen_random_uuid(),qids[7],'Whether to notify customers before investigation is complete',false,'Customer notification decisions are made at the communication phase, based on confirmed impact. Triage establishes scope, not communication strategy.',40);

  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[8],'Prevent the laptop from being used to access the network',false,'Network access would typically be handled separately. The specific reason for not powering off is forensic evidence preservation.',10),
    (gen_random_uuid(),qids[8],'Preserve volatile memory (RAM) that may contain forensic evidence of running processes and network connections',true,'RAM is volatile; it is lost when the system powers off. A forensic memory image can reveal malware processes, active network connections, encryption keys, and attacker commands that are critical to understanding what happened.',20),
    (gen_random_uuid(),qids[8],'Allow remote antivirus scanning to complete',false,'This is not the primary reason. RAM evidence preservation is the key concern.',30),
    (gen_random_uuid(),qids[8],'Prevent triggering an automatic backup that could spread malware',false,'This is not generally accurate. The reason is RAM evidence preservation.',40);

  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[9],'Containment, Recovery, Eradication',false,'The correct order is Eradication before Recovery. You must fully remove the threat before restoring systems.',10),
    (gen_random_uuid(),qids[9],'Eradication, Recovery, Lessons Learned',true,'This is the correct sequence. Eradication removes the threat; Recovery restores systems; Lessons Learned captures what happened and what to improve. Each phase depends on the previous being complete.',20),
    (gen_random_uuid(),qids[9],'Recovery, Eradication, Lessons Learned',false,'Recovery before Eradication risks restoring systems into an environment that still contains the threat, leading to re-infection.',30),
    (gen_random_uuid(),qids[9],'Lessons Learned, Eradication, Recovery',false,'Lessons Learned is the final phase. It cannot logically precede operational recovery.',40);

  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[10],'Provide a brief comment confirming the breach to show transparency',false,'Unauthorized disclosure of incident details to media, including confirmation, must not occur without executive and legal authorization.',10),
    (gen_random_uuid(),qids[10],'Do not confirm or deny anything; refer the journalist to the official communications team or press office',true,'All media contact during an active incident must be routed through the authorized communications function. Unauthorized comment, even a denial, can be harmful and may have legal consequences.',20),
    (gen_random_uuid(),qids[10],'Deny the breach entirely to protect the bank''s reputation',false,'Making false statements to the media is both unethical and potentially illegal. Do not confirm, deny, or comment; refer to communications.',30),
    (gen_random_uuid(),qids[10],'Ask the journalist to hold the story until the investigation is complete',false,'Negotiating publication timelines is a decision for communications and legal professionals, not for individual employees. Refer and do not engage further.',40);

  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[11],'To assign penalties to employees responsible for the incident',false,'Lessons Learned is an improvement mechanism, not a disciplinary process. Blame-focused reviews discourage honest reflection.',10),
    (gen_random_uuid(),qids[11],'To identify what happened, what worked well, what failed, and what changes should be made to improve future response',true,'Lessons Learned is a structured post-incident review aimed at continuous improvement. Organizations that skip this phase are likely to repeat the same mistakes.',20),
    (gen_random_uuid(),qids[11],'To produce the final regulatory incident report',false,'Regulatory reporting is a separate obligation. Lessons Learned is an internal improvement process.',30),
    (gen_random_uuid(),qids[11],'To determine the financial cost of the incident for insurance claims',false,'Financial assessment may occur in parallel, but Lessons Learned is focused on operational improvement, not cost accounting.',40);

  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[12],'Purchasing new database software to replace the compromised system',false,'Purchasing new software is a long-term remediation. Containment requires immediate action to limit damage.',10),
    (gen_random_uuid(),qids[12],'Disabling the compromised credentials, revoking active sessions, and reviewing access logs to determine what was accessed',true,'These are standard account compromise containment actions: stop the attacker''s access (disable credentials, revoke sessions), and begin understanding the scope (access log review). They limit damage without permanently destroying evidence.',20),
    (gen_random_uuid(),qids[12],'Deleting the database to prevent further data access',false,'Deleting the database destroys evidence and the data itself. Containment isolates the threat while preserving evidence.',30),
    (gen_random_uuid(),qids[12],'Notifying all customers immediately',false,'Customer notification is a communication decision made after the scope is understood. Premature notification before scope is confirmed can cause unnecessary alarm and regulatory complications.',40);

  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[13],'The incident can be monitored for 48 hours before escalation',false,'Critical incidents require immediate escalation, not a monitoring period before action.',10),
    (gen_random_uuid(),qids[13],'Immediate executive escalation, activation of the full incident response team, and consideration of regulatory notification obligations',true,'Critical incidents require the full organizational response: executive leadership is notified immediately, the complete IR team is activated, legal is engaged, and the regulatory notification timeline begins. There is no delay at Critical severity.',20),
    (gen_random_uuid(),qids[13],'The incident is referred to the IT helpdesk as a technical problem',false,'A spreading ransomware attack requires an executive-level response, not a helpdesk ticket.',30),
    (gen_random_uuid(),qids[13],'Only the security team needs to be notified at this severity level',false,'Critical incidents require involvement beyond the security team: executive leadership, legal, communications, and potentially regulators.',40);

  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[14],'Backup files are legally required to be used in all recovery scenarios',false,'The reason is technical and operational, not legal. Using unverified backups risks restoring the threat itself.',10),
    (gen_random_uuid(),qids[14],'Backups created after the compromise may themselves contain malware, re-infecting systems that are restored from them',true,'If malware was present before a backup was made, that backup is compromised. Restoring from it re-introduces the threat. Only backups verified to pre-date or be clean of the compromise are safe to use for recovery.',20),
    (gen_random_uuid(),qids[14],'Regulatory requirements specify that only verified backups may be used',false,'While regulators expect sound recovery practices, the primary reason is operational: preventing re-infection.',30),
    (gen_random_uuid(),qids[14],'Unverified backups are slower to restore',false,'Restoration speed is irrelevant to the safety concern. The issue is re-infection risk.',40);

  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[15],'An IRP only needs to cover ransomware; other incidents can be managed ad hoc',false,'An IRP must cover the range of incident types relevant to the organization, not only ransomware.',10),
    (gen_random_uuid(),qids[15],'An IRP must be kept current and tested regularly; an untested or outdated plan will fail when needed most',true,'Plans that are never tested become outdated (wrong contacts, wrong systems, wrong procedures) and teams that have never rehearsed will underperform under the pressure of a real incident. Regular testing and updating are non-negotiable.',20),
    (gen_random_uuid(),qids[15],'Incident response planning is only required for organizations with dedicated security teams',false,'All organizations that process sensitive data, including every financial institution, require an IRP regardless of the size of their security function.',30),
    (gen_random_uuid(),qids[15],'A well-written IRP eliminates the need for incident response training',false,'Documentation and training are complementary. A plan that no one has practiced will not be executed effectively.',40);
END $fe$;

END $$;
