-- 018_module_seed_executive_risk.sql
-- Module 7: Executive Cybersecurity Risk Management
-- Topic 1.0 – Cybersecurity as Business Risk (2 subtopics + checkpoint)
-- Topic 2.0 – Leadership Responsibilities (2 subtopics + checkpoint)
-- Final Exam: 15 MCQs

ALTER TABLE public.quiz_options
  ADD COLUMN IF NOT EXISTS explanation TEXT;

DO $$
DECLARE
  v_mod  UUID := gen_random_uuid();
  v_c10  UUID := gen_random_uuid();
  v_c11  UUID := gen_random_uuid();
  v_c11q UUID := gen_random_uuid();
  v_c12  UUID := gen_random_uuid();
  v_c12q UUID := gen_random_uuid();
  v_c20  UUID := gen_random_uuid();
  v_c21  UUID := gen_random_uuid();
  v_c21q UUID := gen_random_uuid();
  v_c22  UUID := gen_random_uuid();
  v_c22q UUID := gen_random_uuid();
  v_cp1  UUID := gen_random_uuid();
  v_cp2  UUID := gen_random_uuid();
  v_fe   UUID := gen_random_uuid();
  vq UUID; va UUID; vb UUID; vc UUID; vd UUID;
  r RECORD;
  qids UUID[];
  i INT;
BEGIN

INSERT INTO public.modules (id,title,description,status,order_index,duration_mins) VALUES (
  v_mod,'Executive Cybersecurity Risk Management',
  'Cybersecurity is not just a technical function; it is a core business risk that requires executive ownership. This module covers how leaders quantify and communicate cyber risk, apply risk management frameworks, and build the governance structures that sustain a secure organization.',
  'published',7,50
);
INSERT INTO public.module_role_access (module_id,role_id) SELECT v_mod,id FROM public.roles;

-- TOPIC 1 --
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number,learning_objectives) VALUES (
  v_c10,v_mod,'Cybersecurity as Business Risk','text',
  '<p>Senior leaders are increasingly accountable for cybersecurity outcomes. Boards, regulators, and customers expect executives to understand and manage cyber risk with the same rigor applied to financial or operational risk.</p>',
  10,'1.0',
  ARRAY['Explain why cybersecurity is a business risk, not solely a technical problem','Quantify cyber risk in financial and operational terms','Apply a risk management framework to cybersecurity decisions']
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c11,v_mod,'Quantifying and Communicating Cyber Risk','text',
  '<p>Cybersecurity risk is often communicated in technical language that does not resonate with business decision-makers. Effective executives translate cyber risk into the terms that drive organizational decisions: financial exposure, operational impact, regulatory liability, and reputational damage.</p>
<h3>The Business Cost of a Cyber Incident</h3>
<p>A significant breach or ransomware attack can produce costs across multiple categories simultaneously:</p>
<ul>
  <li><strong>Direct financial losses:</strong> Fraudulent transactions, ransom payments, theft of funds</li>
  <li><strong>Incident response costs:</strong> Forensic investigation, legal fees, crisis communications, consultant fees</li>
  <li><strong>Regulatory fines and penalties:</strong> Under GDPR, PCI-DSS, or sector-specific banking regulations, fines can reach tens of millions of euros</li>
  <li><strong>Business interruption:</strong> Systems offline means operations halt; for a bank, this means transaction processing failures, customer service disruptions, and potential SLA breaches</li>
  <li><strong>Reputational damage:</strong> Customer attrition, reduced trust, long-term brand damage, often the most significant long-term cost</li>
</ul>
<h3>Risk Quantification Frameworks</h3>
<p>Two commonly used approaches help translate cyber risk into business language:</p>
<ul>
  <li><strong>FAIR (Factor Analysis of Information Risk):</strong> A quantitative model that estimates the probable financial impact of a cyber event by analyzing threat frequency and the magnitude of potential loss. Produces a range of expected annual loss in monetary terms.</li>
  <li><strong>Heat Maps / Risk Registers:</strong> Qualitative tools that plot risks by likelihood and impact. More accessible for board-level reporting, though less precise than FAIR.</li>
</ul>
<h3>Communicating Risk to the Board</h3>
<p>Effective board-level cyber risk reporting has three characteristics: it is expressed in business terms (not technical jargon), it compares risk against the organization''s defined risk appetite, and it links security investment to risk reduction outcomes. A CISO or executive saying "we blocked 10,000 threats last month" is not informative. Saying "our current exposure to a payment system breach is estimated at €4–12M; the proposed investment reduces this to €800K–2M" is actionable.</p>',
  20,'1.1'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c11q,v_mod,'Quiz: Quantifying Cyber Risk','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"A CISO presents the following to the board: ''We mitigated 47,000 attacks last month.'' Why is this an ineffective risk communication?","options":[
      {"id":"a","text":"The number is too large to be credible","correct":false,"explanation":"The problem is not the number itself but the lack of business context. Attack volumes without context do not inform decisions."},
      {"id":"b","text":"It does not connect security activity to business impact, risk exposure, or investment decisions","correct":true,"explanation":"Effective board-level communication must answer: what is our financial exposure, how does this compare to our risk appetite, and what do we need to invest to reduce it? Raw activity metrics do not answer these questions."},
      {"id":"c","text":"Security metrics should not be shared at board level","correct":false,"explanation":"Boards need cyber risk information, but in business terms, not technical metrics."},
      {"id":"d","text":"The CISO should only report annually, not monthly","correct":false,"explanation":"Reporting frequency is a governance decision, but the core problem here is the nature of the metric, not its frequency."}
    ]},
    {"id":"q2","text":"The FAIR framework is used in cybersecurity to:","options":[
      {"id":"a","text":"Conduct penetration tests on financial systems","correct":false,"explanation":"FAIR is a risk quantification model, not a testing methodology."},
      {"id":"b","text":"Estimate the probable financial impact of cyber events in monetary terms","correct":true,"explanation":"FAIR (Factor Analysis of Information Risk) produces a range of expected annual loss in monetary terms by analyzing threat frequency and loss magnitude, enabling risk-based business decisions."},
      {"id":"c","text":"Classify data by sensitivity level","correct":false,"explanation":"Data classification has its own frameworks. FAIR addresses risk quantification."},
      {"id":"d","text":"Score employee security awareness","correct":false,"explanation":"FAIR is not an HR or awareness measurement tool."}
    ]},
    {"id":"q3","text":"Which category of breach cost is typically the most significant in the long term for a financial institution?","options":[
      {"id":"a","text":"Ransom payment","correct":false,"explanation":"Ransom payments are direct costs but are typically one-time and bounded. Long-term impact is usually larger from other categories."},
      {"id":"b","text":"Forensic investigation fees","correct":false,"explanation":"Investigation costs are significant but bounded and one-time."},
      {"id":"c","text":"Reputational damage and customer attrition","correct":true,"explanation":"For a bank, trust is foundational. A significant breach can cause customers to move accounts, reduce partner confidence, and suppress new business for years, making reputation the most enduring cost."},
      {"id":"d","text":"IT system recovery","correct":false,"explanation":"Recovery costs are real but finite. Reputational damage persists."}
    ]}
  ]}',
  30,'1.1'
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c12,v_mod,'Risk Management Frameworks','text',
  '<p>Organizations use structured frameworks to systematically identify, assess, and treat cybersecurity risks. Rather than reacting to incidents, a mature organization applies a repeatable process to maintain a current view of its risk landscape.</p>
