import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Target, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Building2,
  Calendar
} from 'lucide-react';
import Dashboard from './components/pages/Dashboard';
import ESGCriteria from './components/pages/ESGCriteria';
import ScoreInput from './components/pages/ScoreInput';
import GapAnalysis from './components/pages/GapAnalysis';
import Reports from './components/pages/Reports';
import Settings_Page from './components/pages/Settings';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { getRecommendations } from './utils/calculations';
import './styles/global.css';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dash');
  const [scores, setScores] = useState({});
  const [results, setResults] = useState({ E: 0, S: 0, G: 0, total: 0 });
  const [recommendations, setRecommendations] = useState(getRecommendations(0));
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }

    // Set current date
    const updateDate = () => {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setCurrentDate(now.toLocaleDateString('en-US', options));
    };
    updateDate();
    const interval = setInterval(updateDate, 60000); // Update every minute

    // Listen for navigation events from Dashboard buttons
    const handleNavigate = (e) => {
      setCurrentPage(e.detail);
    };
    window.addEventListener('navigate', handleNavigate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('navigate', handleNavigate);
    };
  }, []);

  const handleSetReports = (total) => {
  setRecommendations(getRecommendations(total));
};
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('dash');
    setScores({});
    setResults({ E: 0, S: 0, G: 0, total: 0 });
  };

  const navItems = [
    { id: 'dash', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'criteria', label: 'ESG Criteria', icon: FileText },
    { id: 'input', label: 'Score Input', icon: Target },
    { id: 'gap', label: 'Gap Analysis', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!isLoggedIn) {
    if (showRegister) {
      return (
        <Register 
          onRegisterSuccess={() => setShowRegister(false)}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <Login 
        setUser={setUser}
        setIsLoggedIn={setIsLoggedIn}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 flex flex-col shadow-2xl`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-bold text-lg">ESG Tracker</h1>
                  <p className="text-xs text-gray-400">Enterprise</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto">
                <Building2 className="w-6 h-6" />
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:block hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/10">
          <div className={`flex items-center gap-3 p-3 rounded-xl bg-white/5 ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold">
                {user?.companyName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user?.companyName || 'User'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/20 transition-all ${
              sidebarOpen ? '' : 'justify-center'
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Header Bar with Logo, Project Name & Date */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          {/* Top Section - Logo, Project Name, Date */}
          <div className="px-8 py-4 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center justify-between">
              {/* Left: Logo + Project Name */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    ESG Governance Tracker System
                  </h1>
                  <p className="text-sm text-gray-500">
                    Environmental, Social & Governance Management Platform
                  </p>
                </div>
              </div>

              {/* Right: Date & Time */}
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                <Calendar className="w-5 h-5 text-teal-600" />
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{currentDate}</p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Page Title */}
          <div className="px-8 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {navItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {currentPage === 'dash' && 'Overview of your ESG performance'}
                  {currentPage === 'criteria' && 'Manage ESG evaluation criteria'}
                  {currentPage === 'input' && 'Input your ESG scores'}
                  {currentPage === 'gap' && 'Analyze performance gaps'}
                  {currentPage === 'reports' && 'Generate comprehensive reports'}
                  {currentPage === 'settings' && 'Configure system settings'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg">
                  Score: {results.total}%
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {currentPage === 'dash' && <Dashboard results={results} user={user} />}
            {currentPage === 'criteria' && <ESGCriteria />}
            {currentPage === 'input' && (
              <ScoreInput
                scores={scores}
                setScores={setScores}
                results={results}
                setResults={setResults}
                setReports={handleSetReports}
              />
            )}
            {currentPage === 'gap' && <GapAnalysis scores={scores} />}
            {currentPage === 'reports' && <Reports recommendations={recommendations} results={results} />}
            {currentPage === 'settings' && <Settings_Page />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;




