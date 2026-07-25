import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';
import { Shield, UserCircle, Brain } from 'lucide-react';
import type { UserRole } from '@/types';

export function LoginView() {
  const { setCurrentUser } = useAppStore();
  const navigate = useNavigate();

  const handleSelectRole = (role: UserRole) => {
    setCurrentUser(role);
    navigate(role === 'cpa' ? '/review' : '/getting-started');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo & title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Brain size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">AI Tax Platform</h1>
          </div>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Select a role to explore the platform. Each role sees a tailored experience.
          </p>
        </div>

        {/* Role cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <RoleCard
            role="cpa"
            name="Sarah Chen, CPA"
            description="Review returns, trace AI extractions to source documents, manage client communications."
            icon={<Shield size={24} className="text-primary-600" />}
            features={['Return Review', 'Source Traceability', 'AI Insights', 'Internal Notes']}
            onSelect={() => handleSelectRole('cpa')}
          />
          <RoleCard
            role="client"
            name="Michael Johnson"
            description="Upload documents, answer questions, view messages, and track what's needed."
            icon={<UserCircle size={24} className="text-emerald-600" />}
            features={['Getting Started', 'Document Upload', 'Messages', 'Action Items']}
            onSelect={() => handleSelectRole('client')}
          />
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-8">
          This is a prototype with mocked data. No real authentication required.
        </p>
      </div>
    </div>
  );
}

function RoleCard({
  name,
  description,
  icon,
  features,
  onSelect,
}: {
  role: UserRole;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="
        w-full text-left bg-white rounded-xl border-2 border-gray-200 p-6
        hover:border-primary-400 hover:shadow-lg hover:shadow-primary-100/50
        focus-visible:outline-2 focus-visible:outline-primary-500
        transition-all duration-200 group
      "
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-primary-50 transition-colors">
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">Click to enter</p>
        </div>
      </div>

      <p className="text-xs text-gray-600 mb-4 leading-relaxed">{description}</p>

      <div className="flex flex-wrap gap-1.5">
        {features.map((feature) => (
          <span
            key={feature}
            className="px-2 py-0.5 bg-gray-50 text-xs text-gray-600 rounded-full group-hover:bg-primary-50 group-hover:text-primary-700 transition-colors"
          >
            {feature}
          </span>
        ))}
      </div>
    </button>
  );
}
