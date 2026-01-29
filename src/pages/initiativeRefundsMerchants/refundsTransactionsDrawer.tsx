/* eslint-disable complexity */
import { Drawer, Box, Typography, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { ButtonNaked, CopyToClipboardButton } from "@pagopa/mui-italia";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Download } from "@mui/icons-material";
import { RewardBatchTrxStatus, RewardBatchTrxStatusEnum } from "../../api/generated/merchants/RewardBatchTrxStatus";
import { RefundsDrawerData } from "./initiativeRefundsTransactions";
import { RefundActionButtons } from "./refundsActionButtons";
import RefundReasonModal from "./refundsReasonModal";
import ApproveConfirmModal from "./approveConfirmModal";

interface Props {
    open: boolean;
    onClose: () => void;
    data: RefundsDrawerData | null;
    download: (pointOfSaleId: string | any, transactionId: string | any, invoiceFileName: string | any, isDownload?: boolean) => void;
    formatDate: (d?: string) => string;
    onApprove: (trxId: string) => void;
    onSuspend: (trxId: string, reason: string, checksError: ChecksErrorDTO) => Promise<void> | void;
    onReject: (trxId: string, reason: string, checksError: ChecksErrorDTO) => Promise<void> | void;
    disabled: boolean;
}

const formatCurrency = (value?: number) => {
    if (!value && value !== 0) { return "-"; }
    return (value / 100).toLocaleString("it-IT", {
        style: "currency",
        currency: "EUR",
    });
};

type ChecksErrorDTO = {
    cfError?: boolean;
    productEligibilityError?: boolean;
    disposalRaeeError?: boolean;
    priceError?: boolean;
    bonusError?: boolean;
    sellerReferenceError?: boolean;
    accountingDocumentError?: boolean;
};

