import type { ReactElement } from 'react';
import type { Placement } from 'tippy.js';
import { HoverPopupTrigger } from '@/components/global/HoverPopupTrigger';
import { ItemPopup } from '@/components/item/ItemPopup';

export const ItemPopupTrigger = ({
  itemId,
  children,
  placement = 'top',
  offset,
}: {
  itemId: string;
  children: ReactElement;
  placement?: Placement;
  offset?: [number, number];
}): ReactElement => (
  <HoverPopupTrigger
    placement={placement}
    offset={offset}
    content={<ItemPopup itemId={itemId} />}
  >
    {children}
  </HoverPopupTrigger>
);
