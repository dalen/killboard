import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { SkirmishList } from './SkirmishList';

const LATEST_SKIRMISHES = gql`
  query GetLatestSkirmishes(
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    skirmishes(first: $first, last: $last, before: $before, after: $after) {
      nodes {
        id
        scenario {
          id
          name
        }
        primaryZone {
          id
          name
        }
        primaryZoneArea {
          id
          name
        }
        startTime
        endTime
        topGuildsByPlayers {
          guild {
            id
            name
            realm
            heraldry {
              emblem
              pattern
              color1
              color2
              shape
            }
          }
          count
        }
        numberOfKills
        numberOfKillsOrder
        numberOfKillsDestruction
        numberOfPlayers
        numberOfPlayersOrder
        numberOfPlayersDestruction
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export function LatestSkirmishes({
  perPage = 10,
}: {
  perPage?: number;
}): JSX.Element {
  const { t } = useTranslation('components');

  return (
    <div>
      <div className="is-size-4 is-family-secondary is-uppercase">
        {t('latestSkirmishes.title')}
      </div>
      <SkirmishList query={LATEST_SKIRMISHES} perPage={perPage} />
    </div>
  );
}
