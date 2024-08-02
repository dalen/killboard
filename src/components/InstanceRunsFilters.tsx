import { Card, Columns, Form, Heading, Icon } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { InstanceRunFilterInput } from '../types';

const getInstanceFilters = (
  search: URLSearchParams,
): InstanceRunFilterInput => {
  const instance = search.get('instance');

  if (instance && instance !== 'all') {
    return { instanceId: { eq: Number(instance) } };
  }

  return {};
};

const getCompletedEncountersFilters = (
  search: URLSearchParams,
): InstanceRunFilterInput => {
  const completedEncounters = search.get('completedEncounters');

  if (completedEncounters && completedEncounters !== '0') {
    return { completedEncounters: { gte: Number(completedEncounters) } };
  }

  return {};
};

const getMinItemRatingFilters = (
  search: URLSearchParams,
): InstanceRunFilterInput => {
  const minItemRatingMin = search.get('minItemRatingMin');
  const minItemRatingMax = search.get('minItemRatingMax');

  if (
    minItemRatingMin &&
    minItemRatingMin !== '0' &&
    minItemRatingMax &&
    minItemRatingMax !== '0'
  ) {
    return {
      minItemRating: {
        gte: Number(minItemRatingMin),
        lte: Number(minItemRatingMax),
      },
    };
  }

  if (minItemRatingMin && minItemRatingMin !== '0') {
    return {
      minItemRating: {
        gte: Number(minItemRatingMin),
      },
    };
  }

  if (minItemRatingMax && minItemRatingMax !== '0') {
    return {
      minItemRating: {
        lte: Number(minItemRatingMax),
      },
    };
  }

  return {};
};

const getAvgItemRatingFilters = (
  search: URLSearchParams,
): InstanceRunFilterInput => {
  const avgItemRatingMin = search.get('avgItemRatingMin');
  const avgItemRatingMax = search.get('avgItemRatingMax');

  if (
    avgItemRatingMin &&
    avgItemRatingMin !== '0' &&
    avgItemRatingMax &&
    avgItemRatingMax !== '0'
  ) {
    return {
      averageItemRating: {
        gte: Number(avgItemRatingMin),
        lte: Number(avgItemRatingMax),
      },
    };
  }

  if (avgItemRatingMin && avgItemRatingMin !== '0') {
    return {
      averageItemRating: {
        gte: Number(avgItemRatingMin),
      },
    };
  }

  if (avgItemRatingMax && avgItemRatingMax !== '0') {
    return {
      averageItemRating: {
        lte: Number(avgItemRatingMax),
      },
    };
  }

  return {};
};

const getMaxItemRatingFilters = (
  search: URLSearchParams,
): InstanceRunFilterInput => {
  const maxItemRatingMin = search.get('maxItemRatingMin');
  const maxItemRatingMax = search.get('maxItemRatingMax');

  if (
    maxItemRatingMin &&
    maxItemRatingMin !== '0' &&
    maxItemRatingMax &&
    maxItemRatingMax !== '0'
  ) {
    return {
      maxItemRating: {
        gte: Number(maxItemRatingMin),
        lte: Number(maxItemRatingMax),
      },
    };
  }

  if (maxItemRatingMin && maxItemRatingMin !== '0') {
    return {
      maxItemRating: {
        gte: Number(maxItemRatingMin),
      },
    };
  }

  if (maxItemRatingMax && maxItemRatingMax !== '0') {
    return {
      maxItemRating: {
        lte: Number(maxItemRatingMax),
      },
    };
  }

  return {};
};

export const getInstanceRunsFilters = (search: URLSearchParams) => ({
  start: { gt: 0 },
  scoreboardEntryCount: { gte: 6 },
  ...getInstanceFilters(search),
  ...getCompletedEncountersFilters(search),
  ...getMinItemRatingFilters(search),
  ...getAvgItemRatingFilters(search),
  ...getMaxItemRatingFilters(search),
});

