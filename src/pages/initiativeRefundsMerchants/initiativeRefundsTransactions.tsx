import { useState, useEffect, useMemo } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, Checkbox, Button, Chip, TableSortLabel, Typography, Paper, Tooltip, Alert } from "@mui/material";
import { ButtonNaked, Colors, Tag } from "@pagopa/mui-italia";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTranslation } from "react-i18next";
import { useLoading } from "@pagopa/selfcare-common-frontend";
import { matchPath, useHistory } from "react-router-dom";
import { storageTokenOps } from "@pagopa/selfcare-common-frontend/utils/storage";
import { Download, Sync } from "@mui/icons-material";
import { getBatchTrx, rehydrateBatchTrx, setBatchTrx } from "../../hooks/useBatchTrx";
import { initiativePagesBreadcrumbsContainerStyle } from "../../helpers";
import BreadcrumbsBox from "../components/BreadcrumbsBox";
import ROUTES from "../../routes";
import { RewardBatchDTO } from "../../api/generated/merchants/RewardBatchDTO";
import { useInitiative } from "../../hooks/useInitiative";
import { LOADING_TASK_INITIATIVE_REFUNDS_MERCHANTS } from "../../utils/constants";
import { getDownloadInvoice, getMerchantTransactionsProcessed, getMerchantDetail, rejectTrx, suspendTrx, approveTrx, validateBatch, approveBatch, getDownloadCsv } from "../../services/merchantsService";
import { MerchantTransactionProcessedDTO } from "../../api/generated/merchants/MerchantTransactionProcessedDTO";
import { RewardBatchTrxStatusEnum } from "../../api/generated/merchants/RewardBatchTrxStatus";
import { getPOS } from "../../services/merchantsService";
import { TransactionActionRequest } from "../../api/generated/merchants/TransactionActionRequest";
import { downloadCsv, openInvoiceInNewTab } from "../../utils/fileViewer-utils";
import { useAppSelector } from "../../redux/hooks";
import { initiativeSelector } from "../../redux/slices/initiativeSlice";
import { parseJwt } from "../../utils/jwt-utils";
import { JWTUser } from "../../model/JwtUser";
import { PointOfSaleDTO } from "../../api/generated/merchants/PointOfSaleDTO";
import { useAlert } from "../../hooks/useAlert";
import RefundsTransactionsDrawer from "./refundsTransactionsDrawer";
import { RefundActionButtons } from "./refundsActionButtons";
import { getPosTypeLabel, getStatusColor, getStatusLabel, RefundItem } from "./initiativeRefundsMerchants";
import RefundReasonModal from "./refundsReasonModal";
import ApproveConfirmModal from "./approveConfirmModal";
import { RoleActionButton } from "./roleActionButton";
import { RoleConfirmModal } from "./roleConfirmModal";
import { RoleErrorModal } from "./roleErrorModal";

export interface TrxItem {
    raw: MerchantTransactionProcessedDTO;
    id: string;
    date: string;
    shop: string;
    amountCents: number;
    statusLabel: string;
    statusColor: string;
    invoiceFileName?: string;
    pointOfSaleId?: string;
    transactionId?: string;
    status?: RewardBatchTrxStatusEnum;
}

export interface RefundsDrawerData {
    trxChargeDate: string;
    productName?: string;
    productGtin?: string;

    fiscalCode?: string;
    trxId: string;
    trxCode?: string;

    effectiveAmountCents?: number;
    rewardAmountCents?: number;
    authorizedAmountCents?: number;

    invoiceDocNumber?: string;
    invoiceFileName?: string;

    rewardBatchTrxStatus?: string;
    statusLabel?: string;
    statusColor?: string;
    pointOfSaleId?: string;
    transactionId?: string;
    rewardBatchRejectionReason?: string;
}

const mapRefundsDrawerData = (
    dto: MerchantTransactionProcessedDTO,
    mappedRow: TrxItem
): RefundsDrawerData => ({
    trxChargeDate: (dto as any).trxChargeDate ?? "",
    productName: (dto as any).additionalProperties?.productName,
    productGtin: (dto as any).additionalProperties?.productGtin,

    fiscalCode: dto.fiscalCode,
    trxId: dto.trxId,
    trxCode: (dto as any).trxCode,

    effectiveAmountCents: dto.effectiveAmountCents,
    rewardAmountCents: dto.rewardAmountCents,
    authorizedAmountCents: (dto as any).authorizedAmountCents,

    invoiceDocNumber: dto.invoiceData?.docNumber,
    invoiceFileName: dto.invoiceData?.filename,
    pointOfSaleId: dto.pointOfSaleId,
    transactionId: dto.trxId,

    rewardBatchTrxStatus: dto.rewardBatchTrxStatus,

    statusLabel: mappedRow.statusLabel,
    statusColor: mappedRow.statusColor,
    rewardBatchRejectionReason: dto.rewardBatchRejectionReason,
});

