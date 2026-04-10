import { ChannelDtoTypeEnum, InitiativeAdditionalDTO } from "../../../../api/generated/initiative/apiClient";

export const parseDataToSend = (values: any): InitiativeAdditionalDTO => {
  const channels: Array<{ type: ChannelDtoTypeEnum; contact: string }> = [];
  values.assistanceChannels.forEach((v: { type: ChannelDtoTypeEnum; contact: string }) => {
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