export function InstanceRunsFilters(): JSX.Element {
  const { t } = useTranslation(['common', 'pages']);
  const [search, setSearch] = useSearchParams();
  const instance = search.get('instance') ?? 'all';
  const completedEncounters = Number(search.get('completedEncounters') ?? 0);
  const minItemRatingMin = Number(search.get('minItemRatingMin') ?? 0);
  const minItemRatingMax =
    search.get('minItemRatingMax') &&
    Number(search.get('minItemRatingMax') ?? 0);
  const avgItemRatingMin =
    search.get('minItemRatingMax') &&
    Number(search.get('avgItemRatingMin') ?? 0);
  const avgItemRatingMax =
    search.get('minItemRatingMax') &&
    Number(search.get('avgItemRatingMax') ?? 0);
  const maxItemRatingMin =
    search.get('minItemRatingMax') &&
    Number(search.get('maxItemRatingMin') ?? 0);
  const maxItemRatingMax =
    search.get('minItemRatingMax') &&
    Number(search.get('maxItemRatingMax') ?? 0);

  return (
    <Card mb={5}>
      <Card.Content>
        <Columns>
          <Columns.Column>
            <Form.Field>
              <Form.Label>Instance</Form.Label>
              <Form.Control>
                <div className="select">
                  <select
                    value={instance}
                    onChange={(event) => {
                      search.set('instance', event.target.value);
                      setSearch(search);
                    }}
                  >
                    <option value="all">{t('pages:instanceRuns.all')}</option>
                    <option value="176">Sigmar Crypts</option>
                    <option value="196">Bilerot</option>
                    <option value="160">Bastion Stair</option>
                    <option value="163">Thar&apos;Ignan</option>
                    <option value="164">Lord Slaurith</option>
                    <option value="165">Kaarn the Vanquisher</option>
                    <option value="166">Skull Lord Var&apos;Ithrok</option>
                    <option value="60">Gunbad</option>
                    <option value="63">Gunbad Nursery</option>
                    <option value="64">Gunbad Lab</option>
                    <option value="65">Squig Boss</option>
                    <option value="66">Gunbad Baracks</option>
                    <option value="152">Altdorf Sewers 1</option>
                    <option value="153">Altdorf Sewers 2</option>
                    <option value="169">Altdorf Sewers 3</option>
                    <option value="155">Sacellum 1</option>
                    <option value="156">Sacellum 2</option>
                    <option value="173">Sacellum 3</option>
                  </select>
                </div>
              </Form.Control>
            </Form.Field>
            <Form.Field>
              <Form.Label>Min completed encounters</Form.Label>
              <Form.Control>
                <Form.Input
                  type="number"
                  step={1}
                  min={0}
                  placeholder="0"
                  value={completedEncounters}
                  onChange={(event) => {
                    search.set('completedEncounters', event.target.value);
                    setSearch(search);
                  }}
                />
              </Form.Control>
            </Form.Field>
          </Columns.Column>
          <Columns.Column>
            <Heading size={6}>Min item rating</Heading>
            <Form.Field>
              <Form.Label>Below</Form.Label>
              <Form.Control>
                <Form.Input
                  type="number"
                  step={1}
                  placeholder="0"
                  value={minItemRatingMax}
                  onChange={(event) => {
                    search.set('minItemRatingMax', event.target.value);
                    setSearch(search);
                  }}
                />
                <Icon align="left">
                  <i className="fa-solid fa-arrow-down" />
                </Icon>
              </Form.Control>
            </Form.Field>
            <Form.Field>
              <Form.Label>Above</Form.Label>
              <Form.Control>
                <Form.Input
                  type="number"
                  step={1}
                  placeholder="0"
                  value={minItemRatingMin}
                  onChange={(event) => {
                    search.set('minItemRatingMin', event.target.value);
                    setSearch(search);
                  }}
                />
                <Icon align="left">
                  <i className="fa-solid fa-arrow-up" />
                </Icon>
              </Form.Control>
            </Form.Field>
          </Columns.Column>
          <Columns.Column>
            <Heading size={6}>Average item rating</Heading>
            <Form.Field>
              <Form.Label>Below</Form.Label>
              <Form.Control>
                <Form.Input
                  type="number"
                  step={1}
                  placeholder="0"
                  value={avgItemRatingMax}
                  onChange={(event) => {
                    search.set('avgItemRatingMax', event.target.value);
                    setSearch(search);
                  }}
                />
                <Icon align="left">
                  <i className="fa-solid fa-arrow-down" />
                </Icon>
              </Form.Control>
            </Form.Field>
            <Form.Field>
              <Form.Label>Above</Form.Label>
              <Form.Control>
                <Form.Input
                  type="number"
                  step={1}
                  placeholder="0"
                  value={avgItemRatingMin}
                  onChange={(event) => {
                    search.set('avgItemRatingMin', event.target.value);
                    setSearch(search);
                  }}
                />
                <Icon align="left">
                  <i className="fa-solid fa-arrow-up" />
                </Icon>
              </Form.Control>
            </Form.Field>
          </Columns.Column>
          <Columns.Column>
            <Heading size={6}>Max item rating</Heading>
            <Form.Field>
              <Form.Label>Below</Form.Label>
              <Form.Control>
                <Form.Input
                  type="number"
                  step={1}
                  placeholder="0"
                  value={maxItemRatingMax}
                  onChange={(event) => {
                    search.set('maxItemRatingMax', event.target.value);
                    setSearch(search);
                  }}
                />
                <Icon align="left">
                  <i className="fa-solid fa-arrow-down" />
                </Icon>
              </Form.Control>
            </Form.Field>
            <Form.Field>
              <Form.Label>Above</Form.Label>
              <Form.Control>
                <Form.Input
                  type="number"
                  step={1}
                  placeholder="0"
                  value={maxItemRatingMin}
                  onChange={(event) => {
                    search.set('maxItemRatingMin', event.target.value);
                    setSearch(search);
                  }}
                />
                <Icon align="left">
                  <i className="fa-solid fa-arrow-up" />
                </Icon>
              </Form.Control>
            </Form.Field>
          </Columns.Column>
        </Columns>
      </Card.Content>
    </Card>
  );
}
