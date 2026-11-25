import { useTranslation } from 'react-i18next';
import { Link, useParams, useSearchParams } from 'react-router';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import Tippy from '@tippyjs/react';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { GoldPrice } from '@/components/GoldPrice';
import { ItemPopupTrigger } from '@/components/item/ItemPopupTrigger';
import { WarIcon } from '@/components/WarIcon';
import type { ReactElement } from 'react';
import { Career, type GetQuestInfoQuery, Realm } from '@/__generated__/graphql';
import { canUseItem } from '@/itemUtils';

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
          careerRestriction
          raceRestriction
          type
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

export const Quest = (): ReactElement => {
  const { t } = useTranslation(['common', 'pages', 'enums']);
  const { id } = useParams();
  const [search, setSearch] = useSearchParams();
  const { loading, error, data } = useQuery<GetQuestInfoQuery>(QUEST_INFO, {
    variables: {
      id,
    },
  });

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  if (data?.quest == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const { quest } = data;
  const selectedCareer = search.get('career');
  const career = Object.values(Career).includes(selectedCareer as Career)
    ? (selectedCareer as Career)
    : null;

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li>
            <Link to="/quests">{t('common:quests')}</Link>
          </li>
          <li className="is-active">
            <div className="ml-2">
              {quest.name || t('pages:quest.questId', { questId: id })}
            </div>
          </li>
        </ul>
      </nav>

      <div className="card mb-5">
        <div className="card-content">
          <div className="is-size-3 is-family-secondary has-text-info">
            {quest.name}
          </div>
          <div className="mb-2">
            {quest.description?.replace('|n', 'Player').replace('|c', 'Career')}
          </div>

          {quest.journalEntry && (
            <>
              <div className="columns is-centered">
                <div className="column is-4">
                  <figure>
                    <hr />
                  </figure>
                </div>
              </div>
              <div className="mb-2">
                {quest.journalEntry
                  .replace('|n', 'Player')
                  .replace('|c', 'Career')}
              </div>
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
                  {objective.description
                    .replace('|n', 'Player')
                    .replace('|c', 'Career')}
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
                <ItemPopupTrigger
                  itemId={reward.item.id}
                  placement="top"
                >
                  <div>
                    <Link to={`/item/${reward.item.id}`}>
                      <figure className="image is-48x48">
                        <div style={{ position: 'relative' }}>
                          <img
                            style={{
                              left: 0,
                              position: 'absolute',
                              top: 0,
                            }}
                            src={reward.item.iconUrl}
                            alt={reward.item.name}
                          />
                          {reward.count > 1 && (
                            <div
                              className="has-text-white"
                              style={{
                                position: 'absolute',
                                right: 6,
                                top: 0,
                              }}
                            >
                              {reward.count}
                            </div>
                          )}
                        </div>
                      </figure>
                    </Link>
                  </div>
                </ItemPopupTrigger>
              </div>
            ))}
          </div>

          {quest.choiceCount > 0 && quest.rewardsChoice.length > 0 && (
            <>
              <div className="columns is-vcentered is-multiline mb-1">
                <div className="column is-12-mobile is-6-tablet">
                  <div className="is-size-4 is-family-secondary has-text-info">
                    {t('pages:quest.choiceCount', {
                      count: quest.choiceCount,
                    })}
                  </div>
                </div>
                {quest.rewardsChoice.some(
                  (reward) => reward.item.careerRestriction.length > 0,
                ) && (
                  <div className="column is-12-mobile is-6-tablet">
                    <div className="field">
                      <label className="label" htmlFor="quest-career-select">
                        {t('pages:quest.careerFilter')}
                      </label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select
                            id="quest-career-select"
                            value={career ?? 'all'}
                            onChange={(event) => {
                              const nextSearch = new URLSearchParams(search);
                              if (event.target.value === 'all') {
                                nextSearch.delete('career');
                              } else {
                                nextSearch.set('career', event.target.value);
                              }
                              setSearch(nextSearch);
                            }}
                          >
                            <option value="all">
                              {t('pages:quest.allCareers')}
                            </option>
                            {Object.values(Career).map((careerOption) => (
                              <option key={careerOption} value={careerOption}>
                                {t(`enums:career.${careerOption}`)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-2 is-flex is-flex-wrap-wrap">
                {quest.rewardsChoice
                  .filter(
                    (reward) =>
                      career === null || canUseItem(reward.item, career),
                  )
                  .map((reward) => (
                    <div key={`${quest.id}-${reward.item.id}`}>
                      <ItemPopupTrigger
                        itemId={reward.item.id}
                        placement="top"
                      >
                        <div>
                          <Link to={`/item/${reward.item.id}`}>
                            <figure className="image is-48x48">
                              <div style={{ position: 'relative' }}>
                                <img
                                  style={{
                                    left: 0,
                                    position: 'absolute',
                                    top: 0,
                                  }}
                                  src={reward.item.iconUrl}
                                  alt={reward.item.name}
                                />
                                {reward.count > 1 && (
                                  <div
                                    className="has-text-white"
                                    style={{
                                      position: 'absolute',
                                      right: 6,
                                      top: 0,
                                    }}
                                  >
                                    {reward.count}
                                  </div>
                                )}
                              </div>
                            </figure>
                          </Link>
                        </div>
                      </ItemPopupTrigger>
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
                  {creature.realm === Realm.Order && (
                    <img
                      src="/images/icons/scenario/order.png"
                      width={24}
                      height={24}
                      alt={t('comon:realmOrder')}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
