import { Button, Progress, Table } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { Query } from '../types';
import { ErrorMessage } from './global/ErrorMessage';

const ITEM_INFO = gql`
  query GetItemRewardedFromQuests(
    $itemId: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    item(id: $itemId) {
      id
      rewardedFromQuests(
        first: $first
        last: $last
        before: $before
        after: $after
      ) {
        nodes {
          id
          name
          rewardsChoice {
            item {
              id
              name
              iconUrl
            }
            count
          }
          rewardsGiven {
            item {
              id
              name
              iconUrl
            }
            count
          }
        }
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
      }
    }
  }
`;

export function ItemQuests({ itemId }: { itemId: string | undefined }) {
  const perPage = 10;
  const { t } = useTranslation(['common', 'components']);
  const { loading, error, data, refetch } = useQuery<Query>(ITEM_INFO, {
    variables: {
      itemId,
      first: perPage,
    },
  });

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  const rewardedFromQuests = data?.item?.rewardedFromQuests;
  const pageInfo = rewardedFromQuests?.pageInfo;

  if (rewardedFromQuests?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  if (rewardedFromQuests?.nodes == null) return null;

  return (
    <Table striped className="is-fullwidth">
      <thead>
        <tr>
          <th>{t('components:itemQuests.questName')}</th>
          <th>{t('components:itemQuests.choice')}</th>
          <th>{t('components:itemQuests.given')}</th>
        </tr>
      </thead>
      <tbody>
        {rewardedFromQuests.nodes.map((quest) => (
          <tr key={quest.id}>
            <td>{quest.name}</td>
            <td>
              {quest.rewardsChoice.map((rewardItem) => (
                <span className="icon-text">
                  <figure className="image is-24x24 mx-1">
                    <img src={rewardItem.item.iconUrl} alt="Item Icon" />
                  </figure>
                  <Link to={`/item/${rewardItem.item.id}`} className="mr-1">
                    {rewardItem.item.name}
                  </Link>
                  x{rewardItem.count}
                </span>
              ))}
            </td>
            <td>
              {quest.rewardsGiven.map((rewardItem) => (
                <span className="icon-text">
                  <figure className="image is-24x24 mx-1">
                    <img src={rewardItem.item.iconUrl} alt="Item Icon" />
                  </figure>
                  <Link to={`/item/${rewardItem.item.id}`} className="mr-1">
                    {rewardItem.item.name}
                  </Link>
                  x{rewardItem.count}
                </span>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
      {(pageInfo?.hasNextPage || pageInfo?.hasPreviousPage) && (
        <tfoot>
          <tr>
            <td colSpan={3}>
              <div className="field is-grouped is-pulled-right">
                {pageInfo.hasPreviousPage && (
                  <Button
                    p={2}
                    pull="right"
                    color="info"
                    size="small"
                    onClick={() =>
                      refetch({
                        first: undefined,
                        after: undefined,
                        last: perPage,
                        before: pageInfo?.startCursor,
                      })
                    }
                  >
                    {t('common:prevPage')}
                    <i className="fas fa-circle-chevron-left ml-1" />
                  </Button>
                )}
                {pageInfo.hasNextPage && (
                  <Button
                    p={2}
                    pull="right"
                    color="info"
                    size="small"
                    onClick={() => {
                      refetch({
                        first: perPage,
                        after: pageInfo?.endCursor,
                        last: undefined,
                        before: undefined,
                      });
                    }}
                  >
                    {t('common:nextPage')}
                    <i className="fas fa-circle-chevron-right ml-1" />
                  </Button>
                )}
              </div>
            </td>
          </tr>
        </tfoot>
      )}
    </Table>
  );
}
