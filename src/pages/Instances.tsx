import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import type {
  GetInstancesQuery,
  InstanceFilterInput,
} from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { QueryPagination } from '@/components/global/QueryPagination';
import { type ReactElement, useEffect, useState } from 'react';
import clsx from 'clsx';
import { getInstanceRunFamily } from '@/components/instance_run/instanceRunFamilies';

const INSTANCE_DISPLAY_FAMILIES = [
  {
    key: 'gunbad',
    name: 'Gunbad',
    ids: ['60', '65', '66'],
  },
  {
    key: 'altdorf-sewers',
    name: 'Altdorf Sewers',
    ids: ['152', '153', '169'],
  },
  { key: 'sacellum', name: 'Sacellum', ids: ['155', '156', '173'] },
  {
    key: 'bastion-stair',
    name: 'Bastion Stair',
    ids: ['160', '163', '164', '165', '166'],
  },
] as const;

const INSTANCE_DISPLAY_ORDER = [
  'instance-36',
  'instance-37',
  'altdorf-sewers',
  'sacellum',
  'instance-92',
  'instance-91',
  'gunbad',
  'instance-50',
  'instance-176',
  'instance-196',
  'bastion-stair',
  'instance-260',
];

const INSTANCE_DISPLAY_NAMES: Record<string, string> = {
  '36': 'Dragonback Pass (Order)',
  '37': 'Dragonback Pass (Destruction)',
};

type InstanceEntry = NonNullable<
  NonNullable<GetInstancesQuery['instances']>['nodes']
>[number];

type InstanceDisplayGroup = {
  key: string;
  name: string;
  entries: InstanceEntry[];
  family?: (typeof INSTANCE_DISPLAY_FAMILIES)[number];
};

const groupInstancesForDisplay = (
  entries: InstanceEntry[],
): InstanceDisplayGroup[] => {
  const entryById = new Map(entries.map((entry) => [entry.id, entry]));
  const consumedIds = new Set<string>();
  const groups: InstanceDisplayGroup[] = [];

  for (const family of INSTANCE_DISPLAY_FAMILIES) {
    const familyEntries = family.ids
      .map((id) => entryById.get(id))
      .filter((entry): entry is InstanceEntry => Boolean(entry));

    if (familyEntries.length < 2) continue;

    familyEntries.forEach((entry) => consumedIds.add(entry.id));
    groups.push({
      key: family.key,
      name: family.name,
      entries: familyEntries,
      family,
    });
  }

  for (const entry of entries) {
    if (consumedIds.has(entry.id)) continue;
    groups.push({
      key: `instance-${entry.id}`,
      name: entry.name,
      entries: [entry],
    });
  }

  return groups.sort((left, right) => {
    const leftOrder = INSTANCE_DISPLAY_ORDER.indexOf(left.key);
    const rightOrder = INSTANCE_DISPLAY_ORDER.indexOf(right.key);
    const leftRank = leftOrder === -1 ? Number.MAX_SAFE_INTEGER : leftOrder;
    const rightRank = rightOrder === -1 ? Number.MAX_SAFE_INTEGER : rightOrder;
    if (leftRank !== rightRank) return leftRank - rightRank;

    // Keep any additional instances after the curated progression in API order.
    return entries.indexOf(left.entries[0]) - entries.indexOf(right.entries[0]);
  });
};

const QUERY = gql`
  query GetInstances(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $where: InstanceFilterInput
  ) {
    instances(
      first: $first
      last: $last
      before: $before
      after: $after
      where: $where
    ) {
      nodes {
        id
        name
        zone {
          id
          name
        }
        encounters {
          id
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
  }
`;

const getInstanceNameFilter = (
  search: URLSearchParams,
): InstanceFilterInput => {
  const name = search.get('name');

  if (!name) {
    return {};
  }

  return { name: { contains: name } };
};

const getFilters = (search: URLSearchParams): InstanceFilterInput => ({
  ...getInstanceNameFilter(search),
});

