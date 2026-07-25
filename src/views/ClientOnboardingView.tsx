import { useState, useCallback } from 'react';
import {
  Upload, HelpCircle, FileCheck, PenTool,
  CheckCircle, Circle, Clock, Lock, ArrowRight,
  Calendar, AlertCircle, ChevronRight, Loader2,
} from 'lucide-react';
import {
  onboardingTasks as initialTasks,
  documentRequests as initialDocs,
  questionnaireItems as initialQuestions,
} from '@/mocks/data/onboarding';
import type { OnboardingTask, OnboardingTaskStatus, OnboardingTaskType, DocumentRequest, QuestionnaireItem } from '@/mocks/data/onboarding';

const taskTypeIcons: Record<OnboardingTaskType, typeof Upload> = {
  document_upload: Upload,
  questionnaire: HelpCircle,
  review: FileCheck,
  signature: PenTool,
};

const statusConfig: Record<OnboardingTaskStatus, { icon: typeof CheckCircle; color: string; label: string }> = {
  completed: { icon: CheckCircle, color: 'text-green-500', label: 'Done' },
  in_progress: { icon: Clock, color: 'text-blue-500', label: 'In progress' },
  not_started: { icon: Circle, color: 'text-gray-300', label: 'To do' },
  blocked: { icon: Lock, color: 'text-gray-300', label: 'Locked' },
};

