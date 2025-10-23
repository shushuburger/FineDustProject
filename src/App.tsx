import '@/shared/styles/global.css';
import './App.css';
import { Dashboard } from '@/pages/Dashboard';

function App() {
  return (
    <div className="app">
      {/* 메인 콘텐츠 */}
      <main className="app-main">
        <Dashboard />
      </main>
    </div>
  );
}
export default App;
