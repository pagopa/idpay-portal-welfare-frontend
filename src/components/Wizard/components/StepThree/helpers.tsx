/* eslint-disable complexity */
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import TagIcon from '@mui/icons-material/Tag';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import PinDropIcon from '@mui/icons-material/PinDrop';

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
            title: 'Codice Ateco',
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

type Colors =
  | 'inherit'
  | 'disabled'
  | 'action'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning'
  | undefined;

export const renderShopRuleIcon = (code: string, margin: number, color: Colors) => {
  switch (code) {
    case 'THRESHOLD':
      return <EuroSymbolIcon color={color} sx={{ mr: margin }} />;
    case 'MCC':
      return <CreditCardIcon color={color} sx={{ mr: margin }} />;
    case 'ATECO':
      return <StorefrontIcon color={color} sx={{ mr: margin }} />;
    case 'TRXCOUNT':
      return <TagIcon color={color} sx={{ mr: margin }} />;
    case 'REWARDLIMIT':
      return <CalendarTodayIcon color={color} sx={{ mr: margin }} />;
    case 'DAYHOURSWEEK':
      return <WatchLaterIcon color={color} sx={{ mr: margin }} />;
    case 'GIS':
      return <PinDropIcon color={color} sx={{ mr: margin }} />;
    default:
      return null;
  }
};

export const handleShopRulesToSubmit = (
  shopRulesToSubmit: Array<{ code: string | undefined; dispatched: boolean }>,
  code: string | undefined
) => {
  const newShopRulesToSubmit: Array<{ code: string | undefined; dispatched: boolean }> = [];
  shopRulesToSubmit.forEach((s) => {
    if (s.code !== code) {
      // eslint-disable-next-line functional/immutable-data
      newShopRulesToSubmit.push(s);
    } else {
      // eslint-disable-next-line functional/immutable-data
      newShopRulesToSubmit.push({ code: s.code, dispatched: true });
    }
  });
  return newShopRulesToSubmit;
};

export const setError = (touched: boolean | undefined, errorText: string | undefined) =>
  touched && Boolean(errorText);

export const setErrorText = (touched: boolean | undefined, errorText: string | undefined) =>
  touched && errorText;
