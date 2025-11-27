import { Box, Button, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from "@mui/material";
import { LoadingOverlay, TitleBox } from "@pagopa/selfcare-common-frontend";
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from 'react-i18next';
import { matchPath } from "react-router-dom";
import { ButtonNaked } from "@pagopa/mui-italia";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { initiativePagesBreadcrumbsContainerStyle } from "../../helpers";
import ROUTES from "../../routes";
import BreadcrumbsBox from "../components/BreadcrumbsBox";
import { initiativeSelector } from "../../redux/slices/initiativeSlice";
import { useAppSelector } from "../../redux/hooks";
import { useInitiative } from "../../hooks/useInitiative";
import { getRewardBatches } from "../../services/merchantsService";

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
    assigneeLevel: "L1" | "L2" | string;
}

export interface RefundsPage {
    content: Array<RefundItem>;
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}

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
    const [pageSize] = useState(10);
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, totalElements);

    const isFilterDisabled =
        draftAssignee === "" || draftAssignee === assigneeFilter;
    const [isLoading, setIsLoading] = useState(true);
    const [rows, setRows] = useState<Array<RefundItem>>([]);

    useMemo(() => {
        setPage(0);
    }, [id]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (typeof id === 'string') {
            getTableData(id,);
        }
    }, [id, page]);

    const getTableData = (
        initiativeId: string,
    ) => {
        setIsLoading(true);
        getRewardBatches(initiativeId, page, 10)
            .then((res) => {
                if (typeof res.totalElements === 'number') {
                    setTotalElements(res.totalElements);
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
                setIsLoading(false);
            });
    };

    if (isLoading) { return (<LoadingOverlay />); }

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
                    onClick={() => setAssigneeFilter(draftAssignee)}
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
                    onClick={() => {
                        setAssigneeFilter("");
                        setDraftAssignee("");
                    }}
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

            <Table sx={{ mt: 2 }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{t('pages.initiativeMerchantsRefunds.table.name')}</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{t('pages.initiativeMerchantsRefunds.table.period')}</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{t('pages.initiativeMerchantsRefunds.table.type')}</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{t('pages.initiativeMerchantsRefunds.table.requestedRefund')}</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{t('pages.initiativeMerchantsRefunds.table.approvedRefund')}</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{t('pages.initiativeMerchantsRefunds.table.transactions')}</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{t('pages.initiativeMerchantsRefunds.table.checksPercentage')}</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{t('pages.initiativeMerchantsRefunds.table.assignee')}</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}></TableCell>
                    </TableRow>
                </TableHead>

                <TableBody sx={{ backgroundColor: "#FFFFFF" }}>
                    {rows.map((row) => (
                        <TableRow key={row.id} hover>
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
                            <TableCell>{row.posType === "ONLINE" ? "Online" : "Fisico"}</TableCell>
                            <TableCell>{!row.initialAmountCents ? "-" : (row.initialAmountCents / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" })}</TableCell>
                            <TableCell>{!row.approvedAmountCents || row.approvedAmountCents === 0 ? "-" : (row.approvedAmountCents / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" })}</TableCell>
                            <TableCell>{row.numberOfTransactions}</TableCell>
                            <TableCell>
                                {row.numberOfTransactions > 0
                                    ? `${((row.numberOfTransactionsElaborated / row.numberOfTransactions) * 100).toFixed(1)}% / 100%`
                                    : `0.0% / 100%`}
                            </TableCell>
                            <TableCell >{row.assigneeLevel}</TableCell>
                            <TableCell sx={{ textAlign: "right", }}>
                                <ButtonNaked onClick={() => { console.log(row); }}>
                                    <ChevronRightIcon color="primary" />
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
                    gap: 2,
                    color: "#33485C",
                    fontSize: "14px",
                    fontWeight: 500,
                }}
            >
                <Box>{`${start}–${end} di ${totalElements}`}</Box>


                <ChevronLeftIcon
                    sx={{
                        cursor: page > 0 ? "pointer" : "default",
                        opacity: page > 0 ? 1 : 0.3,
                        fontSize: 20,
                    }}
                />

                <ChevronRightIcon
                    sx={{
                        cursor:
                            page < totalElements - 1
                                ? "pointer"
                                : "default",
                        opacity:
                            page < totalElements - 1 ? 1 : 0.3,
                        fontSize: 20,
                    }}
                />
            </Box>
        </Box>
    );
};

export default InitiativeRefundsMerchants;