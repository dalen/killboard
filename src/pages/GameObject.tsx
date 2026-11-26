import { Link, Navigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import type { MapSetup, Query, Zone } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { MapPositions } from '@/components/MapPositions';
import { MapFallback } from '@/components/MapFallback';
import { hasUsableMapSetup, isPlayerFacingZone, questTypeIcon } from '../utils';
import type { ReactElement } from 'react';

const GAMEOBJECT_DETAILS = gql`
  query GetGameObject($id: ID!) {
    gameObject(id: $id) {
      id
      name
      modelName
      spawns {
        id
        position {
          x
          y
          zone {
            id
            name
          }
          mapSetup {
            nwCornerX
            nwCornerY
            seCornerX
            seCornerY
          }
        }
      }
      questsStarter {
        id
        name
        type {
          isEpic
          isGroup
          isNone
          isPlayerKill
          isRvR
          isTome
          isTravel
        }
        repeatableType
      }
    }
  }
`;

export const GameObject = (): ReactElement => {
  const { t } = useTranslation(['common', 'pages']);
  const { id, zoneId } = useParams();
  const { loading, error, data } = useQuery<Query>(GAMEOBJECT_DETAILS, {
    variables: { id },
  });

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  const entry = data?.gameObject;
  if (entry == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const zones = entry.spawns.reduce((availableZones, spawn) => {
    const { zone, mapSetup } = spawn.position;
    if (zone != null && isPlayerFacingZone(zone.name)) {
      const previousMapSetup = availableZones.get(zone.id)?.[1];
      availableZones.set(zone.id, [
        zone,
        hasUsableMapSetup(mapSetup) ? mapSetup : previousMapSetup,
      ]);
    }
    return availableZones;
  }, new Map<string, [Zone, MapSetup | null | undefined]>());
  const zoneIds = [...zones.keys()];
  const activeZoneId = zoneId && zones.has(zoneId) ? zoneId : zoneIds[0];
  if (zoneId != null && !zones.has(zoneId)) {
    return (
      <Navigate
        to={
          activeZoneId
            ? `/gameobject/${id}/zone/${activeZoneId}`
            : `/gameobject/${id}`
        }
        replace
      />
    );
  }
  const zone = activeZoneId ? zones.get(activeZoneId)?.[0] : undefined;
  const mapSetup = activeZoneId ? zones.get(activeZoneId)?.[1] : undefined;

  const hasQuests = entry.questsStarter.length > 0;
  const activeTab = hasQuests ? 'quests' : undefined;

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <Link to={`/gameobject/${id}`}>
              {t('pages:gameobject.gameobjectId', { gameobjectId: id })}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="card mb-5">
        <div className="card-content">
          <p className="is-size-4 is-family-secondary has-text-info">
            {entry.name}
          </p>
          <p>{entry.modelName}</p>
        </div>
      </div>

      <div className="tabs">
        <ul>
          {hasQuests && (
            <li className={activeTab === 'quests' ? 'is-active' : ''}>
              <Link to={`/gameobject/${id}/quests`}>
                <img
                  src="/images/corner_icons/ea_icon_corner_quest.png"
                  alt="Quest Icon"
                  width={24}
                  height={24}
                  className="px-1"
                />
                {t('pages:gameobject.questsStarter')}
              </Link>
            </li>
          )}
        </ul>
      </div>

      {activeTab === 'quests' && (
        <div className="card mb-5">
          <div className="card-content">
            <p className="is-size-4 is-family-secondary has-text-info">
              {t('pages:gameobject.questsStarter')}
            </p>
            {entry.questsStarter.map((quest) => (
              <Link to={`/quest/${quest.id}`}>
                <div className="icon-text">
                  <span className="icon has-text-info">
                    <img
                      src={`/images/icons/${questTypeIcon(
                        quest.type,
                        quest.repeatableType,
                      )}`}
                      alt="Quest Type"
                    />
                  </span>
                  <span>{quest.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="tabs">
        <ul>
          {zoneIds.map((z) => (
            <li key={z} className={zoneId === z ? 'is-active' : ''}>
              <Link to={`/gameobject/${id}/zone/${z}`}>
                {zones.get(z)?.[0].name ||
                  t('pages:gameobject.zoneId', { zoneId: z })}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="card mb-5">
        <div className="card-content">
          {zone != null && mapSetup != null && (
            <div
              className={!hasQuests ? 'map-only-viewport-fit' : undefined}
              style={{
                width: '100%',
                maxWidth: !hasQuests
                  ? 'min(640px, calc(100vw - 4rem), max(280px, calc(100vh - 26rem)))'
                  : '640px',
                margin: '0 auto',
              }}
            >
              <MapPositions
                positions={entry.spawns
                  .filter((spawn) => spawn.position.zone?.id === zone.id)
                  .map((spawn) => ({
                    x: spawn.position.x,
                    y: spawn.position.y,
                  }))}
                zoneId={Number(zone.id)}
                nwCornerX={mapSetup.nwCornerX}
                nwCornerY={mapSetup.nwCornerY}
                seCornerX={mapSetup.seCornerX}
                seCornerY={mapSetup.seCornerY}
              />
            </div>
          )}
          {entry.spawns.length === 0 && (
            <div className="notification is-dark mb-0">
              {t('pages:gameobject.noSpawnLocations')}
            </div>
          )}
          {entry.spawns.length > 0 &&
            (zone == null || mapSetup == null) && (
              <MapFallback
                key={zone?.id ?? 'unmapped'}
                zoneId={zone?.id}
                zoneName={zone?.name}
                mapUnavailableText={t('pages:gameobject.mapUnavailable')}
                markersUnavailableText={t(
                  'pages:gameobject.mapMarkersUnavailable',
                )}
              />
            )}
        </div>
      </div>
    </div>
  );
};
