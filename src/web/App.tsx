import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import RecentGames from './components/RecentGames';
import Toast from './components/Toast';
import useRecentGames from './hooks/useRecentGames';

const testSteamId = '76561198271038475';

function App() {
  const { recentGames, loading, error } = useRecentGames(testSteamId);
  return (
    <div className='App'>
      <Header />
      <Toast error={error}/>
      { loading ? <LoadingSpinner /> : <RecentGames recentGames={recentGames} />} 
    </div>
  );
}

export default App;