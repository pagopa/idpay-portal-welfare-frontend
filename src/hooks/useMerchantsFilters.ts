interface MerchantsFilters {
    assigneeFilter: string | null;
    nameFilter: string | null;
    periodFilter: string | null;
    statusFilter: string | null;
    page: number | null;
    pageSize: number | null;
    dateSort:  "" | "asc" | "desc";
}

const defaultMerchantsFilters: MerchantsFilters = {
    assigneeFilter: null,
    nameFilter: null,
    periodFilter: null,
    statusFilter: null,
    page: null,
    pageSize: null,
    dateSort: ""
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