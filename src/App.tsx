import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { LoginView } from './views/LoginView';
import { ReviewView } from './views/ReviewView';
import { CollaborationView } from './views/CollaborationView';
import { ActionItemsView } from './views/ActionItemsView';
import { DocumentsView } from './views/DocumentsView';
import { ClientOnboardingView } from './views/ClientOnboardingView';
import { useAppStore } from './stores/appStore';

/** Redirects clients away from CPA-only routes */
function CPAOnly({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAppStore();
  if (currentUser.role !== 'cpa') {
    return <Navigate to="/getting-started" replace />;
  }
  return <>{children}</>;
}

/** Redirects CPAs away from client-only routes */
function ClientOnly({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAppStore();
  if (currentUser.role !== 'client') {
    return <Navigate to="/review" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      {/* Login / role selection — entry point */}
      <Route path="/login" element={<LoginView />} />

      {/* Authenticated shell */}
      <Route path="/" element={<AppShell />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="getting-started" element={<ClientOnly><ClientOnboardingView /></ClientOnly>} />
        <Route path="review" element={<CPAOnly><ReviewView /></CPAOnly>} />
        <Route path="review/:fieldId" element={<CPAOnly><ReviewView /></CPAOnly>} />
        <Route path="documents" element={<DocumentsView />} />
        <Route path="documents/:documentId" element={<DocumentsView />} />
        <Route path="collaboration" element={<CollaborationView />} />
        <Route path="collaboration/:threadId" element={<CollaborationView />} />
        <Route path="action-items" element={<ActionItemsView />} />
      </Route>
    </Routes>
  );
}

export default App;
