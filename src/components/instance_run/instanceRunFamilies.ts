export const INSTANCE_RUN_FAMILIES = [
  { key: 'gunbad', name: 'Gunbad', ids: ['60', '65', '66'] },
  { key: 'altdorf-sewers', name: 'Altdorf Sewers', ids: ['152', '153', '169'] },
  { key: 'sacellum', name: 'Sacellum', ids: ['155', '156', '173'] },
  {
    key: 'bastion-stair',
    name: 'Bastion Stair',
    ids: ['160', '163', '164', '165', '166'],
  },
] as const;

export const getInstanceRunFamily = (instanceId: string | number) => {
  const value = String(instanceId);
  return INSTANCE_RUN_FAMILIES.find(
    (family) => family.key === value || family.ids.some((id) => id === value),
  );
};

export const isLostValeComplete = (
  instanceId: string | number,
  encounters: ReadonlyArray<{
    completed: boolean;
    encounter?: { name?: string | null } | null;
  }>,
) =>
  String(instanceId) === '260' &&
  encounters.some(
    (encounter) =>
      encounter.completed &&
      (encounter.encounter?.name ?? '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .includes('nkari'),
  );
