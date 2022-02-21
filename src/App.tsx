import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './i18n/config';
import { Character } from './pages/Character';
import { Home } from './pages/Home';
import { Kill } from './pages/Kill';
import { Guild } from './pages/Guild';
import { Search } from './pages/Search';
import { PlayerFeudPage } from './pages/PlayerFeudPage';
import { GuildFeudPage } from './pages/GuildFeudPage';
import { Kills } from './pages/Kills';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kill/:id" element={<Kill />} />
        <Route path="/kills" element={<Kills />} />
        <Route path="/character/:id" element={<Character />} />
        <Route path="/guild/:id" element={<Guild tab="kills" />} />
        <Route path="/guild/:id/members" element={<Guild tab="members" />} />
        <Route path="/search/:query" element={<Search />} />
        <Route
          path="/character/:playerId1/feud/:playerId2"
          element={<PlayerFeudPage />}
        />
        <Route
          path="/guild/:guildId1/feud/:guildId2"
          element={<GuildFeudPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
