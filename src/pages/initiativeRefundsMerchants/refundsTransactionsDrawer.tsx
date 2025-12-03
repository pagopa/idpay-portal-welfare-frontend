import { Drawer, Box, Typography, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { ButtonNaked } from "@pagopa/mui-italia";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { RefundsDrawerData } from "./initiativeRefundsTransactions";

interface Props {
    open: boolean;
    onClose: () => void;
    data: RefundsDrawerData | null;
    download: (pointOfSaleId: string | any, transactionId: string | any) => void;
    formatDate: (d?: string) => string;
}

const formatCurrency = (value?: number) => {
    if (!value && value !== 0) { return "-"; }
    return (value / 100).toLocaleString("it-IT", {
        style: "currency",
        currency: "EUR",
    });
};

export default function RefundsTransactionsDrawer({ open, onClose, data, download, formatDate }: Props) {
    const { t } = useTranslation();

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
                    transform: open ? "translateX(0)" : "translateX(420px)",
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
                <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#17324D", mb: 3 }}>
                    {formatDate(data?.trxChargeDate ?? "")}
                </Typography>

                <Typography sx={{ fontSize: "16px", fontWeight: 400, color: "#5C6F82" }}>
                    {t('pages.initiativeMerchantsTransactions.drawer.appliance')}
                </Typography>
                <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#17324D", mb: 3 }}>
                    {data?.productName ?? "-"} <br />
                    {data?.productGtin ?? "-"}
                </Typography>

                <Typography sx={{ fontSize: "16px", fontWeight: 400, color: "#5C6F82" }}>
                    {t('pages.initiativeMerchantsTransactions.drawer.fiscalCode')}
                </Typography>
                <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#17324D", mb: 3 }}>
                    {data?.fiscalCode ?? "-"}
                </Typography>

                <Typography sx={{ fontSize: "16px", fontWeight: 400, color: "#5C6F82" }}>
                    {t('pages.initiativeMerchantsTransactions.drawer.idTrx')}
                </Typography>
                <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#17324D", mb: 3, wordBreak: "break-all" }}>
                    {data?.trxId}
                </Typography>

                <Typography sx={{ fontSize: "16px", fontWeight: 400, color: "#5C6F82" }}>
                    {t('pages.initiativeMerchantsTransactions.drawer.trxCode')}
                </Typography>
                <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#17324D", mb: 3 }}>
                    {data?.trxCode ?? "-"}
                </Typography>

                <Typography sx={{ fontSize: "16px", fontWeight: 400, color: "#5C6F82" }}>
                    {t('pages.initiativeMerchantsTransactions.drawer.effectiveAmountCents')}
                </Typography>
                <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#17324D", mb: 3 }}>
                    {formatCurrency(data?.effectiveAmountCents)}
                </Typography>

                <Typography sx={{ fontSize: "16px", fontWeight: 400, color: "#5C6F82" }}>
                    {t('pages.initiativeMerchantsTransactions.drawer.rewardedAmountCents')}
                </Typography>
                <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#17324D", mb: 3 }}>
                    {formatCurrency(data?.rewardAmountCents)}
                </Typography>

                <Typography sx={{ fontSize: "16px", fontWeight: 400, color: "#5C6F82" }}>
                    {t('pages.initiativeMerchantsTransactions.drawer.authorizedAmountCents')}
                </Typography>
                <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#17324D", mb: 3 }}>
                    {formatCurrency(data?.authorizedAmountCents)}
                </Typography>

                <Typography sx={{ fontSize: "16px", fontWeight: 400, color: "#5C6F82" }}>
                    {t('pages.initiativeMerchantsTransactions.drawer.docNumber')}
                </Typography>
                <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#17324D", mb: 3 }}>
                    {data?.invoiceDocNumber ?? "-"}
                </Typography>

                <Typography sx={{ fontSize: 16, fontWeight: 400, color: "#5C6F82" }}>
                    {t('pages.initiativeMerchantsTransactions.drawer.invoice')}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                    <DescriptionOutlinedIcon
                        sx={{
                            height: 24,
                            color: "#0073E6",
                            flexShrink: 0,
                        }}
                    />

                    <ButtonNaked
                        color="primary"
                        onClick={() => download(data?.pointOfSaleId, data?.transactionId)}
                    >
                        {/* {row.invoiceFileName}
                        <Typography
                            component="a"
                            href="#"
                            sx={{
                                fontSize: 18,
                                fontWeight: 600,
                                color: "#0073E6",
                                textDecoration: "none",
                                "&:hover": { textDecoration: "underline" },
                            }}
                        > */}
                        {data?.invoiceFileName ?? "-"}
                        {/* </Typography> */}
                    </ButtonNaked>
                </Box>

                <Typography sx={{ fontSize: "16px", fontWeight: 400, color: "#5C6F82" }}>
                    {t('pages.initiativeMerchantsTransactions.table.status')}
                </Typography>
                <Chip
                    label={data?.statusLabel}
                    color={data?.statusColor as any}
                    sx={{
                        mt: 1,
                        fontWeight: 600,
                        fontSize: "14px",
                        "& .MuiChip-label": { whiteSpace: "nowrap" }
                    }}
                />

            </Box>
        </Drawer>
    );
}