<h3>The Risk Management Lifecycle</h3>
<p>Effective cyber risk management follows a continuous cycle:</p>
<ol>
  <li><strong>Identify:</strong> Catalog assets, systems, processes, and their associated threats and vulnerabilities. What do we have, and what could go wrong?</li>
  <li><strong>Assess:</strong> Evaluate the likelihood and impact of identified risks. Which risks are within our risk appetite? Which require treatment?</li>
  <li><strong>Treat:</strong> Choose a risk response for each significant risk: mitigate (add controls), transfer (insurance, contracts), accept (documented decision), or avoid (stop the risky activity).</li>
  <li><strong>Monitor:</strong> Track the effectiveness of controls and the evolution of the threat landscape. Risks change as the environment changes.</li>
  <li><strong>Report:</strong> Communicate the risk position to leadership and the board regularly, with metrics tied to risk appetite.</li>
</ol>
<h3>NIST Cybersecurity Framework</h3>
<p>The NIST CSF is the most widely adopted cybersecurity framework globally. It organizes security activities into five functions:</p>
<ul>
  <li><strong>Identify:</strong> Understand assets, risks, and governance</li>
  <li><strong>Protect:</strong> Implement safeguards to deliver critical services</li>
  <li><strong>Detect:</strong> Identify cybersecurity events</li>
  <li><strong>Respond:</strong> Take action after a detected incident</li>
  <li><strong>Recover:</strong> Restore capabilities impaired by an incident</li>
</ul>
<h3>Risk Appetite and Risk Tolerance</h3>
<p><strong>Risk appetite</strong> is the amount and type of risk an organization is willing to accept in pursuit of its objectives, set by the board. <strong>Risk tolerance</strong> is the acceptable variation around that appetite in practice. A bank''s risk appetite statement might say: "We accept no operational risk from a system failure that would halt payment processing for more than 4 hours." Any identified risk that could breach this threshold requires immediate treatment.</p>',
  40,'1.2'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c12q,v_mod,'Quiz: Risk Management Frameworks','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"An executive team reviews a risk and decides to purchase cyber insurance rather than invest in additional technical controls. Which risk treatment strategy is this?","options":[
      {"id":"a","text":"Mitigation","correct":false,"explanation":"Mitigation means adding controls to reduce the likelihood or impact of the risk directly. Insurance does not change the risk itself."},
      {"id":"b","text":"Avoidance","correct":false,"explanation":"Avoidance means stopping the activity that creates the risk. The organization is continuing its operations."},
      {"id":"c","text":"Transfer","correct":true,"explanation":"Purchasing insurance transfers the financial impact of the risk to a third party. The risk itself remains, but the financial consequences are shared with the insurer."},
      {"id":"d","text":"Acceptance","correct":false,"explanation":"Acceptance means documenting the risk and taking no action. Purchasing insurance is an active treatment, not passive acceptance."}
    ]},
    {"id":"q2","text":"In the NIST Cybersecurity Framework, which function covers identifying the occurrence of a cybersecurity event?","options":[
      {"id":"a","text":"Protect","correct":false,"explanation":"Protect covers implementing safeguards: preventive measures applied before an event."},
      {"id":"b","text":"Identify","correct":false,"explanation":"Identify covers understanding your assets and risk posture, not detecting active events."},
      {"id":"c","text":"Detect","correct":true,"explanation":"The Detect function covers implementing activities to identify cybersecurity events, including continuous monitoring, anomaly detection, and security alerts."},
      {"id":"d","text":"Respond","correct":false,"explanation":"Respond covers taking action after detection. Detection must come first."}
    ]},
    {"id":"q3","text":"What is the difference between risk appetite and risk tolerance?","options":[
      {"id":"a","text":"Risk appetite applies to technical risks; risk tolerance applies to operational risks","correct":false,"explanation":"Both concepts apply across all risk categories; they are not separated by risk type."},
      {"id":"b","text":"Risk appetite is the level of risk accepted in pursuit of objectives; risk tolerance is the acceptable variation around that appetite in practice","correct":true,"explanation":"The board sets the appetite (strategic boundary), and tolerance defines how much operational deviation from that boundary is acceptable before escalation is required."},
      {"id":"c","text":"Risk appetite is set by IT; risk tolerance is set by the board","correct":false,"explanation":"It is the reverse: the board sets risk appetite at a strategic level. IT and operations implement controls within that appetite."},
      {"id":"d","text":"They are synonymous terms for the same concept","correct":false,"explanation":"They are related but distinct. Appetite is the strategic boundary; tolerance is the operational allowance around it."}
    ]}
  ]}',
  50,'1.2'
);

