import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

export function ErrorMessage({
  message,
  name,
  customText,
}: {
  message?: string;
  name?: string;
  customText?: string | null;
}): ReactElement {
  const { t } = useTranslation('components');

  return (
    <div className="notification is-danger">
      <p>{t('global.errorMessage.errorWithSadSmiley')}</p>
      {name && <pre>{name}</pre>}
      {message && <pre>{message}</pre>}
      {customText}
    </div>
  );
}
