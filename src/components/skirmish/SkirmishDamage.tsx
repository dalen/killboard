import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import type { KillDamage, Query } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { killDamageText } from '@/utils';
import type { ReactElement } from 'react';

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

export const SkirmishDamage = ({ id }: { id: string }): ReactElement => {
  const { loading, error, data } = useQuery<Query>(SKIRMISH_DAMAGE, {
    variables: { id },
  });

  const killDamage = data?.skirmish?.killDamage;

  if (loading || killDamage == null) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  // Group killdamage by ability.name and ability.iconUrl
  const killDamageGrouped = killDamage.reduce<KillDamage[]>((acc, curr) => {
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
  }, []);

  const totalDamage = killDamage.reduce(
    (acc, cur) => acc + cur.damageAmount,
    0,
  );

  return (
    <table className="table is-striped is-narrow" width="100%">
      <tbody>
        {killDamageGrouped
          .toSorted((e1, e2) => e2.damageAmount - e1.damageAmount)
          .map((damage) => (
            <tr>
              <td style={{ verticalAlign: 'middle' }}>
                {damage.ability && (
                  <figure className="image is-24x24">
                    <img src={damage.ability.iconUrl} alt="Ability Icon" />
                  </figure>
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
    </table>
  );
};
