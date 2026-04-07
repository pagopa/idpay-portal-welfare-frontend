export const formatCurrencyFromCents = (amountCents?: number) => {
  if (amountCents === undefined || amountCents === null) {
    return '-';
  }
  return (amountCents / 100).toLocaleString('it-IT', {
    style: 'currency',
    currency: 'EUR',
  });
};

export const formatDate = (d?: string) => {
  if (!d) {
    return '-';
  }

  const date = new Date(d);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hour}:${minute}`;
};

export const getFileNameFromAzureUrl = (url: string): string => {
  try {
    const decoded = decodeURIComponent(url);
    const match = decoded.match(/\/([^/?]+)\?/);
    return match ? match[1] : '';
  } catch {
    return '';
  }
};
