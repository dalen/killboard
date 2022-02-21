import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './i18n/config';
import { Character } from './pages/Character';
import { Home } from './pages/Home';
import { Kill } from './pages/Kill';
import { Guild } from './pages/Guild';
import { Search } from './pages/Search';
import { PlayerFeudPage } from './pages/PlayerFeudPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kill/:id" element={<Kill />} />
        <Route path="/character/:id" element={<Character />} />
        <Route path="/guild/:id" element={<Guild tab="kills" />} />
        <Route path="/guild/:id/members" element={<Guild tab="members" />} />
        <Route path="/search/:query" element={<Search />} />
        <Route
          path="/playerfeud/:playerId1/:playerId2"
          element={<PlayerFeudPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
