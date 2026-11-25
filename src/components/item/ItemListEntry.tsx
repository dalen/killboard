import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ItemIconWithPopup } from '@/components/item/ItemIconWithPopup';
import { itemNameClass } from '@/itemUtils';
import type {
  GetItemListSourcesQuery,
  ItemListEntryFragment,
} from '@/__generated__/graphql';

type ItemSources = NonNullable<
  NonNullable<GetItemListSourcesQuery['items']>['nodes']
>[number];

export const ItemListEntry = ({
  item,
  sources,
}: {
  item: ItemListEntryFragment;
  sources?: ItemSources | null;
}): ReactElement => {
  const { t } = useTranslation(['enums', 'pages']);
  const allStats = item.stats
    .map((stat) => `${stat.value} ${t(`enums:stat.${stat.stat}`)}`)
    .join(' · ');
  const stats = item.stats
    .slice(0, 2)
    .map((stat) => `${stat.value} ${t(`enums:stat.${stat.stat}`)}`)
    .join(' · ');

  return (
    <tr>
      <td className="is-hidden-touch">
        <ItemIconWithPopup item={item} />
      </td>
      <td>
        <Link to={`/item/${item.id}`}>
          <div className={`${itemNameClass(item)} has-text-weight-semibold`}>
            {item.name}
          </div>
        </Link>
        {(Boolean(sources?.rewardedFromQuests?.totalCount) ||
          Boolean(sources?.rewardedFromChapters?.totalCount)) && (
          <div
            className="item-list-sources"
            aria-label={t('pages:items.sources')}
          >
            {sources.rewardedFromQuests?.totalCount ? (
              <span>
                <span className="item-list-source-label">
                  {t('pages:items.questSource')}:
                </span>{' '}
                {sources.rewardedFromQuests.nodes?.map((quest, index) => (
                  <span key={quest.id}>
                    {index > 0 && ', '}
                    <Link to={`/quest/${quest.id}`}>{quest.name}</Link>
                  </span>
                ))}
                {sources.rewardedFromQuests.totalCount >
                  (sources.rewardedFromQuests.nodes?.length ?? 0) && (
                  <Link
                    className="ml-1"
                    to={`/item/${item.id}/quests`}
                    aria-label={t('pages:items.moreQuestSources', {
                      count:
                        sources.rewardedFromQuests.totalCount -
                        (sources.rewardedFromQuests.nodes?.length ?? 0),
                    })}
                  >
                    +
                    {sources.rewardedFromQuests.totalCount -
                      (sources.rewardedFromQuests.nodes?.length ?? 0)}
                  </Link>
                )}
              </span>
            ) : null}
            {sources.rewardedFromChapters?.totalCount ? (
              <span>
                <span className="item-list-source-label">
                  {t('pages:items.influenceSource')}:
                </span>{' '}
                {sources.rewardedFromChapters.nodes?.map((chapter, index) => (
                  <span key={chapter.id}>
                    {index > 0 && ', '}
                    <Link
                      to={`/item/${item.id}/chapters#chapter-${chapter.id}`}
                    >
                      {chapter.name ||
                        t('pages:itemSources.chapterWithoutName', {
                          chapterId: chapter.id,
                        })}
                    </Link>
                  </span>
                ))}
                {sources.rewardedFromChapters.totalCount >
                  (sources.rewardedFromChapters.nodes?.length ?? 0) && (
                  <Link
                    className="ml-1"
                    to={`/item/${item.id}/chapters`}
                    aria-label={t('pages:items.moreInfluenceSources', {
                      count:
                        sources.rewardedFromChapters.totalCount -
                        (sources.rewardedFromChapters.nodes?.length ?? 0),
                    })}
                  >
                    +
                    {sources.rewardedFromChapters.totalCount -
                      (sources.rewardedFromChapters.nodes?.length ?? 0)}
                  </Link>
                )}
              </span>
            ) : null}
          </div>
        )}
      </td>
      <td className="is-hidden-touch">{t(`enums:itemType.${item.type}`)}</td>
      <td className="is-hidden-touch">{t(`enums:itemSlot.${item.slot}`)}</td>
      <td>
        <span className={itemNameClass({ rarity: item.rarity })}>
          {t(`enums:itemRarity.${item.rarity}`)}
        </span>
      </td>
      <td>{item.levelRequirement || 0}</td>
      <td>{item.renownRankRequirement || 0}</td>
      <td>{item.itemLevel || 0}</td>
      <td className="is-hidden-touch" title={allStats}>
        {stats || 0}
        {item.stats.length > 2 && ` +${item.stats.length - 2}`}
      </td>
    </tr>
  );
};
