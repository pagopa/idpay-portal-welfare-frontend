import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { TypeEnum } from '../../../../api/generated/initiative/ChannelDTO';
import { InitiativeAdditionalDTO } from '../../../../api/generated/initiative/InitiativeAdditionalDTO';

export const contacts = [
  {
    id: 1,
    value: 'web',
    name: i18n.t('components.wizard.stepOne.form.webUrl'),
  },
  {
    id: 2,
    value: 'email',
    name: i18n.t('components.wizard.stepOne.form.email'),
  },
  {
    id: 3,
    value: 'mobile',
    name: i18n.t('components.wizard.stepOne.form.phone'),
  },
];

export const parseDataToSend = (values: any): InitiativeAdditionalDTO => {
  const channels: Array<{ type: TypeEnum; contact: string }> = [];
  values.assistanceChannels.forEach((v: { type: TypeEnum; contact: string }) => {
    if (v.type.length > 0 && v.contact.length > 0) {
      // eslint-disable-next-line functional/immutable-data
      channels.push({
        type: v.type,
        contact: v.contact,
      });
    }
  });
  return {
    serviceIO: typeof values.initiativeOnIO === 'boolean' ? values.initiativeOnIO : undefined,
    serviceName: typeof values.serviceName === 'string' ? values.serviceName : undefined,
    serviceScope: values.serviceArea,
    description:
      typeof values.serviceDescription === 'string' ? values.serviceDescription : undefined,
    privacyLink: typeof values.privacyPolicyUrl === 'string' ? values.privacyPolicyUrl : undefined,
    tcLink: typeof values.termsAndConditions === 'string' ? values.termsAndConditions : undefined,
    channels: [...channels],
  };
};
