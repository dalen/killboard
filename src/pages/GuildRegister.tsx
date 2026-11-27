import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';
import { Realm } from '@/__generated__/graphql';
import type {
  GuildFilterInput,
  Query,
} from '@/__generated__/graphql';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { QueryPagination } from '@/components/global/QueryPagination';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import clsx from 'clsx';
import type { ReactElement } from 'react';

const GUILD_REGISTER = gql`
  query GuildRegister(
    $first: Int
    $after: String
    $before: String
    $last: Int
    $where: GuildFilterInput
  ) {
    guilds(
      first: $first
      after: $after
      before: $before
      last: $last
      where: $where
    ) {
      nodes {
        id
        name
        realm
        level
        heraldry {
          emblem
          pattern
          color1
          color2
          shape
        }
        leader {
          id
          name
        }
        members {
          totalCount
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

type GuildRegisterData = Pick<Query, 'guilds'>;

const validRealm = (value: string | null): Realm | undefined =>
  value === Realm.Order ||
  value === Realm.Destruction ||
  value === Realm.Neutral
    ? value
    : undefined;

const getFilters = (search: URLSearchParams): GuildFilterInput => {
  const where: GuildFilterInput = {};
  const name = search.get('name')?.trim();
  const realm = validRealm(search.get('realm'));
  const minLevel = Number(search.get('minLevel'));
  const maxLevel = Number(search.get('maxLevel'));
  if (name) where.name = { contains: name };
  if (realm) where.realm = { eq: realm };
  if (minLevel > 0 || maxLevel > 0) {
    where.level = {
      ...(minLevel > 0 ? { gte: minLevel } : {}),
      ...(maxLevel > 0 ? { lte: maxLevel } : {}),
    };
  }
  return where;
};

export const GuildRegister = (): ReactElement => {
  const { t } = useTranslation(['common', 'pages']);
  const [search, setSearch] = useSearchParams();
  const searchKey = search.toString();
  const [draft, setDraft] = useState(() => new URLSearchParams(search));
  const [perPage, setPerPage] = useState(25);
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  useEffect(() => {
    setDraft(new URLSearchParams(searchKey));
  }, [searchKey]);

  const variables = useMemo(
    () => ({ where: getFilters(search) }),
    [searchKey],
  );
  const { loading, error, data, refetch } = useQuery<GuildRegisterData>(
    GUILD_REGISTER,
    { variables: { ...variables, first: perPage } },
  );

  const updateDraft = (key: string, value: string) => {
    setDraft((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    });
  };

  const applyFilters = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = new URLSearchParams(draft);
    next.delete('after');
    next.delete('before');
    setSearch(next);
  };

  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  const guilds = [...(data?.guilds?.nodes ?? [])].toSorted((left, right) => {
    const sort = search.get('sort') ?? 'name-asc';
    if (sort.startsWith('level')) {
      const levelDelta = left.level - right.level;
      if (levelDelta !== 0) return sort === 'level-desc' ? -levelDelta : levelDelta;
    }
    const nameDelta = left.name.localeCompare(right.name);
    return sort === 'name-desc' ? -nameDelta : nameDelta;
  });
  const pageInfo = data?.guilds?.pageInfo;

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li><Link to="/">{t('common:home')}</Link></li>
          <li><Link to="/guilds">{t('pages:guildRegister.guilds')}</Link></li>
          <li className="is-active"><span>{t('pages:guildRegister.title')}</span></li>
        </ul>
      </nav>

      <section className="card mb-5">
        <div className="card-content">
          <h1 className="title is-3">{t('pages:guildRegister.title')}</h1>
          <p className="has-text-grey mb-2">{t('pages:guildRegister.description')}</p>
          <p className="has-text-grey is-size-7 mb-4">{t('pages:guildRegister.sortNote')}</p>
          <form onSubmit={applyFilters}>
            <div className="columns is-multiline is-align-items-flex-end">
              <div className="column is-5">
                <label className="label" htmlFor="guild-register-name">{t('pages:guildRegister.name')}</label>
                <input
                  id="guild-register-name"
                  className="input"
                  type="search"
                  value={draft.get('name') ?? ''}
                  onChange={(event) => updateDraft('name', event.target.value)}
                />
              </div>
              <div className="column is-3">
                <label className="label" htmlFor="guild-register-realm">{t('pages:guildRegister.realm')}</label>
                <div className="select is-fullwidth">
                  <select
                    id="guild-register-realm"
                    value={draft.get('realm') ?? ''}
                    onChange={(event) => updateDraft('realm', event.target.value)}
                  >
                    <option value="">{t('pages:guildRegister.allRealms')}</option>
                    <option value="ORDER">{t('pages:guildRegister.order')}</option>
                    <option value="DESTRUCTION">{t('pages:guildRegister.destruction')}</option>
                    <option value="NEUTRAL">{t('pages:guildRegister.neutral')}</option>
                  </select>
                </div>
              </div>
              <div className="column is-2">
                <label className="label" htmlFor="guild-register-min-level">{t('pages:guildRegister.minLevel')}</label>
                <input
                  id="guild-register-min-level"
                  className="input"
                  type="number"
                  min="1"
                  max="40"
                  value={draft.get('minLevel') ?? ''}
                  onChange={(event) => updateDraft('minLevel', event.target.value)}
                />
              </div>
              <div className="column is-2">
                <label className="label" htmlFor="guild-register-max-level">{t('pages:guildRegister.maxLevel')}</label>
                <input
                  id="guild-register-max-level"
                  className="input"
                  type="number"
                  min="1"
                  max="40"
                  value={draft.get('maxLevel') ?? ''}
                  onChange={(event) => updateDraft('maxLevel', event.target.value)}
                />
              </div>
              <div className="column is-3">
                <label className="label" htmlFor="guild-register-sort">{t('pages:guildRegister.sortCurrentPage')}</label>
                <div className="select is-fullwidth">
                  <select
                    id="guild-register-sort"
                    value={draft.get('sort') ?? 'name-asc'}
                    onChange={(event) => updateDraft('sort', event.target.value)}
                  >
                    <option value="name-asc">{t('pages:guildRegister.nameAsc')}</option>
                    <option value="name-desc">{t('pages:guildRegister.nameDesc')}</option>
                    <option value="level-desc">{t('pages:guildRegister.levelDesc')}</option>
                    <option value="level-asc">{t('pages:guildRegister.levelAsc')}</option>
                  </select>
                </div>
              </div>
              <div className="column is-9 has-text-right">
                <button className="button is-primary" type="submit">
                  {t('pages:guildRegister.applyFilters')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {loading && <progress className="progress" />}
      {!loading && guilds.length === 0 && (
        <p className="notification">{t('pages:guildRegister.noResults')}</p>
      )}
      {!loading && guilds.length > 0 && (
        <div className="table-container">
          <table className={clsx('table is-striped is-hoverable', isMobile ? 'is-narrow' : 'is-fullwidth')}>
            <thead>
              <tr>
                <th>{t('pages:guildRegister.guild')}</th>
                <th>{t('pages:guildRegister.realm')}</th>
                <th>{t('pages:guildRegister.level')}</th>
                <th>{t('pages:guildRegister.members')}</th>
                <th>{t('pages:guildRegister.leader')}</th>
              </tr>
            </thead>
            <tbody>
              {guilds.map((guild) => (
                <tr key={guild.id}>
                  <td>
                    <div className="is-flex is-align-items-center">
                      <span className="mr-2"><GuildHeraldry size="32" heraldry={guild.heraldry} realm={guild.realm} /></span>
                      <Link to={`/guild/${guild.id}`}>{guild.name}</Link>
                    </div>
                  </td>
                  <td>
                    {guild.realm === Realm.Order
                      ? t('pages:guildRegister.order')
                      : guild.realm === Realm.Destruction
                        ? t('pages:guildRegister.destruction')
                        : t('common:realmNeutral')}
                  </td>
                  <td>{guild.level}</td>
                  <td>{guild.members?.totalCount ?? '—'}</td>
                  <td>
                    {guild.leader ? (
                      <Link to={`/character/${guild.leader.id}`}>{guild.leader.name}</Link>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pageInfo && (
        <QueryPagination
          pageInfo={pageInfo}
          perPage={perPage}
          onPerPageChange={setPerPage}
          refetch={refetch}
        />
      )}
    </div>
  );
};
