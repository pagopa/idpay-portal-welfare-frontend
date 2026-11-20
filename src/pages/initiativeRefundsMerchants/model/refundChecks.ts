import config from './refundChecks.config.json';

export const isDecoderInitiative = (initiativeName: string): boolean =>
  /^bonus\s+decoder(?:\s|$)/i.test(initiativeName.trim());

export const getMinimumChecksPercentage = (initiativeName: string): number =>
  (config.initiatives as Record<string, number>)[
    isDecoderInitiative(initiativeName) ? 'bonus decoder' : initiativeName.trim().toLowerCase()
  ] ?? config.defaultMinimumChecksPercentage;

export const hasMinimumBatchChecks = (
  batch: { numberOfTransactions: number; numberOfTransactionsElaborated: number },
  minimumChecksPercentage: number
): boolean =>
  batch.numberOfTransactions === 0 ||
  batch.numberOfTransactionsElaborated * 100 >=
    batch.numberOfTransactions * minimumChecksPercentage;
