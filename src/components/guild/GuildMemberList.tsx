import { gql } from '@apollo/client';
import { useApolloClient } from '@apollo/client/react';
import { Career } from '@/__generated__/graphql';
import { type ReactElement, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';
import clsx from 'clsx';
import { CareerIcon } from '@/components/CareerIcon';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import {
  WarhammerFilterPanel,
  WarhammerSelect,
} from '@/components/global/WarhammerFormControls';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import './GuildMemberList.scss';

const MEMBERS_PER_REQUEST = 50;

const GUILD_MEMBERS = gql`
  query GetGuildMembers($id: ID!, $first: Int, $after: String) {
    guild(id: $id) {
      members(first: $first, after: $after) {
        totalCount
        nodes {
          rank {
            name
            rank
          }
          character {
            id
            name
            career
            level
            renownRank
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

interface Member {
  rank: { name: string; rank: number };
  character: {
    id: string;
    name: string;
    career: Career;
    level: number;
    renownRank: number;
  };
}

interface MembersConnection {
  totalCount: number;
  nodes: Member[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}

interface MembersData {
  guild: {
    members: MembersConnection;
  } | null;
}

type SortKey = 'name' | 'level' | 'renownRank' | 'rank';
type SortDirection = 'asc' | 'desc';
const pageSizes = [10, 15, 20, 25, 50] as const;
const sortKeys: SortKey[] = ['name', 'level', 'renownRank', 'rank'];

const getSortValue = (member: Member, key: SortKey): string | number => {
  switch (key) {
    case 'name': {
      return member.character.name.toLocaleLowerCase();
    }
    case 'level': {
      return member.character.level;
    }
    case 'renownRank': {
      return member.character.renownRank;
    }
    case 'rank': {
      return member.rank.rank;
    }
    default: {
      return '';
    }
  }
};

export const GuildMemberList = ({
  id,
}: {
  id: string | undefined;
}): ReactElement => {
  const client = useApolloClient();
  const { t } = useTranslation(['common', 'pages', 'enums']);
  const [search, setSearch] = useSearchParams();
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;
  const [members, setMembers] = useState<Member[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const selectedCareer = search.get('career') as Career | null;
  const careerFilter = selectedCareer && Object.values(Career).includes(selectedCareer)
    ? selectedCareer
    : '';
  const rankFilter = search.get('guildRank') ?? '';
  const selectedSort = search.get('memberSort');
  const sortKey = sortKeys.includes(selectedSort as SortKey)
    ? (selectedSort as SortKey)
    : 'name';
  const sortDirection: SortDirection = search.get('memberDirection') === 'desc' ? 'desc' : 'asc';
  const selectedPageSize = Number(search.get('membersPerPage'));
  const perPage = pageSizes.includes(selectedPageSize as (typeof pageSizes)[number])
    ? selectedPageSize
    : 25;
  const selectedPage = Number(search.get('membersPage'));
  const page = Number.isInteger(selectedPage) && selectedPage >= 0 ? selectedPage : 0;

  const updateMemberSearch = (updates: Record<string, string | number | null>) => {
    const nextSearch = new URLSearchParams(search);
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === '') {
        nextSearch.delete(key);
      } else {
        nextSearch.set(key, String(value));
      }
    }
    setSearch(nextSearch);
  };

  useEffect(() => {
    let active = true;

    const loadMembers = async () => {
      setMembers([]);
      setTotalCount(0);
      setLoadedCount(0);
      setError(null);
      setLoading(true);

      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const allMembers: Member[] = [];
        let after: string | undefined = undefined;
        let hasNextPage = true;
        let expectedCount = 0;
        const seenCursors = new Set<string>();

        while (hasNextPage) {
          // Cursor pages depend on the previous response, so fetch sequentially.
          // eslint-disable-next-line no-await-in-loop
          const result: { data: MembersData | undefined } =
            (
              // eslint-disable-next-line no-await-in-loop
              await client.query<MembersData>({
              query: GUILD_MEMBERS,
              variables: { id, first: MEMBERS_PER_REQUEST, after },
              fetchPolicy: 'no-cache',
              })
            ) as { data: MembersData | undefined };

          const connection: MembersConnection | undefined =
            result.data?.guild?.members;
          if (!connection) {
            throw new Error(t('common:notFound'));
          }

          const {
            nodes,
            totalCount: pageTotal,
            pageInfo: { hasNextPage: hasMore, endCursor },
          } = connection;
          allMembers.push(...nodes);
          expectedCount = pageTotal;
          hasNextPage = hasMore;
          after = endCursor ?? undefined;

          if (hasNextPage && (!after || seenCursors.has(after))) {
            throw new Error('The member list returned an invalid page cursor.');
          }
          if (after) {
            seenCursors.add(after);
          }

          if (active) {
            setTotalCount(expectedCount);
            setLoadedCount(allMembers.length);
          }
        }

        if (active) {
          setMembers(allMembers);
          setTotalCount(expectedCount);
          setLoadedCount(allMembers.length);
        }
      } catch (fetchError) {
        if (active) {
          setError(
            fetchError instanceof Error
              ? fetchError
              : new Error(String(fetchError)),
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadMembers();
    return () => {
      active = false;
    };
  }, [client, id, t]);

  const ranks = useMemo(
    () =>
      [...new Set(members.map((member) => member.rank.name))].toSorted(
        (first, second) => first.localeCompare(second),
      ),
    [members],
  );
  const careerComposition = useMemo(() => {
    const counts = new Map<Career, number>();
    members.forEach(({ character: { career } }) => {
      counts.set(career, (counts.get(career) ?? 0) + 1);
    });
    return [...counts.entries()].toSorted(
      ([firstCareer, firstCount], [secondCareer, secondCount]) =>
        secondCount - firstCount ||
        t(`enums:career.${firstCareer}`).localeCompare(
          t(`enums:career.${secondCareer}`),
        ),
    );
  }, [members, t]);
  const compositionMemberCount = members.length;
  const careers = useMemo(
    () =>
      Object.values(Career).toSorted((first, second) =>
        t(`enums:career.${first}`).localeCompare(t(`enums:career.${second}`)),
      ),
    [t],
  );
  const filteredMembers = useMemo(() => {
    const filtered = members.filter(
      (member) =>
        (!careerFilter || member.character.career === careerFilter) &&
        (!rankFilter || member.rank.name === rankFilter),
    );

    return filtered.toSorted((first, second) => {
      const firstValue = getSortValue(first, sortKey);
      const secondValue = getSortValue(second, sortKey);
      const comparison =
        sortKey === 'name'
          ? String(firstValue).localeCompare(String(secondValue))
          : (firstValue as number) - (secondValue as number);
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [careerFilter, members, rankFilter, sortDirection, sortKey]);

  const pageCount = Math.ceil(filteredMembers.length / perPage);
  const currentPage = Math.min(page, Math.max(pageCount - 1, 0));
  const pageMembers = filteredMembers.slice(currentPage * perPage, (currentPage + 1) * perPage);

  const changeSort = (key: SortKey) => {
    let nextDirection: SortDirection = key === 'name' ? 'asc' : 'desc';
    if (key === sortKey) {
      nextDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }
    updateMemberSearch({
      memberSort: key,
      memberDirection: nextDirection,
      membersPage: null,
    });
  };

  const sortHeader = (key: SortKey, label: string) => {
    let ariaSort: 'ascending' | 'descending' | 'none' = 'none';
    if (key === sortKey) {
      ariaSort = sortDirection === 'asc' ? 'ascending' : 'descending';
    }

    return (
      <th aria-sort={ariaSort}>
        <button
          className="button is-ghost p-0 has-text-weight-bold"
          type="button"
          onClick={() => changeSort(key)}
        >
          {label}
          {key === sortKey && (
            <span aria-hidden="true" className="ml-1">
              {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </button>
      </th>
    );
  };

  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  return (
    <div>
      {loading ? (
        <div className="mb-4">
          <p className="mb-2">
            {t('pages:guildMembers.loadingMembers', {
              loaded: loadedCount,
              total: totalCount || '…',
            })}
          </p>
          <progress
            className="progress is-info"
            max={totalCount || undefined}
            value={totalCount ? loadedCount : undefined}
          />
        </div>
      ) : (
        <>
          <section className="warhammer-window-panel guild-member-composition mb-3" aria-labelledby="guild-member-composition-title">
              <div className="guild-member-composition-heading">
                <h2 className="title is-5" id="guild-member-composition-title">
                  {t('pages:guildMembers.compositionTitle')}
                </h2>
                <p className="has-text-grey">
                  {t('pages:guildMembers.compositionCoverage', {
                    count: members.length,
                    total: totalCount,
                  })}
                </p>
              </div>
              <div className="guild-member-career-grid">
                {careerComposition.map(([career, count]) => {
                  const percentage = compositionMemberCount > 0 ? (count / compositionMemberCount) * 100 : 0;
                  const selected = careerFilter === career;
                  const careerName = t(`enums:career.${career}`);
                  return (
                    <button
                      className={`guild-member-career${selected ? ' is-selected' : ''}`}
                      key={career}
                      type="button"
                      aria-pressed={selected}
                      aria-label={t('pages:guildMembers.careerShare', {
                        career: careerName,
                        count,
                        percentage: Math.round(percentage),
                      })}
                      onClick={() => updateMemberSearch({
                        career: selected ? null : career,
                        membersPage: null,
                      })}
                    >
                      <span className="guild-member-career-label">
                        <CareerIcon career={career} />
                        <span>{careerName}</span>
                        <strong>{count} · {Math.round(percentage)}%</strong>
                      </span>
                      <span className="guild-member-career-track" aria-hidden="true">
                        <span style={{ width: `${percentage}%` }} />
                      </span>
                    </button>
                  );
                })}
              </div>
          </section>
          <WarhammerFilterPanel className="guild-member-filters">
            <div className="guild-member-filter-row">
              <WarhammerSelect
                id="guild-member-career-filter"
                label={t('pages:guildMembers.classFilter')}
                value={careerFilter}
                options={[
                  { value: '', label: t('pages:guildMembers.allClasses') },
                  ...careers.map((career) => ({
                    value: career,
                    label: t(`enums:career.${career}`),
                  })),
                ]}
                onChange={(value) => updateMemberSearch({ career: value, membersPage: null })}
              />
              <WarhammerSelect
                id="guild-member-rank-filter"
                label={t('pages:guildMembers.rankFilter')}
                value={rankFilter}
                options={[
                  { value: '', label: t('pages:guildMembers.allRanks') },
                  ...ranks.map((rank) => ({ value: rank, label: rank })),
                ]}
                onChange={(value) => updateMemberSearch({ guildRank: value, membersPage: null })}
              />
              <div className="guild-member-filter-summary">
                <span>
              {t('pages:guildMembers.showingMembers', {
                shown: filteredMembers.length,
                total: totalCount,
              })}
                </span>
                {(careerFilter || rankFilter) && (
                  <button
                    className="button is-small guild-member-clear-filters"
                    type="button"
                    onClick={() => updateMemberSearch({
                      career: null,
                      guildRank: null,
                      membersPage: null,
                    })}
                  >
                    {t('pages:guildMembers.clearFilters')}
                  </button>
                )}
              </div>
            </div>
          </WarhammerFilterPanel>

          <div className="table-container">
            <table
              className={clsx(
                'table',
                'is-striped',
                'is-hoverable',
                'is-fullwidth',
                'warhammer-guild-member-table',
                isMobile && 'is-narrow',
              )}
            >
              <thead>
                <tr>
                  <th aria-label={t('pages:guildMembers.class')} id="th-career">
                    {t('pages:guildMembers.class')}
                  </th>
                  {sortHeader('name', t('pages:guildMembers.name'))}
                  {sortHeader('level', t('pages:guildMembers.level'))}
                  {sortHeader('renownRank', t('pages:guildMembers.renownRank'))}
                  {sortHeader('rank', t('pages:guildMembers.guildRank'))}
                </tr>
              </thead>
              <tbody>
                {pageMembers.map((member) => (
                  <tr key={member.character.id}>
                    <td aria-labelledby="th-career">
                      <CareerIcon career={member.character.career} />
                    </td>
                    <td>
                      <Link to={`/character/${member.character.id}`}>
                        {member.character.name}
                      </Link>
                    </td>
                    <td>{member.character.level}</td>
                    <td>{member.character.renownRank}</td>
                    <td>{member.rank.name}</td>
                  </tr>
                ))}
                {pageMembers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="has-text-centered">
                      {t('pages:guildMembers.noMatchingMembers')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="is-flex is-flex-wrap-wrap is-justify-content-space-between is-align-items-center mt-3">
            <div className="is-flex is-align-items-center">
              <label className="label is-small mb-0 mr-2" htmlFor="guild-members-per-page">
                {t('common:itemsPerPage')}
              </label>
              <div className="select is-small">
                <select
                  id="guild-members-per-page"
                  value={perPage}
                  onChange={(event) => {
                    updateMemberSearch({
                      membersPerPage: Number(event.currentTarget.value),
                      membersPage: null,
                    });
                  }}
                >
                  {pageSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {pageCount > 1 && (
              <div className="buttons are-small mb-0">
                <button
                  className="button is-info"
                  type="button"
                  disabled={currentPage === 0}
                  onClick={() =>
                    updateMemberSearch({ membersPage: Math.max(0, currentPage - 1) })
                  }
                >
                  {t('common:prevPage')}
                </button>
                <span className="button is-static">
                  {t('pages:guildMembers.pageOf', {
                    page: currentPage + 1,
                    pages: pageCount,
                  })}
                </span>
                <button
                  className="button is-info"
                  type="button"
                  disabled={currentPage + 1 >= pageCount}
                  onClick={() => updateMemberSearch({ membersPage: currentPage + 1 })}
                >
                  {t('common:nextPage')}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
