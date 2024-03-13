import { mccCodes2MccCodesModel } from '../MccCodes';

const mockedMccCodes = {
  code: '5501',
  description: 'Grandi magazzini',
  checked: true,
};

test('Test mccCodes2MccCodesModel', () => {
  const mcc = mccCodes2MccCodesModel(mockedMccCodes);
  expect(mcc).toStrictEqual({
    code: '5501',
    description: 'Grandi magazzini',
    checked: true,
  });
});
