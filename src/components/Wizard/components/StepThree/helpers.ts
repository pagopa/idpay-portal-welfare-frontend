/* eslint-disable complexity */
import { ConfigTrxRuleArrayDTO } from '../../../../api/generated/initiative/ConfigTrxRuleArrayDTO';
import { ShopRulesModel } from '../../../../model/ShopRules';

export const mapResponse = (response: ConfigTrxRuleArrayDTO): Array<ShopRulesModel> =>
  // eslint-disable-next-line sonarjs/cognitive-complexity
  response.map((r) => {
    // eslint-disable-next-line no-prototype-builtins
    if (r.hasOwnProperty('code') && typeof r.code !== undefined) {
      switch (r.code) {
        case 'THRESHOLD':
          return {
            checked: r.checked || false,
            code: r.code,
            description: r.description || '',
            enabled: r.enabled || true,
            title: 'Limite di spesa',
            subtitle: 'Definisci importo minimo o massimo',
          };
        case 'MCC':
          return {
            checked: r.checked || false,
            code: r.code,
            description: r.description || '',
            enabled: r.enabled || true,
            title: 'Merchant Category Code',
            subtitle: 'Ammetti o escludi categorie',
          };
        case 'ATECO':
          return {
            checked: r.checked || false,
            code: r.code,
            description: r.description || '',
            enabled: r.enabled || false,
            title: 'Codice Adeco',
            subtitle: 'Ammetti o escludi categorie',
          };
        case 'TRXCOUNT':
          return {
            checked: r.checked || false,
            code: r.code,
            description: r.description || '',
            enabled: r.enabled || true,
            title: 'Numero di transazioni',
            subtitle: 'Definisci un minimo o massimo',
          };
        case 'REWARDLIMIT':
          return {
            checked: r.checked || false,
            code: r.code,
            description: r.description || '',
            enabled: r.enabled || true,
            title: 'Limite temporale',
            subtitle: 'Definisci un massimale ricorrente',
          };
        case 'DAYHOURSWEEK':
          return {
            checked: r.checked || false,
            code: r.code,
            description: r.description || '',
            enabled: r.enabled || true,
            title: 'Orario della transazione',
            subtitle: 'Definisci una fascia oraria di validità',
          };
        case 'GIS':
          return {
            checked: r.checked || false,
            code: r.code,
            description: r.description || '',
            enabled: r.enabled || false,
            title: 'Area geografica',
            subtitle: 'Scegli la zona di operativà',
          };
        default:
          return {
            checked: false,
            code: '',
            description: '',
            enabled: false,
            title: '',
            subtitle: '',
          };
      }
    } else {
      return {
        checked: false,
        code: '',
        description: '',
        enabled: false,
        title: '',
        subtitle: '',
      };
    }
  });
