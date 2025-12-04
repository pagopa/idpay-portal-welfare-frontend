import { Box, Button, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from "@mui/material";
import { TitleBox, useLoading } from "@pagopa/selfcare-common-frontend";
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { useEffect, useMemo, useState } from "react";
import { useHistory, matchPath } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ButtonNaked, Colors, Tag } from "@pagopa/mui-italia";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { initiativePagesBreadcrumbsContainerStyle } from "../../helpers";
import ROUTES from "../../routes";
import { setBatchTrx } from "../../hooks/useBatchTrx";
import BreadcrumbsBox from "../components/BreadcrumbsBox";
import { initiativeSelector } from "../../redux/slices/initiativeSlice";
import { useAppSelector } from "../../redux/hooks";
import { useInitiative } from "../../hooks/useInitiative";
import { getRewardBatches } from "../../services/merchantsService";
import { LOADING_TASK_INITIATIVE_REFUNDS_MERCHANTS } from "../../utils/constants";

export interface RefundItem {
    id: string;
    merchantId: string;
    businessName: string;
    month: string;
    posType: "ONLINE" | "FISICO";
    status: string;
    partial: boolean;
    name: string;
    startDate: string;
    endDate: string;
    totalAmountCents: number;
    approvedAmountCents: number;
    initialAmountCents: number;
    numberOfTransactions: number;
    numberOfTransactionsSuspended: number;
    numberOfTransactionsRejected: number;
    numberOfTransactionsElaborated: number;
    assigneeLevel: "L1" | "L2" | "L3";
}

export interface RefundsPage {
    content: Array<RefundItem>;
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "APPROVED":
            return "success";
        case "EVALUATING":
            return "info";
        case "SENT":
            return "default";
        case "APPROVING":
            return "warning";
        default:
            return "default";
    }
};

const getStatusLabel = (status: string, t: any) => {
    switch (status) {
        case "APPROVED":
            return t("chip.batch.approved");
        case "EVALUATING":
            return t("chip.batch.evaluating");
        case "SENT":
            return t("chip.batch.sent");
        case "APPROVING":
            return t("chip.batch.approving");
        default:
            return "-";
    }
};

const getPosTypeLabel = (posType: "ONLINE" | "FISICO") =>
    posType ? (posType === "ONLINE" ? "Online" : "Fisico") : '-';

const formatAmount = (amountCents?: number) => {
    if (!amountCents) {
        return "-";
    }
    return (amountCents / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" });
};

const getChecksPercentage = (row: RefundItem) => {
    if (row.numberOfTransactions > 0 && row.numberOfTransactionsElaborated > 0) {
        const percentage = (row.numberOfTransactionsElaborated / row.numberOfTransactions) * 100;
        return `${Math.floor(percentage)}% / 100%`;
    }
    return "0% / 100%";
};

const isRowDisabled = (status: string) => {
    const s = status?.toUpperCase?.() ?? "";
    return s === "SENT" || s === "CREATED";
};

type RefundRowProps = {
    row: RefundItem;
    t: any;
    onClick: () => void;
};

const RefundRow = ({ row, t, onClick }: RefundRowProps) => {
    const status = row.status?.toUpperCase?.() ?? "";
    const isDisabled = isRowDisabled(status);
    const checksPercentage = getChecksPercentage(row);
    const requestedRefund = formatAmount(row.initialAmountCents);
    const approvedRefund = formatAmount(row.approvedAmountCents);

    const handleClick = () => {
        if (!isDisabled) {
            onClick();
        }
    };

    return (
        <TableRow hover>
            <TableCell>
                <Tooltip title={row.businessName}>
                    <Box
                        sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 300
                        }}
                    >
                        {row.businessName}
                    </Box>
                </Tooltip>
            </TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{getPosTypeLabel(row.posType)}</TableCell>
            <TableCell>{requestedRefund}</TableCell>
            <TableCell>{approvedRefund}</TableCell>
            <TableCell>{checksPercentage}</TableCell>
            <TableCell>{row.assigneeLevel}</TableCell>
            <TableCell>
                <Tag
                    value={getStatusLabel(row.status, t)}
                    color={getStatusColor(row.status) as Colors}
                />
            </TableCell>
            <TableCell sx={{ textAlign: "right" }}>
                <ButtonNaked disabled={isDisabled} onClick={handleClick}>
                    <ChevronRightIcon color={isDisabled ? "disabled" : "primary"} />
                </ButtonNaked>
            </TableCell>
        </TableRow>
    );
};