-- Topic 1 Checkpoint --
INSERT INTO public.quizzes (id,module_id,title,quiz_type,section_number,pass_score,max_attempts,time_limit_mins) VALUES (
  v_cp1,v_mod,'Topic 1 Checkpoint: Cybersecurity as Business Risk','checkpoint','1.0',70,3,null
);
INSERT INTO public.quiz_questions (id,quiz_id,question_text,order_index) VALUES
  (gen_random_uuid(),v_cp1,'Which of the following best describes why cybersecurity is classified as a business risk rather than solely a technical problem?',10),
  (gen_random_uuid(),v_cp1,'A bank experiences a ransomware attack that takes its payment processing systems offline for 36 hours. Beyond the ransom itself, what other categories of cost would the organization likely face?',20),
  (gen_random_uuid(),v_cp1,'An executive wants to demonstrate the value of a proposed security investment to the board. Which approach is most effective?',30),
  (gen_random_uuid(),v_cp1,'In the risk management lifecycle, what does the "Treat" step involve?',40),
  (gen_random_uuid(),v_cp1,'A board sets the following policy: "No single system failure shall result in customer-facing downtime exceeding 2 hours." This statement is an example of:',50);

  -- CP1 Q1
  SELECT id INTO r FROM public.quiz_questions WHERE quiz_id=v_cp1 AND order_index=10;
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),r.id,'Cyber incidents can only be prevented by technical teams, so executives need not be involved',false,'This view leaves the organization exposed. Executive ownership of cyber risk is now a regulatory and governance expectation.',10),
    (gen_random_uuid(),r.id,'Cyber incidents produce financial losses, operational disruption, regulatory penalties, and reputational damage that affect the entire organization',true,'These impacts span every part of the business and require executive-level decisions about risk appetite, investment, and governance, not just technical responses.',20),
    (gen_random_uuid(),r.id,'Cybersecurity risk is fully managed by insurance, so it requires no executive attention',false,'Insurance transfers financial impact but does not manage the underlying risk. Executives must still govern and mitigate cyber risk.',30),
    (gen_random_uuid(),r.id,'Business risk refers only to financial fraud, which is separate from cybersecurity',false,'Cybersecurity incidents are a primary driver of modern financial fraud. The two are inseparable in a banking context.',40);
  -- CP1 Q2
  SELECT id INTO r FROM public.quiz_questions WHERE quiz_id=v_cp1 AND order_index=20;
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),r.id,'Only the ransom payment and IT recovery costs',false,'These are direct and bounded costs. A significant incident creates cascading costs across multiple categories.',10),
    (gen_random_uuid(),r.id,'Incident response fees, regulatory fines, business interruption losses, and long-term reputational damage',true,'A major incident creates simultaneous costs across all these categories. Reputational damage is often the most persistent.',20),
    (gen_random_uuid(),r.id,'No additional costs if the ransom is paid promptly',false,'Payment does not eliminate other costs and may not even restore systems. Paying ransom is also associated with additional regulatory scrutiny.',30),
    (gen_random_uuid(),r.id,'Only regulatory fines, as these are the largest category',false,'Regulatory fines can be significant, but business interruption and reputational damage are often larger in aggregate.',40);
  -- CP1 Q3
  SELECT id INTO r FROM public.quiz_questions WHERE quiz_id=v_cp1 AND order_index=30;
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),r.id,'Present the number of threats blocked last quarter',false,'Activity metrics without business context do not inform investment decisions.',10),
    (gen_random_uuid(),r.id,'Show technical vulnerability scores and patch completion percentages',false,'Technical metrics are relevant to operations but do not speak the board''s language of financial exposure and risk appetite.',20),
    (gen_random_uuid(),r.id,'Quantify the current risk exposure in financial terms and show how the investment reduces that exposure',true,'Boards make investment decisions based on cost and risk reduction. Showing that a €500K investment reduces a €5M exposure to €800K is a business case, not a technical request.',30),
    (gen_random_uuid(),r.id,'Reference high-profile breaches at other banks to create urgency',false,'Industry examples can add context but are not a substitute for quantifying your own organization''s specific risk exposure.',40);
  -- CP1 Q4
  SELECT id INTO r FROM public.quiz_questions WHERE quiz_id=v_cp1 AND order_index=40;
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),r.id,'Identify all assets and systems in the organization',false,'Asset identification is part of the Identify step, not Treat.',10),
    (gen_random_uuid(),r.id,'Choose a response strategy for each significant risk: mitigate, transfer, accept, or avoid',true,'Treatment is about deciding what to do with identified and assessed risks. Each significant risk requires an explicit, documented response decision.',20),
    (gen_random_uuid(),r.id,'Monitor security controls to ensure they are working effectively',false,'Monitoring is its own step in the lifecycle, following treatment.',30),
    (gen_random_uuid(),r.id,'Report the risk position to the board',false,'Reporting is the final step. Treatment decisions must come before reporting on what has been done.',40);
  -- CP1 Q5
  SELECT id INTO r FROM public.quiz_questions WHERE quiz_id=v_cp1 AND order_index=50;
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),r.id,'A technical SLA for IT operations',false,'While it describes a system performance target, its purpose here is to define the threshold at which risk becomes unacceptable: a governance concept.',10),
    (gen_random_uuid(),r.id,'A risk appetite statement',true,'This is a clear expression of how much operational disruption the board is prepared to accept. Any identified risk threatening to breach this boundary must be treated.',20),
    (gen_random_uuid(),r.id,'A business continuity plan',false,'A business continuity plan describes the response to an outage. This statement defines the acceptable threshold, not the response.',30),
    (gen_random_uuid(),r.id,'An incident response policy',false,'Incident response is about how to act during and after an incident. This statement is a pre-incident governance boundary.',40);

