import { useState, useEffect, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Bounce, ToastContainer, ToastOptions, toast } from 'react-toastify';
import { callServer } from '../api/webClients/callServer';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PreferencesPage from './pages/Prefferences';
import Recommendations from './pages/Recommendations';
import StatisticsCharts from './pages/Statictics';
import LoginPage from './pages/LoginPage';
import { useAuth } from './hooks/useAuth';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import 'react-toastify/dist/ReactToastify.css';

const toastProperties: ToastOptions = {
  position: 'bottom-left',
  autoClose: 4000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  transition: Bounce,
  theme: 'dark',
};

function App() {
  const { isLoggedIn, loginStatus, handleLogin, handleLogout, currentUserId } = useAuth();
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const [error, setError] = useState<string | Error | null>(null);
  const [successSave, setSuccessSave] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const saved = localStorage.getItem('user-tags');
    return saved ? JSON.parse(saved) : [];
  });
  const [sidebarTags, setSidebarTags] = useState<string[]>(selectedTags);
  const steamId = '76561198199623266';

  const toggleMenu = () => setSidebarOpened((prev) => !prev);

  const recommendationsComponents = (
    <Recommendations
      currentUserId={currentUserId}
      sidebarOpened={sidebarOpened}
      setError={setError}
      steamId={steamId}
      sidebarTags={sidebarTags}
    />
  );

  const showSuccessToast = useCallback((message: string) => {
    toast.success(message, toastProperties);
  }, []);

  const showErrorToast = useCallback((message: string) => {
    toast.error(message, toastProperties);
  }, []);

  useEffect(() => {
    if (successSave) {
      showSuccessToast(successSave);
      setSuccessSave(null);
    }
  }, [successSave, showSuccessToast]);

  useEffect(() => {
    if (error) {
      showErrorToast(error instanceof Error ? error.message : String(error));
      setError(null);
    }
  }, [error, showErrorToast]);

  useEffect(() => {
    if (loginStatus) {
      if (loginStatus.type === 'success') {
        showSuccessToast(loginStatus.message);
      } else if (loginStatus.type === 'error') {
        showErrorToast(loginStatus.message);
      }
    }
  }, [loginStatus]);

  return (
    <Router>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/user/home" /> : <LoginPage handleLogin={handleLogin} />
          }
        />
        <Route path="/register" element={<RegisterPage handleLogin={handleLogin} />} />
        {isLoggedIn && (
          <Route
            path="/user/*"
            element={
              <div>
                <Header
                  onToggleMenu={toggleMenu}
                  sidebarOpened={sidebarOpened}
                  onLogout={handleLogout}
                />
                <Sidebar
                  sidebarOpened={sidebarOpened}
                  selectedTags={selectedTags}
                  setSidebarTags={setSidebarTags}
                />
                <Routes>
                  <Route path="home" element={<HomePage />} />
                  <Route path="recommendations" element={recommendationsComponents} />
                  <Route
                    path="preferences"
                    element={
                      <PreferencesPage
                        getTags={() =>
                          callServer<string[], any>('topmostTags', {
                            limit: 60,
                          })
                        }
                        selectedTags={selectedTags}
                        setSelectedTags={setSelectedTags}
                        setSuccessSave={setSuccessSave}
                        setError={setError}
                      />
                    }
                  />
                  <Route path="statistics" element={<StatisticsCharts />} />
                </Routes>
              </div>
            }
          />
        )}
      </Routes>
    </Router>
  );
}

export default App;
