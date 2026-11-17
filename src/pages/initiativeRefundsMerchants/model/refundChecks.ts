import config from './refundChecks.config.json';

export const getMinimumChecksPercentage = (initiativeName: string): number =>
  (config.initiatives as Record<string, number>)[initiativeName.trim().toLowerCase()] ??
  config.defaultMinimumChecksPercentage;

export const hasMinimumBatchChecks = (
  batch: { numberOfTransactions: number; numberOfTransactionsElaborated: number },
  minimumChecksPercentage: number
): boolean =>
  batch.numberOfTransactions === 0 ||
  batch.numberOfTransactionsElaborated * 100 >=
    batch.numberOfTransactions * minimumChecksPercentage;
