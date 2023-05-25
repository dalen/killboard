import { Routes, Route, useLocation } from 'react-router-dom';
import './i18n/config';
import { Character } from './pages/Character';
import { Home } from './pages/Home';
import { Kill } from './pages/Kill';
import { Guild } from './pages/Guild';
import { Search } from './pages/Search';
import { SearchGuild } from './pages/SearchGuild';
import { PlayerFeudPage } from './pages/PlayerFeudPage';
import { GuildFeudPage } from './pages/GuildFeudPage';
import { Kills } from './pages/Kills';
import React from 'react';
import { Scenario } from './pages/Scenario';

// Send page views to google analytics
function usePageViews() {
  let location = useLocation();
  React.useEffect(() => {
    if ((window as any).gtag == null) return;
    (window as any).gtag('event', 'pageview', {
      page_location: location.pathname,
    });
  }, [location]);
}

function App() {
  usePageViews();

  return (
    <Routes>
      <Route path="/" element={<Home tab="players" />} />
      <Route path="/guilds" element={<Home tab="guilds" />} />
      <Route path="/scenarios" element={<Home tab="scenarios" />} />
      <Route path="/kill/:id" element={<Kill />} />
      <Route path="/kills" element={<Kills />} />
      <Route path="/character/:id" element={<Character tab="kills" />} />
      <Route
        path="/character/:id/scenarios"
        element={<Character tab="scenarios" />}
      />
      <Route
        path="/character/:id/armory"
        element={<Character tab="armory" />}
      />
      <Route path="/guild/:id" element={<Guild tab="kills" />} />
      <Route path="/guild/:id/members" element={<Guild tab="members" />} />
      <Route path="/guild/:id/scenarios" element={<Guild tab="scenarios" />} />
      <Route path="/search/:query" element={<Search />} />
      <Route path="/search/guild/:query" element={<SearchGuild />} />
      <Route
        path="/character/:playerId1/feud/:playerId2"
        element={<PlayerFeudPage />}
      />
      <Route
        path="/guild/:guildId1/feud/:guildId2"
        element={<GuildFeudPage />}
      />
      <Route path="/scenario/:id" element={<Scenario tab="scoreboard" />} />
      <Route path="/scenario/:id/kills" element={<Scenario tab="kills" />} />
      <Route path="/scenario/:id/map" element={<Scenario tab="map" />} />
    </Routes>
  );
}

export default App;
