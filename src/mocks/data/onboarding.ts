export type OnboardingTaskStatus = 'completed' | 'in_progress' | 'not_started' | 'blocked';
export type OnboardingTaskType = 'document_upload' | 'questionnaire' | 'review' | 'signature';

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  type: OnboardingTaskType;
  status: OnboardingTaskStatus;
  estimatedMinutes: number;
  urgent: boolean;
  completedAt?: string;
  blockedReason?: string;
}

export interface QuestionnaireItem {
  id: string;
  question: string;
  section: string;
  answered: boolean;
  answer?: string;
}

export interface DocumentRequest {
  id: string;
  name: string;
  description: string;
  required: boolean;
  uploaded: boolean;
  uploadedAt?: string;
}

export interface OnboardingProgress {
  totalTasks: number;
  completedTasks: number;
  percentComplete: number;
  nextAction: OnboardingTask;
  daysUntilDeadline: number;
}

// === Mock Data ===

export const onboardingTasks: OnboardingTask[] = [
  {
    id: 'onb-1',
    title: 'Upload your W-2 forms',
    description: 'Upload W-2 forms from each employer you worked for in 2024.',
    type: 'document_upload',
    status: 'completed',
    estimatedMinutes: 5,
    urgent: false,
    completedAt: '2025-06-08T14:00:00Z',
  },
  {
    id: 'onb-2',
    title: 'Upload 1099 forms',
    description: 'Upload any 1099 forms (interest, dividends, freelance income).',
    type: 'document_upload',
    status: 'in_progress',
    estimatedMinutes: 5,
    urgent: true,
  },
  {
    id: 'onb-3',
    title: 'Answer personal info questions',
    description: 'Basic information about your filing status, dependents, and address.',
    type: 'questionnaire',
    status: 'completed',
    estimatedMinutes: 3,
    urgent: false,
    completedAt: '2025-06-07T10:00:00Z',
  },
  {
    id: 'onb-4',
    title: 'Answer income & deductions questions',
    description: 'Questions about additional income sources, deductions, and credits.',
    type: 'questionnaire',
    status: 'not_started',
    estimatedMinutes: 10,
    urgent: true,
  },
  {
    id: 'onb-5',
    title: 'Review AI-prepared return',
    description: 'Your CPA has prepared a draft return. Review the key numbers.',
    type: 'review',
    status: 'blocked',
    estimatedMinutes: 15,
    urgent: false,
    blockedReason: 'Waiting for all documents and questionnaires to be completed.',
  },
  {
    id: 'onb-6',
    title: 'Sign and authorize filing',
    description: 'Electronically sign your return to authorize the CPA to file.',
    type: 'signature',
    status: 'blocked',
    estimatedMinutes: 2,
    urgent: false,
    blockedReason: 'Available after you review and approve the return.',
  },
];

export const documentRequests: DocumentRequest[] = [
  { id: 'doc-req-1', name: 'W-2 from Acme Corp', description: 'Wage and tax statement', required: true, uploaded: true, uploadedAt: '2025-06-08T14:00:00Z' },
  { id: 'doc-req-2', name: 'W-2 from Freelance Co', description: 'Wage and tax statement', required: true, uploaded: true, uploadedAt: '2025-06-08T14:05:00Z' },
  { id: 'doc-req-3', name: '1099-INT from First National Bank', description: 'Interest income statement', required: true, uploaded: true, uploadedAt: '2025-06-09T09:00:00Z' },
  { id: 'doc-req-4', name: '1099-DIV from Vanguard', description: 'Dividend income statement', required: true, uploaded: false },
  { id: 'doc-req-5', name: '1099-B from TD Ameritrade', description: 'Brokerage transactions', required: true, uploaded: false },
  { id: 'doc-req-6', name: 'Mortgage interest statement (1098)', description: 'Optional for itemized deductions', required: false, uploaded: false },
];

export const questionnaireItems: QuestionnaireItem[] = [
  { id: 'q-1', question: 'What is your filing status?', section: 'Personal Info', answered: true, answer: 'Single' },
  { id: 'q-2', question: 'Do you have any dependents?', section: 'Personal Info', answered: true, answer: 'Yes — 1 child' },
  { id: 'q-3', question: 'Did your address change in 2024?', section: 'Personal Info', answered: true, answer: 'No' },
  { id: 'q-4', question: 'Did you earn freelance or self-employment income?', section: 'Income', answered: false },
  { id: 'q-5', question: 'Did you sell any stocks, bonds, or cryptocurrency?', section: 'Income', answered: false },
  { id: 'q-6', question: 'Did you make any charitable donations over $250?', section: 'Deductions', answered: false },
  { id: 'q-7', question: 'Did you pay student loan interest?', section: 'Deductions', answered: false },
  { id: 'q-8', question: 'Did you contribute to an IRA or HSA?', section: 'Deductions', answered: false },
];

export function getOnboardingProgress(): OnboardingProgress {
  const completed = onboardingTasks.filter((t) => t.status === 'completed').length;
  const total = onboardingTasks.length;
  const nextAction = onboardingTasks.find(
    (t) => t.status === 'in_progress' || t.status === 'not_started'
  ) ?? onboardingTasks[onboardingTasks.length - 1];

  return {
    totalTasks: total,
    completedTasks: completed,
    percentComplete: Math.round((completed / total) * 100),
    nextAction,
    daysUntilDeadline: 42, // Simulated: ~6 weeks until October 15 deadline
  };
}
