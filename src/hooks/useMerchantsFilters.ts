interface MerchantsFilters {
    assigneeFilter: string | null;
    page: number | null;
    pageSize: number | null;
}

const defaultMerchantsFilters: MerchantsFilters = {
    assigneeFilter: null,
    page: null,
    pageSize: null,
};

// eslint-disable-next-line functional/no-let
let filters: MerchantsFilters = { ...defaultMerchantsFilters };

export const setMerchantsFilters = (newFilters: Partial<MerchantsFilters>) => {
    filters = { ...filters, ...newFilters };
};

export const resetMerchantsFilters = () => {
    filters = { ...defaultMerchantsFilters };
};

export const getMerchantsFilters = (): MerchantsFilters => ({ ...filters });