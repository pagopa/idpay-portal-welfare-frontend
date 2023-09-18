import { FormikProps } from 'formik';
import { Dispatch, SetStateAction } from 'react';

export const filterByStatusOptionsListMT = [
  {
    value: 'IDENTIFIED',
    label: 'pages.initiativeMerchantDetail.transactionStatusEnum.identified',
  },
  {
    value: 'AUTHORIZED',
    label: 'pages.initiativeMerchantDetail.transactionStatusEnum.authorized',
  },
  {
    value: 'REJECTED',
    label: 'pages.initiativeMerchantDetail.transactionStatusEnum.invalidated',
  },
];

export const filterByStatusOptionsListMTP = [
  {
    value: 'REWARDED',
    label: 'pages.initiativeMerchantDetail.transactionStatusEnum.rewarded',
  },
  {
    value: 'CANCELLED',
    label: 'pages.initiativeMerchantDetail.transactionStatusEnum.cancelled',
  },
];

export const resetForm = (
  merchantId: string | undefined,
  initiativeId: string | undefined,
  formik: FormikProps<{ searchUser: string; filterStatus: string }>,
  setFilterByUser: Dispatch<SetStateAction<string | undefined>>,
  setFilterByStatus: Dispatch<SetStateAction<string | undefined>>,
  setRows: Dispatch<SetStateAction<Array<any>>>,
  getTableData: (
    merchantId: string,
    initiativeId: string,
    page: number,
    fiscalCode: string | undefined,
    status: string | undefined
  ) => void
) => {
  const initialValues = { searchUser: '', filterStatus: '' };
  formik.resetForm({ values: initialValues });
  setFilterByUser(undefined);
  setFilterByStatus(undefined);
  setRows([]);
  if (typeof merchantId === 'string' && typeof initiativeId === 'string') {
    getTableData(merchantId, initiativeId, 0, undefined, undefined);
  }
};

export const tableHeadData = [
  { width: '20%', label: 'pages.initiativeMerchantDetail.date' },
  { width: '40%', label: 'pages.initiativeMerchantDetail.beneficiary' },
  { width: '15%', label: 'pages.initiativeMerchantDetail.totalSpent' },
  { width: '15%', label: 'pages.initiativeMerchantDetail.authorizedAmount' },
  { width: '10%', label: 'pages.initiativeMerchantDetail.transactionStatus' },
];

export const containerStyle = {
  display: 'grid',
  width: '100%',
  gridTemplateColumns: 'repeat(12, 1fr)',
  alignItems: 'center',
  mt: 3,
};
