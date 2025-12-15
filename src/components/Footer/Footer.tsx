import { useTranslation } from 'react-i18next';
import { FooterPostLogin, FooterLegal } from '@pagopa/mui-italia';
import ROUTES from '../../routes';

const FOOTER_LINKS = {
    COMPANY: 'https://www.pagopa.it/it/',
    PERSONAL_DATA: 'https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8',
    A11Y: 'https://form.agid.gov.it/view/87f46790-9798-11f0-b583-8b5f76942354'
} as const;

const openExternalLink = (url: string) => window.open(url, '_blank')?.focus();
const baseUrl = window.location.origin;

export const Footer = () => {
    const { t } = useTranslation();

    return (
        <>
            <FooterPostLogin
                companyLink={{
                    ariaLabel: 'PagoPA SPA',
                    href: FOOTER_LINKS.COMPANY,
                    onClick: () => openExternalLink(FOOTER_LINKS.COMPANY)
                }}
                links={[
                    {
                        label: t('footer.privacy'),
                        ariaLabel: t('footer.privacy'),
                        linkType: 'external',
                        href: ROUTES.PRIVACY_POLICY,
                        onClick: () => openExternalLink(`${baseUrl}${ROUTES.PRIVACY_POLICY}`)
                    },
                    {
                        label: t('footer.personalData'),
                        ariaLabel: t('footer.personalData'),
                        linkType: 'external',
                        href: FOOTER_LINKS.PERSONAL_DATA,
                        onClick: () => openExternalLink(FOOTER_LINKS.PERSONAL_DATA)
                    },
                    {
                        label: t('footer.termsAndConditions'),
                        ariaLabel: t('footer.termsAndConditions'),
                        href: `${baseUrl}/portale-enti${ROUTES.TOS}`,
                        linkType: 'external',
                        onClick: () => openExternalLink(`${baseUrl}${ROUTES.TOS}`)
                    },
                    {
                        label: t('footer.a11y'),
                        ariaLabel: t('footer.a11y'),
                        linkType: 'external',
                        onClick: () => openExternalLink(FOOTER_LINKS.A11Y)
                    }
                ]}
                currentLangCode={'it'}
                languages={{
                    it: {
                        it: 'Italiano'
                    }
                }}
                onLanguageChanged={() => { }}
            />
            <FooterLegal
                content={
                    <span style={{ whiteSpace: 'pre-line' }}>
                        <b>{t('footer.PagoPA')}</b> - {t('footer.legalInfo')}
                    </span>
                }
            />
        </>
    );
};