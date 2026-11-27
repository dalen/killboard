import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useLayoutEffect, useRef, useState, type ReactElement } from 'react';
import { Link } from 'react-router';
import type { GetCharacterArmoryQuery } from '@/__generated__/graphql';
import { EquipSlot, Stat } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { EQUIPPED_ITEM_FRAGMENT } from '@/components/character/CharacterItem';
import { CharacterItemPopup } from '@/components/character/CharacterItemPopup';
import { WarhammerScrollPane } from '@/components/global/WarhammerScrollPane';
import { itemNameClass } from '@/itemUtils';
import './CharacterArmory.scss';

type EquippedRecord = NonNullable<GetCharacterArmoryQuery['character']>['items'][number];
type ItemSetBonuses = NonNullable<EquippedRecord['item']['itemSet']>['bonuses'];

const CORE_STAT_ROWS: [Stat, Stat][] = [
  [Stat.Strength, Stat.WeaponSkill],
  [Stat.BallisticSkill, Stat.Initiative],
  [Stat.Intelligence, Stat.Willpower],
  [Stat.Toughness, Stat.Wounds],
];
const CORE_STATS = new Set(CORE_STAT_ROWS.flat());

const formatGearStat = (total: { flat: number; percent: number }): string => {
  const flat = total.flat ? `${total.flat > 0 ? '+' : ''}${total.flat}` : '';
  const percent = total.percent
    ? `${total.percent > 0 ? '+' : ''}${total.percent}%`
    : '';
  return [flat, percent].filter(Boolean).join(' · ');
};

type ArmorySlotDefinition = { slot: EquipSlot; emptyIcon: string };
const EMPTY_SLOT_ICON: Partial<Record<EquipSlot, string>> = {
  [EquipSlot.Event]: 'ge_accessory',
  [EquipSlot.Helm]: 'ge_helm',
  [EquipSlot.Shoulder]: 'ge_shoulders',
  [EquipSlot.Back]: 'ge_back',
  [EquipSlot.Body]: 'ge_body',
  [EquipSlot.Gloves]: 'ge_gloves',
  [EquipSlot.Belt]: 'ge_belt',
  [EquipSlot.Boots]: 'ge_boots',
  [EquipSlot.Jewellery1]: 'ge_accessory',
  [EquipSlot.Jewellery2]: 'ge_accessory',
  [EquipSlot.Jewellery3]: 'ge_accessory',
  [EquipSlot.Jewellery4]: 'ge_accessory',
  [EquipSlot.Trophy1]: 'ge_trophy',
  [EquipSlot.Trophy2]: 'ge_trophy',
  [EquipSlot.Trophy3]: 'ge_trophy',
  [EquipSlot.Trophy4]: 'ge_trophy',
  [EquipSlot.Trophy5]: 'ge_trophy',
  [EquipSlot.Pocket1]: 'ge_pocket',
  [EquipSlot.Pocket2]: 'ge_pocket',
  [EquipSlot.MainHand]: 'ge_righthand',
  [EquipSlot.Standard]: 'ge_banner',
  [EquipSlot.OffHand]: 'ge_lefthand',
  [EquipSlot.RangedWeapon]: 'ge_range',
};
const slotDefinition = (slot: EquipSlot): ArmorySlotDefinition => ({
  slot,
  emptyIcon: EMPTY_SLOT_ICON[slot] ?? 'ge_accessory',
});

const LEFT_SLOT_GROUPS: { title: string; slots: ArmorySlotDefinition[] }[] = [
  { title: 'eventItem', slots: [slotDefinition(EquipSlot.Event)] },
  {
    title: 'armor',
    slots: [
      EquipSlot.Helm,
      EquipSlot.Shoulder,
      EquipSlot.Back,
      EquipSlot.Body,
      EquipSlot.Gloves,
      EquipSlot.Belt,
      EquipSlot.Boots,
    ].map(slotDefinition),
  },
];