const CHECK_ERROR_LABELS: Record<keyof ChecksErrorDTO, string> = {
    cfError: "Codice fiscale",
    productEligibilityError: "Idoneità prodotto",
    disposalRaeeError: "Smaltimento RAEE",
    priceError: "Prezzo",
    bonusError: "Bonus",
    sellerReferenceError: "Riferimento venditore",
    accountingDocumentError: "Documento contabile",
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function RefundsTransactionsDrawer({ open, onClose, data, download, formatDate, onApprove, onSuspend, onReject, disabled }: Props) {
    const { t } = useTranslation();

    const [reasonModalOpen, setReasonModalOpen] = useState(false);
    const [reasonModalType, setReasonModalType] = useState<"suspend" | "reject" | null>(null);
    const [pendingTrxId, setPendingTrxId] = useState<string | null>(null);
    const [approveModalOpen, setApproveModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const openReasonModal = (type: "suspend" | "reject", trxId: string, editMode?: boolean) => {
        setPendingTrxId(trxId);
        setReasonModalType(type);
        setReasonModalOpen(true);
        setEditMode(editMode || false);
    };

    const closeReasonModal = () => {
        setReasonModalOpen(false);
        setPendingTrxId(null);
        setEditMode(false);
    };

    useEffect(() => {
        // eslint-disable-next-line functional/immutable-data
        if (open) { document.body.style.overflow = "hidden"; }
        // eslint-disable-next-line functional/immutable-data
        else { document.body.style.overflow = "auto"; }
    }, [open, onClose]);

    const checksError = data?.checksError as ChecksErrorDTO | undefined;

    const activeErrors: Array<string> = checksError
        ? (Object.keys(checksError) as Array<keyof ChecksErrorDTO>)
            .filter((k) => checksError[k] === true)
            .map((k) => CHECK_ERROR_LABELS[k])
        : [];

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            ModalProps={{ keepMounted: true }}
            transitionDuration={300}
            PaperProps={{
                sx: {
                    width: "30%",
                    bgcolor: "#FFFFFF",
                    transform: open ? "translateX(0)" : "translateX(30%)",
                    transition: "transform 0.3s ease-out",
                },
            }}
        >
            <Box
                sx={{
                    px: 3,
                }}
            >
                <Typography
                    sx={{
                        fontSize: "24px",
                        fontWeight: 700,
                        color: "#17324D",
                        pr: 4,
                        pt: 7,
                        pb: 4
                    }}
                >
                    {t('pages.initiativeMerchantsTransactions.drawer.trxDetail')}
                </Typography>

                <CloseIcon
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 24,
                        top: 24,
                        cursor: "pointer",
                        color: "#17324D",
                    }}
                />
            </Box>

            <Box sx={{ px: 3, pb: 4 }}>
                <Typography sx={{ fontSize: "16px", fontWeight: 400, color: "#5C6F82" }}>
                    {t('pages.initiativeMerchantsTransactions.table.dateTime')}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
                    <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#17324D", flex: 1, wordBreak: "break-all" }}>
                        {formatDate(data?.trxChargeDate ?? "")}
                    </Typography>
                    <CopyToClipboardButton value={formatDate(data?.trxChargeDate ?? "")} sx={{ ml: 2, mr: 0, my: 0, p: 1 }} />
                </Box>

                <Typography sx={{ fontSize: "16px", fontWeight: 400, color: "#5C6F82" }}>
                    {t('pages.initiativeMerchantsTransactions.drawer.appliance')}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
                    <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#17324D", flex: 1, wordBreak: "break-all" }}>
                        {data?.productName ?? "-"} <br />
                        {data?.productGtin ?? "-"}
                    </Typography>
                    <CopyToClipboardButton value={`${data?.productName} ${data?.productGtin}`} sx={{ ml: 2, mr: 0, my: 0, p: 1 }} />
                </Box>

                <Typography sx={{ fontSize: "16px", fontWeight: 400, color: "#5C6F82" }}>
                    {t('pages.initiativeMerchantsTransactions.drawer.fiscalCode')}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
                    <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#17324D", flex: 1, wordBreak: "break-all" }}>
                        {data?.fiscalCode ?? "-"}
                    </Typography>
                    <CopyToClipboardButton value={data?.fiscalCode ?? "-"} sx={{ ml: 2, mr: 0, my: 0, p: 1 }} />
                </Box>

                <Typography sx={{ fontSize: "16px", fontWeight: 400, color: "#5C6F82" }}>
                    {t('pages.initiativeMerchantsTransactions.drawer.idTrx')}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
                    <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#17324D", flex: 1, wordBreak: "break-all" }}>
                        {data?.trxId ?? "-"}
                    </Typography>
                    <CopyToClipboardButton value={data?.trxId ?? "-"} sx={{ ml: 2, mr: 0, my: 0, p: 1 }} />
                </Box>

                <Typography sx={{ fontSize: "16px", fontWeight: 400, color: "#5C6F82" }}>
                    {t('pages.initiativeMerchantsTransactions.drawer.trxCode')}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
                    <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#17324D", flex: 1, wordBreak: "break-all" }}>
                        {data?.trxCode ?? "-"}
                    </Typography>
                    <CopyToClipboardButton value={data?.trxCode ?? "-"} sx={{ ml: 2, mr: 0, my: 0, p: 1 }} />
                </Box>

                <Typography sx={{ fontSize: "16px", fontWeight: 400, color: "#5C6F82" }}>
                    {t('pages.initiativeMerchantsTransactions.drawer.effectiveAmountCents')}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
                    <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#17324D", flex: 1, wordBreak: "break-all" }}>
                        {formatCurrency(data?.effectiveAmountCents)}
                    </Typography>
                    <CopyToClipboardButton value={formatCurrency(data?.effectiveAmountCents)} sx={{ ml: 2, mr: 0, my: 0, p: 1 }} />
                </Box>

                <Typography sx={{ fontSize: "16px", fontWeight: 400, color: "#5C6F82" }}>
                    {t('pages.initiativeMerchantsTransactions.drawer.rewardedAmountCents')}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
                    <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#17324D", flex: 1, wordBreak: "break-all" }}>
                        {formatCurrency(data?.rewardAmountCents)}
                    </Typography>
                    <CopyToClipboardButton value={formatCurrency(data?.rewardAmountCents)} sx={{ ml: 2, mr: 0, my: 0, p: 1 }} />
                </Box>

                <Typography sx={{ fontSize: "16px", fontWeight: 400, color: "#5C6F82" }}>
                    {t('pages.initiativeMerchantsTransactions.drawer.authorizedAmountCents')}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
                    <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#17324D", flex: 1, wordBreak: "break-all" }}>
                        {formatCurrency(data?.authorizedAmountCents)}
                    </Typography>
                    <CopyToClipboardButton value={formatCurrency(data?.authorizedAmountCents)} sx={{ ml: 2, mr: 0, my: 0, p: 1 }} />
                </Box>

                <Typography sx={{ fontSize: "16px", fontWeight: 400, color: "#5C6F82" }}>
                    {t('pages.initiativeMerchantsTransactions.drawer.docNumber')}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
                    <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#17324D", flex: 1, wordBreak: "break-all" }}>
                        {data?.invoiceDocNumber ?? "-"}
                    </Typography>
                    <CopyToClipboardButton value={data?.invoiceDocNumber ?? "-"} sx={{ ml: 2, mr: 0, my: 0, p: 1 }} />
                </Box>

                <Typography sx={{ fontSize: 16, fontWeight: 400, color: "#5C6F82" }}>
                    {t('pages.initiativeMerchantsTransactions.drawer.invoice')}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'space-between', gap: 1, mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <DescriptionOutlinedIcon
                            sx={{
                                height: 24,
                                color: "#0073E6",
                                flexShrink: 0,
                            }}
                        />

                        <ButtonNaked
                            sx={{ fontSize: 18, ml: 1, wordBreak: "break-word", textAlign: "left" }}
                            color="primary"
                            onClick={() => download(data?.pointOfSaleId, data?.transactionId, data?.invoiceFileName)}
                        >
                            {data?.invoiceFileName ?? "-"}
                        </ButtonNaked>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", p: 0.5 }} onClick={() => download(data?.pointOfSaleId, data?.transactionId, data?.invoiceFileName, true)}>
                        <Download sx={{ alignSelf: 'flex-end', color: "#0073E6", height: 24, cursor: 'pointer' }} />
                    </Box>
                </Box>

                <Typography sx={{ fontSize: "16px", fontWeight: 400, color: "#5C6F82" }}>
                    {t('pages.initiativeMerchantsTransactions.table.status')}
                </Typography>
                <Chip
                    label={data?.statusLabel}
                    color={data?.statusColor as any}
                    sx={{
                        mb: 3,
                        mt: 1,
                        fontWeight: 600,
                        fontSize: "14px",
                        "& .MuiChip-label": { whiteSpace: "nowrap" },
                        backgroundColor: data?.statusLabel === t('pages.initiativeMerchantsTransactions.table.toCheck') ? "#C4DCF5" : "",
                        color: data?.statusLabel === t('pages.initiativeMerchantsTransactions.table.toCheck') ? "#17324D" : ""
                    }}
                />

                {activeErrors.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            sx={{
                                fontSize: "14px",
                                fontWeight: 700,
                                color: "#17324D",
                                textTransform: "uppercase",
                                mb: 1,
                                letterSpacing: "0.5px",
                            }}
                        >
                            {t(`pages.initiativeMerchantsTransactions.drawer.criticity`)}
                        </Typography>

                        <Box component="ul" sx={{ pl: 3, m: 0, listStyleType: "square", }}>
                            {activeErrors.map((label) => (
                                <Box
                                    component="li"
                                    key={label}
                                    sx={{
                                        fontSize: "16px",
                                        color: "#17324D",
                                        lineHeight: "21px",
                                        mb: 1,
                                    }}
                                >
                                    {label}
                                </Box>
                            ))}
                        </Box>

                        <ButtonNaked onClick={() => {
                            if (data) {
                                const type = data?.rewardBatchTrxStatus === RewardBatchTrxStatusEnum.SUSPENDED ? "suspend" : "reject";
                                openReasonModal(type, data.trxId, true);
                            }
                         }}
                            sx={{
                                display: "inline-block",
                                mt: 1,
                                fontSize: "16px",
                                fontWeight: 600,
                                color: "#0066CC",
                                textDecoration: "none",
                                "&:hover": { textDecoration: "underline" },
                            }}>
                            {t(`pages.initiativeMerchantsTransactions.drawer.editChecks`)}
                        </ButtonNaked>
                    </Box>
                )}

                {data?.rewardBatchRejectionReason && data?.rewardBatchRejectionReason !== "-" &&
                    data?.rewardBatchTrxStatus !== "APPROVED" && (
                        <Box sx={{ mb: 3 }}>
                            <Typography
                                sx={{
                                    fontSize: "14px",
                                    fontWeight: 700,
                                    color: "#17324D",
                                    textTransform: "uppercase",
                                    mb: 3,
                                    letterSpacing: "0.5px"
                                }}
                            >
                                {t(`pages.initiativeMerchantsTransactions.drawer.note`)}
                            </Typography>

                            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                                <Typography
                                    sx={{
                                        fontSize: "18px",
                                        fontWeight: 600,
                                        color: "#17324D",
                                        lineHeight: "22px",
                                        whiteSpace: "pre-line",
                                        wordBreak: "break-all",
                                        overflowWrap: "break-word",
                                        flex: 1
                                    }}
                                >
                                    {data.rewardBatchRejectionReason}
                                </Typography>
                                <CopyToClipboardButton value={data.rewardBatchRejectionReason} sx={{ ml: 2, mr: 0, my: 0, p: 1 }} />
                            </Box>
                        </Box>
                    )}
                {!disabled &&
                    <RefundActionButtons
                        direction="column"
                        status={data?.rewardBatchTrxStatus as RewardBatchTrxStatus}
                        onApprove={() => data?.trxId && setApproveModalOpen(true)}
                        onSuspend={() => data?.trxId && openReasonModal("suspend", data.trxId)}
                        onReject={() => data?.trxId && openReasonModal("reject", data.trxId)}
                    />
                }
            </Box>
            <RefundReasonModal
                open={reasonModalOpen}
                type={reasonModalType ?? 'reject'}
                editMode={editMode}
                activeErrors={checksError}
                count={1}
                onClose={closeReasonModal}
                onConfirm={async (reason: string, checksError: ChecksErrorDTO) => {
                    if (!reasonModalType || !pendingTrxId) {
                        closeReasonModal();
                        return;
                    }

                    if (reasonModalType === "suspend") {
                        await onSuspend(pendingTrxId, reason, checksError);
                    } else {
                        await onReject(pendingTrxId, reason, checksError);
                    }

                    closeReasonModal();
                    onClose();
                }}
            />
            <ApproveConfirmModal
                open={approveModalOpen}
                count={1}
                onClose={() => setApproveModalOpen(false)}
                onConfirm={() => data?.trxId && onApprove(data.trxId)}
            />
        </Drawer>
    );
}