import i18next from 'i18next';
import i18nextXHRBackend from 'i18next-xhr-backend';

export default function i18n({locale, baseUrl, resources}) {
  const useXHR = !resources;
  const backend = {
    loadPath: `${baseUrl || ''}assets/locale/messages_{{lng}}.json`,
    crossDomain: true
  };

  const res = {
    [locale]: {translation: resources}
  };

  const key = useXHR ? 'backend' : 'resources';
  const value = useXHR ? backend : res;

  if (useXHR) {
    i18next.use(i18nextXHRBackend);
  }

  return i18next
    .init({
      lng: locale,
      fallbackLng: 'en',
      keySeparator: '$',
      interpolation: {
        escapeValue: false
      },
      [key]: value
    });
}
