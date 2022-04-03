import React from 'react';
import { SortConfig, SortConfigDirection } from '../types';

export const useSortableData = (items: any, config: SortConfig | null = null) => {
  //@todo expand so it can deal with nested objects and sort by their properties
  const [sortConfig, setSortConfig] = React.useState(config);

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === SortConfigDirection.ascending ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === SortConfigDirection.ascending ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key: string) => {
    let direction = SortConfigDirection.ascending;
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === SortConfigDirection.ascending
    ) {
      direction = SortConfigDirection.descending;
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};