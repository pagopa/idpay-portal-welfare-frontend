import { useState, useEffect, useMemo } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, Checkbox, Button, Chip, TableSortLabel } from "@mui/material";
import { ButtonNaked } from "@pagopa/mui-italia";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTranslation } from "react-i18next";
import { useErrorDispatcher, useLoading } from "@pagopa/selfcare-common-frontend";
import { matchPath, useHistory } from "react-router-dom";
import { getBatchTrx } from "../../hooks/useBatchTrx";
import { initiativePagesBreadcrumbsContainerStyle } from "../../helpers";
import BreadcrumbsBox from "../components/BreadcrumbsBox";
import ROUTES from "../../routes";
import { useInitiative } from "../../hooks/useInitiative";
import { LOADING_TASK_INITIATIVE_REFUNDS_MERCHANTS } from "../../utils/constants";
import { getMerchantTransactionsProcessed } from "../../services/merchantsService";
import { MerchantTransactionProcessedDTO } from "../../api/generated/merchants/MerchantTransactionProcessedDTO";
import { RewardBatchTrxStatusEnum } from "../../api/generated/merchants/RewardBatchTrxStatus";

export interface TrxItem {
    raw: MerchantTransactionProcessedDTO;
    id: string;
    date: string;
    shop: string;
    amountCents: number;
    statusLabel: string;
    statusColor: string;
    invoiceFilename?: string;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const InitiativeRefundsTransactions = () => {
    const { t } = useTranslation();
    const batchData = getBatchTrx();
    const batch = useMemo(() => batchData, [batchData?.id]);

    const [draftStatusFilter, setDraftStatusFilter] = useState<string | "">("");
    const [statusFilter, setStatusFilter] = useState<string | "">("");
    const [draftPosFilter, setDraftPosFilter] = useState<string>("");
    const [posFilter, setPosFilter] = useState<string>("");

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, totalElements);

    const [rows, setRows] = useState<Array<TrxItem>>([]);
    useInitiative();
    interface MatchParams {
        id: string;
    }
    const addError = useErrorDispatcher();
    const match = matchPath(location.pathname, {
        path: [ROUTES.INITIATIVE_REFUNDS_TRANSACTIONS],
        exact: true,
        strict: false,
    });
    const { id } = (match?.params as MatchParams) || {};
    const setLoading = useLoading(LOADING_TASK_INITIATIVE_REFUNDS_MERCHANTS);
    const history = useHistory();
    const isFilterDisabled =
        (draftStatusFilter === "" || draftStatusFilter === statusFilter) &&
        (draftPosFilter === "" || draftPosFilter === posFilter);

    type SortState = "" | "asc" | "desc";
    const [dateSort, setDateSort] = useState<SortState>("");