const formatCurrency = (amountCents?: number) => {
    if (amountCents === undefined || amountCents === null) {
        return "-";
    }
    return (amountCents / 100).toLocaleString("it-IT", {
        style: "currency",
        currency: "EUR",
    });
};

const formatDate = (d?: string) => {
    if (!d) { return "-"; };
    const date = new Date(d);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hour}:${minute}`;
};

// eslint-disable-next-line sonarjs/cognitive-complexity, complexity
const InitiativeRefundsTransactions = () => {
    const { t } = useTranslation();
    const initiativeSel = useAppSelector(initiativeSelector);
    const [batch, setBatch] = useState<RefundItem | null>(getBatchTrx());

    const user = parseJwt(storageTokenOps.read()) as JWTUser;
    const role = user.org_role;

    const disabled = useMemo(() => batch?.status !== "EVALUATING", [batch]);
    const [draftStatusFilter, setDraftStatusFilter] = useState<string | "">("");
    const [statusFilter, setStatusFilter] = useState<string | "">("");
    const [draftPosFilter, setDraftPosFilter] = useState<string>("");
    const [posFilter, setPosFilter] = useState<string>("");

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const { setAlert } = useAlert();

    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, totalElements);

    const [rows, setRows] = useState<Array<TrxItem>>([]);
    const [iban, setIban] = useState<string>('');
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [lockedStatus, setLockedStatus] = useState<RewardBatchTrxStatusEnum | null>(null);

    useInitiative();
    interface MatchParams {
        id: string;
    }

    const match = matchPath(location.pathname, {
        path: [ROUTES.INITIATIVE_REFUNDS_TRANSACTIONS],
        exact: true,
        strict: false,
    });
    const { id } = (match?.params as MatchParams) || {};
    const matchBatch = matchPath(location.pathname, {
        path: ROUTES.INITIATIVE_REFUNDS_TRANSACTIONS,
        exact: true,
    });

    const batchId = (matchBatch?.params as any)?.batchId;
    const setLoading = useLoading(LOADING_TASK_INITIATIVE_REFUNDS_MERCHANTS);
    const history = useHistory();
    const isFilterDisabled =
        (draftStatusFilter === "" || draftStatusFilter === statusFilter) &&
        (draftPosFilter === "" || draftPosFilter === posFilter);

    type SortState = "" | "asc" | "desc";
    const [dateSort, setDateSort] = useState<SortState>("");
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<RefundsDrawerData | null>(null);
    const [approveModal, setApproveModal] = useState(false);
    const [restored, setRestored] = useState(false);
    const [posList, setPosList] = useState<Array<PointOfSaleDTO>>([]);
    const [batchModalOpen, setBatchModalOpen] = useState(false);
    const [batchErrorOpen, setBatchErrorOpen] = useState(false);

    useEffect(() => {
        const restore = async () => {
            const saved = getBatchTrx();

            if (!saved && id && batchId) {
                const ok = await rehydrateBatchTrx(id, batchId);
                setBatch(getBatchTrx());
                setRestored(true);
                if (!ok) { history.replace(ROUTES.INITIATIVE_REFUNDS.replace(":id", id)); }
            } else {
                setRestored(true);
            }
        };
        void restore();
    }, [id, batchId]);

    useEffect(() => {
        if (!batch?.merchantId) { return; }

        getPOS(batch.merchantId, 200)
            .then((res) => setPosList([...(res.content ?? [])]))
            .catch(console.error);
    }, [batch?.merchantId]);

    const handleOpenDrawer = (trx: TrxItem) => {
        setSelectedTransaction(mapRefundsDrawerData(trx.raw, trx));
        setOpenDrawer(true);
    };

    const handleCloseDrawer = () => {
        setOpenDrawer(false);
        setSelectedTransaction(null);
    };

    const closeAfter = (fn: Promise<any>) => fn.finally(() => handleCloseDrawer());

    const checksPercentage = useMemo(() => {
        if (!batch || batch.numberOfTransactions === 0) {
            return "0%";
        }

        const percentage =
            (batch.numberOfTransactionsElaborated / batch.numberOfTransactions) * 100;

        return `${Math.floor(percentage)}%`;
    }, [batch]);

    const formattedPeriod = useMemo(() => {
        if (!batch?.startDate || !batch?.endDate) {
            return "-";
        }
        const start = new Date(batch.startDate).toLocaleDateString("it-IT");
        const end = new Date(batch.endDate).toLocaleDateString("it-IT");
        return `${start} - ${end}`;
    }, [batch]);

    const sameStatusRows = useMemo(() => {
        if (!lockedStatus) { return []; }
        return rows.filter(row => row.status === lockedStatus);
    }, [rows, lockedStatus]);

    const allSameStatusSelected = useMemo(() => {
        if (sameStatusRows.length === 0) { return false; }
        return sameStatusRows.every(row => selectedRows.has(row.id));
    }, [sameStatusRows, selectedRows]);

    const [reasonModal, setReasonModal] = useState<{
        open: boolean;
        type: "reject" | "suspend" | null;
    }>({ open: false, type: null });

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

    useEffect(() => {
        setSelectedRows(new Set());
        setLockedStatus(null);
    }, [page, pageSize, posFilter, statusFilter, dateSort]);

    const getTableData = (initiativeId: string) => {
        if (!batch?.merchantId) {
            throw new Error("Invalid Merchant ID");
        }

        setLoading(true);

        const sort = dateSort === "" ? undefined : `trxChargeDate,${dateSort}`;

        Promise.all([
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
            ),
            getMerchantDetail(initiativeId, batch.merchantId)
        ])
            .then(([transactionsRes, merchantDetailRes]) => {
                setTotalElements(transactionsRes.totalElements);
                setTotalPages(transactionsRes.totalPages);

                const rowsData: Array<TrxItem> = transactionsRes.content.map((r) =>
                    mapTransactionDTO(r)
                );

                setRows(rowsData);

                if (merchantDetailRes.iban) {
                    setIban(merchantDetailRes.iban);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => setLoading(false));
    };

    const handleBatchStatus = () => {
        if (batch?.id) {

            setLoading(true);
            if (batch?.assigneeLevel !== "L3") {

                validateBatch(
                    id,
                    batch.id
                )
                    .then((res) => {
                        updateBatch(res);
                    })
                    .catch((error) => {
                        handleCatch(error);
                    })
                    .finally(() => { setLoading(false); setBatchModalOpen(false); });
            } else {
                approveBatch(
                    id,
                    batch.id
                )
                    .then((res) => {
                        updateBatch(res);
                    })
                    .catch((error) => {
                        handleCatch(error);
                    })
                    .finally(() => { setLoading(false); setBatchModalOpen(false); });
            }
        }
    };

    const handleCatch = (error: any) => {
        if (error?.status === 400 && error?.body?.code === "BATCH_NOT_ELABORATED_15_PERCENT") {
            setBatchErrorOpen(true);
        } else if (error?.status === 400 && error?.body?.code === "REWARD_BATCH_INVALID_REQUEST") {
            setAlert({ title: t('errors.title'), text: t('errors.batchInvalidRequest'), isOpen: true, severity: 'error' });
        } else {
            setAlert({ title: t('errors.title'), text: t('errors.getDataDescription'), isOpen: true, severity: 'error' });
        }
    };

    // eslint-disable-next-line complexity
    const mapRewardBatchToRefundItem = (
        dto: RewardBatchDTO
        // eslint-disable-next-line sonarjs/cognitive-complexity
    ): RefundItem => ({
        id: dto.id,
        merchantId: dto.merchantId ?? batch?.merchantId ?? "",
        businessName: dto.businessName ?? batch?.businessName ?? "",
        month: dto.month ?? batch?.month ?? "",
        posType: dto.posType === "PHYSICAL" ? "FISICO" : "ONLINE",
        status: dto.status ?? "",
        partial: dto.partial ?? false,
        name: dto.name,
        startDate: dto.startDate?.toDateString() ?? "",
        endDate: dto.endDate?.toDateString() ?? "",
        totalAmountCents: dto.initialAmountCents ?? batch?.initialAmountCents ?? 0,
        approvedAmountCents: dto.approvedAmountCents ?? batch?.approvedAmountCents ?? 0,
        initialAmountCents: dto.initialAmountCents ?? batch?.initialAmountCents ?? 0,
        numberOfTransactions: dto.numberOfTransactions ?? batch?.numberOfTransactions ?? 0,
        numberOfTransactionsSuspended: dto.numberOfTransactionsSuspended ?? batch?.numberOfTransactionsSuspended ?? 0,
        numberOfTransactionsRejected: dto.numberOfTransactionsRejected ?? batch?.numberOfTransactionsRejected ?? 0,
        numberOfTransactionsElaborated: dto.numberOfTransactionsElaborated ?? batch?.numberOfTransactionsElaborated ?? 0,
        assigneeLevel: dto.assigneeLevel ?? "L1",
    });

    const updateBatch = (res: RewardBatchDTO) => {
        const refundItem = mapRewardBatchToRefundItem(res);
        setBatchTrx(refundItem);
        setBatch(getBatchTrx());
    };

    const mapTransactionStatus = (status?: RewardBatchTrxStatusEnum) => {
        switch (status) {
            case RewardBatchTrxStatusEnum.TO_CHECK:
                return { label: t('pages.initiativeMerchantsTransactions.table.toCheck'), color: "indigo" };

            case RewardBatchTrxStatusEnum.CONSULTABLE:
                return { label: t('pages.initiativeMerchantsTransactions.table.consultable'), color: "default" };

            case RewardBatchTrxStatusEnum.SUSPENDED:
                return { label: t('pages.initiativeMerchantsTransactions.table.suspended'), color: "warning" };

            case RewardBatchTrxStatusEnum.APPROVED:
                return { label: t('pages.initiativeMerchantsTransactions.table.approved'), color: "info" };

            case RewardBatchTrxStatusEnum.REJECTED:
                return { label: t('pages.initiativeMerchantsTransactions.table.rejected'), color: "error" };

            default:
                return { label: "-", color: "default" };
        }
    };

    const mapTransactionDTO = (r: MerchantTransactionProcessedDTO): TrxItem => {
        const uiStatus = mapTransactionStatus(r.rewardBatchTrxStatus);

        return {
            raw: r,

            id: r.trxId,

            date: (r as any).trxChargeDate
                ? formatDate((r as any)?.trxChargeDate) // TODO change type
                : "-",

            shop: r.franchiseName ?? r.pointOfSaleId ?? "-",

            amountCents: r.rewardAmountCents ?? 0,

            statusLabel: uiStatus.label,
            statusColor: uiStatus.color,

            invoiceFileName: r.invoiceData?.filename,

            pointOfSaleId: r.pointOfSaleId,
            transactionId: r.trxId,
            status: r.rewardBatchTrxStatus
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
    };

    const handleRowCheckbox = (rowId: string, rowStatus?: RewardBatchTrxStatusEnum) => {
        if (!rowStatus) { return; }

        setSelectedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(rowId)) {
                newSet.delete(rowId);
                if (newSet.size === 0) {
                    setLockedStatus(null);
                }
            } else {
                if (lockedStatus === null) {
                    setLockedStatus(rowStatus);
                }
                newSet.add(rowId);
            }
            return newSet;
        });
    };

    const handleHeaderCheckbox = () => {
        if (allSameStatusSelected) {
            setSelectedRows(new Set());
            setLockedStatus(null);
        } else {
            const newSet = new Set(sameStatusRows.map(row => row.id));
            setSelectedRows(newSet);
        }
    };

    const downloadInvoice = (pointOfSaleId: string | any, transactionId: string | any, invoiceFileName: string | any, isDownload: boolean = false) => {
        if (batch?.merchantId) {

            setLoading(true);
            getDownloadInvoice(
                pointOfSaleId,
                transactionId,
                batch.merchantId
            )
                .then((res) => {
                    const invoiceUrl = res?.invoiceUrl;
                    if (!invoiceUrl) {
                        throw new Error("Invoice URL not found");
                    }
                    if (isDownload) {
                        return downloadCsv(invoiceUrl, invoiceFileName);
                    }
                    return openInvoiceInNewTab(invoiceUrl, invoiceFileName);
                })
                .catch(() => {
                    setAlert({ title: t('errors.title'), text: t('errors.getDataDescription'), isOpen: true, severity: 'error' });
                })
                .finally(() => setLoading(false));
        }
    };

    const approve = () => handleRefundAction("approve", [...selectedRows]);

    const handleRefundAction = async (
        type: "approve" | "suspend" | "reject",
        trxIds: Array<string>,
        reason?: string
    ) => {
        if (!batch?.id) { return; };

        setLoading(true);
        const payload: TransactionActionRequest = {
            transactionIds: trxIds,
            reason: type !== "approve" ? reason : undefined
        };

        const serviceMap = {
            approve: approveTrx,
            suspend: suspendTrx,
            reject: rejectTrx
        };

        return serviceMap[type](id, batch.id, payload)
            .then(res => {
                setBatchTrx(res as RefundItem);
                setBatch(getBatchTrx());
                getTableData(id);
                const isSingle = trxIds.length === 1 ? "single" : "plural";
                setAlert({ text: t(`pages.initiativeMerchantsTransactions.toast.${isSingle}.${type}`), isOpen: true, severity: 'success' });
            })
            .catch(err => { setLoading(false); console.error(err); })
            .finally(() => {
                setSelectedRows(new Set());
                setLockedStatus(null);
            });
    };

    const getCsv = () => {
        if (batch?.id) {

            setLoading(true);
            getDownloadCsv(
                id,
                batch?.id
            )
                .then((res) => {
                    const csvUrl = res?.approvedBatchUrl;
                    if (!csvUrl) {
                        throw new Error("Invoice URL not found");
                    }
                    const fileName = getFileNameFromAzureUrl(csvUrl);
                    return downloadCsv(csvUrl, fileName);
                })
                .catch((_error) => {
                    setAlert({ title: t('errors.title'), text: t('errors.getDataDescription'), isOpen: true, severity: 'error' });
                })
                .finally(() => setLoading(false));
        }
    };

    const getFileNameFromAzureUrl = (url: string): string => {
        try {
            const { pathname } = new URL(url);
            const rawFileName = pathname.substring(pathname.lastIndexOf("/") + 1);
            return decodeURIComponent(rawFileName);
        } catch {
            console.log("catch");
            return `${batch?.businessName}_${batch?.name}_${batch?.posType}`;
        }
    };

    if (!batch && !restored) { return null; }

    if (!batch && restored) {
        history.replace(ROUTES.INITIATIVE_REFUNDS.replace(":id", id));
        return null;
    }

    if (batch) {

        return (
            <Box sx={{ width: "100%", pt: 2, px: 2 }}>
                <Box sx={initiativePagesBreadcrumbsContainerStyle}>
                    <BreadcrumbsBox
                        backUrl={ROUTES.INITIATIVE_REFUNDS.replace(":id", id)}
                        backLabel={t("breadcrumbs.back")}
                        items={[initiativeSel.initiativeName, t('breadcrumbs.initiativeRefunds'), batch.businessName]}
                    />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, mb: 3 }}>
                    <Box
                        sx={{
                            flex: 1,
                            width: 0,
                            minWidth: 0,
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 600,
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                wordBreak: "break-word",
                            }}
                        >
                            {batch.businessName}
                        </Typography>
                    </Box>

                    {batch.status === "EVALUATING" ?
                        selectedRows.size > 0 ?
                            <Box sx={{ width: "50%" }}>
                                <RefundActionButtons
                                    direction="row"
                                    status={lockedStatus as RewardBatchTrxStatusEnum}
                                    onApprove={() => setApproveModal(true)}
                                    onSuspend={() => setReasonModal({ open: true, type: "suspend" })}
                                    onReject={() => setReasonModal({ open: true, type: "reject" })}
                                    size={selectedRows.size}
                                />
                            </Box>
                            :
                            role.replace("operator", "L").toUpperCase() === batch.assigneeLevel.toUpperCase() ?
                                <RoleActionButton onClick={() => setBatchModalOpen(true)} role={batch.assigneeLevel} /> :
                                null
                        :
                        <Box sx={{ width: "25%", justifyContent: "flex-end", display: "flex" }}>
                            <Button onClick={() => getCsv()} variant="contained" disabled={batch.status === "APPROVING"} startIcon={<Download />} sx={{ whiteSpace: 'nowrap' }}>
                                {t('pages.initiativeMerchantsTransactions.csv.button')}
                            </Button>
                        </Box>
                    }
                </Box>

                {batch?.status === "APPROVING" &&
                    <Alert sx={{ mb: 3 }} variant="outlined" color="info" icon={<Sync sx={{ color: "#6BCFFB" }} />} >{t('pages.initiativeMerchantsTransactions.csv.alert')}</Alert>
                }

                <Paper
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(12, 1fr)',
                        width: '100%',
                        mb: 3,
                        p: 3,
                        gap: 3
                    }}
                >
                    <Box sx={{ display: 'grid', gridColumn: 'span 6', gridTemplateColumns: 'repeat(12,1fr)', gap: 1.5 }}>

                        <Typography variant="body2" sx={{ gridColumn: 'span 5', color: '#5C6F82' }}>
                            {t('pages.initiativeMerchantsTransactions.batchDetail.batchRef')}
                        </Typography>
                        <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                            <Tooltip title={batch.name || '-'}>
                                <Box sx={{ display: "inline-block", maxWidth: "100%", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                    {batch.name || '-'}
                                </Box>
                            </Tooltip>
                        </Typography>

                        <Typography variant="body2" sx={{ gridColumn: 'span 5', color: '#5C6F82' }}>
                            {t('pages.initiativeMerchantsTransactions.batchDetail.period')}
                        </Typography>
                        <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                            <Tooltip title={formattedPeriod}>
                                <Box sx={{ display: "inline-block", maxWidth: "100%", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                    {formattedPeriod}
                                </Box>
                            </Tooltip>
                        </Typography>

                        <Typography variant="body2" sx={{ gridColumn: 'span 5', color: '#5C6F82' }}>
                            {t('pages.initiativeMerchantsRefunds.table.type')}
                        </Typography>
                        <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                            <Tooltip title={getPosTypeLabel(batch.posType)}>
                                <Box sx={{ display: "inline-block", maxWidth: "100%", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                    {getPosTypeLabel(batch.posType)}
                                </Box>
                            </Tooltip>
                        </Typography>

                        <Typography variant="body2" sx={{ gridColumn: 'span 5', color: '#5C6F82' }}>
                            {t('pages.initiativeMerchantsTransactions.batchDetail.requestedRefund')}
                        </Typography>
                        <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                            <Tooltip title={formatCurrency(batch.initialAmountCents)}>
                                <Box sx={{ display: "inline-block", maxWidth: "100%", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                    {formatCurrency(batch.initialAmountCents)}
                                </Box>
                            </Tooltip>
                        </Typography>

                        <Typography variant="body2" sx={{ gridColumn: 'span 5', color: '#5C6F82' }}>
                            {t('pages.initiativeMerchantsTransactions.batchDetail.approvedRefund')}
                        </Typography>
                        <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                            <Tooltip title={formatCurrency(batch.approvedAmountCents)}>
                                <Box sx={{ display: "inline-block", maxWidth: "100%", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                    {formatCurrency(batch.approvedAmountCents)}
                                </Box>
                            </Tooltip>
                        </Typography>

                        <Typography variant="body2" sx={{ gridColumn: 'span 5', color: '#5C6F82' }}>
                            {t('pages.initiativeMerchantsTransactions.batchDetail.assignedTo')}
                        </Typography>
                        <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                            <Tooltip title={batch.assigneeLevel || '-'}>
                                <Box sx={{ display: "inline-block", maxWidth: "100%", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                    {batch.assigneeLevel || '-'}
                                </Box>
                            </Tooltip>
                        </Typography>
                    </Box>


                    <Box sx={{ display: 'grid', gridColumn: 'span 6', gridTemplateColumns: 'repeat(12,1fr)', gap: 1.5 }}>

                        <Typography variant="subtitle2" sx={{ gridColumn: 'span 12', fontWeight: 600 }}>
                            {t('pages.initiativeMerchantsTransactions.batchDetail.refundData')}
                        </Typography>

                        <Typography variant="body2" sx={{ gridColumn: 'span 5', color: '#5C6F82' }}>
                            {t('pages.initiativeMerchantsTransactions.batchDetail.beneficiary')}
                        </Typography>
                        <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                            <Tooltip title={batch.businessName || '-'}>
                                <Box sx={{ display: "inline-block", maxWidth: "100%", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                    {batch.businessName || '-'}
                                </Box>
                            </Tooltip>
                        </Typography>

                        <Typography variant="body2" sx={{ gridColumn: 'span 5', color: '#5C6F82' }}>
                            {t('pages.initiativeMerchantsTransactions.batchDetail.iban')}
                        </Typography>
                        <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600, wordBreak: 'break-all' }}>
                            <Tooltip title={iban || '-'}>
                                <Box sx={{ display: "inline-block", maxWidth: "100%", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                    {iban || '-'}
                                </Box>
                            </Tooltip>
                        </Typography>

                        <Typography variant="body2" sx={{ gridColumn: 'span 5', color: '#5C6F82' }}>
                            {t('pages.initiativeMerchantsTransactions.batchDetail.checksCompleted')}
                        </Typography>
                        <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                            <Tooltip title={`${checksPercentage}/100%`}>
                                <Box sx={{ display: "inline-block", maxWidth: "100%", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                    {checksPercentage}/100%
                                </Box>
                            </Tooltip>
                        </Typography>

                        <Typography variant="body2" sx={{ gridColumn: 'span 5', color: '#5C6F82' }}>
                            {t('pages.initiativeMerchantsRefunds.table.status')}
                        </Typography>
                        <Tag
                            value={getStatusLabel(batch.status, batch.assigneeLevel, t)}
                            color={getStatusColor(batch.status, batch.assigneeLevel) as Colors}
                            sx={{ display: 'flex', alignItems: 'center' }}
                        />
                    </Box>
                </Paper>

                <Box sx={{ display: "flex", gap: 3, mb: 3, alignItems: "center" }}>
                    <FormControl size="small" sx={{
                        minWidth: 150, "& .MuiInputLabel-root": {
                            fontSize: 14,
                            lineHeight: "normal"
                        }
                    }}>
                        <InputLabel>{t('pages.initiativeMerchantsTransactions.table.pos')}</InputLabel>
                        <Select
                            disabled={posList.at(0) === undefined}
                            value={draftPosFilter}
                            onChange={(e) => setDraftPosFilter(e.target.value)}
                            label={t('pages.initiativeMerchantsTransactions.table.pos')}
                            renderValue={(selected) => {
                                const selectedPos = posList.find(p => p.id === selected);
                                const label = selectedPos?.franchiseName ?? selected;

                                return (
                                    <Tooltip
                                        title={label}
                                        disableHoverListener={!selected}
                                    >
                                        <Box sx={{
                                            maxWidth: 250,
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis"
                                        }}>
                                            {label}
                                        </Box>
                                    </Tooltip>
                                );
                            }}
                        >
                            {posList.map(pos => (
                                <MenuItem key={pos.id} value={pos.id}>
                                    <Tooltip title={pos.franchiseName} placement="left" arrow>
                                        <Box sx={{
                                            maxWidth: 200,
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis"
                                        }}>
                                            {pos.franchiseName ?? pos.id}
                                        </Box>
                                    </Tooltip>
                                </MenuItem>
                            ))}
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
                        >
                            {Object.values(RewardBatchTrxStatusEnum).map((status) => {
                                const mapped = mapTransactionStatus(status);
                                return (
                                    <MenuItem key={status} value={status} sx={{ display: "flex", alignItems: "center" }}>
                                        <Chip
                                            label={mapped.label}
                                            color={mapped.color as any}
                                            size="small"
                                            sx={{
                                                cursor: "pointer",
                                                fontSize: 14,
                                                "& .MuiChip-label": { whiteSpace: "nowrap" },
                                                backgroundColor: mapped.label === t('pages.initiativeMerchantsTransactions.table.toCheck') ? "#C4DCF5" : "",
                                                color: mapped.label === t('pages.initiativeMerchantsTransactions.table.toCheck') ? "#17324D" : ""
                                            }}
                                        />
                                    </MenuItem>
                                );
                            })}
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

                {totalElements === 0 || rows.length === 0 ? (
                    <Table sx={{ mt: 2, backgroundColor: "#FFFFFF" }}>
                        <TableBody>
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    sx={{
                                        textAlign: "center",
                                        py: 4,
                                        fontSize: 16,
                                        fontWeight: 500,
                                        color: "#5C6F82",
                                        backgroundColor: "#FFFFFF",
                                    }}
                                >
                                    {t("pages.initiativeMerchantsRefunds.emptyState")}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                ) : (
                    <>
                        <Table sx={{ mt: 2 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        {lockedStatus && sameStatusRows.length > 0 && (
                                            <Checkbox
                                                disabled={disabled}
                                                checked={allSameStatusSelected}
                                                onChange={handleHeaderCheckbox}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                                        {t("pages.initiativeMerchantsTransactions.table.invoice")}
                                    </TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                                        {t("pages.initiativeMerchantsTransactions.table.pos")}
                                    </TableCell>
                                    <TableCell sortDirection={dateSort === "" ? false : dateSort}>
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
                                {rows.map((row) => {
                                    const isDisabled = lockedStatus !== null && row.status !== lockedStatus;
                                    const isChecked = selectedRows.has(row.id);

                                    return (
                                        <TableRow key={row.id} hover>
                                            <TableCell>
                                                <Checkbox
                                                    checked={isChecked}
                                                    disabled={isDisabled || disabled}
                                                    onChange={() => handleRowCheckbox(row.id, row.status)}
                                                />
                                            </TableCell>

                                            <TableCell>
                                                <Tooltip title={row.invoiceFileName}>
                                                    <Box sx={{ display: "inline-flex", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200 }}>
                                                        <ButtonNaked
                                                            color="primary"
                                                            onClick={() => downloadInvoice(row.pointOfSaleId, row.transactionId, row.invoiceFileName)}
                                                            sx={{
                                                                maxWidth: 200,
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap",
                                                                display: "inline-block",
                                                            }}
                                                        >
                                                            {row.invoiceFileName}
                                                        </ButtonNaked>
                                                    </Box>
                                                </Tooltip>
                                            </TableCell>

                                            <TableCell>
                                                <Tooltip title={row.shop}>
                                                    <Box sx={{ display: "inline-block", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200, whiteSpace: "nowrap", }}>
                                                        {row.shop}
                                                    </Box>
                                                </Tooltip>
                                            </TableCell>

                                            <TableCell>
                                                <Tooltip title={row.date}>
                                                    <Box sx={{ display: "inline-flex", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}>
                                                        {row.date}
                                                    </Box>
                                                </Tooltip>
                                            </TableCell>

                                            <TableCell>
                                                <Tooltip
                                                    title={(row.amountCents / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                                                >
                                                    <Box sx={{ display: "inline-flex", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 120 }}>
                                                        {(row.amountCents / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                                                    </Box>
                                                </Tooltip>
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    label={row.statusLabel}
                                                    color={row.statusColor as any}
                                                    sx={{
                                                        fontSize: "14px",
                                                        "& .MuiChip-label": { whiteSpace: "nowrap" },
                                                        backgroundColor: row.statusLabel === t('pages.initiativeMerchantsTransactions.table.toCheck') ? "#C4DCF5" : "",
                                                        color: row.statusLabel === t('pages.initiativeMerchantsTransactions.table.toCheck') ? "#17324D" : ""
                                                    }}
                                                />
                                            </TableCell>

                                            <TableCell sx={{ textAlign: "right" }}>
                                                <ButtonNaked onClick={() => handleOpenDrawer(row)}>
                                                    <ChevronRightIcon color="primary" />
                                                </ButtonNaked>
                                            </TableCell>

                                        </TableRow>
                                    );
                                })}
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
                    </>
                )}
                <RefundsTransactionsDrawer
                    open={openDrawer}
                    onClose={handleCloseDrawer}
                    data={selectedTransaction}
                    download={downloadInvoice}
                    formatDate={formatDate}
                    onApprove={(id) => closeAfter(handleRefundAction("approve", [id]))}
                    onSuspend={(id, reason) => closeAfter(handleRefundAction("suspend", [id], reason))}
                    onReject={(id, reason) => closeAfter(handleRefundAction("reject", [id], reason))}
                    disabled={disabled}
                />
                <RefundReasonModal
                    open={reasonModal.open}
                    type={reasonModal.type as any}
                    count={selectedRows.size}
                    onClose={() => setReasonModal({ open: false, type: null })}

                    onConfirm={async (reason) => {
                        if (!reasonModal.type) { return; };

                        await handleRefundAction(reasonModal.type, [...selectedRows], reason)
                            .finally(() => setReasonModal({ open: false, type: null }));
                    }}
                />
                <ApproveConfirmModal
                    open={approveModal}
                    count={selectedRows.size}
                    onClose={() => setApproveModal(false)}
                    onConfirm={() => {
                        void approve();
                        setApproveModal(false);
                    }}
                />
                <RoleConfirmModal
                    open={batchModalOpen}
                    role={batch.assigneeLevel}
                    onClose={() => setBatchModalOpen(false)}
                    onConfirm={handleBatchStatus}
                />
                <RoleErrorModal
                    open={batchErrorOpen}
                    onClose={() => setBatchErrorOpen(false)}
                />
            </Box>
        );
    }

    return null;
};

export default InitiativeRefundsTransactions;