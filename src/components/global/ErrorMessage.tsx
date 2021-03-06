import { Notification } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';

export const ErrorMessage = ({
  message,
  name,
  customText,
}: {
  message?: string;
  name?: string;
  customText?: string;
}): JSX.Element => {
  const { t } = useTranslation('components');

  return (
    <Notification color={'danger'}>
      <p>{t('global.errorMessage.errorWithSadSmiley')}</p>
      {name && <pre>{name}</pre>}
      {message && <pre>{message}</pre>}
      {customText && customText}
    </Notification>
  );
};
