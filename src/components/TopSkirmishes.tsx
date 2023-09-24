import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Progress } from 'react-bulma-components';
import _ from 'lodash';
import { Query } from '../types';
import { ErrorMessage } from './global/ErrorMessage';
import { SkirmishListTable } from './SkirmishListTable';

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
      scoreboardEntries {
        totalCount
      }
      kills {
        totalCount
      }
    }
  }
`;

export function TopSkirmishes(): JSX.Element {
  const { t } = useTranslation('components');
  const { loading, error, data } = useQuery<Query>(TOP_SKIRMISHES);

  if (loading)
    return (
      <div className="mb-3">
        <div className="is-size-4 is-family-secondary is-uppercase">
          {t('topSkirmishes.title')}
        </div>
        <Progress />;
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

  const skirmishes = _.orderBy(
    data?.topSkirmishes,
    (s) => s.kills?.totalCount,
    'desc',
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
