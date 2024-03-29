/* eslint-disable functional/immutable-data */
import { Chip } from '@mui/material';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import * as Yup from 'yup';
import { parse } from 'date-fns';

export const renderInitiativeStatus = (status: string | undefined) => {
  switch (status) {
    case 'DRAFT':
      return (
        <Chip
          sx={{ fontSize: '14px' }}
          label={i18n.t('pages.initiativeList.status.draft')}
          color="default"
        />
      );
    case 'IN_REVISION':
      return (
        <Chip
          label={i18n.t('pages.initiativeList.status.inRevision')}
          sx={{ fontSize: '14px' }}
          color="warning"
        />
      );
    case 'TO_CHECK':
      return (
        <Chip
          sx={{ fontSize: '14px' }}
          label={i18n.t('pages.initiativeList.status.toCheck')}
          color="error"
        />
      );
    case 'APPROVED':
      return (
        <Chip
          sx={{ fontSize: '14px' }}
          label={i18n.t('pages.initiativeList.status.approved')}
          color="success"
        />
      );
    case 'PUBLISHED':
      return (
        <Chip
          sx={{ fontSize: '14px' }}
          label={i18n.t('pages.initiativeList.status.published')}
          color="indigo"
        />
      );
    case 'CLOSED':
      return (
        <Chip
          sx={{ fontSize: '14px' }}
          label={i18n.t('pages.initiativeList.status.closed')}
          color="default"
        />
      );
    case 'SUSPENDED':
      return (
        <Chip
          sx={{ fontSize: '14px' }}
          label={i18n.t('pages.initiativeList.status.suspended')}
          color="error"
        />
      );
    default:
      return null;
  }
};

export const peopleReached = (totalBudget: string, budgetPerPerson: string): any => {
  const totalBudgetInt = parseFloat(totalBudget);
  const budgetPerPersonInt = parseFloat(budgetPerPerson);
  return Math.floor(totalBudgetInt / budgetPerPersonInt);
};

export const formatFileName = (name: string | undefined): string => {
  if (typeof name === 'string' && name.length > 15) {
    const nameArr = name.split('.');
    const fileExtension = nameArr[nameArr.length - 1];
    const truncatedName = name.substring(0, 10);
    return `${truncatedName}... .${fileExtension}`;
  } else if (typeof name === 'string' && name.length <= 15) {
    return name;
  }
  return '';
};

export const numberWithCommas = (x: number | string | undefined) => {
  if (typeof x === 'string' && x.length > 0) {
    const xFormatted = x.replace(/\./g, '').replace(/,/g, '.');
    const xFloat = parseFloat(xFormatted);
    return xFloat.toLocaleString('de-DE');
  }
  if (typeof x === 'number') {
    return x.toLocaleString('de-DE');
  }
  return '0';
};

export const formatIban = (iban: string | undefined) => {
  if (iban) {
    return `${iban.slice(0, 2)} ${iban.slice(2, 4)} ${iban.slice(4, 5)} ${iban.slice(
      5,
      10
    )} ${iban.slice(10, 15)} ${iban.slice(15, 32)}`;
  }
  return '';
};

export const formatedCurrency = (
  number: number | undefined,
  symbol: string = '-',
  cents = false
) => {
  if (number && cents === false) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(number);
  } else if (number && cents === true) {
    const roundedNumberStr = number.toFixed(2);
    const roundedNumber = parseFloat(roundedNumberStr) / 100;
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
      roundedNumber
    );
  }
  return symbol;
};

export const formatedDate = (date: Date | undefined, symbol: string = '-') => {
  if (date) {
    return date.toLocaleString('fr-BE', { year: 'numeric', month: 'numeric', day: 'numeric' });
  }
  return symbol;
};

export const formatStringToDate = (date: string | undefined) => {
  if (typeof date === 'string') {
    const newDate = new Date(date);
    if (newDate) {
      return newDate.toLocaleString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Europe/Rome',
        hour: 'numeric',
        minute: 'numeric',
      });
    }
  }
  return '';
};

export const formatAddress = (
  street: string | undefined,
  municipality: string | undefined,
  province: string | undefined,
  zipCpde: string | undefined
) => {
  const s = street || '-';
  const m = municipality || ' -';
  const p = province || ' -';
  const z = zipCpde || ' -';

  return `${s}, ${m}, ${p}, ${z}`;
};

export const getMaskedPan = (pan: string | undefined) => {
  if (typeof pan === 'string') {
    const regexp = new RegExp('^[0-9]*$');
    const isNumber = regexp.test(pan);
    if (isNumber) {
      return `**** ${pan?.substring(-4)}`;
    }
    return pan;
  }
  return '****';
};

export const mappedChannel = (channel: string | undefined) => {
  switch (channel) {
    case 'APP_IO':
      return i18n.t('pages.initiativeUserDetails.appIo');
    case 'ISSUER':
      return i18n.t('pages.initiativeUserDetails.issuer');
    default:
      return '-';
  }
};

