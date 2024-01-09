import {
  Breadcrumb,
  Card,
  Columns,
  Container,
  Progress,
} from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import Tippy from '@tippyjs/react';
import { Query } from '../types';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { GoldPrice } from '../components/GoldPrice';
import { ItemPopup } from '../components/ItemPopup';

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
          {t('pages:quest.questId', { questId: id })}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card mb={5}>
        <Card.Content>
          <div className="is-size-3 is-family-secondary has-text-info">
            {quest.name}
          </div>
          <div className="mb-2">{quest.description}</div>

          <div className="mb-2">
            <GoldPrice price={quest.gold} />
          </div>

          {quest.rewardsGiven.length > 0 && (
            <>
              <div className="is-size-4 is-family-secondary has-text-info">
                {t('pages:quest.given')}
              </div>
              <Columns>
                {quest.rewardsGiven.map((reward) => (
                  <Columns.Column key={reward.item.id} size="one-quarter">
                    <div key={`${quest.id}-${reward.item.id}`}>
                      <Tippy
                        duration={0}
                        placement="top"
                        content={<ItemPopup itemId={reward.item.id} />}
                      >
                        <span className="icon-text">
                          <figure className="image is-24x24 mx-1">
                            <img src={reward.item.iconUrl} alt="Item Icon" />
                          </figure>
                          <Link to={`/item/${reward.item.id}`} className="mr-1">
                            {reward.item.name}
                          </Link>
                          x{reward.count}
                        </span>
                      </Tippy>
                    </div>
                  </Columns.Column>
                ))}
              </Columns>
            </>
          )}
          {quest.rewardsChoice.length > 0 && (
            <>
              <div className="is-size-4 is-family-secondary has-text-info">
                {t('pages:quest.choice')}
              </div>
              {quest.choiceCount > 0 && (
                <div className="mb-2">Pick {quest.choiceCount}</div>
              )}
              <Columns>
                {quest.rewardsChoice.map((reward) => (
                  <Columns.Column key={reward.item.id} size="one-quarter">
                    <div key={`${quest.id}-${reward.item.id}`}>
                      <Tippy
                        duration={0}
                        placement="top"
                        content={<ItemPopup itemId={reward.item.id} />}
                      >
                        <span className="icon-text">
                          <figure className="image is-24x24 mx-1">
                            <img src={reward.item.iconUrl} alt="Item Icon" />
                          </figure>
                          <Link to={`/item/${reward.item.id}`} className="mr-1">
                            {reward.item.name}
                          </Link>
                          x{reward.count}
                        </span>
                      </Tippy>
                    </div>
                  </Columns.Column>
                ))}
              </Columns>
            </>
          )}
        </Card.Content>
      </Card>
    </Container>
  );
}
