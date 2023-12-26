import {
  Breadcrumb,
  Card,
  Container,
  Progress,
  Tabs,
} from 'react-bulma-components';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { MapSetup, Query, Zone } from '../types';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { MapPositions } from '../components/MapPositions';

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
    }
  }
`;

export function Creature(): JSX.Element {
  const { t } = useTranslation(['common', 'pages']);
  const { id, zoneId } = useParams();
  const { loading, error, data } = useQuery<Query>(CREATURE_DETAILS, {
    variables: { id },
  });

  if (loading) return <Progress />;
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

  return (
    <Container max breakpoint="widescreen" mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to={`/creature/${id}`}>
            {t('pages:creature.creatureId', { creatureId: id })}
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card mb={5}>
        <Card.Content>
          <p className="is-size-4">
            <strong>{entry.name}</strong>
          </p>
          <p>{t(`enums:creatureSubType.${entry.creatureSubType}`)}</p>
        </Card.Content>
      </Card>

      <Tabs>
        <ul>
          {zoneIds.map((z) => (
            <li key={z} className={zoneId === z ? 'is-active' : ''}>
              <Link to={`/creature/${id}/${z}`}>{zones.get(z)?.[0].name}</Link>
            </li>
          ))}
        </ul>
      </Tabs>

      <Card mb={5}>
        <Card.Content>
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
        </Card.Content>
      </Card>
    </Container>
  );
}
