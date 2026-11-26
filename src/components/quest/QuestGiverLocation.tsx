import { useState } from 'react';
import type { ReactElement } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Realm, type GetQuestInfoQuery } from '@/__generated__/graphql';
import { MapFallback } from '@/components/MapFallback';
import { MapPositions } from '@/components/MapPositions';
import { isPlayerFacingZone } from '@/utils';

type QuestGiver = NonNullable<
  GetQuestInfoQuery['quest']
>['starterCreatures'][number];
type QuestGiverSpawn = QuestGiver['spawns'][number];
type QuestGiverZone = NonNullable<QuestGiverSpawn['position']['zone']>;
type QuestGiverMapSetup = NonNullable<QuestGiverSpawn['position']['mapSetup']>;

export const QuestGiverLocation = ({
  creature,
}: {
  creature: QuestGiver;
}): ReactElement => {
  const { t } = useTranslation(['common', 'pages']);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const zones = new Map<
    string,
    {
      zone: QuestGiverZone;
      mapSetup: QuestGiverMapSetup | null;
      positions: { x: number; y: number }[];
    }
  >();

  creature.spawns.forEach((spawn: QuestGiverSpawn) => {
    const { x, y, zone, mapSetup } = spawn.position;
    if (zone == null || !isPlayerFacingZone(zone.name)) {
      return;
    }

    const existing = zones.get(zone.id);
    const location = existing ?? {
      zone,
      mapSetup: null,
      positions: [] as { x: number; y: number }[],
    };
    if (
      mapSetup != null &&
      Number.isFinite(mapSetup.nwCornerX) &&
      Number.isFinite(mapSetup.nwCornerY) &&
      Number.isFinite(mapSetup.seCornerX) &&
      Number.isFinite(mapSetup.seCornerY) &&
      mapSetup.seCornerX > mapSetup.nwCornerX &&
      mapSetup.seCornerY > mapSetup.nwCornerY
    ) {
      location.mapSetup = mapSetup;
    }
    if (
      typeof x === 'number' &&
      Number.isFinite(x) &&
      typeof y === 'number' &&
      Number.isFinite(y)
    ) {
      location.positions.push({ x, y });
    }
    zones.set(zone.id, location);
  });

  const zoneIds = [...zones.keys()];
  const activeZoneId =
    selectedZoneId != null && zones.has(selectedZoneId)
      ? selectedZoneId
      : zoneIds[0];
  const activeLocation = activeZoneId ? zones.get(activeZoneId) : undefined;

  return (
    <div className="box mb-3">
      <div className="icon-text mb-2">
        <span className="icon has-text-info">
          {creature.realm === Realm.Order && (
            <img
              src="/images/icons/scenario/order.png"
              width={24}
              height={24}
              alt={t('common:realmOrder')}
            />
          )}
          {creature.realm === Realm.Destruction && (
            <img
              src="/images/icons/scenario/destruction.png"
              width={24}
              height={24}
              alt={t('components:realmDestruction')}
            />
          )}
          {creature.realm === Realm.Neutral && (
            <img
              src="/images/icons/quest_green.png"
              width={24}
              height={24}
              alt={t('components:realmNeutral')}
            />
          )}
        </span>
        <span>
          <Link to={`/creature/${creature.id}`}>{creature.name}</Link>
        </span>
      </div>

      <details>
        <summary className="is-clickable has-text-link">
          {t('pages:quest.showGiverLocation')}
        </summary>
        <div className="mt-3">
          {zoneIds.length === 0 ? (
            <div className="notification is-dark mb-0">
              {t('pages:quest.giverLocationUnavailable')}
            </div>
          ) : (
            <>
              {zoneIds.length > 1 && (
                <div className="field">
                  <label
                    className="label"
                    htmlFor={`quest-giver-zone-${creature.id}`}
                  >
                    {t('pages:quest.giverLocationZone')}
                  </label>
                  <div className="control">
                    <div className="select">
                      <select
                        id={`quest-giver-zone-${creature.id}`}
                        value={activeZoneId}
                        onChange={(event) =>
                          setSelectedZoneId(event.target.value)
                        }
                      >
                        {zoneIds.map((zoneId) => (
                          <option key={zoneId} value={zoneId}>
                            {zones.get(zoneId)?.zone.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
              {activeLocation != null && (
                <div className="card">
                  <div className="card-content">
                    <p className="is-family-secondary has-text-info mb-2">
                      {activeLocation.zone.name}
                    </p>
                    {activeLocation.mapSetup != null ? (
                      <div
                        style={{
                          width: '100%',
                          maxWidth: '480px',
                          margin: '0 auto',
                        }}
                      >
                        <MapPositions
                          positions={activeLocation.positions}
                          zoneId={Number(activeLocation.zone.id)}
                          nwCornerX={activeLocation.mapSetup.nwCornerX}
                          nwCornerY={activeLocation.mapSetup.nwCornerY}
                          seCornerX={activeLocation.mapSetup.seCornerX}
                          seCornerY={activeLocation.mapSetup.seCornerY}
                        />
                      </div>
                    ) : (
                      <MapFallback
                        zoneId={activeLocation.zone.id}
                        zoneName={activeLocation.zone.name}
                        mapUnavailableText={t(
                          'pages:quest.giverMapUnavailable',
                        )}
                        markersUnavailableText={t(
                          'pages:quest.giverMarkersUnavailable',
                        )}
                      />
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </details>
    </div>
  );
};
