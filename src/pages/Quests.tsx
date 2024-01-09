import {
  Breadcrumb,
  Button,
  Card,
  Container,
  Form,
  Progress,
  Table,
} from 'react-bulma-components';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import Tippy from '@tippyjs/react';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { Query, QuestFilterInput } from '../types';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { SearchBox } from '../components/SearchBox';
import { GoldPrice } from '../components/GoldPrice';
import { ItemPopup } from '../components/ItemPopup';
import { questTypeIcon } from '../utils';

const QUESTS = gql`
  query GetQuests(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $where: QuestFilterInput
  ) {
    quests(
      first: $first
      last: $last
      before: $before
      after: $after
      where: $where
    ) {
      nodes {
        id
        name
        type
        xp
        gold
        choiceCount
        rewardsChoice {
          count
          item {
            id
            iconUrl
            name
          }
        }
        rewardsGiven {
          count
          item {
            id
            iconUrl
            name
          }
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
`;

const getQuestNameFilter = (search: URLSearchParams): QuestFilterInput => {
  const name = search.get('name');

  if (!name) {
    return {};
  }

  return { name: { contains: name } };
};

const getFilters = (search: URLSearchParams): QuestFilterInput => ({
  ...getQuestNameFilter(search),
});

export function Quests(): JSX.Element {
  const perPage = 15;
  const [search, setSearch] = useSearchParams();
  const { t } = useTranslation(['common', 'pages', 'enums']);
  const { loading, error, data, refetch } = useQuery<Query>(QUESTS, {
    variables: {
      where: getFilters(search),
      first: perPage,
    },
  });
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.quests?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const entries = data.quests.nodes;
  const { pageInfo } = data.quests;

  return (
    <Container max breakpoint="widescreen" mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <div className="ml-2">{t('pages:quests.title')}</div>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card mb={5}>
        <Card.Content>
          <Form.Field>
            <Form.Label>{t('pages:quests.search')}</Form.Label>
            <SearchBox
              initialQuery={search.get('name') || ''}
              onSubmit={(event) => {
                search.set('name', event);
                setSearch(search);
              }}
            />
          </Form.Field>
        </Card.Content>
      </Card>

      <div className="table-container">
        <Table striped hoverable size={isMobile ? 'narrow' : 'fullwidth'}>
          <thead>
            <tr>
              <th>{t('pages:quests.name')}</th>
              <th align="right">{t('pages:quests.xp')}</th>
              <th align="right" id="table_gold">
                <span className="mr-2">{t('pages:quests.gold')}</span>
              </th>
              <th>{t('pages:quests.given')}</th>
              <th>{t('pages:quests.choice')}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((quest) => (
              <tr key={quest.id}>
                <td>
                  <Link to={`/quest/${quest.id}`}>
                    <div className="icon-text">
                      <span className="icon has-text-info">
                        <img
                          src={`/images/icons/${questTypeIcon(
                            quest.type,
                            false,
                          )}`}
                          alt="Quest Type"
                        />
                      </span>
                      <span>{quest.name}</span>
                    </div>
                  </Link>
                </td>
                <td align="right">{quest.xp}</td>
                <td align="right" aria-labelledby="table_gold">
                  <GoldPrice price={quest.gold} />
                </td>
                <td>
                  <div className="mb-2 is-flex">
                    {quest.rewardsGiven.slice(0, 5).map((reward) => (
                      <div key={`${quest.id}-${reward.item.id}`}>
                        <Tippy
                          duration={0}
                          placement="top"
                          content={<ItemPopup itemId={reward.item.id} />}
                        >
                          <div>
                            <Link to={`/item/${reward.item.id}`}>
                              <figure className="image is-32x32">
                                <div style={{ position: 'relative' }}>
                                  <img
                                    style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                    }}
                                    src={reward.item.iconUrl}
                                    alt={reward.item.name}
                                  />
                                  {reward.count > 1 && (
                                    <div
                                      className="has-text-white"
                                      style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 4,
                                      }}
                                    >
                                      {reward.count}
                                    </div>
                                  )}
                                </div>
                              </figure>
                            </Link>
                          </div>
                        </Tippy>
                      </div>
                    ))}
                  </div>
                  {quest.rewardsGiven.length > 5 && (
                    <div>{quest.rewardsGiven.length - 5} other items</div>
                  )}
                </td>
                <td>
                  {quest.choiceCount > 0 && (
                    <div>Choose {quest.choiceCount}</div>
                  )}

                  <div className="mb-2 is-flex">
                    {quest.rewardsChoice.slice(0, 5).map((reward) => (
                      <div key={`${quest.id}-${reward.item.id}`}>
                        <Tippy
                          duration={0}
                          placement="top"
                          content={<ItemPopup itemId={reward.item.id} />}
                        >
                          <div>
                            <Link to={`/item/${reward.item.id}`}>
                              <figure className="image is-32x32">
                                <div style={{ position: 'relative' }}>
                                  <img
                                    style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                    }}
                                    src={reward.item.iconUrl}
                                    alt={reward.item.name}
                                  />
                                  {reward.count > 1 && (
                                    <div
                                      className="has-text-white"
                                      style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 4,
                                      }}
                                    >
                                      {reward.count}
                                    </div>
                                  )}
                                </div>
                              </figure>
                            </Link>
                          </div>
                        </Tippy>
                      </div>
                    ))}
                  </div>
                  {quest.rewardsChoice.length > 5 && (
                    <div>{quest.rewardsChoice.length - 5} other items</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {pageInfo && (
        <div className="field is-grouped is-pulled-right">
          {pageInfo.hasPreviousPage && (
            <Button
              color="info"
              size="small"
              onClick={() => {
                refetch({
                  first: undefined,
                  after: undefined,
                  last: perPage,
                  before: pageInfo.startCursor,
                });
              }}
            >
              {t('common:prevPage')}
              <i className="fas fa-circle-chevron-left ml-1" />
            </Button>
          )}
          {pageInfo.hasNextPage && (
            <Button
              color="info"
              size="small"
              onClick={() => {
                refetch({
                  first: perPage,
                  after: pageInfo.endCursor,
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
      )}
    </Container>
  );
}