-- TOPIC 2 --
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number,learning_objectives) VALUES (
  v_c20,v_mod,'Leadership Responsibilities in Cybersecurity','text',
  '<p>Cybersecurity governance requires active executive leadership, not just delegation to a technical team. Leaders set the tone, allocate resources, define accountability, and model the behaviors they expect from the organization.</p>',
  60,'2.0',
  ARRAY['Describe the governance structures that support effective cybersecurity','Explain how executives build and sustain a security culture','Identify the key leadership behaviors that reduce organizational cyber risk']
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c21,v_mod,'Governance Structures and Executive Accountability','text',
  '<p>Cybersecurity governance defines who is responsible for what, how decisions are made, and how the organization ensures its security posture remains aligned with its risk appetite. Governance is not the same as management; governance sets the direction and accountability, while management executes it.</p>
<h3>Key Governance Roles</h3>
<ul>
  <li><strong>Board of Directors:</strong> Sets risk appetite, approves the security strategy, holds the CEO and executive team accountable for cyber risk outcomes, and ensures regulatory obligations are met.</li>
  <li><strong>Chief Executive Officer (CEO):</strong> Accountable for the organization''s overall security posture. The CEO must ensure cybersecurity is resourced and integrated into business strategy, not treated as a back-office function.</li>
  <li><strong>Chief Information Security Officer (CISO):</strong> Leads the cybersecurity function, develops and executes the security strategy, and reports risk position to executive leadership and the board. In many jurisdictions, the CISO is now a regulated role with personal accountability.</li>
  <li><strong>All Senior Leaders:</strong> Accountable for cybersecurity within their own business units. Security is not the CISO''s problem alone; the Head of Retail Banking is accountable for how their team handles customer data.</li>
</ul>
<h3>Governance Mechanisms</h3>
<ul>
  <li><strong>Security Committee:</strong> Cross-functional executive body that reviews the risk register, approves investments, and escalates significant risks to the board.</li>
  <li><strong>Policy Framework:</strong> Board-approved policies that set mandatory requirements: acceptable use, access control, data handling, incident reporting. Policies must be enforced, not just documented.</li>
  <li><strong>Third-Party Risk Management:</strong> Suppliers and partners with access to systems or data extend the organization''s attack surface. Executives must ensure third-party risk is assessed, contracted, and monitored.</li>
  <li><strong>Regulatory Engagement:</strong> Banking regulators (such as the ECB, PRA, or national banking authorities) have specific expectations for cybersecurity governance. Executives are personally accountable for regulatory compliance.</li>
</ul>
<h3>The Three Lines Model</h3>
<p>Many financial institutions use the Three Lines model to clarify accountability:</p>
<ul>
  <li><strong>First Line:</strong> Business units: own and manage risks within their operations</li>
  <li><strong>Second Line:</strong> Risk and compliance functions: provide oversight, frameworks, and challenge</li>
  <li><strong>Third Line:</strong> Internal audit: provides independent assurance to the board</li>
</ul>',
  70,'2.1'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c21q,v_mod,'Quiz: Governance and Accountability','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"Under the Three Lines model, which line is responsible for owning and managing cybersecurity risks within day-to-day operations?","options":[
      {"id":"a","text":"Second line: the risk and compliance function","correct":false,"explanation":"The second line provides oversight and frameworks but does not own or manage operational risks directly."},
      {"id":"b","text":"Third line: internal audit","correct":false,"explanation":"Internal audit provides independent assurance to the board. It is not responsible for managing operational risks."},
      {"id":"c","text":"First line: business units","correct":true,"explanation":"The first line consists of the business units and functions that conduct operations. They own the risks created by their activities and are responsible for managing them with appropriate controls."},
      {"id":"d","text":"The board of directors","correct":false,"explanation":"The board sets direction and holds management accountable. Operational risk ownership sits in the first line."}
    ]},
    {"id":"q2","text":"A Head of Operations argues: ''Cybersecurity is the CISO''s responsibility, not mine.'' Why is this view incorrect in a well-governed organization?","options":[
      {"id":"a","text":"It is correct: the CISO is solely responsible for all cybersecurity outcomes","correct":false,"explanation":"Concentrating all accountability on the CISO is a governance failure. The CISO leads the security function but cannot own every business unit''s security behavior."},
      {"id":"b","text":"Senior leaders are accountable for cybersecurity within their own business units; the CISO provides the framework and oversight","correct":true,"explanation":"Under the Three Lines model, business leaders own the risks created by their operations. The CISO provides strategy, frameworks, and oversight, but business accountability cannot be delegated away."},
      {"id":"c","text":"It is correct if the organization has a dedicated security operations center","correct":false,"explanation":"A SOC handles detection and response. It does not replace business unit accountability for how staff handle data, access, and security policies."},
      {"id":"d","text":"The Head of Operations is responsible only for physical security, not cyber","correct":false,"explanation":"In an operational role with access to systems and staff, cyber risk is inseparable from operational responsibility."}
    ]},
    {"id":"q3","text":"What is the primary purpose of a board-level Security Committee?","options":[
      {"id":"a","text":"To conduct penetration tests and vulnerability assessments","correct":false,"explanation":"Testing is an operational function. A board-level committee sets direction and oversight, not hands-on security operations."},
      {"id":"b","text":"To review the risk register, approve security investments, and escalate significant risks to the board","correct":true,"explanation":"A Security Committee is a governance mechanism; it translates operational security information into board-level decisions about risk appetite, investment, and accountability."},
      {"id":"c","text":"To approve individual security patches","correct":false,"explanation":"Patch decisions are operational. Governance committees focus on strategy and significant risks, not day-to-day operational choices."},
      {"id":"d","text":"To manage vendor contracts for security software","correct":false,"explanation":"Procurement is an operational function. The Security Committee may set policy for third-party risk but does not manage contracts directly."}
    ]}
  ]}',
  80,'2.1'
);

INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c22,v_mod,'Building a Security Culture','text',
  '<p>Technology and policy alone cannot make an organization secure. The behavior of every person in the organization, shaped by its culture, is the decisive factor. Culture is not a training program; it is the product of what leaders consistently do, reward, and allow.</p>
<h3>What a Security Culture Looks Like</h3>
<p>In an organization with a strong security culture:</p>
<ul>
  <li>Employees report suspicious emails, calls, and activity without fear of being dismissed or blamed</li>
  <li>Leaders visibly follow the same rules as everyone else, no exceptions for seniority</li>
  <li>Security awareness is embedded in onboarding and continuous development, not limited to annual checkbox training</li>
  <li>Near-misses and mistakes are treated as learning opportunities, not occasions for punishment</li>
  <li>Security teams are seen as business enablers, not obstacles</li>
</ul>
<h3>Leadership Behaviors That Shape Culture</h3>
<p>Culture is not communicated through memos; it is demonstrated through behavior. Specific leadership actions that build security culture:</p>
<ul>
  <li><strong>Modeling compliance:</strong> Senior leaders who complete training on time, follow clean-desk policy, and challenge unfamiliar visitors signal that these behaviors are genuinely expected</li>
  <li><strong>Funding awareness programs:</strong> Allocating budget and executive time to security training demonstrates organizational priority</li>
  <li><strong>Celebrating reporting:</strong> Publicly recognizing staff who report phishing attempts or security concerns encourages others to do the same</li>
  <li><strong>Holding leaders accountable:</strong> When a business unit has a security failure, the leader of that unit is held accountable, not just the IT team</li>
  <li><strong>Communicating after incidents:</strong> Transparent communication about what happened, what was done, and what changed builds trust and reinforces seriousness</li>
