import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { MapSetup, Query, Zone } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { MapPositions } from '@/components/MapPositions';
import { questTypeIcon } from '../utils';
import { ReactElement } from 'react';
import { VendorItems } from '@/components/creature/VendorItems';

const CREATURE_DETAILS = gql`
  query GetCreature($id: ID!) {
    creature(id: $id) {
      id
      name
      creatureType
      creatureSubType
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

export function Creature({
  tab,
}: {
  tab?: undefined | 'quests' | 'vendorItems';
}): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const { id, zoneId } = useParams();
  const { loading, error, data } = useQuery<Query>(CREATURE_DETAILS, {
    variables: { id },
  });

  if (loading) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  const entry = data?.creature;
  if (entry == null) return <ErrorMessage customText={t('common:notFound')} />;

  const zoneIds: string[] = Array.from(
    new Set(entry.spawns.map((spawn) => spawn.position.zone?.id as string)),
  );

  const zones = new Map<string, [Zone, MapSetup]>(
    entry.spawns.map((spawn): [string, [Zone, MapSetup]] => [
      spawn.position.zone?.id as string,
      [spawn.position.zone as Zone, spawn.position.mapSetup as MapSetup],
    ]),
  );

  const zone = zoneId ? zones.get(zoneId)?.[0] : zones.get(zoneIds[0])?.[0];
  const mapSetup = zoneId ? zones.get(zoneId)?.[1] : zones.get(zoneIds[0])?.[1];

  if (zone == null || mapSetup == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const hasQuests = entry.questsStarter.length > 0;
  const hasVendorItems = (entry.vendorItems?.totalCount ?? 0) > 0;
  const activeTab =
    tab ??
    (hasQuests ? 'quests' : undefined) ??
    (hasVendorItems ? 'vendorItems' : undefined);

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
              {t('pages:creature.creatureId', { creatureId: id })}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="card mb-5">
        <div className="card-content">
          <p className="is-size-4 is-family-secondary has-text-info">
            {entry.name}
          </p>
          <p>{t(`enums:creatureSubType.${entry.creatureSubType}`)}</p>
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

      {activeTab === 'quests' && (
        <div className="card mb-5">
          <div className="card-content">
            <p className="is-size-4 is-family-secondary has-text-info">
              {t('pages:creature.questsStarter')}
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

      {activeTab === 'vendorItems' && <VendorItems creatureId={id} />}

      <div className="tabs">
        <ul>
          {zoneIds.map((z) => (
            <li key={z} className={zoneId === z ? 'is-active' : ''}>
              <Link to={`/creature/${id}/zone/${z}`}>
                {zones.get(z)?.[0].name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="card mb-5">
        <div className="card-content">
          <div
            style={{
              width: '640px',
              height: '640px',
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
        </div>
      </div>
    </div>
  );
}
