import { Breadcrumb, Card, Container, Progress } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import Tippy from '@tippyjs/react';
import { Query } from '../types';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { GoldPrice } from '../components/GoldPrice';
import { ItemPopup } from '../components/ItemPopup';
import { WarIcon } from '../components/WarIcon';

const QUEST_INFO = gql`
  query GetQuestInfo($id: ID!) {
    quest(id: $id) {
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
          careerRestriction
          description
          type
          slot
          rarity
          armor
          dps
          speed
          levelRequirement
          renownRankRequirement
          itemLevel
          talismanSlots
          itemSet {
            id
            name
            items {
              id
            }
            bonuses {
              itemsRequired
              bonus {
                ... on Ability {
                  description
                  __typename
                }
                ... on ItemStat {
                  stat
                  value
                  percentage
                  __typename
                }
              }
            }
          }
          buffs {
            id
            description
          }
          stats {
            stat
            value
          }
        }
      }
      rewardsGiven {
        count
        item {
          id
          iconUrl
          name
          careerRestriction
          description
          type
          slot
          rarity
          armor
          dps
          speed
          levelRequirement
          renownRankRequirement
          itemLevel
          talismanSlots
          itemSet {
            id
            name
            items {
              id
            }
            bonuses {
              itemsRequired
              bonus {
                ... on Ability {
                  description
                  __typename
                }
                ... on ItemStat {
                  stat
                  value
                  percentage
                  __typename
                }
              }
            }
          }
          buffs {
            id
            description
          }
          stats {
            stat
            value
          }
        }
      }
      description
      raceRestriction
      careerRestriction
      minLevel
      maxLevel
      minRenown
      maxRenown
    }
  }
`;

export function Quest(): JSX.Element {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();
  const { loading, error, data } = useQuery<Query>(QUEST_INFO, {
    variables: {
      id,
    },
  });

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  if (data?.quest == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const { quest } = data;

  return (
    <Container max breakpoint="widescreen" mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/quests">{t('common:quests')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <div className="ml-2">
            {t('pages:quest.questId', { questId: id })}
          </div>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card mb={5}>
        <Card.Content>
          <div className="is-size-3 is-family-secondary has-text-info">
            {quest.name}
          </div>
          <div className="mb-2">{quest.description}</div>

          <div className="is-size-4 is-family-secondary has-text-info">
            {t('pages:quest.rewards')}
          </div>

          <div className="mb-2 is-flex">
            {quest.xp > 0 && (
              <div>
                <Tippy
                  duration={0}
                  placement="right"
                  content={
                    <div className="tooltip-popup">
                      <div className="is-size-5 is-family-secondary has-text-info">
                        {t('pages:quest.xp')}
                      </div>
                      <div>{quest.xp}</div>
                    </div>
                  }
                >
                  <div>
                    <WarIcon icon={35} size={48} alt={t('pages:quest.money')} />
                  </div>
                </Tippy>
              </div>
            )}
            {quest.gold > 0 && (
              <div>
                <Tippy
                  duration={0}
                  placement="right"
                  content={
                    <div className="tooltip-popup">
                      <div className="is-size-5 is-family-secondary has-text-info">
                        {t('pages:quest.money')}
                      </div>
                      <div>
                        <GoldPrice price={quest.gold} />
                      </div>
                    </div>
                  }
                >
                  <div>
                    <WarIcon icon={34} size={48} alt={t('pages:quest.money')} />
                  </div>
                </Tippy>
              </div>
            )}
            {quest.rewardsGiven.map((reward) => (
              <div key={`${quest.id}-${reward.item.id}`}>
                <Tippy
                  duration={0}
                  placement="top"
                  content={<ItemPopup itemId={reward.item.id} />}
                >
                  <div>
                    <Link to={`/item/${reward.item.id}`}>
                      <figure className="image is-48x48">
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
                              className="has-text-weight-bold s-1"
                              style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
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

          {quest.choiceCount > 0 && quest.rewardsChoice.length > 0 && (
            <>
              <div className="mb-2 is-size-4 is-family-secondary has-text-info">
                {t('pages:quest.choiceCount', { count: quest.choiceCount })}
              </div>

              <div className="mb-2 is-flex">
                {quest.rewardsChoice.map((reward) => (
                  <div key={`${quest.id}-${reward.item.id}`}>
                    <Tippy
                      duration={0}
                      placement="top"
                      content={<ItemPopup itemId={reward.item.id} />}
                    >
                      <div>
                        <Link to={`/item/${reward.item.id}`}>
                          <figure className="image is-48x48">
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
                                    right: 6,
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
            </>
          )}
        </Card.Content>
      </Card>
    </Container>
  );
}