</ul>
<h3>Measuring Security Culture</h3>
<p>Culture can be measured through: phishing simulation click rates over time, near-miss reporting rates, training completion and assessment scores, security survey results, and incident root-cause analysis. A healthy culture shows declining click rates, increasing reporting rates, and high voluntary training engagement. Executives who track these metrics signal that culture is a priority, not an aspiration.</p>',
  90,'2.2'
);
INSERT INTO public.module_content (id,module_id,title,content_type,content_body,order_index,section_number) VALUES (
  v_c22q,v_mod,'Quiz: Building a Security Culture','knowledge_check',
  '{"questions":[
    {"id":"q1","text":"A senior executive is exempt from the organization''s mandatory security awareness training because ''they are too busy.'' What risk does this create?","options":[
      {"id":"a","text":"No material risk: senior executives already understand security","correct":false,"explanation":"Seniority does not equal security awareness. Executives are high-value targets for spear phishing and social engineering precisely because of their authority and access."},
      {"id":"b","text":"It signals that security is optional for influential people, undermining the culture of compliance for everyone","correct":true,"explanation":"Culture is shaped by what leaders model. When executives are exempt from rules, it signals that rules are for others, and compliance rates across the organization will reflect that signal."},
      {"id":"c","text":"The executive could miss one threat type covered in training","correct":false,"explanation":"While true, the systemic cultural signal is the more significant risk. Exemptions undermine the entire compliance culture."},
      {"id":"d","text":"It creates a legal liability for the training vendor","correct":false,"explanation":"The liability and risk belong to the organization, not the training vendor."}
    ]},
    {"id":"q2","text":"An employee reports a suspicious email that turns out to be a genuine vendor communication, not an attack. What is the most appropriate leadership response?","options":[
      {"id":"a","text":"Remind the employee to check more carefully before reporting","correct":false,"explanation":"Criticizing good-faith reporting will discourage future reports. False positives are far preferable to unreported genuine threats."},
      {"id":"b","text":"Ignore the report to avoid creating alarm","correct":false,"explanation":"Ignoring reports signals that reporting is pointless: exactly the culture you do not want."},
      {"id":"c","text":"Thank the employee for reporting and confirm that reporting is always the right action","correct":true,"explanation":"Reinforcing reporting behavior, even when the report turns out to be a false alarm, builds the culture where real threats will also be reported. The cost of a false positive is near zero; the cost of an unreported real attack can be catastrophic."},
      {"id":"d","text":"Escalate the vendor communication to legal as a potential impersonation","correct":false,"explanation":"This creates unnecessary alarm for what is already identified as a genuine vendor communication. The appropriate response is to close the loop with the employee positively."}
    ]},
    {"id":"q3","text":"Which metric best indicates an improving security culture over time?","options":[
      {"id":"a","text":"A decrease in the number of security policy documents","correct":false,"explanation":"Document count is not a culture metric. Culture is about behavior, not documentation volume."},
      {"id":"b","text":"An increasing number of near-miss reports submitted by employees","correct":true,"explanation":"A rising near-miss reporting rate indicates that employees feel safe reporting and believe it matters, both hallmarks of a strong security culture. Low reporting rates suggest fear of blame or a belief that reporting is pointless."},
      {"id":"c","text":"A reduction in the security team headcount","correct":false,"explanation":"Headcount reduction is not a culture indicator and may simply reflect budget cuts rather than improved security."},
      {"id":"d","text":"Fewer security trainings scheduled per year","correct":false,"explanation":"Training frequency is an input, not an outcome metric. Fewer trainings may indicate reduced investment, not improved culture."}
    ]}
  ]}',
  100,'2.2'
);

