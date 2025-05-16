import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import Recommendations from './pages/Recommendations';
import PreferencesPage from './pages/Prefferences';
import { callServer } from '../api/webClients/callServer';

function App() {
  const [menuOpened, setMenuOpened] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        <Toast mode={'error'} text={error ?? 'Unknown error'} />
        <Toast mode={'success'} text={successSave ?? 'Saved successfully'} />
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
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;