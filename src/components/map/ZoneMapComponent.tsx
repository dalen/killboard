import {
  CreatureTitle,
  GetZoneMapQuery,
  PublicQuestType,
  Realm,
} from '@/__generated__/graphql';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import L, { CRS } from 'leaflet';
import { ReactElement } from 'react';
import {
  ImageOverlay,
  LayersControl,
  MapContainer,
  Marker,
  Popup,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { leafletIcon } from '@/components/map/mapIcons';
import { isVendor } from '@/components/map/creatureTitle';

const ZONE_MAP = gql`
  query GetZoneMap($zoneId: ID!) {
    zone(id: $zoneId) {
      id
      name
      mapSetup {
        nwCornerX
        nwCornerY
        seCornerX
        seCornerY
      }
      warJournalEntries {
        id
        name
        title
        text
        position {
          x
          y
        }
      }
      locations {
        name
        position {
          x
          y
        }
        ... on Keep {
          id
        }
        ... on PublicQuest {
          id
          type
        }
        ... on Landmark {
          importance
          icon
          liveEvent {
            id
            startTime
            endTime
          }
        }
      }
      creatureSpawns {
        id
        creature {
          id
          name
          realm
          title
          questsStarter {
            id
          }
        }
        position {
          x
          y
        }
      }
    }
  }
`;

const coordToLatLng = (x: number, y: number): L.LatLng => {
  return L.latLng((65536 - y) / 64, x / 64);
};

export const ZoneMapComponent = ({
  zoneId,
}: {
  zoneId: number;
}): ReactElement => {
  const { data, loading, error } = useQuery<GetZoneMapQuery>(ZONE_MAP, {
    variables: { zoneId },
  });

  if (loading) {
    return <div>Loading map...</div>;
  }

  if (error || !data?.zone?.mapSetup) {
    return <div>Error loading map.</div>;
  }

  console.log('Zone map data:', data.zone.mapSetup);

  const bounds = L.latLngBounds(
    coordToLatLng(data.zone.mapSetup.seCornerX, data.zone.mapSetup.nwCornerY),
    coordToLatLng(data.zone.mapSetup.nwCornerX, data.zone.mapSetup.seCornerY),
  );

  return (
    <MapContainer
      crs={CRS.Simple}
      center={bounds.getCenter()}
      style={{ width: '1024px', height: '1024px' }}
      bounds={bounds}
      attributionControl={false}
      maxBoundsViscosity={1.0}
      maxBounds={bounds}
    >
      <ImageOverlay bounds={bounds} url={`/images/maps/${zoneId}.webp`} />
      <LayersControl position="bottomleft">
        <LayersControl.Overlay name="Terrain map">
          <ImageOverlay
            bounds={bounds}
            url={`/images/maps/terrain/${zoneId}.jpg`}
          />
        </LayersControl.Overlay>
      </LayersControl>
      {/* {data.zone.warJournalEntries.map((entry) => {
        if (entry.position == null) {
          return null;
        }
        return entry.position ? (
          <Marker
            key={entry.id}
            position={coordToLatLng(entry.position.x, entry.position.y)}
          >
            <Popup>
              {entry.title}: {entry.name}
            </Popup>
          </Marker>
        ) : null;
      })} */}
      {data.zone.creatureSpawns.map((entry) => {
        let icon = leafletIcon(61);
        let index = 10;
        if (entry.creature.questsStarter?.length) {
          icon = leafletIcon(3);
        } else if (entry.creature.title === CreatureTitle.KillCollector) {
          icon = leafletIcon(18);
        } else if (isVendor(entry.creature.title)) {
          icon = leafletIcon(19);
        } else if (
          entry.creature.title === CreatureTitle.CareerTrainer ||
          entry.creature.title === CreatureTitle.RenownTrainer
        ) {
          icon = leafletIcon(20);
        } else if (entry.creature.title === CreatureTitle.Auctioneer) {
          icon = leafletIcon(22);
        } else if (entry.creature.title === CreatureTitle.FlightMaster) {
          icon = leafletIcon(23);
        } else if (entry.creature.title === CreatureTitle.VaultKeeper) {
          icon = leafletIcon(24);
        } else if (entry.creature.title === CreatureTitle.Librarian) {
          icon = leafletIcon(25);
        } else if (entry.creature.title === CreatureTitle.GuildRegistrar) {
          icon = leafletIcon(26);
        } else if (entry.creature.title === CreatureTitle.RallyMaster) {
          icon = leafletIcon(34);
        } else if (entry.creature.title === CreatureTitle.Healer) {
          icon = leafletIcon(42);
        } else if (entry.creature.title === CreatureTitle.NameRegistrar) {
          icon = leafletIcon(49);
        } else if (entry.creature.realm === Realm.Order) {
          return null;
          icon = leafletIcon(10);
          index = 1;
        } else if (entry.creature.realm === Realm.Destruction) {
          return null;
          icon = leafletIcon(11);
          index = 1;
        } else {
          return null;
          index = 1;
        }
        return entry.position ? (
          <Marker
            key={entry.id}
            position={coordToLatLng(entry.position.x, entry.position.y)}
            icon={icon}
            zIndexOffset={index}
          >
            <Popup>
              <a href={`/creature/${entry.creature.id}`}>
                {entry.creature.name}
              </a>
            </Popup>
          </Marker>
        ) : null;
      })}
      {data.zone.locations.map((entry) => {
        if (entry.__typename === 'Keep') {
          return (
            <Marker
              icon={leafletIcon(104)}
              key={entry.name}
              position={coordToLatLng(entry.position.x, entry.position.y)}
              zIndexOffset={100}
            >
              <Popup>{entry.name}</Popup>
            </Marker>
          );
        }
        if (entry.__typename === 'BattlefieldObjective') {
          return (
            <Marker
              icon={leafletIcon(90)}
              key={entry.name}
              position={coordToLatLng(entry.position.x, entry.position.y)}
              zIndexOffset={90}
            >
              <Popup>{entry.name}</Popup>
            </Marker>
          );
        }
        if (
          entry.__typename === 'PublicQuest' &&
          entry.type === PublicQuestType.PublicQuest
        ) {
          return (
            <Marker
              icon={leafletIcon(1313)}
              key={entry.name}
              position={coordToLatLng(entry.position.x, entry.position.y)}
              zIndexOffset={90}
            >
              <Popup>{entry.name}</Popup>
            </Marker>
          );
        }
        if (
          entry.__typename === 'PublicQuest' &&
          entry.type === PublicQuestType.None
        ) {
          return (
            <Marker
              icon={leafletIcon(90)}
              key={entry.name}
              position={coordToLatLng(entry.position.x, entry.position.y)}
              zIndexOffset={90}
            >
              <Popup>{entry.name}</Popup>
            </Marker>
          );
        }
        if (entry.__typename === 'Mailbox') {
          return (
            <Marker
              icon={leafletIcon(48)}
              key={entry.name}
              position={coordToLatLng(entry.position.x, entry.position.y)}
              zIndexOffset={90}
            >
              <Popup>{entry.name}</Popup>
            </Marker>
          );
        }

        if (entry.__typename === 'Landmark') {
          if (
            entry.liveEvent &&
            (new Date(entry.liveEvent.startTime) > new Date() ||
              new Date(entry.liveEvent.endTime) < new Date())
          ) {
            return null;
          }
          return (
            <Marker
              icon={leafletIcon(entry.icon)}
              key={entry.name}
              position={coordToLatLng(entry.position.x, entry.position.y)}
              zIndexOffset={90}
            >
              <Popup>{entry.name}</Popup>
            </Marker>
          );
        }
      })}
    </MapContainer>
  );
};