--  Topic 2 Checkpoint --
INSERT INTO public.quizzes (id,module_id,title,quiz_type,section_number,pass_score,max_attempts,time_limit_mins) VALUES (
  v_cp2,v_mod,'Topic 2 Checkpoint: Leadership Responsibilities','checkpoint','2.0',70,3,null
);
INSERT INTO public.quiz_questions (id,quiz_id,question_text,order_index) VALUES
  (gen_random_uuid(),v_cp2,'Which governance body is ultimately responsible for setting cybersecurity risk appetite in a financial institution?',10),
  (gen_random_uuid(),v_cp2,'A bank is evaluating a third-party cloud provider to host customer data. From a governance perspective, who bears responsibility for ensuring this relationship is secure?',20),
  (gen_random_uuid(),v_cp2,'What is the most reliable indicator of a security-aware culture, as opposed to a box-checking compliance exercise?',30),
  (gen_random_uuid(),v_cp2,'An internal audit team identifies that a business unit has been bypassing the clean-desk policy for over a year without consequence. This is primarily a failure of:',40),
  (gen_random_uuid(),v_cp2,'The CISO presents to the board that phishing simulation click rates have dropped from 24% to 6% over 18 months while near-miss reporting has tripled. What does this data suggest?',50);

  -- CP2 Q1
  SELECT id INTO r FROM public.quiz_questions WHERE quiz_id=v_cp2 AND order_index=10;
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),r.id,'The CISO, as the senior security professional',false,'The CISO develops and executes the security strategy but reports to and is governed by the board. Risk appetite is a board-level decision.',10),
    (gen_random_uuid(),r.id,'The board of directors',true,'Risk appetite is a governance decision; it defines what level of risk the organization is willing to accept in pursuit of its objectives. This is a board responsibility, not an operational one.',20),
    (gen_random_uuid(),r.id,'The IT department, as system owners',false,'IT manages technical controls within the risk appetite set above them. They do not set organizational risk appetite.',30),
    (gen_random_uuid(),r.id,'The regulator, through supervisory guidance',false,'Regulators set minimum standards and expectations, but the organization''s risk appetite is its own governance decision, within regulatory boundaries.',40);

  -- CP2 Q2
  SELECT id INTO r FROM public.quiz_questions WHERE quiz_id=v_cp2 AND order_index=20;
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),r.id,'The cloud provider bears full responsibility once a contract is signed',false,'Outsourcing a function does not outsource the risk. The bank retains accountability for data it processes and stores, regardless of who operates the infrastructure.',10),
    (gen_random_uuid(),r.id,'The bank''s executive leadership retains accountability and must assess, contract, and monitor the relationship',true,'Third-party risk is an extension of the organization''s own risk. Executives must ensure due diligence before engagement, appropriate contractual protections, and ongoing monitoring of the relationship.',20),
    (gen_random_uuid(),r.id,'The regulator assumes responsibility for approved cloud providers',false,'Regulators may approve certain provider types but do not assume liability for individual organizations'' security outcomes.',30),
    (gen_random_uuid(),r.id,'The IT team is solely responsible for third-party security assessments',false,'IT may conduct technical assessments, but executive and governance accountability for third-party relationships is a leadership responsibility.',40);

  -- CP2 Q3
  SELECT id INTO r FROM public.quiz_questions WHERE quiz_id=v_cp2 AND order_index=30;
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),r.id,'100% training completion rates on mandatory courses',false,'Completion rates measure attendance, not behavior. Compliance training can be completed without any change in security behavior.',10),
    (gen_random_uuid(),r.id,'Employees proactively reporting suspicious activity and near-misses without prompting',true,'Voluntary reporting behavior indicates that employees understand threats, feel safe reporting, and believe reporting matters. This is the behavioral outcome that defines real security culture.',20),
    (gen_random_uuid(),r.id,'No security incidents in the past year',false,'Absence of known incidents can indicate good security or simply poor detection. It is not a direct culture measure.',30),
    (gen_random_uuid(),r.id,'A comprehensive, well-documented security policy framework',false,'Policy documentation is an input to culture, not an output. Good policies that no one follows do not create culture.',40);

  -- CP2 Q4
  SELECT id INTO r FROM public.quiz_questions WHERE quiz_id=v_cp2 AND order_index=40;
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),r.id,'Technology: the clean-desk policy needed better enforcement software',false,'Physical security policies depend on human behavior and management accountability, not primarily on software enforcement.',10),
    (gen_random_uuid(),r.id,'Governance and accountability: the policy existed but was not enforced, and no leader was held accountable',true,'A policy that exists on paper but is consistently violated without consequence demonstrates a governance failure. Enforcement requires that leaders are held accountable for compliance in their units.',20),
    (gen_random_uuid(),r.id,'The internal audit function, which should have caught this sooner',false,'Audit identifies failures; the root cause is the absence of accountability in the first line and oversight in the second line. Audit finding it late is a secondary issue.',30),
    (gen_random_uuid(),r.id,'The employees, who chose not to follow the policy',false,'Individual non-compliance at scale typically reflects a culture and leadership failure, not widespread individual misconduct. Leaders set and enforce the expectations.',40);

  -- CP2 Q5
  SELECT id INTO r FROM public.quiz_questions WHERE quiz_id=v_cp2 AND order_index=50;
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),r.id,'The phishing simulations were too easy and should be replaced',false,'Declining click rates over 18 months suggest improving staff awareness, not easier tests. Both metrics together tell a coherent improvement story.',10),
    (gen_random_uuid(),r.id,'Security training investment should be reduced since performance is improving',false,'Sustained improvement requires sustained investment. Cutting training because metrics improved is a common error that leads to regression.',20),
    (gen_random_uuid(),r.id,'The organization''s security culture is measurably improving; staff are more resistant to phishing and more willing to report',true,'Declining click rates indicate improved threat recognition. Tripling reporting rates indicates a culture where staff feel safe and empowered to report. Together, these are strong positive culture indicators.',30),
    (gen_random_uuid(),r.id,'The data is insufficient to draw conclusions without knowing the industry benchmark',false,'Internal trend data over 18 months is meaningful in its own right. Benchmarks add context but are not required to interpret directional improvement.',40);

-- FINAL EXAM --
INSERT INTO public.quizzes (id,module_id,title,quiz_type,pass_score,max_attempts,time_limit_mins) VALUES (
  v_fe,v_mod,'Final Exam: Executive Cybersecurity Risk Management','final_exam',70,2,25
);

