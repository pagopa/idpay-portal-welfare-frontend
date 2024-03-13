import { shopRules2ShopRulesItem } from '../ShopRules';

const mockedShopRules = {
  checked: true,
  code: 'THRESHOLD',
  description: '',
  enabled: true,
  title: 'Limite di spesa',
  subtitle: 'Definisci importo minimo o massimo',
};

test('Test shopRules2ShopRulesItem', () => {
  const shop = shopRules2ShopRulesItem(mockedShopRules);
  expect(shop).toStrictEqual({
    checked: true,
    code: 'THRESHOLD',
    description: '',
    enabled: true,
    title: 'Limite di spesa',
    subtitle: 'Definisci importo minimo o massimo',
  });
});
