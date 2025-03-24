import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import RecentGames from './components/RecentGames';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import useProfileData from './hooks/useProfileData';
import useRecentGames from './hooks/useRecentGames';

// const testSteamId = '76561198271038475';
const testSteamId2 = '76561198199623266';

function App() {
  const { recentGames, loading, error } = useRecentGames(testSteamId2);
  const { profileData } = useProfileData(testSteamId2);
  console.log(profileData);
  return (
    <div className='App'>
      <Header />
      <Sidebar />
      <Toast error={error}/>
      { loading ? <LoadingSpinner /> : <RecentGames recentGames={recentGames} />}
    </div>
  );
}

export default App;