export const getTimeLineMaskedPan = (id: string, pan: string | undefined) => {
  if (id && typeof pan === 'string') {
    const regexp = new RegExp('^[0-9]*$');
    const isNumber = regexp.test(pan);
    if (isNumber) {
      return `**** ${pan?.substring(-4)}`;
    }
    return pan;
  }
  return '****';
};

export const formatedTimeLineCurrency = (id: string, number: number | undefined) => {
  if (id && number) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(number);
  }
  return '';
};

export const initiativeUsersAndRefundsValidationSchema = Yup.object().shape({
  searchFrom: Yup.date()
    .nullable()
    .transform(function (value, originalValue) {
      if (this.isType(value)) {
        return value;
      }
      return parse(originalValue, 'dd/MM/yyyy', new Date());
    })
    .typeError(i18n.t('validation.invalidDate')),
  searchTo: Yup.date()
    .nullable()
    // eslint-disable-next-line sonarjs/no-identical-functions
    .transform(function (value, originalValue) {
      if (this.isType(value)) {
        return value;
      }
      return parse(originalValue, 'dd/MM/yyyy', new Date());
    })
    .typeError(i18n.t('validation.invalidDate'))
    .when('searchFrom', (searchFrom, _schema) => {
      const timestamp = Date.parse(searchFrom);
      if (isNaN(timestamp) === false) {
        return Yup.date()
          .nullable()
          .min(searchFrom, i18n.t('validation.outDateTo'))
          .typeError(i18n.t('validation.invalidDate'));
      } else {
        return Yup.date().nullable().typeError(i18n.t('validation.invalidDate'));
      }
    }),
});

export const cleanDate = (d: Date, mod: 'start' | 'end'): string | undefined => {
  const hours = mod === 'start' ? 'T00:00:00Z' : 'T23:59:59Z';
  return d.toLocaleDateString('fr-CA').length > 0
    ? `${d.toLocaleDateString('fr-CA')}${hours}`
    : undefined;
};

export const getRefundStatusChip = (status: {
  status: string | undefined;
  percentageResulted: string | undefined;
}) => {
  switch (status.status) {
    case 'EXPORTED':
      return (
        <Chip
          sx={{ fontSize: '14px' }}
          label={i18n.t('pages.initiativeRefunds.status.exported')}
          color="default"
        />
      );
    case 'PARTIAL':
      return (
        <Chip
          sx={{ fontSize: '14px' }}
          label={
            status.percentageResulted
              ? i18n.t('pages.initiativeRefunds.status.partial', {
                  percentage: status?.percentageResulted || '',
                })
              : i18n.t('pages.initiativeRefunds.status.partialNoPerc')
          }
          color="warning"
        />
      );
    case 'COMPLETE':
      return (
        <Chip
          sx={{ fontSize: '14px' }}
          label={i18n.t('pages.initiativeRefunds.status.complete')}
          color="success"
        />
      );
    default:
      return null;
  }
};

export const initiativePagesBreadcrumbsContainerStyle = {
  display: 'grid',
  width: '100%',
  gridTemplateColumns: 'repeat(12, 1fr)',
  alignItems: 'center',
};

export const initiativePagesFiltersFormContainerStyle = {
  display: 'grid',
  width: '100%',
  gridTemplateColumns: 'repeat(12, 1fr)',
  alignItems: 'baseline',
  gap: 2,
  mb: 4,
};

export const initiativePagesTableContainerStyle = {
  display: 'grid',
  width: '100%',
  height: '100%',
  gridTemplateColumns: 'repeat(12, 1fr)',
  alignItems: 'center',
};

export const copyTextToClipboard = (text: string | undefined) => {
  if (typeof text === 'string') {
    void navigator.clipboard.writeText(text);
  }
};

export const fileFromReader = async (
  reader: ReadableStreamDefaultReader<Uint8Array> | undefined
): Promise<string> => {
  const stream = new ReadableStream({
    start(controller) {
      return pump();
      function pump(): Promise<any> | undefined {
        return reader?.read().then(({ done, value }) => {
          if (done) {
            controller.close();
            return;
          }
          controller.enqueue(value);
          return pump();
        });
      }
    },
  });
  const response = new Response(stream);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const downloadURI = (uri: string, filename: string) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = uri;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const initUploadBoxStyle = {
  gridColumn: 'span 12',
  alignItems: 'center',
  justifyItems: 'center',
  width: '100%',
  border: '1px dashed #0073E6',
  borderRadius: '10px',
  backgroundColor: 'rgba(0, 115, 230, 0.08)',
  p: 3,
};

export const initUploadHelperBoxStyle = {
  gridColumn: 'span 12',
  alignItems: 'center',
  justifyItems: 'center',
  width: '100%',
  py: 1,
  px: 3,
};