INSERT INTO public.quiz_questions (id,quiz_id,question_text,order_index) VALUES
  (gen_random_uuid(),v_fe,'Which of the following best describes the relationship between cybersecurity and business risk?',10),
  (gen_random_uuid(),v_fe,'A financial institution suffers a data breach. Regulatory fines are announced at €8M. However, the CFO estimates total cost at €35M. What accounts for the gap?',20),
  (gen_random_uuid(),v_fe,'The FAIR framework is primarily used for:',30),
  (gen_random_uuid(),v_fe,'In the risk management lifecycle, "Accept" as a risk treatment strategy means:',40),
  (gen_random_uuid(),v_fe,'The NIST Cybersecurity Framework''s "Recover" function covers:',50),
  (gen_random_uuid(),v_fe,'An executive says: "We have great security; we have not had a breach in five years." What is the most significant flaw in this reasoning?',60),
  (gen_random_uuid(),v_fe,'What is the primary role of the board of directors in cybersecurity governance?',70),
  (gen_random_uuid(),v_fe,'Under the Three Lines model, which line provides independent assurance to the board?',80),
  (gen_random_uuid(),v_fe,'A CISO is preparing a quarterly board report. Which format best meets governance expectations?',90),
  (gen_random_uuid(),v_fe,'A vendor with access to the bank''s customer database experiences a breach. Who bears regulatory accountability for the exposure of customer data?',100),
  (gen_random_uuid(),v_fe,'An organization''s phishing simulation click rate has remained at 28% for three years despite annual training. What does this most likely indicate?',110),
  (gen_random_uuid(),v_fe,'Risk appetite is best described as:',120),
  (gen_random_uuid(),v_fe,'A new CEO publicly completes the mandatory security awareness training before any other executive does. What governance principle does this demonstrate?',130),
  (gen_random_uuid(),v_fe,'Which of the following is NOT a characteristic of effective board-level cyber risk communication?',140),
  (gen_random_uuid(),v_fe,'An executive learns that a business unit leader ignored a second-line risk function''s recommendation to restrict contractor access privileges. The CISO escalates this to the board. What governance mechanism is being used?',150);

  SELECT ARRAY_AGG(id ORDER BY order_index) INTO qids
  FROM public.quiz_questions
  WHERE quiz_id = v_fe;

  -- FE Q1
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[1],'Cybersecurity is a subset of IT risk, managed separately from business strategy',false,'This siloed view is outdated and dangerous. Cyber risk affects financial outcomes, operations, reputation, and regulatory standing; it is a core business risk.',10),
    (gen_random_uuid(),qids[1],'Cyber incidents are rare enough that only large organizations need formal risk management',false,'Frequency does not determine the need for risk management. Impact does. A single incident can be existential for any size organization.',20),
    (gen_random_uuid(),qids[1],'Cybersecurity risk produces financial, operational, regulatory, and reputational impacts that require executive governance',true,'This is the correct framing. Cyber risk manifests across all dimensions of business performance and must be governed with the same rigor as financial or operational risk.',30),
    (gen_random_uuid(),qids[1],'Cybersecurity risk is fully transferred to insurers through cyber liability policies',false,'Insurance transfers financial impact, not the underlying risk. Governance, controls, and culture remain the organization''s responsibility.',40);
  -- FE Q2
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[2],'The fine calculation was incorrect and should be disputed',false,'The question assumes the fine is correct. The issue is understanding why total costs exceed the fine.',10),
    (gen_random_uuid(),qids[2],'Incident response costs, business interruption, customer attrition, and reputational damage compound the direct fine',true,'A breach creates simultaneous costs across multiple categories. Regulatory fines are often the smallest component of total breach cost for large incidents.',20),
    (gen_random_uuid(),qids[2],'The CFO is including projected future losses that may not materialize',false,'While future losses are uncertain, the CFO''s estimate reflects real categories of breach cost that are well-documented in incident analysis.',30),
    (gen_random_uuid(),qids[2],'Only the fine is a real cost; the rest are accounting adjustments',false,'Breach costs beyond fines, including investigation, remediation, customer loss, reputational damage, are real economic impacts, not accounting fictions.',40);
  -- FE Q3
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[3],'Conducting network vulnerability scans',false,'FAIR is not a technical scanning tool. It is an analytical framework.',10),
    (gen_random_uuid(),qids[3],'Quantifying cyber risk in financial terms to support business decision-making',true,'FAIR (Factor Analysis of Information Risk) produces estimated annual loss ranges in monetary terms, enabling leaders to compare risk to investment in business language.',20),
    (gen_random_uuid(),qids[3],'Classifying data assets by sensitivity',false,'Data classification uses separate frameworks. FAIR addresses risk quantification.',30),
    (gen_random_uuid(),qids[3],'Assessing employee security awareness scores',false,'FAIR is an organizational risk model, not a personnel measurement tool.',40);
  -- FE Q4
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[4],'Ignoring the risk because it is too difficult to address',false,'Acceptance is a deliberate, documented decision, not neglect. Ignoring a risk without formal decision is not a risk management strategy.',10),
    (gen_random_uuid(),qids[4],'Documenting an explicit decision to carry the risk without additional treatment, because the cost of mitigation exceeds the expected loss',true,'Acceptance is a valid and often appropriate response when the risk is within appetite and the cost of treatment is disproportionate to the benefit. The key is that it is a documented, conscious decision.',20),
    (gen_random_uuid(),qids[4],'Stopping the activity that generates the risk',false,'Stopping the risky activity is avoidance, not acceptance.',30),
    (gen_random_uuid(),qids[4],'Purchasing insurance to cover the risk',false,'Insurance is risk transfer. Acceptance means carrying the risk internally without additional treatment.',40);
  -- FE Q5
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[5],'Identifying threats and classifying assets before an incident occurs',false,'Asset identification and threat mapping belong to the Identify function, which is pre-incident.',10),
    (gen_random_uuid(),qids[5],'Detecting and containing active security events',false,'Detection and containment belong to the Detect and Respond functions.',20),
    (gen_random_uuid(),qids[5],'Restoring systems, services, and capabilities impaired by a cybersecurity incident',true,'Recover addresses the restoration of operations after an incident, including system recovery, communications, and lessons learned integration.',30),
    (gen_random_uuid(),qids[5],'Training staff to recognize phishing attacks',false,'Awareness training is a Protect function activity.',40);
  -- FE Q6
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[6],'Absence of known incidents does not mean absence of risk; threats may be present but undetected',true,'No reported breach may mean strong security, or it may mean poor detection capability. Without active monitoring and threat hunting, the absence of a reported incident is not evidence of safety.',10),
    (gen_random_uuid(),qids[6],'Five years is too short a timeframe for meaningful security assessment',false,'The duration is not the issue; the reasoning is. Five years of no known incident is not equivalent to five years of no risk.',20),
    (gen_random_uuid(),qids[6],'The claim is valid if the organization has not changed its IT systems',false,'Threat landscapes evolve regardless of whether internal systems change. External threats are dynamic.',30),
    (gen_random_uuid(),qids[6],'The organization should increase security spending immediately',false,'The data does not support this conclusion; the reasoning error is about how to interpret the absence of incidents, not necessarily that spend is insufficient.',40);
  -- FE Q7
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[7],'Conducting penetration tests and approving firewall rules',false,'These are operational activities. The board''s role is governance, not technical operations.',10),
    (gen_random_uuid(),qids[7],'Setting risk appetite, approving security strategy, and holding management accountable for cyber risk outcomes',true,'Board governance in cybersecurity means setting the boundaries within which management operates (risk appetite), approving the strategic direction (security strategy), and holding executives accountable for outcomes.',20),
    (gen_random_uuid(),qids[7],'Managing the day-to-day security operations of the organization',false,'Day-to-day management is an executive and operational function. The board provides oversight, not management.',30),
    (gen_random_uuid(),qids[7],'Hiring and supervising the IT security team',false,'The board hires and supervises the CEO. The CEO owns the security function. The board does not directly manage IT staff.',40);
  -- FE Q8
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[8],'First line: business units',false,'Business units own and manage risk. They do not provide independent assurance.',10),
    (gen_random_uuid(),qids[8],'Second line: risk and compliance functions',false,'The second line provides oversight and challenge but is not independent of management in the same way as audit.',20),
    (gen_random_uuid(),qids[8],'Third line: internal audit',true,'Internal audit is independent of management and provides the board with objective assurance that the first and second lines are functioning effectively.',30),
    (gen_random_uuid(),qids[8],'External regulators',false,'Regulators provide external oversight, not the internal assurance function described in the Three Lines model.',40);
  -- FE Q9
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[9],'A technical briefing covering vulnerability counts, patch status, and penetration test findings',false,'Technical detail without business context does not support board-level governance decisions.',10),
    (gen_random_uuid(),qids[9],'A report expressing risk in financial terms, comparing current posture to risk appetite, and linking investments to risk reduction outcomes',true,'This format enables governance decisions: it tells the board where they stand relative to their stated appetite, in terms they can act on.',20),
    (gen_random_uuid(),qids[9],'A list of all security incidents in the past quarter with technical root causes',false,'Incident lists are operational. Board reporting should synthesize, not list, and should connect to risk position and appetite.',30),
    (gen_random_uuid(),qids[9],'An update confirming that no changes were made to security policies',false,'Status quo reporting is not governance. The board needs forward-looking risk position information, not a confirmation that nothing changed.',40);
  -- FE Q10
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[10],'The vendor, as they own and operate the breached systems',false,'While the vendor has operational liability, the bank retains regulatory accountability for data it controls. Regulators will hold the bank responsible.',10),
    (gen_random_uuid(),qids[10],'The bank, as the data controller, retains regulatory accountability regardless of where processing occurs',true,'Under data protection regulations such as GDPR, the data controller, the bank, retains accountability for data it processes. Outsourcing processing does not transfer regulatory liability.',20),
    (gen_random_uuid(),qids[10],'Regulatory accountability is split equally between the bank and the vendor',false,'Regulators look to the data controller. Contractual liability between bank and vendor is a separate matter.',30),
    (gen_random_uuid(),qids[10],'No party is accountable if the contract contained appropriate security warranties',false,'Contractual terms may affect civil liability between parties, but do not eliminate the bank''s regulatory accountability to the data protection authority.',40);
  -- FE Q11
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[11],'The phishing simulations have become too easy; harder scenarios are needed',false,'While simulation difficulty matters, a stagnant rate over three years despite training more likely reflects a training effectiveness or culture problem.',10),
    (gen_random_uuid(),qids[11],'The training approach is ineffective and requires redesign: awareness alone is insufficient without behavioral reinforcement',true,'Annual training that produces no measurable improvement in behavior over three years is not creating behavior change. Effective culture change requires continuous reinforcement, leadership modeling, and consequences, not just annual eLearning.',20),
    (gen_random_uuid(),qids[11],'28% is an acceptable industry standard that should not concern leadership',false,'28% click rates represent significant risk. Even if it were an industry average, acceptable risk is defined by the organization''s risk appetite, not by what is common.',30),
    (gen_random_uuid(),qids[11],'The simulation platform should be replaced',false,'The problem is the training approach and culture, not the platform. Changing platforms without addressing root causes will not improve outcomes.',40);
  -- FE Q12
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[12],'The maximum loss the organization is willing to absorb in any single incident',false,'This describes a risk tolerance threshold, not risk appetite. Risk appetite is a broader strategic concept.',10),
    (gen_random_uuid(),qids[12],'The amount and type of risk an organization is willing to accept in pursuit of its strategic objectives, set by the board',true,'Risk appetite is a strategic governance statement. It defines the boundaries within which the organization is willing to operate, informing investment, treatment, and acceptance decisions.',20),
    (gen_random_uuid(),qids[12],'The residual risk remaining after all controls are applied',false,'Residual risk is what remains after treatment. Risk appetite defines what the organization is willing to accept; it is a target, not a measured outcome.',30),
    (gen_random_uuid(),qids[12],'The likelihood of a significant cyber incident occurring in a given year',false,'Likelihood is a component of risk assessment, not the definition of risk appetite.',40);
  -- FE Q13
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[13],'Regulatory compliance: all executives must complete mandatory training',false,'While compliance is a reason, the CEO doing it first and publicly demonstrates something beyond minimum compliance.',10),
    (gen_random_uuid(),qids[13],'Tone from the top: leaders model the behaviors they expect from the organization',true,'Culture is shaped by what leaders visibly do, not just what they say. A CEO completing training first signals that security applies to everyone, regardless of seniority, one of the most powerful culture-building actions available.',20),
    (gen_random_uuid(),qids[13],'Delegation: the CEO is training so they can delegate security decisions effectively',false,'The behavior is about modeling, not delegation. Delegation is a management action, not a cultural signal.',30),
    (gen_random_uuid(),qids[13],'Risk transfer: trained executives reduce personal liability',false,'The motivation here is cultural signaling, not personal liability management.',40);
  -- FE Q14
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[14],'Expressed in business and financial terms rather than technical jargon',false,'This IS a characteristic of effective board communication. The question asks for what is NOT.',10),
    (gen_random_uuid(),qids[14],'Comprehensive technical detail on every vulnerability discovered in the quarter',true,'Board reporting should be synthesized, strategic, and business-focused. Comprehensive technical vulnerability detail is operational reporting for management, not board governance communication.',20),
    (gen_random_uuid(),qids[14],'Compared against the organization''s defined risk appetite',false,'Comparing to risk appetite IS a characteristic of effective board communication.',30),
    (gen_random_uuid(),qids[14],'Linking security investment to measurable risk reduction outcomes',false,'Linking investment to outcomes IS a characteristic of effective board communication.',40);
  -- FE Q15
  INSERT INTO public.quiz_options (id,question_id,option_text,is_correct,explanation,order_index) VALUES
    (gen_random_uuid(),qids[15],'Technical escalation: the CISO is requesting additional IT resources',false,'This is a governance escalation, not a resource request.',10),
    (gen_random_uuid(),qids[15],'The second line challenging the first line, with escalation to the board as an oversight mechanism',true,'The risk function (second line) challenged business unit behavior, and when the challenge was ignored, the CISO escalated to the board, exactly how the Three Lines model and governance escalation paths are designed to work.',20),
    (gen_random_uuid(),qids[15],'A whistleblowing procedure for reporting unethical behavior',false,'Whistleblowing applies to ethical violations. This is a governance escalation for risk management failure.',30),
    (gen_random_uuid(),qids[15],'Third-line audit asserting findings from an inspection',false,'Internal audit is the third line. The scenario describes the second-line risk function (CISO) escalating a risk decision.',40);

END $$;
