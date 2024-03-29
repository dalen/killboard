import { Form, Card, Columns } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { URLSearchParams } from 'url';
import { Career } from '../types';

const getCareerFilters = (search: URLSearchParams) => {
  const career = search.get('career');

  if (career === 'all') {
    return {};
  }

  return {
    usableByCareer: career as Career,
  };
};

export const getCurrentFilters = (search: URLSearchParams) => ({
  ...getCareerFilters(search),
});

export function ItemVendorsFilters(): JSX.Element {
  const { t } = useTranslation(['components', 'enums']);
  const [search, setSearch] = useSearchParams();

  const career = search.get('career') || 'all';

  return (
    <Card mb={5}>
      <Card.Content>
        <Columns>
          <Columns.Column>
            <Form.Field>
              <Form.Label>
                {t('components:itemVendorsFilters.career')}
              </Form.Label>
              <Form.Select
                value={career}
                onChange={(event) => {
                  search.set('career', event.target.value);
                  setSearch(search);
                }}
              >
                <option value="all">
                  {t('components:itemVendorsFilters.all')}
                </option>
                <option value={Career.IronBreaker}>
                  {t(`enums:career.${Career.IronBreaker}`)}
                </option>
                <option value={Career.Slayer}>
                  {t(`enums:career.${Career.Slayer}`)}
                </option>
                <option value={Career.RunePriest}>
                  {t(`enums:career.${Career.RunePriest}`)}
                </option>
                <option value={Career.Engineer}>
                  {t(`enums:career.${Career.Engineer}`)}
                </option>
                <option value={Career.BlackOrc}>
                  {t(`enums:career.${Career.BlackOrc}`)}
                </option>
                <option value={Career.Choppa}>
                  {t(`enums:career.${Career.Choppa}`)}
                </option>
                <option value={Career.Shaman}>
                  {t(`enums:career.${Career.Shaman}`)}
                </option>
                <option value={Career.SquigHerder}>
                  {t(`enums:career.${Career.SquigHerder}`)}
                </option>
                <option value={Career.WitchHunter}>
                  {t(`enums:career.${Career.WitchHunter}`)}
                </option>
                <option value={Career.KnightOfTheBlazingSun}>
                  {t(`enums:career.${Career.KnightOfTheBlazingSun}`)}
                </option>
                <option value={Career.BrightWizard}>
                  {t(`enums:career.${Career.BrightWizard}`)}
                </option>
                <option value={Career.WarriorPriest}>
                  {t(`enums:career.${Career.WarriorPriest}`)}
                </option>
                <option value={Career.Chosen}>
                  {t(`enums:career.${Career.Chosen}`)}
                </option>
                <option value={Career.Marauder}>
                  {t(`enums:career.${Career.Marauder}`)}
                </option>
                <option value={Career.Zealot}>
                  {t(`enums:career.${Career.Zealot}`)}
                </option>
                <option value={Career.Magus}>
                  {t(`enums:career.${Career.Magus}`)}
                </option>
                <option value={Career.SwordMaster}>
                  {t(`enums:career.${Career.SwordMaster}`)}
                </option>
                <option value={Career.ShadowWarrior}>
                  {t(`enums:career.${Career.ShadowWarrior}`)}
                </option>
                <option value={Career.WhiteLion}>
                  {t(`enums:career.${Career.WhiteLion}`)}
                </option>
                <option value={Career.Archmage}>
                  {t(`enums:career.${Career.Archmage}`)}
                </option>
                <option value={Career.BlackGuard}>
                  {t(`enums:career.${Career.BlackGuard}`)}
                </option>
                <option value={Career.WitchElf}>
                  {t(`enums:career.${Career.WitchElf}`)}
                </option>
                <option value={Career.DiscipleOfKhaine}>
                  {t(`enums:career.${Career.DiscipleOfKhaine}`)}
                </option>
                <option value={Career.Sorcerer}>
                  {t(`enums:career.${Career.Sorcerer}`)}
                </option>
              </Form.Select>
            </Form.Field>
          </Columns.Column>
        </Columns>
      </Card.Content>
    </Card>
  );
}
