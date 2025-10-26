import '@/shared/styles/global.css';
import './App.css';
import { useState } from 'react';
import { Dashboard } from '@/pages/Dashboard';
import { Profile } from '@/pages/Profile';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'profile'>('dashboard');

  return (
    <div className="app">
      {/* 메인 콘텐츠 */}
      <main className="app-main">
        {currentPage === 'dashboard' ? (
          <Dashboard onNavigateToProfile={() => setCurrentPage('profile')} />
        ) : (
          <Profile onNavigateToDashboard={() => setCurrentPage('dashboard')} />
        )}
      </main>
    </div>
  );
}
export default App;
