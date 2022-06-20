import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Product } from '../../model/Product';
import { partiesActions } from '../../redux/slices/partiesSlice';
import { createStore } from '../../redux/store';
import { mockedPartyProducts } from '../../services/__mocks__/productService';
import { useProductRoles } from '../useProductRoles';
import withProductsRolesMap from '../../decorators/withProductsRolesMap';
import { useEffect, useState } from 'react';
import { ProductRole } from '../../model/ProductRole';

jest.mock('../../services/productService');

const renderApp = (product: Product, injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const Component = () => {
    const [productRoles, setProductRoles] = useState<Array<ProductRole>>();
    const fetchProductRoles = useProductRoles();

    useEffect(() => {
      fetchProductRoles(product)
        .then((r) => setProductRoles(r.list))
        .catch((r) => console.error(r));
    }, []);

    return productRoles ? (
      <>RENDERED using useProductRoles and fetching {product.id}</>
    ) : (
      <>NOT RETRIEVED</>
    );
  };

  render(
    <Provider store={store}>
      <Component />
    </Provider>
  );
  return store;
};

const renderWithProductsRolesMapDecorated = (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const Component = () => <>RENDERED using withProductsRolesMap</>;
  const DecoratedComponent = withProductsRolesMap(Component);
  render(
    <Provider store={store}>
      <DecoratedComponent />
    </Provider>
  );
  return store;
};

let fetchProductRolesSpy: jest.SpyInstance;

beforeEach(() => {
  fetchProductRolesSpy = jest.spyOn(require('../../services/productService'), 'fetchProductRoles');
});

test('Test', async () => {
  const store = renderApp(mockedPartyProducts[0]);
  await waitFor(() =>
    screen.getByText(`RENDERED using useProductRoles and fetching ${mockedPartyProducts[0].id}`)
  );
  await (
    await waitFor(() => expect(store.getState().parties.selectedProductsRolesMap))
  ).not.toBeUndefined();

  await checkProductsRolesMapLength(1, store);

  renderApp(mockedPartyProducts[1], store);
  await waitFor(() =>
    screen.getByText(`RENDERED using useProductRoles and fetching ${mockedPartyProducts[1].id}`)
  );
  await checkProductsRolesMapLength(2, store);

  renderApp(mockedPartyProducts[0], store);
  await waitFor(() =>
    expect(
      screen.getAllByText(
        `RENDERED using useProductRoles and fetching ${mockedPartyProducts[0].id}`
      ).length
    ).toBe(2)
  );
  await checkProductsRolesMapLength(2, store);

  store.dispatch(partiesActions.setPartySelectedProducts(mockedPartyProducts));
  renderWithProductsRolesMapDecorated(store);
  await waitFor(() => screen.getByText('RENDERED using withProductsRolesMap'));

  await checkProductsRolesMapLength(
    mockedPartyProducts.filter((p) => p.status === 'ACTIVE').length,
    store
  );

  renderApp(mockedPartyProducts[2], store);
  await waitFor(() =>
    screen.getAllByText(`RENDERED using useProductRoles and fetching ${mockedPartyProducts[2].id}`)
  );

  renderApp(mockedPartyProducts[0], store);
  await waitFor(() =>
    expect(
      screen.getAllByText(
        `RENDERED using useProductRoles and fetching ${mockedPartyProducts[0].id}`
      ).length
    ).toBe(3)
  );

  await checkProductsRolesMapLength(
    mockedPartyProducts.filter((p) => p.status === 'ACTIVE').length,
    store
  );

  expect(fetchProductRolesSpy).toBeCalledTimes(
    mockedPartyProducts.filter((p) => p.status === 'ACTIVE').length
  );
});

const checkProductsRolesMapLength = async (
  expectedProductCached: number,
  store: ReturnType<typeof createStore>
) => {
  await waitFor(() =>
    expect(Object.keys(store.getState().parties.selectedProductsRolesMap).length).toBe(
      expectedProductCached
    )
  );
};
