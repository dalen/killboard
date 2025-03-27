import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { Query } from '@/types';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { SkirmishListTable } from './SkirmishListTable';
import { ReactElement } from 'react';

const TOP_SKIRMISHES = gql`
  query GetTopSkirmishes {
    topSkirmishes {
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
  }
`;

export function TopSkirmishes(): ReactElement {
  const { t } = useTranslation('components');
  const { loading, error, data } = useQuery<Query>(TOP_SKIRMISHES);

  if (loading)
    return (
      <div className="mb-3">
        <div className="is-size-4 is-family-secondary is-uppercase">
          {t('topSkirmishes.title')}
        </div>
        <progress className="progress" />;
      </div>
    );

  if (error)
    return (
      <div className="mb-3">
        <div className="is-size-4 is-family-secondary is-uppercase">
          {t('topSkirmishes.title')}
        </div>
        <ErrorMessage name={error.name} message={error.message} />{' '}
      </div>
    );

  const skirmishes = _.uniqBy(
    _.orderBy(data?.topSkirmishes, (s) => s.kills?.totalCount, 'desc'),
    (s) => s.id,
  );

  if (skirmishes == null) return <p>{t('common:error')}</p>;

  return (
    <div className="mb-3">
      <div className="is-size-4 is-family-secondary is-uppercase">
        {t('topSkirmishes.title')}
      </div>
      <SkirmishListTable data={skirmishes} />
    </div>
  );
}
