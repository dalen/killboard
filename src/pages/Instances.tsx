import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';
import type { GetInstancesQuery } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { SearchBox } from '@/components/global/SearchBox';
import type { ReactElement } from 'react';
import { INSTANCE_GROUPS } from '@/utils/instanceGroups';

// There are only ~20 instances total (a handful of which get merged into
// single dungeon groups below), so the whole list fits in one request - no
// need for the pagination the site uses on genuinely large lists.
const MAX_INSTANCES = 50;

const QUERY = gql`
  query GetInstances($first: Int) {
    instances(first: $first) {
      nodes {
        id
        name
        encounters {
          id
        }
      }
    }
  }
`;

interface InstanceCard {
  encounterCount: number;
  id: number;
  name: string;
}

export const Instances = (): ReactElement => {
  const [search, setSearch] = useSearchParams();
  const { t } = useTranslation(['common', 'pages']);
  const { loading, error, data } = useQuery<GetInstancesQuery>(QUERY, {
    variables: { first: MAX_INSTANCES },
  });

  const nameFilter = (search.get('name') ?? '').toLowerCase();

  // Several "instances" the API returns are really just a single wing/boss
  // of a larger dungeon (see src/utils/instanceGroups.ts) - fold them into
  // one card per dungeon, with a de-duplicated encounter count across every
  // instance ID in the group.
  const cards = useMemo<InstanceCard[]>(() => {
    const instances = data?.instances?.nodes ?? [];
    const encounterIdsByInstanceId = new Map<number, string[]>();
    for (const instance of instances) {
      encounterIdsByInstanceId.set(
        Number(instance.id),
        (instance.encounters ?? [])
          .filter((encounter): encounter is { id: string } => encounter != null)
          .map((encounter) => encounter.id),
      );
    }

    return INSTANCE_GROUPS.map((group) => {
      const encounterIds = new Set<string>();
      for (const instanceId of group.instanceIds) {
        for (const encounterId of encounterIdsByInstanceId.get(instanceId) ??
          []) {
          encounterIds.add(encounterId);
        }
      }
      return {
        encounterCount: encounterIds.size,
        id: group.id,
        name: group.name,
      };
    })
      .filter((card) =>
        nameFilter ? card.name.toLowerCase().includes(nameFilter) : true,
      )
      .toSorted((a, b) => b.encounterCount - a.encounterCount);
  }, [data, nameFilter]);

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li className="is-active">
            <Link to="/instances">{t('pages:instances.title')}</Link>
          </li>
        </ul>
      </nav>

      <div className="filter-grid">
        <label>
          <span>{t('pages:instances.search')}</span>
          <SearchBox
            initialQuery={search.get('name') || ''}
            onSubmit={(event) => {
              search.set('name', event);
              setSearch(search);
            }}
          />
        </label>
      </div>

      {loading && data == null && <progress className="progress" />}
      {!loading && error && (
        <ErrorMessage name={error.name} message={error.message} />
      )}
      {!loading && !error && cards.length === 0 && (
        <ErrorMessage customText={t('common:notFound')} />
      )}
      {cards.length > 0 && (
        <div className="instance-card-grid">
          {cards.map((card) => (
            <article className="instance-card" key={card.id}>
              <div className="instance-card-header">
                <span className="instance-card-icon">
                  <i className="fas fa-dungeon" aria-hidden="true" />
                </span>
                <strong>
                  <Link to={`/instance/${card.id}`}>{card.name}</Link>
                </strong>
              </div>
              <div className="instance-card-meta">
                <span>
                  {card.encounterCount} {t('pages:instances.encounters')}
                </span>
              </div>
              <div className="instance-card-actions">
                <Link
                  to={`/instance/${card.id}`}
                  className="button is-primary is-small"
                >
                  {t('pages:instances.runs')}
                </Link>
                <Link
                  to={`/instance-statistics/${card.id}`}
                  className="button is-small"
                >
                  {t('pages:instances.statistics')}
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