    useMemo(() => {
        setPage(0);
    }, [id]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id, page]);

    useEffect(() => {
        setPage(0);
    }, [pageSize]);

    useEffect(() => {
        if (!batch) { return; };
        getTableData(id);

    }, [batch, page, pageSize, posFilter, statusFilter, dateSort]);

    const getTableData = (initiativeId: string) => {
        if (!batch?.merchantId) {
            throw new Error("Invalid Merchant ID");
        }

        setLoading(true);

        const sort = dateSort === "" ? undefined : `trxChargeDate, ${dateSort}`;

        getMerchantTransactionsProcessed(
            batch.merchantId,
            initiativeId,
            page,
            pageSize,
            sort,
            undefined, // fiscal code
            undefined, // status
            batch.id,
            statusFilter as RewardBatchTrxStatusEnum || undefined,
            posFilter || undefined
        )
            .then((res) => {
                setTotalElements(res.totalElements);
                setTotalPages(res.totalPages);

                const rowsData: Array<TrxItem> = res.content.map((r) =>
                    mapTransactionDTO(r)
                );

                setRows(rowsData);
            })
            .catch((error) => {
                addError({
                    id: "GET_TRX_PAGED_ERROR",
                    blocking: false,
                    error,
                    techDescription: "Error retrieving transactions",
                    displayableTitle: t("errors.title"),
                    displayableDescription: t("errors.getDataDescription"),
                    toNotify: true,
                    component: "Toast",
                    showCloseIcon: true,
                });
            })
            .finally(() => setLoading(false));
    };

    const mapTransactionStatus = (status?: RewardBatchTrxStatusEnum) => {
        switch (status) {
            case RewardBatchTrxStatusEnum.SUSPENDED:
                return { label: "Da esaminare", color: "info" };

            case RewardBatchTrxStatusEnum.CONSULTABLE:
                return { label: "Consultabile", color: "default" };

            case RewardBatchTrxStatusEnum.TO_CHECK:
                return { label: "Da controllare", color: "warning" };

            case RewardBatchTrxStatusEnum.APPROVED:
                return { label: "Approvata", color: "success" };

            case RewardBatchTrxStatusEnum.REJECTED:
                return { label: "Esclusa", color: "error" };

            default:
                return { label: "-", color: "default" };
        }
    };

    const mapTransactionDTO = (r: MerchantTransactionProcessedDTO): TrxItem => {
        const uiStatus = mapTransactionStatus(r.rewardBatchTrxStatus);

        return {
            raw: r,

            id: r.trxId,

            date: r.trxDate
                ? new Date(r.trxDate).toLocaleString("it-IT")
                : "-",

            shop: r.franchiseName ?? r.pointOfSaleId ?? "-",

            amountCents: r.effectiveAmountCents,

            statusLabel: uiStatus.label,
            statusColor: uiStatus.color,

            invoiceFilename: r.invoiceFile?.filename,
        };
    };

    const handleFilterClick = () => {
        setStatusFilter(draftStatusFilter);
        setPosFilter(draftPosFilter);
        setPage(0);
    };

    const handleRemoveFilters = () => {
        setStatusFilter("");
        setPosFilter("");
        setDraftPosFilter("");
        setDraftStatusFilter("");
        setPage(0);
    };

    const toggleDateSort = () => {
        setDateSort(prev => {
            if (prev === "") { return "asc"; }
            if (prev === "asc") { return "desc"; }
            return "";
        });
        setPage(0);
    };

    if (!batch && id) {
        history.replace(ROUTES.INITIATIVE_REFUNDS.replace(":id", id));
    }

    if (!batch) {
        return null;
    }

    return (
        <Box sx={{ width: "100%", pt: 2, px: 2 }}>
            <Box sx={initiativePagesBreadcrumbsContainerStyle}>
                <BreadcrumbsBox
                    backUrl={ROUTES.INITIATIVE_REFUNDS.replace(":id", id)}
                    backLabel={t("breadcrumbs.back")}
                    items={[t('breadcrumbs.initiativeRefunds'), batch.businessName]}
                />
            </Box>

            <Box sx={{ display: "flex", gap: 3, mt: 3, mb: 3, alignItems: "center" }}>
                <FormControl size="small" sx={{
                    minWidth: 150, "& .MuiInputLabel-root": {
                        fontSize: 14,
                        lineHeight: "normal"
                    }
                }}>
                    <InputLabel>{t('pages.initiativeMerchantsTransactions.table.pos')}</InputLabel>
                    <Select
                        value={draftPosFilter}
                        label={t('pages.initiativeMerchantsTransactions.table.pos')}
                        onChange={(e) => setDraftPosFilter(e.target.value)}
                        sx={{ height: 40 }}
                    >
                        <MenuItem value="">Tutti</MenuItem>
                        <MenuItem value={batch.businessName}>{batch.businessName}</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{
                    minWidth: 150, "& .MuiInputLabel-root": {
                        fontSize: 14,
                        lineHeight: "normal"
                    }
                }}>
                    <InputLabel>{t('pages.initiativeMerchantsTransactions.table.status')}</InputLabel>
                    <Select
                        value={draftStatusFilter}
                        label={t('pages.initiativeMerchantsTransactions.table.status')}
                        onChange={(e) => setDraftStatusFilter(e.target.value)}
                        sx={{ height: 40 }}
                    >
                        <MenuItem value={RewardBatchTrxStatusEnum.SUSPENDED}>Da esaminare</MenuItem>
                        <MenuItem value={RewardBatchTrxStatusEnum.CONSULTABLE}>Consultabile</MenuItem>
                        <MenuItem value={RewardBatchTrxStatusEnum.TO_CHECK}>Da controllare</MenuItem>
                        <MenuItem value={RewardBatchTrxStatusEnum.APPROVED}>Approvata</MenuItem>
                        <MenuItem value={RewardBatchTrxStatusEnum.REJECTED}>Esclusa</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    variant="outlined"
                    color="primary"
                    disabled={isFilterDisabled}
                    onClick={handleFilterClick}
                    sx={{
                        height: "40px",
                        paddingX: 3,
                        fontWeight: 600,
                        borderRadius: "4px",
                        textTransform: "none"
                    }}
                >
                    {t('pages.initiativeMerchantDetail.filterBtn')}
                </Button>

                <ButtonNaked
                    color="primary"
                    disabled={!posFilter && !statusFilter}
                    onClick={handleRemoveFilters}
                    sx={{
                        height: "40px",
                        paddingX: 2,
                        fontWeight: 600,
                        textTransform: "none",
                        opacity: posFilter || statusFilter ? 1 : 0.5
                    }}
                >
                    {t('pages.initiativeMerchant.form.removeFiltersBtn')}
                </ButtonNaked>
            </Box>

            <Table sx={{ mt: 2 }}>
                <TableHead>
                    <TableRow>
                        <TableCell><Checkbox /></TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{t('pages.initiativeMerchantsTransactions.table.invoice')}</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{t('pages.initiativeMerchantsTransactions.table.pos')}</TableCell>
                        <TableCell sortDirection={dateSort === "" ? false : dateSort} >
                            <TableSortLabel
                                active={dateSort !== ""}
                                direction={dateSort === "" ? "asc" : dateSort}
                                onClick={toggleDateSort}
                            >
                                {t("pages.initiativeMerchantsTransactions.table.dateTime")}
                            </TableSortLabel>
                        </TableCell>

                        <TableCell sx={{ whiteSpace: "nowrap" }}>{t('pages.initiativeMerchantsTransactions.table.requestedRefund')}</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{t('pages.initiativeMerchantsTransactions.table.status')}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>

                <TableBody sx={{ backgroundColor: "#FFFFFF" }}>
                    {rows.map((row) => (
                        <TableRow key={row.id} hover>
                            <TableCell>
                                {/* TODO CHECKBOX */}
                                <Checkbox />
                            </TableCell>

                            <TableCell>
                                <ButtonNaked
                                    color="primary"
                                    onClick={() => console.log("open file")}
                                >
                                    Nome_fattura.xml
                                </ButtonNaked>
                            </TableCell>

                            <TableCell>{row.shop}</TableCell>
                            <TableCell>{row.date}</TableCell>

                            <TableCell>
                                {(row.amountCents / 100).toLocaleString("it-IT", {
                                    style: "currency",
                                    currency: "EUR",
                                })}
                            </TableCell>

                            <TableCell>
                                <Chip
                                    label={row.statusLabel}
                                    color={row.statusColor as any}
                                    sx={{
                                        fontSize: "14px",
                                        "& .MuiChip-label": { whiteSpace: "nowrap" }
                                    }}
                                />
                            </TableCell>

                            <TableCell sx={{ textAlign: "right" }}>
                                <ButtonNaked onClick={() => console.log(row.raw)}>
                                    <ChevronRightIcon color="primary" onClick={() => console.log(row.raw)} />
                                </ButtonNaked>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Box
                sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 3,
                    color: "#33485C",
                    fontSize: "14px",
                    fontWeight: 500,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>{t('pages.initiativeMerchantsRefunds.rowsPerPage')}</span>

                    <FormControl size="small">
                        <Select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            sx={{
                                height: 32,
                                "& .MuiSelect-select": { paddingY: "3px" },
                            }}
                        >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box>{`${start}–${end} di ${totalElements}`}</Box>

                <ChevronLeftIcon
                    onClick={() => page > 0 && setPage(page - 1)}
                    sx={{
                        cursor: page > 0 ? "pointer" : "default",
                        opacity: page > 0 ? 1 : 0.3,
                        fontSize: 20,
                    }}
                />

                <ChevronRightIcon
                    onClick={() => page < totalPages - 1 && setPage(page + 1)}
                    sx={{
                        cursor: page < totalPages - 1 ? "pointer" : "default",
                        opacity: page < totalPages - 1 ? 1 : 0.3,
                        fontSize: 20,
                    }}
                />
            </Box>
        </Box>
    );
};

export default InitiativeRefundsTransactions;