const RIGHT_SLOT_GROUPS: { title: string; slots: ArmorySlotDefinition[] }[] = [
  {
    title: 'jewellery',
    slots: [
      EquipSlot.Jewellery1,
      EquipSlot.Jewellery2,
      EquipSlot.Jewellery3,
      EquipSlot.Jewellery4,
    ].map(slotDefinition),
  },
  {
    title: 'trophies',
    slots: [
      EquipSlot.Trophy1,
      EquipSlot.Trophy2,
      EquipSlot.Trophy3,
      EquipSlot.Trophy4,
      EquipSlot.Trophy5,
    ].map(slotDefinition),
  },
];

const WEAPON_SLOTS: ArmorySlotDefinition[] = [
  EquipSlot.MainHand,
  EquipSlot.Standard,
  EquipSlot.OffHand,
  EquipSlot.RangedWeapon,
].map(slotDefinition);

const POCKET_SLOTS: ArmorySlotDefinition[] = [
  EquipSlot.Pocket1,
  EquipSlot.Pocket2,
].map(slotDefinition);

const ArmorySlot = ({
  definition,
  entry,
  label,
  items,
  side = 'left',
}: {
  definition: ArmorySlotDefinition;
  entry: EquippedRecord | undefined;
  label: string;
  items: EquippedRecord[];
  side?: 'left' | 'right' | 'bottom';
}): ReactElement => {
  const [popupOpen, setPopupOpen] = useState(false);
  const popupCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [popupPosition, setPopupPosition] = useState({
    left: 8,
    top: 8,
    width: 320,
    maxHeight: 480,
  });
  const iconRef = useRef<HTMLImageElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const itemName = entry?.item.name;
  const slotName = itemName ? `${label}: ${itemName}` : `${label} (empty)`;
  const icon = entry?.item.iconUrl ?? `/gear-preview/ui/empty/${definition.emptyIcon}.png`;
  const showPopup = (): void => {
    if (popupCloseTimer.current) clearTimeout(popupCloseTimer.current);
    popupCloseTimer.current = null;
    setPopupOpen(Boolean(entry));
  };
  const hidePopupSoon = (): void => {
    if (popupCloseTimer.current) clearTimeout(popupCloseTimer.current);
    popupCloseTimer.current = setTimeout(() => {
      setPopupOpen(false);
      popupCloseTimer.current = null;
    }, 180);
  };

  useEffect(() => () => {
    if (popupCloseTimer.current) clearTimeout(popupCloseTimer.current);
  }, []);

  useLayoutEffect(() => {
    if (!popupOpen || !iconRef.current || !popupRef.current) return;
    const slotRect = iconRef.current.getBoundingClientRect();
    const popupRect = popupRef.current.getBoundingClientRect();
    const margin = 8;
    const gap = 8;
    let width = Math.min(360, window.innerWidth - margin * 2);
    const rightSpace = window.innerWidth - slotRect.right - gap - margin;
    const leftSpace = slotRect.left - gap - margin;
    let left: number;
    if (rightSpace >= width) {
      left = slotRect.right + gap;
    } else if (leftSpace >= width) {
      left = slotRect.left - width - gap;
    } else if (rightSpace >= leftSpace) {
      width = Math.max(120, rightSpace);
      left = slotRect.right + gap;
    } else {
      width = Math.max(120, leftSpace);
      left = slotRect.left - width - gap;
    }
    left = Math.max(margin, Math.min(left, window.innerWidth - width - margin));
    const maxHeight = window.innerHeight - margin * 2;
    const visibleHeight = Math.min(popupRect.height, maxHeight);
    const top = Math.max(
      margin,
      Math.min(slotRect.top, window.innerHeight - visibleHeight - margin),
    );
    setPopupPosition({ left, top, width, maxHeight });
  }, [popupOpen, popupPosition.width]);

  return (
    <div
      className={`character-armory-slot character-armory-slot-${side}`}
      title={slotName}
      onMouseEnter={showPopup}
      onMouseLeave={hidePopupSoon}
      onFocus={showPopup}
      onBlur={hidePopupSoon}
    >
      {entry ? (
        <Link className="character-armory-slot-frame is-equipped" to={`/item/${entry.item.id}`} aria-label={slotName}>
          <img ref={iconRef} src={icon} alt={slotName} loading="lazy" decoding="async" />
        </Link>
      ) : (
        <div className="character-armory-slot-frame is-empty" aria-label={slotName}>
          <img ref={iconRef} src={icon} alt={slotName} loading="lazy" decoding="async" />
        </div>
      )}
      <div className="character-armory-slot-copy">
        <span className="character-armory-slot-label">{label}</span>
        {entry && (
          <Link className={`character-armory-slot-name ${itemNameClass(entry.item)}`} to={`/item/${entry.item.id}`}>
            {entry.item.name}
          </Link>
        )}
      </div>
      {entry && popupOpen && (
        <CharacterItemPopup
          item={entry.item}
          talismans={entry.talismans}
          itemsEquipped={items}
          popupClassName="popup character-armory-slot-popup"
          popupRef={popupRef}
          popupPosition={popupPosition}
          onMouseEnter={showPopup}
          onMouseLeave={hidePopupSoon}
        />
      )}
    </div>
  );
};

