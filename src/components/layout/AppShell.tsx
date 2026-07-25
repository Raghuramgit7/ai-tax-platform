import { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';
import { actionItems } from '@/mocks/data/actionItems';
import { BreadcrumbBar } from './BreadcrumbBar';
import {
  FileSearch, FolderOpen, MessageSquare, ClipboardList,
  User, ArrowLeftRight, Menu, X, Rocket,
} from 'lucide-react';

const cpaNavItems = [
  { path: '/review', label: 'Return Review', icon: FileSearch },
  { path: '/documents', label: 'Documents', icon: FolderOpen },
  { path: '/collaboration', label: 'Collaboration', icon: MessageSquare },
  { path: '/action-items', label: 'Action Items', icon: ClipboardList },
];

const clientNavItems = [
  { path: '/getting-started', label: 'Getting Started', icon: Rocket },
  { path: '/documents', label: 'Documents', icon: FolderOpen },
  { path: '/collaboration', label: 'Messages', icon: MessageSquare },
  { path: '/action-items', label: 'Action Items', icon: ClipboardList },
];

export function AppShell() {
  const { currentUser, setCurrentUser } = useAppStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openItemsForUser = actionItems.filter(
    (ai) => ai.status === 'open' && ai.ownerId === currentUser.id
  ).length;

  const toggleRole = () => {
    setCurrentUser(currentUser.role === 'cpa' ? 'client' : 'cpa');
  };

  const navItems = currentUser.role === 'cpa' ? cpaNavItems : clientNavItems;
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 hidden md:flex md:flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-primary-700">AI Tax Platform</h1>
        </div>

        <nav className="flex-1 p-3 space-y-1" aria-label="Main navigation">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname.startsWith(path);
            const showBadge = path === '/action-items' && openItemsForUser > 0;

            return (
              <Link
                key={path}
                to={path}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  focus-visible:outline-2 focus-visible:outline-primary-500
                  ${isActive
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} className={isActive ? 'text-primary-600' : 'text-gray-400'} />
                <span className="flex-1">{label}</span>
                {showBadge && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full" aria-label={`${openItemsForUser} open items`}>
                    {openItemsForUser}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Role toggle */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={toggleRole}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors focus-visible:outline-2 focus-visible:outline-primary-500"
            aria-label={`Switch role. Currently viewing as ${currentUser.name}`}
          >
            <User size={18} className="text-gray-400" />
            <div className="flex-1 text-left">
              <p className="text-xs text-gray-500">Viewing as</p>
              <p className="font-semibold text-gray-800">{currentUser.name}</p>
            </div>
            <ArrowLeftRight size={14} className="text-gray-400" />
          </button>
          <p className="text-xs text-center text-gray-400 mt-1">
            Click to switch role
          </p>
        </div>
      </aside>

      {/* Mobile hamburger overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
      {mobileMenuOpen && (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl flex flex-col md:hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h1 className="text-lg font-bold text-primary-700">AI Tax Platform</h1>
            <button
              onClick={closeMobileMenu}
              className="p-1 rounded hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-primary-500"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 p-3 space-y-1" aria-label="Mobile navigation">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname.startsWith(path);
              const showBadge = path === '/action-items' && openItemsForUser > 0;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={closeMobileMenu}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon size={18} className={isActive ? 'text-primary-600' : 'text-gray-400'} />
                  <span className="flex-1">{label}</span>
                  {showBadge && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {openItemsForUser}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={() => { toggleRole(); closeMobileMenu(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              <User size={18} className="text-gray-400" />
              <div className="flex-1 text-left">
                <p className="text-xs text-gray-500">Viewing as</p>
                <p className="font-semibold text-gray-800">{currentUser.name}</p>
              </div>
              <ArrowLeftRight size={14} className="text-gray-400" />
            </button>
          </div>
        </aside>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header with hamburger */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-primary-500"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-sm font-bold text-primary-700">AI Tax Platform</h1>
        </header>

        {/* Breadcrumb bar */}
        <BreadcrumbBar />

        {/* Page content */}
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
