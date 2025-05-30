import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Recommendations from './pages/Recommendations';
import PreferencesPage from './pages/Prefferences';
import { callServer } from '../api/webClients/callServer';
import ToastError from './components/ToastError';
import ToastSuccess from './components/ToastSuccess';
import { Bounce, ToastContainer } from 'react-toastify';

function App() {
  const [menuOpened, setMenuOpened] = useState(true);
  const [error, setError] = useState<string | Error | null>(null);
  const [successSave, setSuccessSave] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const saved = localStorage.getItem('user-tags');
    return saved ? JSON.parse(saved) : [];
  });
  const [sidebarTags, setSidebarTags] = useState<string[]>(selectedTags);
  const steamId = '76561198199623266';

  const toggleMenu = () => {
    setMenuOpened((prev) => !prev);
  };

  //TODO: poprawic - poprawic przeladowanie gier
  // dodać strukturę do bazy danych by mozna bylo zapisać zapisane przez AI opisy gier i wyniki analizy
  const recommendationsComponents = <Recommendations
    menuOpened={menuOpened}
    setError={setError}
    steamId={steamId}
    sidebarTags={sidebarTags}
  />;
  return (
    <div className="App">
      <Router>
        <Header onToggleMenu={toggleMenu} menuOpened={menuOpened} />
        <Sidebar menuOpened={menuOpened} selectedTags={selectedTags} setSidebarTags={setSidebarTags} />
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
        {error && <ToastError error={error instanceof Error ? error.message : String(error)} />}

        <Routes>
          <Route
            path="/user/recommendations"
            element={
              recommendationsComponents
            }
          />
          <Route
            path="/"
            element={
              recommendationsComponents
            }
          />
          <Route
            path="/user/preferences"
            element={
              <PreferencesPage
                getTags={() => callServer<string[], any>('topmostTags', { limit: 60 })}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                setSuccessSave={setSuccessSave}
                setError={setError}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;