import { gql, useQuery } from '@apollo/client';
import { Table, Image, Progress } from 'react-bulma-components';
import { KillDamage, Query } from '../types';
import { ErrorMessage } from './global/ErrorMessage';
import { killDamageText } from '../utils';
import { ReactElement } from 'react';

const SKIRMISH_DAMAGE = gql`
  query GetSkirmishDamage($id: ID!) {
    skirmish(id: $id) {
      id
      killDamage {
        attackerType
        damageType
        ability {
          id
          name
          iconUrl
        }
        damageAmount
      }
    }
  }
`;

export function SkirmishDamage({ id }: { id: string }): ReactElement {
  const { loading, error, data } = useQuery<Query>(SKIRMISH_DAMAGE, {
    variables: { id },
  });

  const killDamage = data?.skirmish?.killDamage;

  if (loading || killDamage == null) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  // Group killdamage by ability.name and ability.iconUrl
  const killDamageGrouped = killDamage.reduce((acc, curr) => {
    const existing = acc.find(
      (e) =>
        killDamageText(e) === killDamageText(curr) &&
        e.ability?.iconUrl === curr.ability?.iconUrl,
    );
    if (existing) {
      existing.damageAmount += curr.damageAmount;
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, [] as KillDamage[]);

  const totalDamage = killDamage.reduce(
    (acc, cur) => acc + cur.damageAmount,
    0,
  );

  return (
    <Table size="narrow" striped width="100%">
      <tbody>
        {killDamageGrouped
          .sort((e1, e2) => e2.damageAmount - e1.damageAmount)
          .map((damage) => (
            <tr>
              <td style={{ verticalAlign: 'middle' }}>
                {damage.ability && (
                  <Image
                    size={24}
                    src={damage.ability.iconUrl}
                    alt="Heraldry"
                  />
                )}
              </td>
              <td>{killDamageText(damage)}</td>
              <td align="right">
                {Number(damage.damageAmount).toLocaleString()}
              </td>
              <td align="right">
                {((Number(damage.damageAmount) / totalDamage) * 100)
                  .toFixed(2)
                  .toLocaleString()}{' '}
                %
              </td>
            </tr>
          ))}
        <tr>
          <td align="right" colSpan={3}>
            Total: {totalDamage.toLocaleString()}
          </td>
          <td />
        </tr>
      </tbody>
    </Table>
  );
}