const CHARACTER_ARMORY = gql`
  query GetCharacterArmory($id: ID!) {
    character(id: $id) {
      items {
        ...EquippedCharacterItem
      }
    }
  }

  ${EQUIPPED_ITEM_FRAGMENT}
`;

export const CharacterArmory = ({ id }: { id: number }): ReactElement => {
  const { t } = useTranslation(['components', 'pages', 'enums']);
  const { loading, error, data } = useQuery<GetCharacterArmoryQuery>(
    CHARACTER_ARMORY,
    {
      variables: {
        id,
      },
    },
  );

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  if (data?.character === null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const character = data && data.character;
  const items = character ? character.items : [];
  const gearStats = new Map<Stat, { flat: number; percent: number }>();
  const addStat = (stat: Stat, value: number, percentage: boolean): void => {
    const total = gearStats.get(stat) ?? { flat: 0, percent: 0 };
    if (percentage) total.percent += value;
    else total.flat += value;
    gearStats.set(stat, total);
  };
  for (const { item, talismans } of items) {
    for (const stat of item.stats) addStat(stat.stat, stat.value, stat.percentage);
    for (const talisman of talismans) {
      for (const stat of talisman.stats) addStat(stat.stat, stat.value, stat.percentage);
    }
  }
  const itemSets = new Map<string, { count: number; bonuses: ItemSetBonuses }>();
  for (const { item } of items) {
    if (item.itemSet) {
      const current = itemSets.get(item.itemSet.id);
      itemSets.set(item.itemSet.id, {
        count: (current?.count ?? 0) + 1,
        bonuses: item.itemSet.bonuses,
      });
    }
  }
  for (const set of itemSets.values()) {
    for (const bonus of set.bonuses) {
      if (bonus.bonus.__typename === 'ItemStat' && set.count >= bonus.itemsRequired) {
        addStat(bonus.bonus.stat, bonus.bonus.value, bonus.bonus.percentage);
      }
    }
  }
  const sortedGearStats = [...gearStats.entries()].sort(([a], [b]) => a.localeCompare(b));
  const otherGearStats = sortedGearStats.filter(([stat]) => !CORE_STATS.has(stat));
  const equippedBySlot = new Map(items.map((item) => [item.equipSlot, item]));

  return (
    <section className="character-armory-paperdoll">
      <div className="character-armory-paperdoll-main">
        <aside className="character-armory-side character-armory-side-left">
          {LEFT_SLOT_GROUPS.map((group) => (
            <section className="character-armory-slot-group" key={group.title}>
              <h3>{t(`pages:characterPage.armorySection.${group.title}`)}</h3>
              <div className="character-armory-slot-stack">
                {group.slots.map((definition) => (
                  <ArmorySlot
                    key={definition.slot}
                    definition={definition}
                    entry={equippedBySlot.get(definition.slot)}
                    label={definition.slot === EquipSlot.Event
                      ? t('pages:characterPage.armorySlot.event')
                      : t(`enums:itemSlot.${definition.slot}`)}
                    items={items}
                    side="left"
                  />
                ))}
              </div>
            </section>
          ))}
        </aside>

        <div className="character-armory-center">
          <WarhammerScrollPane
            className="character-armory-stats-window"
            viewportClassName="character-armory-stats-screen"
            ariaLabel={t('pages:characterPage.equippedGearBonuses')}
            scrollUpLabel={t('pages:characterPage.scrollUp')}
            scrollDownLabel={t('pages:characterPage.scrollDown')}
          >
            <h2>{t('pages:characterPage.equippedGearBonuses')}</h2>
            <p className="character-armory-stats-note">
              {t('pages:characterPage.gearBonusesNote')}
            </p>
            <div className="character-armory-primary-gear-stats">
              {CORE_STAT_ROWS.map(([left, right]) => (
                <div className="character-armory-primary-stat-row" key={`${left}-${right}`}>
                  {[left, right].map((stat) => (
                    <div className="character-armory-gear-stat" key={stat}>
                      <span>{t(`enums:stat.${stat}`)}</span>
                      <span>{formatGearStat(gearStats.get(stat) ?? { flat: 0, percent: 0 }) || '—'}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {otherGearStats.length > 0 && (
              <div className="character-armory-other-gear-stats">
                <h3>{t('pages:characterPage.otherGearBonuses', { count: otherGearStats.length })}</h3>
                <div className="character-armory-gear-stat-list">
                  {otherGearStats.map(([stat, total]) => (
                    <div className="character-armory-gear-stat" key={stat}>
                      <span>{t(`enums:stat.${stat}`)}</span>
                      <span>{formatGearStat(total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </WarhammerScrollPane>
        </div>

        <aside className="character-armory-side character-armory-side-right">
          {RIGHT_SLOT_GROUPS.map((group) => (
            <section className="character-armory-slot-group" key={group.title}>
              <h3>{t(`pages:characterPage.armorySection.${group.title}`)}</h3>
              <div className="character-armory-slot-stack">
                {group.slots.map((definition) => (
                  <ArmorySlot
                    key={definition.slot}
                    definition={definition}
                    entry={equippedBySlot.get(definition.slot)}
                    label={t(`enums:itemSlot.${definition.slot}`)}
                    items={items}
                    side="right"
                  />
                ))}
              </div>
            </section>
          ))}
        </aside>
      </div>

      <div className="character-armory-bottom">
        <section className="character-armory-bottom-group">
          <h3>{t('pages:characterPage.armorySection.weapons')}</h3>
          <div className="character-armory-bottom-slots">
            {WEAPON_SLOTS.map((definition) => (
              <ArmorySlot
                key={definition.slot}
                definition={definition}
                entry={equippedBySlot.get(definition.slot)}
                label={t(`enums:itemSlot.${definition.slot}`)}
                items={items}
                side="bottom"
              />
            ))}
          </div>
        </section>
        <section className="character-armory-bottom-group">
          <h3>{t('pages:characterPage.armorySection.pocket')}</h3>
          <div className="character-armory-bottom-slots">
            {POCKET_SLOTS.map((definition) => (
              <ArmorySlot
                key={definition.slot}
                definition={definition}
                entry={equippedBySlot.get(definition.slot)}
                label={t('pages:characterPage.armorySlot.pocket')}
                items={items}
                side="bottom"
              />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};