const InitiativeRefundsMerchants = () => {
    const { t } = useTranslation();
    const initiativeSel = useAppSelector(initiativeSelector);
    useInitiative();
    interface MatchParams {
        id: string;
    }
    const addError = useErrorDispatcher();

    const match = matchPath(location.pathname, {
        path: [ROUTES.INITIATIVE_REFUNDS],
        exact: true,
        strict: false,
    });
    const { id } = (match?.params as MatchParams) || {};

    const [assigneeFilter, setAssigneeFilter] = useState<string>("");
    const [draftAssignee, setDraftAssignee] = useState<string>("");

    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, totalElements);

    const isFilterDisabled =
        draftAssignee === "" || draftAssignee === assigneeFilter;
    const setLoading = useLoading(LOADING_TASK_INITIATIVE_REFUNDS_MERCHANTS);
    const [rows, setRows] = useState<Array<RefundItem>>([]);
    const history = useHistory();

    useMemo(() => {
        setPage(0);
    }, [id]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (typeof id === 'string') {
            getTableData(id);
        }
    }, [id, page, assigneeFilter, pageSize]);

    useEffect(() => {
        setPage(0);
    }, [pageSize]);

    const getTableData = (
        initiativeId: string,
    ) => {
        setLoading(true);
        getRewardBatches(initiativeId, page, pageSize, assigneeFilter || undefined)
            .then((res) => {
                if (typeof res.totalElements === 'number') {
                    setTotalElements(res.totalElements);
                }
                if (typeof res.totalPages === 'number') {
                    setTotalPages(res.totalPages);
                }

                if (Array.isArray(res.content) && res.content.length > 0) {
                    const rowsData: Array<RefundItem> = res.content.map((r: any) => ({
                        id: r.id,
                        merchantId: r.merchantId,
                        businessName: r.businessName,
                        month: r.month,
                        posType: r.posType,
                        status: r.status,
                        partial: r.partial,
                        name: r.name,
                        startDate: r.startDate,
                        endDate: r.endDate,
                        totalAmountCents: r.totalAmountCents,
                        approvedAmountCents: r.approvedAmountCents,
                        initialAmountCents: r.initialAmountCents,
                        numberOfTransactions: r.numberOfTransactions,
                        numberOfTransactionsSuspended: r.numberOfTransactionsSuspended,
                        numberOfTransactionsRejected: r.numberOfTransactionsRejected,
                        numberOfTransactionsElaborated: r.numberOfTransactionsElaborated,
                        assigneeLevel: r.assigneeLevel,
                    }));

                    setRows(rowsData);
                } else {
                    setRows([]);
                }
            })
            .catch((error) => {
                addError({
                    id: 'GET_BATCH_PAGED_ERROR',
                    blocking: false,
                    error,
                    techDescription: 'An error occurred getting export paged data',
                    displayableTitle: t('errors.title'),
                    displayableDescription: t('errors.getDataDescription'),
                    toNotify: true,
                    component: 'Toast',
                    showCloseIcon: true,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleFilterClick = () => {
        setAssigneeFilter(draftAssignee);
        setPage(0);
    };

    const handleRemoveFilters = () => {
        setAssigneeFilter("");
        setDraftAssignee("");
        setPage(0);
    };

    return (
        <Box sx={{ width: '100%', pt: 2, px: 2 }}>
            <Box sx={initiativePagesBreadcrumbsContainerStyle}>
                <BreadcrumbsBox
                    backUrl={ROUTES.HOME}
                    backLabel={t('breadcrumbs.back')}
                    items={[initiativeSel.initiativeName, t('breadcrumbs.initiativeRefunds')]}
                />

                <Box sx={{ display: 'grid', gridColumn: 'span 10', mt: 2 }}>
                    <TitleBox
                        title={t('pages.initiativeRefunds.title')}
                        subTitle={t('pages.initiativeRefunds.subtitle')}
                        mbTitle={2}
                        mtTitle={2}
                        mbSubTitle={5}
                        variantTitle="h4"
                        variantSubTitle="body1"
                    />
                </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 3, mt: 3, mb: 3, alignItems: "center" }}>

                <FormControl
                    variant="outlined"
                    size="small"
                    sx={{
                        minWidth: 150,
                        "& .MuiInputLabel-root": {
                            fontSize: 14,
                            lineHeight: "normal"
                        }
                    }}
                >
                    <InputLabel id="assignee-filter-label">
                        {t("pages.initiativeMerchantsRefunds.table.assignee")}
                    </InputLabel>

                    <Select
                        labelId="assignee-filter-label"
                        value={draftAssignee}
                        label={t("pages.initiativeMerchantsRefunds.table.assignee")}
                        onChange={(e) => setDraftAssignee(e.target.value)}
                        sx={{
                            height: 40,
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        <MenuItem value={t("pages.initiativeMerchantsRefunds.L1")}>{t("pages.initiativeMerchantsRefunds.L1")}</MenuItem>
                        <MenuItem value={t("pages.initiativeMerchantsRefunds.L2")}>{t("pages.initiativeMerchantsRefunds.L2")}</MenuItem>
                        <MenuItem value={t("pages.initiativeMerchantsRefunds.L3")}>{t("pages.initiativeMerchantsRefunds.L3")}</MenuItem>
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
                    disabled={!assigneeFilter}
                    onClick={handleRemoveFilters}
                    sx={{
                        height: "40px",
                        paddingX: 2,
                        fontWeight: 600,
                        textTransform: "none",
                        opacity: assigneeFilter ? 1 : 0.5
                    }}
                >
                    {t('pages.initiativeMerchant.form.removeFiltersBtn')}
                </ButtonNaked>
            </Box>

            {totalElements === 0 ? (
                <Table sx={{ mt: 2, backgroundColor: '#FFFFFF' }}>
                    <TableBody>
                        <TableRow>
                            <TableCell
                                colSpan={10}
                                sx={{
                                    textAlign: 'center',
                                    py: 4,
                                    fontSize: 16,
                                    fontWeight: 500,
                                    color: '#5C6F82',
                                    backgroundColor: '#FFFFFF'
                                }}
                            >
                                {t('pages.initiativeMerchantsRefunds.emptyState')}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            ) : (
                <>
                    <Table sx={{ mt: 2 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                    {t('pages.initiativeMerchantsRefunds.table.name')}
                                </TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                    {t('pages.initiativeMerchantsRefunds.table.period')}
                                </TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                    {t('pages.initiativeMerchantsRefunds.table.type')}
                                </TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                    {t('pages.initiativeMerchantsRefunds.table.requestedRefund')}
                                </TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                    {t('pages.initiativeMerchantsRefunds.table.approvedRefund')}
                                </TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                    {t('pages.initiativeMerchantsRefunds.table.checksPercentage')}
                                </TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                    {t('pages.initiativeMerchantsRefunds.table.assignee')}
                                </TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                    {t('pages.initiativeMerchantsRefunds.table.status')}
                                </TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody sx={{ backgroundColor: '#FFFFFF' }}>
                            {rows.map((row) => (
                                <RefundRow
                                    key={row.id}
                                    row={row}
                                    t={t}
                                    onClick={() => {
                                        if (typeof id !== 'string') {
                                            return;
                                        }
                                        setBatchTrx(row);
                                        history.replace(
                                            ROUTES.INITIATIVE_REFUNDS_TRANSACTIONS.replace(
                                                ':batchId',
                                                row.id
                                            ).replace(':id', id)
                                        );
                                    }}
                                />
                            ))}
                        </TableBody>
                    </Table>

                    <Box
                        sx={{
                            mt: 3,
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: 3,
                            color: '#33485C',
                            fontSize: '14px',
                            fontWeight: 500
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{t('pages.initiativeMerchantsRefunds.rowsPerPage')}</span>

                            <FormControl size='small'>
                                <Select
                                    value={pageSize}
                                    onChange={(e) => setPageSize(Number(e.target.value))}
                                    sx={{
                                        height: 32,
                                        '& .MuiSelect-select': { paddingY: '3px' }
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
                                cursor: page > 0 ? 'pointer' : 'default',
                                opacity: page > 0 ? 1 : 0.3,
                                fontSize: 20
                            }}
                        />

                        <ChevronRightIcon
                            onClick={() => page < totalPages - 1 && setPage(page + 1)}
                            sx={{
                                cursor: page < totalPages - 1 ? 'pointer' : 'default',
                                opacity: page < totalPages - 1 ? 1 : 0.3,
                                fontSize: 20
                            }}
                        />
                    </Box>
                </>
            )}
        </Box>
    );
};

export default InitiativeRefundsMerchants;