import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import RecentGames from './components/RecentGames';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import useRecentGames from './hooks/useRecentGames';

const testSteamId = '76561198271038475';

function App() {
  const { /*recentGames,*/ loading, error } = useRecentGames(testSteamId);
  return (
    <div className='App'>
      <Header />
      <DndProvider backend={HTML5Backend}>
        <Sidebar />
      </DndProvider>
      <Toast error={error}/>
      { loading ? <LoadingSpinner /> : <RecentGames recentGames={[]} />} 
    </div>
  );
}

export default App;