// A handful of "instances" in the API are actually just a single wing/boss
// of a larger dungeon that got modeled as its own separate instance record
// (e.g. Bastion Stair's four named bosses each have their own instance ID
// with a single encounter, on top of Bastion Stair's own 16). Players think
// of these as one dungeon, so the site groups them into one entry backed by
// several underlying instance IDs, queried together via `instanceId: {in:
// [...]}`. Groups with only one instanceId behave exactly like a plain
// instance.
export interface InstanceGroup {
  // The canonical instance ID used in URLs (/instance/:id, /instance-statistics/:id)
  // for this group - always the "main" instance of the dungeon.
  id: number;
  instanceIds: number[];
  name: string;
}

export const INSTANCE_GROUPS: InstanceGroup[] = [
  { id: 260, instanceIds: [260], name: 'Lost Vale' },
  { id: 176, instanceIds: [176], name: 'Sigmar Crypts' },
  { id: 196, instanceIds: [196], name: 'Bilerot' },
  {
    id: 160,
    instanceIds: [160, 163, 164, 165, 166],
    name: 'Bastion Stair',
  },
  { id: 60, instanceIds: [60, 63, 64, 65, 66], name: 'Gunbad' },
  { id: 36, instanceIds: [36], name: 'Dragonback Pass Order' },
  { id: 37, instanceIds: [37], name: 'Dragonback Pass Destro' },
  { id: 152, instanceIds: [152, 153, 169], name: 'Altdorf Sewers' },
  { id: 155, instanceIds: [155, 156, 173], name: 'Sacellum' },
  { id: 50, instanceIds: [50], name: "Hunter's Vale" },
];

export const getInstanceGroupById = (
  id: number,
): InstanceGroup | undefined =>
  INSTANCE_GROUPS.find((group) => group.instanceIds.includes(id));

// Falls back to a single-instance "group" for any instance ID the API
// returns that isn't in the curated list above, so nothing silently
// disappears if a new instance gets added upstream.
export const getInstanceGroupByIdOrFallback = (
  id: number,
  fallbackName?: string,
): InstanceGroup =>
  getInstanceGroupById(id) ?? {
    id,
    instanceIds: [id],
    name: fallbackName ?? `#${id}`,
  };
