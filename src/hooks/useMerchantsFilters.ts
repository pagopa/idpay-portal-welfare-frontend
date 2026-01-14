interface MerchantsFilters {
    assigneeFilter: string;
    page: number;
    pageSize: number;
}

// eslint-disable-next-line functional/no-let
let filters: MerchantsFilters = {
    assigneeFilter: '',
    page: 0,
    pageSize: 10,
};

export const setMerchantsFilters = (newFilters: Partial<MerchantsFilters>) => {
    filters = { ...filters, ...newFilters };
};

export const getMerchantsFilters = (): MerchantsFilters => ({ ...filters });