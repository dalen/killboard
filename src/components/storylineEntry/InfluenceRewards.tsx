import type {
  Career,
  ChapterInfluenceRewardFragment,
} from '@/__generated__/graphql';
import { ITEM_FRAGMENT } from '@/components/item/ItemIconWithPopup';
import { ItemPopup } from '@/components/item/ItemPopup';
import { canUseItem } from '@/itemUtils';
import { gql } from '@apollo/client';
import Tippy from '@tippyjs/react';
import type { ReactElement } from 'react';
import { Link } from 'react-router';

export const INFLUENCE_REWARDS_FRAGMENT = gql`
  fragment ChapterInfluenceReward on ChapterInfluenceReward {
    count
    tier
    item {
      ...ItemListEntry
    }
  }

  ${ITEM_FRAGMENT}
`;

export function InfluenceRewards({
  rewards,
  tier,
  career = null,
}: {
  rewards: ChapterInfluenceRewardFragment[];
  tier: number;
  career?: Career | null;
}): ReactElement {
  return (
    <div className="mb-2 is-flex is-flex-direction-row is-flex-wrap-wrap">
      {rewards
        .filter((item) => item.tier === tier)
        .filter((item) => career === null || canUseItem(item.item, career))
        .map((reward) => (
          <div key={reward.item.id}>
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
            </Tippy>
          </div>
        ))}
    </div>
  );
}
