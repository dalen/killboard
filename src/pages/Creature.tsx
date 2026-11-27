import { Link, Navigate, useParams, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import type { MapSetup, Query, Zone } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { MapPositions } from '@/components/MapPositions';
import { MapFallback } from '@/components/MapFallback';
import { hasUsableMapSetup, isPlayerFacingZone, questTypeIcon } from '../utils';
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

const getQuestAriaSort = (
  active: boolean,
  direction: 'ASC' | 'DESC',
): 'none' | 'ascending' | 'descending' => {
  if (!active) {
    return 'none';
  }
  return direction === 'ASC' ? 'ascending' : 'descending';
};

export const Creature = ({
  tab,
}: {
  tab?: undefined | 'quests' | 'vendorItems';
}): ReactElement => {
  const { t } = useTranslation(['common', 'pages']);
  const { id, zoneId } = useParams();
  const [search, setSearch] = useSearchParams();
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
            ? `/creature/${id}/zone/${activeZoneId}`
            : `/creature/${id}`
        }
        replace
      />
    );
  }
  const zone = activeZoneId ? zones.get(activeZoneId)?.[0] : undefined;
  const mapSetup = activeZoneId ? zones.get(activeZoneId)?.[1] : undefined;

  const hasQuests = entry.questsStarter.length > 0;
  const hasVendorItems = (entry.vendorItems?.totalCount ?? 0) > 0;
  const activeTab =
    tab ??
    (hasQuests ? 'quests' : undefined) ??
    (hasVendorItems ? 'vendorItems' : undefined);

  const questSortField = search.get('sort');
  const questSortDirection = search.get('direction') === 'DESC' ? 'DESC' : 'ASC';
  const sortedQuests = [...entry.questsStarter];
  if (
    questSortField === 'minLevel' ||
    questSortField === 'xp' ||
    questSortField === 'gold'
  ) {
    sortedQuests.sort((a, b) => {
      const difference = a[questSortField] - b[questSortField];
      return questSortDirection === 'ASC' ? difference : -difference;
    });
  }

  const updateQuestSort = (field: 'minLevel' | 'xp' | 'gold') => {
    const nextSearch = new URLSearchParams(search);
    const direction =
      questSortField === field && questSortDirection === 'ASC' ? 'DESC' : 'ASC';
    nextSearch.set('sort', field);
    nextSearch.set('direction', direction);
    setSearch(nextSearch);
  };

  const questSortHeader = (
    field: 'minLevel' | 'xp' | 'gold',
    label: string,
  ) => {
    const active = questSortField === field;
    return (
      <button
        className="button is-ghost p-0 has-text-weight-bold"
        type="button"
        aria-label={`${label}${active ? `, ${questSortDirection === 'ASC' ? 'ascending' : 'descending'}` : ''}`}
        onClick={() => updateQuestSort(field)}
      >
        <span className="creature-quest-sort-label-full">{label}</span>
        <span className="creature-quest-sort-label-short">
          {field === 'minLevel' ? 'Lvl' : label}
        </span>
        {active && (
          <span className="ml-1">
            {questSortDirection === 'ASC' ? '▲' : '▼'}
          </span>
        )}
      </button>
    );
  };

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
        {zone != null && (
          <p className="mb-3">
            <Link to={`/zone_heatmap/${zone.id}`}>
              {t('pages:activityPage.openZoneHeatmap', { zone: zone.name })}
            </Link>
          </p>
        )}
          {zone != null && mapSetup != null && (
            <div
              className={activeTab == null ? 'map-only-viewport-fit' : undefined}
              style={{
                width: '100%',
                maxWidth:
                  activeTab == null
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
        <div className="table-container">
          <table className="table is-fullwidth is-striped is-hoverable is-narrow creature-quests-table">
            <thead>
              <tr>
                <th>{t('pages:quests.name')}</th>
                <th
                  aria-sort={getQuestAriaSort(
                    questSortField === 'minLevel',
                    questSortDirection,
                  )}
                >
                  {questSortHeader(
                    'minLevel',
                    t('pages:quests.minLevel'),
                  )}
                </th>
                <th
                  aria-sort={getQuestAriaSort(
                    questSortField === 'xp',
                    questSortDirection,
                  )}
                >
                  {questSortHeader('xp', t('pages:quests.xp'))}
                </th>
                <th
                  aria-sort={getQuestAriaSort(
                    questSortField === 'gold',
                    questSortDirection,
                  )}
                >
                  {questSortHeader('gold', t('pages:quests.gold'))}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedQuests.map((quest) => (
                <tr key={quest.id}>
                  <td className="creature-quest-name-cell">
                    <Link
                      className="creature-quest-name"
                      to={`/quest/${quest.id}`}
                      title={quest.name}
                    >
                      <span className="icon has-text-info mr-1">
                        <img
                          src={`/images/icons/${questTypeIcon(
                            quest.type,
                            quest.repeatableType,
                          )}`}
                          alt="Quest Type"
                        />
                      </span>
                      <span className="creature-quest-name-text">
                        {quest.name}
                      </span>
                    </Link>
                  </td>
                  <td>{quest.minLevel}</td>
                  <td>{quest.xp.toLocaleString()}</td>
                  <td>
                    <span className="creature-quest-gold">
                      <GoldPrice price={quest.gold} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
