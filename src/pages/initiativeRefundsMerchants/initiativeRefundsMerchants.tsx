/* eslint-disable complexity */
/* eslint-disable sonarjs/cognitive-complexity */
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Tooltip } from "@mui/material";
import { TitleBox, useLoading } from "@pagopa/selfcare-common-frontend";
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
import { getMerchantList, getRewardBatches } from "../../services/merchantsService";
import { LOADING_TASK_INITIATIVE_REFUNDS_MERCHANTS } from "../../utils/constants";
import { useAlert } from "../../hooks/useAlert";
import { getMerchantsFilters, resetMerchantsFilters, setMerchantsFilters } from "../../hooks/useMerchantsFilters";

export interface RefundItem {
    id: string;
    merchantId: string;
    businessName: string;
    month: string;
    posType: "ONLINE" | "FISICO";
    merchantSendDate: string;
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

export const getStatusColor = (status: string, role: string) => {
    switch (status) {
        case "APPROVED":
            return "success";
        case "EVALUATING":
            if (role === 'L3') {
                return "warning";
            }
            return "primary";
        case "SENT":
            return "default";
        case "APPROVING":
            return "info";
        default:
            return "default";
    }
};

export const getStatusLabel = (status: string, role: string, t: any) => {
    switch (status) {
        case "APPROVED":
            return t("chip.batch.approved");
        case "EVALUATING":
            if (role === 'L3') {
                return t("chip.batch.toApprove");
            }
            return t("chip.batch.evaluating");
        case "SENT":
            return t("chip.batch.sent");
        case "APPROVING":
            return t("chip.batch.approving");
        default:
            return "-";
    }
};

export const getPosTypeLabel = (posType: "ONLINE" | "FISICO") =>
    posType ? (posType === "ONLINE" ? "Online" : "Fisico") : '-';

const formatAmount = (amountCents?: number) => {
    if (amountCents === undefined || amountCents === null) {
        return "-";
    }
    return (amountCents / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" });
};

export const refundRequestDate = (date?: string) => {
    if (!date) {
        return "-";
    }
    return new Date(date).toLocaleDateString('it-IT');
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
    const formatRefundDate = refundRequestDate(row.merchantSendDate);

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

            <TableCell>
                <Tooltip title={row.name}>
                    <Box sx={{ display: "inline-flex", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {row.name}
                    </Box>
                </Tooltip>
            </TableCell>

            <TableCell>
                <Tooltip title={formatRefundDate}>
                    <Box sx={{ display: "inline-flex", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {formatRefundDate}
                    </Box>
                </Tooltip>
            </TableCell>

            <TableCell>
                <Tooltip title={requestedRefund}>
                    <Box sx={{ display: "inline-flex", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {requestedRefund}
                    </Box>
                </Tooltip>
            </TableCell>

            <TableCell>
                <Tooltip title={approvedRefund}>
                    <Box sx={{ display: "inline-flex", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {approvedRefund}
                    </Box>
                </Tooltip>
            </TableCell>

            <TableCell>
                <Tooltip title={checksPercentage}>
                    <Box sx={{ display: "inline-flex", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {checksPercentage}
                    </Box>
                </Tooltip>
            </TableCell>

            <TableCell>
                <Tooltip title={row.assigneeLevel}>
                    <Box sx={{ display: "inline-flex", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {row.assigneeLevel}
                    </Box>
                </Tooltip>
            </TableCell>

            <TableCell>
                <Tag
                    value={getStatusLabel(row.status, row.assigneeLevel, t)}
                    color={getStatusColor(row.status, row.assigneeLevel) as Colors}
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

    const { setAlert } = useAlert();

    const match = matchPath(location.pathname, {
        path: [ROUTES.INITIATIVE_REFUNDS],
        exact: true,
        strict: false,
    });
    const { id } = (match?.params as MatchParams) || {};

    const savedFilters = getMerchantsFilters();
    const [assigneeFilter, setAssigneeFilter] = useState<string>(savedFilters.assigneeFilter ?? "");
    const [draftAssignee, setDraftAssignee] = useState<string>(savedFilters.assigneeFilter ?? "");
    const [nameFilter, setNameFilter] = useState<string>(savedFilters.nameFilter ?? "");
    const [draftName, setDraftName] = useState<string>(savedFilters.nameFilter ?? "");
    const [periodFilter, setPeriodFilter] = useState<string>(savedFilters.periodFilter ?? "");
    const [draftPeriod, setDraftPeriod] = useState<string>(savedFilters.periodFilter ?? "");
    const [statusFilter, setStatusFilter] = useState<string>(savedFilters.statusFilter ?? "");
    const [draftStatus, setDraftStatus] = useState<string>(savedFilters.statusFilter ?? "");

    const [page, setPage] = useState(savedFilters.page ?? 0);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(savedFilters.pageSize ?? 10);
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, totalElements);

    type SortState = "" | "asc" | "desc";
    const [dateSort, setDateSort] = useState<SortState>("");

    const toggleDateSort = () => {
        setDateSort(prev => {
            if (prev === "") { return "asc"; }
            if (prev === "asc") { return "desc"; }
            return "";
        });
    };

    const norm = (s: string) => (s ?? "").trim();

    const isFilterDisabled = !(
        norm(draftAssignee) !== norm(assigneeFilter) ||
        norm(draftName) !== norm(nameFilter) ||
        norm(draftPeriod) !== norm(periodFilter) ||
        norm(draftStatus) !== norm(statusFilter)
    );

    const [businessNameList, setBusinessNameList] = useState([]);
    const setLoading = useLoading(LOADING_TASK_INITIATIVE_REFUNDS_MERCHANTS);
    const [rows, setRows] = useState<Array<RefundItem>>([]);
    const history = useHistory();

    useMemo(() => {
        if (!savedFilters.page) {
            setPage(0);
        }
    }, [id]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (typeof id === 'string') {
            getMerchantsList();
            getTableData(id);
        }
    }, [id, page, assigneeFilter, pageSize, nameFilter, periodFilter, statusFilter, dateSort]);

    // eslint-disable-next-line sonarjs/no-identical-functions
    useEffect(() => {
        if (!savedFilters.page) {
            setPage(0);
        }
    }, [pageSize]);

    useEffect(() => {
        if (savedFilters.page !== null) {
            setPage(savedFilters.page);
        }
        if (savedFilters.assigneeFilter !== null) {
            setDraftAssignee(savedFilters.assigneeFilter);
            setAssigneeFilter(savedFilters.assigneeFilter);
        }
        if (savedFilters.nameFilter !== null) {
            setDraftName(savedFilters.nameFilter);
            setNameFilter(savedFilters.nameFilter);
        }
        if (savedFilters.periodFilter !== null) {
            setDraftPeriod(savedFilters.periodFilter);
            setPeriodFilter(savedFilters.periodFilter);
        }
        if (savedFilters.statusFilter !== null) {
            setDraftStatus(savedFilters.statusFilter);
            setStatusFilter(savedFilters.statusFilter);
        }
        if (savedFilters.pageSize !== null) {
            setPageSize(savedFilters.pageSize);
        }

        resetMerchantsFilters();
    }, [savedFilters]);

    const getMerchantsList = () => {
        getMerchantList(id, 1).then((res) => {
            if((res.content as [])?.length > 0) {
                setBusinessNameList(res.content as []);
            }
            console.log(businessNameList);
        }).catch(() => {
            setAlert({ title: t('errors.title'), text: t('errors.getDataDescription'), isOpen: true, severity: 'error' });
        });
    };

    const getTableData = (
        initiativeId: string,
    ) => {
        const sort = dateSort === "" ? undefined : `merchantSendDate,${dateSort}`;

        setLoading(true);
        getRewardBatches(initiativeId, page, pageSize, assigneeFilter || undefined, nameFilter || undefined, periodFilter || undefined, statusFilter || undefined, sort || undefined)
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
                        merchantSendDate: r.merchantSendDate,
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
            .catch(() => {
                setAlert({ title: t('errors.title'), text: t('errors.getDataDescription'), isOpen: true, severity: 'error' });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleFilterClick = () => {
        setAssigneeFilter(draftAssignee);
        setNameFilter(draftName);
        setPeriodFilter(draftPeriod);
        setStatusFilter(draftStatus);
        setPage(0);
    };

    const handleRemoveFilters = () => {
        setAssigneeFilter("");
        setDraftAssignee("");
        setNameFilter("");
        setDraftName("");
        setPeriodFilter("");
        setDraftPeriod("");
        setStatusFilter("");
        setDraftStatus("");

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

                <FormControl
                    variant="outlined"
                    size="small"
                    sx={{
                        minWidth: 150,
                        "& .MuiInputLabel-root": { fontSize: 14, lineHeight: "normal" },
                    }}
                >
                    <InputLabel id="name-filter-label">
                        {t("pages.initiativeMerchantsRefunds.table.name")}
                    </InputLabel>

                    <Select
                        labelId="name-filter-label"
                        value={draftName}
                        label={t("pages.initiativeMerchantsRefunds.table.name")}
                        onChange={(e) => setDraftName(e.target.value)}
                        sx={{ height: 40, display: "flex", alignItems: "center" }}
                    >
                        <MenuItem value="3a602b17-ac1c-3029-9e78-0a4bbb8693d4">Esercente di test IdPay</MenuItem>
                    </Select>
                </FormControl>

                <FormControl
                    variant="outlined"
                    size="small"
                    sx={{
                        minWidth: 150,
                        "& .MuiInputLabel-root": { fontSize: 14, lineHeight: "normal" },
                    }}
                >
                    <InputLabel id="period-filter-label">
                        {t("pages.initiativeMerchantsRefunds.table.period")}
                    </InputLabel>

                    <Select
                        labelId="period-filter-label"
                        value={draftPeriod}
                        label={t("pages.initiativeMerchantsRefunds.table.period")}
                        onChange={(e) => setDraftPeriod(e.target.value)}
                        sx={{ height: 40, display: "flex", alignItems: "center" }}
                    >
                        <MenuItem value="2025-11">{t("pages.initiativeMerchantsRefunds.perdiod.november")}</MenuItem>
                        <MenuItem value="2025-12">{t("pages.initiativeMerchantsRefunds.perdiod.december")}</MenuItem>
                        <MenuItem value="2026-01">{t("pages.initiativeMerchantsRefunds.perdiod.january")}</MenuItem>
                        <MenuItem value="2026-02">{t("pages.initiativeMerchantsRefunds.perdiod.february")}</MenuItem>
                        <MenuItem value="2026-03">{t("pages.initiativeMerchantsRefunds.perdiod.march")}</MenuItem>
                        <MenuItem value="2026-04">{t("pages.initiativeMerchantsRefunds.perdiod.april")}</MenuItem>
                        <MenuItem value="2026-05">{t("pages.initiativeMerchantsRefunds.perdiod.may")}</MenuItem>
                    </Select>
                </FormControl>

                <FormControl
                    variant="outlined"
                    size="small"
                    sx={{
                        minWidth: 150,
                        "& .MuiInputLabel-root": { fontSize: 14, lineHeight: "normal" },
                    }}
                >
                    <InputLabel id="status-filter-label">
                        {t("pages.initiativeMerchantsRefunds.table.status")}
                    </InputLabel>

                    <Select
                        labelId="status-filter-label"
                        value={draftStatus}
                        label={t("pages.initiativeMerchantsRefunds.table.status")}
                        onChange={(e) => setDraftStatus(e.target.value)}
                        sx={{ height: 40, display: "flex", alignItems: "center" }}
                    >
                        <MenuItem value="SENT">
                            <Tag value={t("chip.batch.sent")} color="default" />
                        </MenuItem>

                        <MenuItem value="TO_WORK">
                            <Tag value={t("chip.batch.evaluating")} color="primary" />
                        </MenuItem>

                        <MenuItem value="TO_APPROVE">
                            <Tag value={t("chip.batch.toApprove")} color="warning" />
                        </MenuItem>

                        <MenuItem value="APPROVING">
                            <Tag value={t("chip.batch.approving")} color="info" />
                        </MenuItem>

                        <MenuItem value="APPROVED">
                            <Tag value={t("chip.batch.approved")} color="success" />
                        </MenuItem>

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
                    disabled={!assigneeFilter && !nameFilter && !periodFilter && !statusFilter}
                    onClick={handleRemoveFilters}
                    sx={{
                        height: "40px",
                        paddingX: 2,
                        fontWeight: 600,
                        textTransform: "none",
                        opacity: assigneeFilter || nameFilter || periodFilter || statusFilter ? 1 : 0.5
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
                    <Table
                        sx={{
                            mt: 2,
                            width: '100%',
                            tableLayout: 'fixed',
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ whiteSpace: { xl: "nowrap", lg: "none" } }}>
                                    {t('pages.initiativeMerchantsRefunds.table.name')}
                                </TableCell>
                                <TableCell sx={{ whiteSpace: { xl: "nowrap", lg: "none" } }}>
                                    {t('pages.initiativeMerchantsRefunds.table.period')}
                                </TableCell>
                                <TableCell sortDirection={dateSort === "" ? false : dateSort}>
                                    <TableSortLabel
                                        active={dateSort !== ""}
                                        direction={dateSort === "" ? "asc" : dateSort}
                                        onClick={toggleDateSort}
                                    >
                                        {t("pages.initiativeMerchantsRefunds.table.requestRefundDate")}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ whiteSpace: { xl: "nowrap", lg: "none" } }}>
                                    {t('pages.initiativeMerchantsRefunds.table.requestedRefund')}
                                </TableCell>
                                <TableCell sx={{ whiteSpace: { xl: "nowrap", lg: "none" } }}>
                                    {t('pages.initiativeMerchantsRefunds.table.approvedRefund')}
                                </TableCell>
                                <TableCell sx={{ whiteSpace: { xl: "nowrap", lg: "none" } }}>
                                    {t('pages.initiativeMerchantsRefunds.table.checksPercentage')}
                                </TableCell>
                                <TableCell sx={{ whiteSpace: { xl: "nowrap", lg: "none" } }}>
                                    {t('pages.initiativeMerchantsRefunds.table.assignee')}
                                </TableCell>
                                <TableCell sx={{ whiteSpace: { xl: "nowrap", lg: "none" } }}>
                                    {t('pages.initiativeMerchantsRefunds.table.status')}
                                </TableCell>
                                <TableCell sx={{
                                    width: 55,
                                    maxWidth: 55,
                                    minWidth: 44,
                                    p: 0,
                                    pr: 1,
                                    textAlign: 'right',
                                }}></TableCell>
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
                                        setMerchantsFilters({ assigneeFilter, nameFilter, periodFilter, statusFilter, page, pageSize });
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
                                    <MenuItem value={25}>25</MenuItem>
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