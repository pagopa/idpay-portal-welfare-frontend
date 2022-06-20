import { mockedProductResources } from '../../api/__mocks__/DashboardApiClient';
import { DashboardApi } from '../../api/DashboardApiClient';
import { fetchProducts, fetchProductRoles } from '../productService';
import { productResource2Product } from '../../model/Product';
import { mockedPartyProducts } from '../__mocks__/productService';

jest.mock('../../api/DashboardApiClient');

beforeEach(() => {
  jest.spyOn(DashboardApi, 'getProducts');
  jest.spyOn(DashboardApi, 'getProductRoles');
});

test('Test fetchProducts', async () => {
  const products = await fetchProducts('1');

  expect(products).toMatchObject(mockedProductResources.map(productResource2Product));

  expect(DashboardApi.getProducts).toBeCalledTimes(1);
});

test('Test fetchProductRoles', async () => {
  const productRoles = await fetchProductRoles(mockedPartyProducts[0]);

  expect(productRoles).toStrictEqual([
    {
      productId: mockedPartyProducts[0].id,
      partyRole: 'SUB_DELEGATE',
      selcRole: 'ADMIN',
      multiroleAllowed: false,
      productRole: 'incaricato-ente-creditore',
      title: 'Incaricato Ente Creditore',
      description: 'Descrizione incaricato-ente-creditore',
    },
    {
      productId: mockedPartyProducts[0].id,
      partyRole: 'OPERATOR',
      selcRole: 'LIMITED',
      multiroleAllowed: true,
      productRole: 'referente-dei-pagamenti',
      title: 'Referente dei Pagamenti',
      description: 'Descrizione referente-dei-pagamenti',
    },
    {
      productId: mockedPartyProducts[0].id,
      partyRole: 'OPERATOR',
      selcRole: 'LIMITED',
      multiroleAllowed: true,
      productRole: 'referente-tecnico',
      title: 'Referente Tecnico',
      description: 'Descrizione referente-tecnico',
    },
  ]);

  expect(DashboardApi.getProductRoles).toBeCalledWith(mockedPartyProducts[0].id);
});
