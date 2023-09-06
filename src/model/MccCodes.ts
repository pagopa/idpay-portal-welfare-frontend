export interface MccCodesModel {
  code: string;
  description: string;
  checked: boolean;
}

export const mccCodes2MccCodesModel = (resources: MccCodesModel) => ({
  code: resources.code,
  description: resources.description,
  checked: resources.checked,
});
