import { Breadcrumb, Card, Container, Progress } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { gql, useQuery } from '@apollo/client';
import Tippy from '@tippyjs/react';
import { Query } from '../types';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { GoldPrice } from '../components/GoldPrice';
import { ItemPopup } from '../components/ItemPopup';
import { WarIcon } from '../components/WarIcon';
import { ReactElement } from 'react';

const QUEST_INFO = gql`
  query GetQuestInfo($id: ID!) {
    quest(id: $id) {
      id
      name
      type {
        isGroup
        isTravel
        isTome
        isRvR
        isPlayerKill
        isEpic
      }
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
      description
      objectives {
        description
        count
      }
      journalEntry
      raceRestriction
      careerRestriction
      minLevel
      maxLevel
      minRenown
      maxRenown
      starterCreatures {
        id
        name
        realm
      }
    }
  }
`;

export function Quest(): ReactElement {
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

          {quest.journalEntry && (
            <>
              <div className="columns is-centered">
                <div className="column is-one-third">
                  <figure>
                    <hr />
                  </figure>
                </div>
              </div>
              <div className="mb-2">{quest.journalEntry}</div>
            </>
          )}

          <div className="is-size-4 is-family-secondary has-text-info">
            {t('pages:quest.objectives')}
          </div>

          <div className="mb-3">
            {quest.objectives.map((objective) => (
              <div className="icon-text">
                <span className="icon has-text-info">
                  <img
                    src="/images/icons/quest_blue.png"
                    alt="Quest Objective"
                  />
                </span>
                <span>
                  {objective.description}
                  {objective.count > 1 && <span> 0 of {objective.count}</span>}
                </span>
              </div>
            ))}
          </div>

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

          {quest.choiceCount > 0 && quest.rewardsChoice.length > 0 && (
            <>
              <div className="is-size-4 is-family-secondary has-text-info">
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

          <div className="is-size-4 is-family-secondary has-text-info">
            {t('pages:quest.questGivers')}
          </div>
          <div>
            {quest.starterCreatures.map((creature) => (
              <div className="icon-text">
                <span className="icon has-text-info">
                  {creature.realm === 'ORDER' && (
                    <img
                      src="/images/icons/scenario/order.png"
                      width={24}
                      height={24}
                      alt={t('comon:realmOrder')}
                    />
                  )}
                  {creature.realm === 'DESTRUCTION' && (
                    <img
                      src="/images/icons/scenario/destruction.png"
                      width={24}
                      height={24}
                      alt={t('components:realmDestruction')}
                    />
                  )}
                  {creature.realm === 'NEUTRAL' && (
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
            ))}
          </div>
        </Card.Content>
      </Card>
    </Container>
  );
}
