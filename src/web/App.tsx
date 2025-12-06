import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';
import { callServer } from '../api/webClients/callServer';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ToastError from './components/ToastError';
import ToastSuccess from './components/ToastSuccess';
import PreferencesPage from './pages/Prefferences';
import Recommendations from './pages/Recommendations';
import StatisticsCharts from './pages/Statictics';
import LoginPage from './pages/LoginPage';
import { useAuth } from './hooks/useAuth';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';

function App() {
  const { isLoggedIn, handleLogin, handleLogout } = useAuth();
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
      sidebarOpened={sidebarOpened}
      setError={setError}
      steamId={steamId}
      sidebarTags={sidebarTags}
    />
  );

  return (
    <Router>
      <ToastContainer
        position="bottom-left"
        autoClose={4000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      {successSave && <ToastSuccess success={successSave} />}
      {error && (
        <ToastError
          error={error instanceof Error ? error.message : String(error)}
        />
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/user/home" />
            ) : (
              <LoginPage handleLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/register"
          element={<RegisterPage handleLogin={handleLogin} />}
        />
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
                  <Route
                    path="home"
                    element={<HomePage />}
                  />
                  <Route
                    path="recommendations"
                    element={recommendationsComponents}
                  />
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
