// src/constants/threatCategories.js
// Threat categories used for module tagging and risk display

export const THREAT_CATEGORIES = {
  PHISHING: {
    id:          'phishing',
    label:       'Phishing',
    description: 'Email-based attacks designed to steal credentials or install malware.',
    icon:        '🎣',
    color:       'red',
  },
  SOCIAL_ENGINEERING: {
    id:          'social_engineering',
    label:       'Social Engineering',
    description: 'Psychological manipulation to trick employees into revealing information.',
    icon:        '🎭',
    color:       'orange',
  },
  DOCUMENT_FRAUD: {
    id:          'document_fraud',
    label:       'Document Fraud',
    description: 'Fake financial documents used to obtain loans or access accounts.',
    icon:        '📄',
    color:       'yellow',
  },
  IDENTITY_THEFT: {
    id:          'identity_theft',
    label:       'Identity Theft',
    description: 'Stolen personal information used to impersonate customers.',
    icon:        '🪪',
    color:       'purple',
  },
  INSIDER_THREAT: {
    id:          'insider_threat',
    label:       'Insider Threat',
    description: 'Security risks from within the organization — employees or contractors.',
    icon:        '👁️',
    color:       'blue',
  },
  DATA_BREACH: {
    id:          'data_breach',
    label:       'Data Breach',
    description: 'Unauthorized access to sensitive customer or financial data.',
    icon:        '🔓',
    color:       'red',
  },
  CREDENTIAL_THEFT: {
    id:          'credential_theft',
    label:       'Credential Theft',
    description: 'Stealing login credentials through phishing, keyloggers or brute force.',
    icon:        '🔑',
    color:       'orange',
  },
  VISHING: {
    id:          'vishing',
    label:       'Vishing',
    description: 'Voice phishing — attackers call and impersonate trusted parties.',
    icon:        '📞',
    color:       'yellow',
  },
}

export const THREAT_CATEGORY_LIST = Object.values(THREAT_CATEGORIES)