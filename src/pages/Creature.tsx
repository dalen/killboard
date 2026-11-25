import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import type { MapSetup, Query, Zone } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { MapPositions } from '@/components/MapPositions';
import { MapFallback } from '@/components/MapFallback';
import { hasUsableMapSetup, questTypeIcon } from '../utils';
import type { ReactElement } from 'react';
import { VendorItems } from '@/components/creature/VendorItems';
import { GoldPrice } from '@/components/GoldPrice';

const CREATURE_DETAILS = gql`
  query GetCreature($id: ID!) {
    creature(id: $id) {
      id
      name
      realm
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
        minLevel
        xp
        gold
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
      vendorItems {
        totalCount
      }
    }
  }
`;

export const Creature = ({
  tab,
}: {
  tab?: undefined | 'quests' | 'vendorItems';
}): ReactElement => {
  const { t } = useTranslation(['common', 'pages']);
  const { id, zoneId } = useParams();
  const { loading, error, data } = useQuery<Query>(CREATURE_DETAILS, {
    variables: { id },
  });

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  const entry = data?.creature;
  if (entry == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const zones = entry.spawns.reduce((availableZones, spawn) => {
    const { zone, mapSetup } = spawn.position;
    if (zone != null) {
      const previousMapSetup = availableZones.get(zone.id)?.[1];
      availableZones.set(zone.id, [
        zone,
        hasUsableMapSetup(mapSetup) ? mapSetup : previousMapSetup,
      ]);
    }
    return availableZones;
  }, new Map<string, [Zone, MapSetup | null | undefined]>());
  const zoneIds = [...zones.keys()];
  const activeZoneId = zoneId ?? zoneIds[0];
  const zone = activeZoneId ? zones.get(activeZoneId)?.[0] : undefined;
  const mapSetup = activeZoneId ? zones.get(activeZoneId)?.[1] : undefined;

  const hasQuests = entry.questsStarter.length > 0;
  const hasVendorItems = (entry.vendorItems?.totalCount ?? 0) > 0;
  const activeTab =
    tab ??
    (hasQuests ? 'quests' : undefined) ??
    (hasVendorItems ? 'vendorItems' : undefined);

  const zoneMapPanel = (
    <div className="card mb-5">
      <div className="card-content">
        {zoneIds.length > 1 ? (
          <div className="tabs is-small mb-4">
            <ul>
              {zoneIds.map((z) => (
                <li key={z} className={zoneId === z ? 'is-active' : ''}>
                  <Link to={`/creature/${id}/zone/${z}`}>
                    {zones.get(z)?.[0].name ||
                      t('pages:creature.zoneId', { zoneId: z })}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          zone != null && (
            <p className="is-size-5 is-family-secondary has-text-info mb-4">
              {zone.name}
            </p>
          )
        )}
          {zone != null && mapSetup != null && (
            <div style={{ width: '100%', maxWidth: '640px', margin: '0 auto' }}>
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
              {t('pages:creature.noSpawnLocations')}
            </div>
          )}
          {entry.spawns.length > 0 &&
            (zone == null || mapSetup == null) && (
              <MapFallback
                key={zone?.id ?? 'unmapped'}
                zoneId={zone?.id}
                zoneName={zone?.name}
                mapUnavailableText={t('pages:creature.mapUnavailable')}
                markersUnavailableText={t(
                  'pages:creature.mapMarkersUnavailable',
                )}
              />
            )}
      </div>
    </div>
  );

  const questPanel = (
    <div className="card mb-5">
      <div className="card-content">
        <p className="is-size-4 is-family-secondary has-text-info">
          {t('pages:creature.questsStarter')}
        </p>
        {entry.questsStarter.map((quest) => (
          <Link
            className="is-block mb-3"
            key={quest.id}
            to={`/quest/${quest.id}`}
          >
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
            <div className="ml-6 is-size-7 is-flex is-align-items-center is-flex-wrap-wrap">
              <span className="mr-3">
                {t('pages:quests.minLevel')}: {quest.minLevel}
              </span>
              <span className="mr-3">
                {t('pages:quests.xp')}: {quest.xp.toLocaleString()}
              </span>
              {quest.gold > 0 && (
                <span className="icon-text">
                  {t('pages:quests.gold')}: <GoldPrice price={quest.gold} />
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  let mainContent = zoneMapPanel;
  if (activeTab === 'quests') {
    mainContent = (
      <div className="columns is-multiline is-variable is-4 mx-0">
        <div className="column is-12-desktop is-5-widescreen">
          {zoneMapPanel}
        </div>
        <div className="column is-12-desktop is-7-widescreen">
          {questPanel}
        </div>
      </div>
    );
  } else if (activeTab === 'vendorItems') {
    mainContent = (
      <div className="columns is-multiline is-variable is-4 mx-0">
        <div className="column is-12-desktop is-5-widescreen">
          {zoneMapPanel}
        </div>
        <div className="column is-12-desktop is-7-widescreen">
          <div className="card mb-5">
            <div className="card-content">
              <VendorItems creatureId={id} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li>
            <Link to="/creatures">{t('common:creatures')}</Link>
          </li>
          <li className="is-active">
            <Link to={`/creature/${id}`}>
              {entry.name || t('pages:creature.creatureId', { creatureId: id })}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="card mb-5">
        <div className="card-content">
          <p className="is-size-4 is-family-secondary has-text-info">
            {entry.name}
          </p>
        </div>
      </div>

      <div className="tabs">
        <ul>
          {hasQuests && (
            <li className={activeTab === 'quests' ? 'is-active' : ''}>
              <Link to={`/creature/${id}/quests`}>
                <img
                  src="/images/corner_icons/ea_icon_corner_quest.png"
                  alt="Quest Icon"
                  width={24}
                  height={24}
                  className="px-1"
                />
                {t('pages:creature.questsStarter')} (
                {entry.questsStarter.length})
              </Link>
            </li>
          )}
          {hasVendorItems && (
            <li className={activeTab === 'vendorItems' ? 'is-active' : ''}>
              <Link to={`/creature/${id}/vendorItems`}>
                <img
                  src="/images/corner_icons/ea_icon_corner_merchant.png"
                  alt="Merchant Icon"
                  width={24}
                  height={24}
                  className="px-1"
                />
                {t('pages:creature.vendorItems')} (
                {entry.vendorItems?.totalCount})
              </Link>
            </li>
          )}
        </ul>
      </div>

      {mainContent}
    </div>
  );
};
