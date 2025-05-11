import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import Recommendations from './pages/Recommendations';

function App() {
  const [menuOpened, setMenuOpened] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steamId = '76561198422563870';

  const toggleMenu = () => {
    setMenuOpened((prev) => !prev);
  };

  //TODO: zawężyć genres na sidebarze i dodać liste do wyboru kilku opcji po których można filtrować

  return (
    <div className="App">
      <Router>
        <Header onToggleMenu={toggleMenu} menuOpened={menuOpened} />
        <Sidebar menuOpened={menuOpened} />
        <Toast error={error} />
        <Routes>
          <Route
            path="/"
            element={
              <Recommendations
                menuOpened={menuOpened}
                setError={setError}
                steamId={steamId}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;