export const Instances = (): ReactElement => {
  const [perPage, setPerPage] = useState(50);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(),
  );
  const [search, setSearch] = useSearchParams();
  const [draftName, setDraftName] = useState(search.get('name') ?? '');
  const { t } = useTranslation(['common', 'pages', 'enums']);
  const { loading, error, data, refetch } = useQuery<GetInstancesQuery>(QUERY, {
    variables: {
      first: perPage,
      where: getFilters(search),
    },
  });
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  useEffect(() => {
    setDraftName(search.get('name') ?? '');
  }, [search]);

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }
  if (data?.instances?.nodes == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const entries = data.instances.nodes.filter(
    (instance) => instance.id !== '63' && instance.id !== '64',
  );
  const { pageInfo } = data.instances;
  const displayGroups = groupInstancesForDisplay(entries);

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <Link to="/instances">{t('pages:home.showInstances')}</Link>
          </li>
        </ul>
      </nav>

      <div className="card mb-5">
        <div className="card-content">
          <div className="columns is-vcentered is-variable is-5">
            <div className="column is-4">
              <h1 className="is-size-3 is-family-secondary has-text-info mb-2">
                {t('pages:home.showInstances')}
              </h1>
              <p className="has-text-grey-light">
                {t('pages:instances.description')}
              </p>
            </div>
            <div className="column is-8">
              <div className="field mb-0">
                <label className="label" htmlFor="instances-search">
                  {t('pages:instances.search')}
                </label>
                <form
                  className="instance-list-search-actions"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const nextSearch = new URLSearchParams(search);
                    if (draftName.trim()) {
                      nextSearch.set('name', draftName.trim());
                    } else {
                      nextSearch.delete('name');
                    }
                    setSearch(nextSearch);
                  }}
                >
                  <input
                    className="input"
                    id="instances-search"
                    type="search"
                    placeholder={t('components:searchBox.placeholder')}
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                  />
                  <Link
                    to="/instance-runs"
                    className="instance-list-action-link instance-list-runs-link"
                  >
                    {t('pages:instanceRuns.title')}
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table
          className={clsx(
            'table',
            'instance-list-table',
            'is-striped',
            'is-hoverable',
            isMobile ? 'is-narrow' : 'is-fullwidth',
          )}
        >
          <thead>
            <tr>
              <th>{t('pages:instances.name')}</th>
              <th>{t('pages:instances.zone')}</th>
              <th>{t('pages:instances.encounters')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {displayGroups.flatMap((group) => {
              const expanded = expandedGroups.has(group.key);
              const familyIds = group.entries.map((entry) => entry.id);
              const encounterCount = new Set(
                group.entries.flatMap((entry) =>
                  (entry.encounters ?? [])
                    .map((encounter) => encounter?.id)
                    .filter((id): id is string => Boolean(id)),
                ),
              ).size;
              const zones = [
                ...new Set(
                  group.entries
                    .map((entry) => entry.zone?.name)
                    .filter((name): name is string => Boolean(name)),
                ),
              ];

              if (!group.family) {
                const instance = group.entries[0];
                return [
                  <tr key={group.key}>
                    <td>
                      <Link to={`/instance/${instance.id}`}>
                        {INSTANCE_DISPLAY_NAMES[instance.id] ?? instance.name}
                      </Link>
                    </td>
                    <td>{instance.zone?.name || '—'}</td>
                    <td>{instance.encounters?.length || 0}</td>
                    <td>
                      <div className="instance-list-actions">
                        <Link
                          to={`/instance-runs?instance=${instance.id}`}
                          className="instance-list-action-link"
                        >
                          {t('pages:instances.runs')}
                        </Link>
                        <Link
                          to={`/instance-statistics/${instance.id}`}
                          className="instance-list-action-link"
                        >
                          {t('pages:instances.statistics')}
                        </Link>
                      </div>
                    </td>
                  </tr>,
                ];
              }

              const runFamily = getInstanceRunFamily(familyIds[0]);

              return [
                <tr key={group.key}>
                  <td>
                    <strong>{group.name}</strong>
                  </td>
                  <td>
                    {zones.length === 1
                      ? zones[0]
                      : t('pages:instances.sectionCount', {
                          count: group.entries.length,
                        })}
                  </td>
                  <td>{encounterCount}</td>
                  <td>
                    <div className="instance-list-actions">
                      {runFamily && (
                        <Link
                          to={`/instance-runs?instance=${runFamily.key}`}
                          className="instance-list-action-link"
                        >
                          {t('pages:instances.runs')}
                        </Link>
                      )}
                      <button
                        type="button"
                        className="instance-list-sections-toggle"
                        aria-expanded={expanded}
                        onClick={() => {
                          setExpandedGroups((current) => {
                            const next = new Set(current);
                            if (next.has(group.key)) next.delete(group.key);
                            else next.add(group.key);
                            return next;
                          });
                        }}
                      >
                        {expanded
                          ? t('pages:instances.hideSections')
                          : t('pages:instances.sections', {
                              count: group.entries.length,
                            })}
                        <span aria-hidden="true" className="ml-1">
                          {expanded ? '⌃' : '⌄'}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>,
                ...(expanded
                  ? [
                      ...group.entries.map((instance) => (
                        <tr key={`${group.key}-${instance.id}`}>
                        <td className="pl-5">
                          <Link to={`/instance/${instance.id}`}>
                            {instance.name}
                          </Link>
                        </td>
                        <td>{instance.zone?.name || '—'}</td>
                        <td>{instance.encounters?.length || 0}</td>
                        <td>
                          <div className="instance-list-actions">
                            <Link
                              to={`/instance-runs?instance=${instance.id}`}
                              className="instance-list-action-link"
                            >
                              {t('pages:instances.runs')}
                            </Link>
                            <Link
                              to={`/instance-statistics/${instance.id}`}
                              className="instance-list-action-link"
                            >
                              {t('pages:instances.statistics')}
                            </Link>
                          </div>
                        </td>
                        </tr>
                      )),
                      <tr
                        key={`${group.key}-section-end`}
                        className="instance-list-section-end-divider"
                        aria-hidden="true"
                      >
                        <td colSpan={4}>
                          <span />
                        </td>
                      </tr>,
                    ]
                  : []),
              ];
            })}
          </tbody>
        </table>
      </div>
      <QueryPagination
        pageInfo={pageInfo}
        perPage={perPage}
        onPerPageChange={setPerPage}
        refetch={refetch}
      />
    </div>
  );
};
