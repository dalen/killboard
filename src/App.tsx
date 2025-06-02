import { Routes, Route, useLocation } from 'react-router';

import './i18n/config';
import React from 'react';
import { Character } from '@/pages/Character';
import { Home } from '@/pages/Home';
import { Kill } from '@/pages/Kill';
import { Guild } from '@/pages/Guild';
import { Search } from '@/pages/Search';
import { SearchGuild } from '@/pages/SearchGuild';
import { PlayerFeudPage } from '@/pages/PlayerFeudPage';
import { GuildFeudPage } from '@/pages/GuildFeudPage';
import { Kills } from '@/pages/Kills';
import { Scenario } from '@/pages/Scenario';
import { ZoneMap } from '@/pages/ZoneMap';
import { Skirmish } from '@/pages/Skirmish';
import { Item } from '@/pages/Item';
import { RankedLeaderboard } from '@/pages/RankedLeaderboard';
import { Items } from '@/pages/Items';
import { Creatures } from '@/pages/Creatures';
import { Creature } from '@/pages/Creature';
import { Quests } from '@/pages/Quests';
import { Quest } from '@/pages/Quest';
import { InstanceRuns } from '@/pages/InstanceRuns';
import { InstanceRun } from '@/pages/InstanceRun';
import { Instances } from '@/pages/Instances';
import { InstanceEncounterRun } from '@/pages/InstanceEncounterRun';
import { GameObject } from '@/pages/GameObject';
import { Chapter } from '@/pages/Chapter';
import { Chapters } from '@/pages/Chapters';
import { Storylines } from '@/pages/Storylines';
import { Storyline } from '@/pages/Storyline';
import { StorylineEntry } from '@/pages/StorylineEntry';

// Extend the Window interface to include gtag
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
  }
}

// Send page views to google analytics
function usePageViews() {
  const location = useLocation();
  React.useEffect(() => {
    if (window.gtag == null) return;
    window.gtag('event', 'pageview', {
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
        path="/character/:id/skirmishes"
        element={<Character tab="skirmishes" />}
      />
      <Route
        path="/character/:id/armory"
        element={<Character tab="armory" />}
      />
      <Route
        path="/character/:playerId1/feud/:playerId2"
        element={<PlayerFeudPage />}
      />

      <Route path="/creatures" element={<Creatures />} />
      <Route path="/creature/:id" element={<Creature />} />
      <Route path="/creature/:id/quests" element={<Creature tab="quests" />} />
      <Route
        path="/creature/:id/vendorItems"
        element={<Creature tab="vendorItems" />}
      />
      <Route path="/creature/:id/zone/:zoneId" element={<Creature />} />

      <Route path="/gameobject/:id" element={<GameObject />} />
      <Route path="/creature/:id/quests" element={<GameObject />} />
      <Route path="/creature/:id/zone/:zoneId" element={<GameObject />} />

      <Route path="/guild/:id" element={<Guild tab="kills" />} />
      <Route path="/guild/:id/members" element={<Guild tab="members" />} />
      <Route path="/guild/:id/scenarios" element={<Guild tab="scenarios" />} />
      <Route
        path="/guild/:id/skirmishes"
        element={<Guild tab="skirmishes" />}
      />
      <Route
        path="/guild/:guildId1/feud/:guildId2"
        element={<GuildFeudPage />}
      />

      <Route path="/quests" element={<Quests />} />
      <Route path="/quest/:id" element={<Quest />} />

      <Route path="/chapters" element={<Chapters />} />
      <Route path="/chapter/:id" element={<Chapter />} />

      <Route path="/search/:query" element={<Search />} />
      <Route path="/search/guild/:query" element={<SearchGuild />} />

      <Route path="/scenario/:id" element={<Scenario tab="scoreboard" />} />
      <Route path="/scenario/:id/kills" element={<Scenario tab="kills" />} />
      <Route
        path="/scenario/:id/skirmishes"
        element={<Scenario tab="skirmishes" />}
      />
      <Route path="/scenario/:id/map" element={<Scenario tab="map" />} />
      <Route path="/skirmishes" element={<Home tab="skirmishes" />} />
      <Route path="/skirmish/:id" element={<Skirmish tab="scoreboard" />} />
      <Route path="/skirmish/:id/kills" element={<Skirmish tab="kills" />} />
      <Route
        path="/skirmish/:id/damage/:characterId"
        element={<Skirmish tab="characterDamage" />}
      />
      <Route path="/skirmish/:id/damage" element={<Skirmish tab="damage" />} />
      <Route path="/zone_heatmap/:id" element={<ZoneMap />} />

      <Route path="/items" element={<Items />} />
      <Route path="/item/:id" element={<Item tab="vendors" />} />
      <Route path="/item/:id/purchase" element={<Item tab="purchase" />} />
      <Route path="/item/:id/quests" element={<Item tab="quests" />} />

      <Route path="/instance-runs" element={<InstanceRuns />} />
      <Route path="/instance-run/:id" element={<InstanceRun />} />
      <Route
        path="/instance-run/:instanceRunId/:id"
        element={<InstanceEncounterRun />}
      />

      <Route path="/instances" element={<Instances />} />

      <Route path="/storylines" element={<Storylines />} />
      <Route path="/storylines/:id" element={<Storyline />} />
      <Route path="/storylines/:storylineId/:id" element={<StorylineEntry />} />

      <Route path="/ranked-leaderboard" element={<RankedLeaderboard />} />
    </Routes>
  );
}

export default App;
