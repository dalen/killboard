import { ChapterInfluenceRewardFragment } from '@/__generated__/graphql';
import { ITEM_FRAGMENT } from '@/components/item/ItemIconWithPopup';
import { ItemPopup } from '@/components/item/ItemPopup';
import { gql } from '@apollo/client';
import Tippy from '@tippyjs/react';
import { ReactElement } from 'react';
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
}: {
  rewards: ChapterInfluenceRewardFragment[];
  tier: number;
}): ReactElement {
  return (
    <div className="mb-2 is-flex">
      {rewards
        .filter((item) => item.tier === tier)
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
  );
}
