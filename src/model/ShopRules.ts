export interface ShopRulesModel {
  checked: boolean;
  code: string;
  description: string;
  enabled: boolean;
  title: string;
  subtitle: string;
}

export const shopRules2ShopRulesItem = (resources: ShopRulesModel) => ({
  checked: resources.checked,
  code: resources.code,
  description: resources.description,
  enabled: resources.enabled,
  title: resources.title,
  subtitle: resources.subtitle,
});