export function ClientOnboardingView() {
  const [tasks, setTasks] = useState<OnboardingTask[]>(structuredClone(initialTasks));
  const [docs, setDocs] = useState<DocumentRequest[]>(structuredClone(initialDocs));
  const [questions, setQuestions] = useState<QuestionnaireItem[]>(structuredClone(initialQuestions));
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [answering, setAnswering] = useState<string | null>(null);

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const percentComplete = Math.round((completedTasks / totalTasks) * 100);

  const docsUploaded = docs.filter((d) => d.uploaded).length;
  const docsTotal = docs.filter((d) => d.required).length;
  const questionsAnswered = questions.filter((q) => q.answered).length;
  const questionsTotal = questions.length;

  const nextTask = tasks.find((t) => t.status === 'in_progress' || t.status === 'not_started');

  // Simulate uploading a document
  const handleUploadDoc = useCallback((docId: string) => {
    setUploading(docId);
    setTimeout(() => {
      setDocs((prev) => prev.map((d) =>
        d.id === docId ? { ...d, uploaded: true, uploadedAt: new Date().toISOString() } : d
      ));
      setUploading(null);

      // Check if all required docs for the upload task are done
      setDocs((currentDocs) => {
        const pendingRequired = currentDocs.filter((d) => d.required && !d.uploaded);
        if (pendingRequired.length === 0) {
          // Mark upload tasks as completed
          setTasks((prev) => prev.map((t) =>
            t.type === 'document_upload' ? { ...t, status: 'completed' as const, completedAt: new Date().toISOString() } : t
          ));
        }
        return currentDocs;
      });
    }, 1500);
  }, []);

  // Simulate answering a question
  const handleAnswerQuestion = useCallback((questionId: string) => {
    setAnswering(questionId);
    setTimeout(() => {
      setQuestions((prev) => prev.map((q) =>
        q.id === questionId ? { ...q, answered: true, answer: 'Yes' } : q
      ));
      setAnswering(null);

      // Check if all questions are done
      setQuestions((currentQs) => {
        const unanswered = currentQs.filter((q) => !q.answered);
        if (unanswered.length === 0) {
          setTasks((prev) => prev.map((t) =>
            t.type === 'questionnaire' ? { ...t, status: 'completed' as const, completedAt: new Date().toISOString() } : t
          ));
        }
        return currentQs;
      });
    }, 800);
  }, []);

  // Handle Start/Continue button on the main next-action card
  const handleStartTask = useCallback(() => {
    if (!nextTask) return;
    setExpandedTask(nextTask.id);
    // If it's not_started, move to in_progress
    if (nextTask.status === 'not_started') {
      setTasks((prev) => prev.map((t) =>
        t.id === nextTask.id ? { ...t, status: 'in_progress' as const } : t
      ));
    }
  }, [nextTask]);

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, Michael 👋</h1>
          <p className="text-sm text-gray-600 mt-1">
            Let's get your 2024 tax return ready. Here's what you need to do.
          </p>
        </div>

        {/* Progress overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-gray-800">Your progress</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {completedTasks} of {totalTasks} steps complete
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar size={12} />
              <span>42 days until deadline</span>
            </div>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-500"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {percentComplete}% complete
          </p>
        </div>

        {/* Next action hero card */}
        {nextTask && (
          <NextActionCard task={nextTask} onStart={handleStartTask} />
        )}
        {!nextTask && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 mb-6 text-center">
            <CheckCircle size={32} className="mx-auto text-green-500 mb-2" />
            <p className="text-sm font-semibold text-green-800">All tasks complete!</p>
            <p className="text-xs text-green-600 mt-1">Your CPA will review and reach out with next steps.</p>
          </div>
        )}

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard
            icon={<Upload size={16} className="text-blue-500" />}
            label="Documents"
            value={`${docsUploaded}/${docsTotal} uploaded`}
            complete={docsUploaded === docsTotal}
          />
          <StatCard
            icon={<HelpCircle size={16} className="text-purple-500" />}
            label="Questions"
            value={`${questionsAnswered}/${questionsTotal} answered`}
            complete={questionsAnswered === questionsTotal}
          />
        </div>

        {/* Task list */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-800">All steps</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {tasks.map((task, index) => (
              <TaskRow
                key={task.id}
                task={task}
                stepNumber={index + 1}
                isExpanded={expandedTask === task.id}
                onToggle={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                docs={docs}
                questions={questions}
                uploading={uploading}
                answering={answering}
                onUploadDoc={handleUploadDoc}
                onAnswerQuestion={handleAnswerQuestion}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NextActionCard({ task, onStart }: { task: OnboardingTask; onStart: () => void }) {
  const Icon = taskTypeIcons[task.type];

  return (
    <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-5 mb-6">
      <div className="flex items-center gap-1 text-xs font-semibold text-primary-600 uppercase tracking-wide mb-2">
        <AlertCircle size={12} />
        Your next step
      </div>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon size={20} className="text-primary-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">{task.title}</p>
          <p className="text-xs text-gray-600 mt-0.5">{task.description}</p>
        </div>
        <button
          onClick={onStart}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors focus-visible:outline-2 focus-visible:outline-primary-500 flex-shrink-0"
        >
          {task.status === 'in_progress' ? 'Continue' : 'Start'}
          <ArrowRight size={14} />
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2 ml-14">
        Estimated time: ~{task.estimatedMinutes} min
      </p>
    </div>
  );
}

function StatCard({ icon, label, value, complete }: { icon: React.ReactNode; label: string; value: string; complete: boolean }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs font-medium text-gray-500">{label}</span>
      </div>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
      {complete && (
        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
          <CheckCircle size={10} /> All done
        </p>
      )}
    </div>
  );
}

function TaskRow({
  task,
  stepNumber,
  isExpanded,
  onToggle,
  docs,
  questions,
  uploading,
  answering,
  onUploadDoc,
  onAnswerQuestion,
}: {
  task: OnboardingTask;
  stepNumber: number;
  isExpanded: boolean;
  onToggle: () => void;
  docs: DocumentRequest[];
  questions: QuestionnaireItem[];
  uploading: string | null;
  answering: string | null;
  onUploadDoc: (docId: string) => void;
  onAnswerQuestion: (qId: string) => void;
}) {
  const StatusIcon = statusConfig[task.status].icon;
  const statusColor = statusConfig[task.status].color;
  const isActionable = task.status === 'in_progress' || task.status === 'not_started';
  const isBlocked = task.status === 'blocked';

  return (
    <div className={`${isBlocked ? 'opacity-50' : ''}`}>
      <button
        onClick={onToggle}
        disabled={isBlocked}
        className={`
          w-full text-left px-5 py-4 flex items-center gap-3 transition-colors
          ${isActionable ? 'hover:bg-gray-50 cursor-pointer' : ''}
          ${isBlocked ? 'cursor-not-allowed' : ''}
          focus-visible:outline-2 focus-visible:outline-primary-500
        `}
      >
        <StatusIcon size={18} className={statusColor} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono">{stepNumber}.</span>
            <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
              {task.title}
            </p>
            {task.urgent && task.status !== 'completed' && (
              <span className="px-1.5 py-0.5 text-xs font-medium bg-red-50 text-red-600 rounded">Urgent</span>
            )}
          </div>
          {isBlocked && task.blockedReason && (
            <p className="text-xs text-gray-400 mt-0.5 ml-6">{task.blockedReason}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {!isBlocked && task.status !== 'completed' && (
            <span className="text-xs text-gray-400">~{task.estimatedMinutes} min</span>
          )}
          {!isBlocked && (
            <ChevronRight size={14} className={`text-gray-300 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          )}
        </div>
      </button>

      {isExpanded && !isBlocked && (
        <div className="px-5 pb-4 pl-12">
          <p className="text-xs text-gray-600 mb-3">{task.description}</p>
          {task.type === 'document_upload' && task.status !== 'completed' && (
            <DocumentUploadInteractive docs={docs} uploading={uploading} onUpload={onUploadDoc} />
          )}
          {task.type === 'questionnaire' && task.status !== 'completed' && (
            <QuestionnaireInteractive questions={questions} answering={answering} onAnswer={onAnswerQuestion} />
          )}
          {task.status === 'completed' && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle size={10} /> Completed
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function DocumentUploadInteractive({
  docs,
  uploading,
  onUpload,
}: {
  docs: DocumentRequest[];
  uploading: string | null;
  onUpload: (docId: string) => void;
}) {
  const pending = docs.filter((d) => !d.uploaded && d.required);
  const uploaded = docs.filter((d) => d.uploaded);

  return (
    <div className="space-y-2">
      {pending.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1.5">Still needed:</p>
          {pending.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Circle size={8} className="text-gray-300" />
                <span>{doc.name}</span>
              </div>
              <button
                onClick={() => onUpload(doc.id)}
                disabled={uploading !== null}
                className="px-2.5 py-1 text-xs font-medium text-primary-700 bg-primary-50 rounded hover:bg-primary-100 transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                {uploading === doc.id ? (
                  <><Loader2 size={10} className="animate-spin" /> Uploading...</>
                ) : (
                  <><Upload size={10} /> Upload</>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
      {uploaded.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Uploaded:</p>
          {uploaded.map((doc) => (
            <div key={doc.id} className="flex items-center gap-2 text-xs text-green-600 py-0.5">
              <CheckCircle size={8} />
              <span>{doc.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QuestionnaireInteractive({
  questions,
  answering,
  onAnswer,
}: {
  questions: QuestionnaireItem[];
  answering: string | null;
  onAnswer: (qId: string) => void;
}) {
  const unanswered = questions.filter((q) => !q.answered);
  const answered = questions.filter((q) => q.answered);

  return (
    <div className="space-y-2">
      {unanswered.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1.5">
            {unanswered.length} questions remaining:
          </p>
          {unanswered.slice(0, 3).map((q) => (
            <div key={q.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-700">{q.question}</p>
                <p className="text-xs text-gray-400">{q.section}</p>
              </div>
              <button
                onClick={() => onAnswer(q.id)}
                disabled={answering !== null}
                className="px-2.5 py-1 text-xs font-medium text-primary-700 bg-primary-50 rounded hover:bg-primary-100 transition-colors disabled:opacity-50 flex items-center gap-1 ml-2 flex-shrink-0"
              >
                {answering === q.id ? (
                  <><Loader2 size={10} className="animate-spin" /> Saving...</>
                ) : (
                  'Answer'
                )}
              </button>
            </div>
          ))}
          {unanswered.length > 3 && (
            <p className="text-xs text-gray-400 mt-1">+ {unanswered.length - 3} more questions</p>
          )}
        </div>
      )}
      {answered.length > 0 && (
        <p className="text-xs text-green-600 flex items-center gap-1">
          <CheckCircle size={10} /> {answered.length} answered
        </p>
      )}
    </div>
  );
}
