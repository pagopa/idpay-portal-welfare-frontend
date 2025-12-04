import { Box, Button } from "@mui/material";
import { ButtonNaked } from "@pagopa/mui-italia";
import FlagIcon from "@mui/icons-material/Flag";
import { useTranslation } from "react-i18next";
import { RewardBatchTrxStatusEnum } from "../../api/generated/merchants/RewardBatchTrxStatus";

interface Props {
    direction: "row" | "column";
    status?: RewardBatchTrxStatusEnum;
    onApprove: () => void;
    onSuspend: () => void;
    onReject: () => void;
    size?: number;
}

export const RefundActionButtons = ({
    direction,
    status,
    onApprove,
    onSuspend,
    onReject,
    size
}: Props) => {
    const { t } = useTranslation(); 

    // eslint-disable-next-line sonarjs/cognitive-complexity
    const getButtons = () => {
        switch (status) {
            case RewardBatchTrxStatusEnum.TO_CHECK:
            case RewardBatchTrxStatusEnum.CONSULTABLE:
                return [
                    direction === "column" ? { label: t(`pages.initiativeMerchantsTransactions.modal.approve`), click: onApprove, type: "primary" } : { label: t(`pages.initiativeMerchantsTransactions.modal.reject`), click: onReject, type: "error" },
                    { label: t(`pages.initiativeMerchantsTransactions.modal.suspend`), click: onSuspend, type: "flag" },
                    direction === "column" ? { label: t(`pages.initiativeMerchantsTransactions.modal.reject`), click: onReject, type: "naked" } : { label: t(`pages.initiativeMerchantsTransactions.modal.approve`), click: onApprove, type: "primary" }
                ];

            case RewardBatchTrxStatusEnum.REJECTED:
                return [
                    direction === "column" ? { label: t(`pages.initiativeMerchantsTransactions.modal.approve`), click: onApprove, type: "primary" } : { label: t(`pages.initiativeMerchantsTransactions.modal.suspend`), click: onSuspend, type: "flag" },
                    direction === "column" ? { label: t(`pages.initiativeMerchantsTransactions.modal.suspend`), click: onSuspend, type: "flag" } : { label: t(`pages.initiativeMerchantsTransactions.modal.approve`), click: onApprove, type: "primary" }
                ];

            case RewardBatchTrxStatusEnum.SUSPENDED:
                return [
                    direction === "column" ? { label: t(`pages.initiativeMerchantsTransactions.modal.approve`), click: onApprove, type: "primary" } : { label: t(`pages.initiativeMerchantsTransactions.modal.reject`), click: onReject, type: "error" },
                    direction === "column" ? { label: t(`pages.initiativeMerchantsTransactions.modal.reject`), click: onReject, type: "naked" } : { label: t(`pages.initiativeMerchantsTransactions.modal.approve`), click: onApprove, type: "primary" }
                ];

            case RewardBatchTrxStatusEnum.APPROVED:
                return [
                    direction === "column" ? { label: t(`pages.initiativeMerchantsTransactions.modal.suspend`), click: onSuspend, type: "flag" } : { label: t(`pages.initiativeMerchantsTransactions.modal.reject`), click: onReject, type: "error" },
                    direction === "column" ? { label: t(`pages.initiativeMerchantsTransactions.modal.reject`), click: onReject, type: "naked" } : { label: t(`pages.initiativeMerchantsTransactions.modal.suspend`), click: onSuspend, type: "flag" }
                ];

            default:
                return [];
        }
    };

    const btns = getButtons();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: direction,
                gap: 2,
                width: "100%",
                justifyContent: direction === "row" ? "flex-end" : ""
            }}
        >
            {btns.map((b, i) => {

                if (direction === "column" && b.type === "naked") {
                    return (
                        <ButtonNaked
                            key={i}
                            onClick={b.click}
                            color="error"
                            sx={{
                                mt: 1,
                                width: "100%",
                                textAlign: "center",
                                fontWeight: 600,
                                fontSize: "16px"
                            }}
                        >
                            {b.label} {size ? "(" + size.toString() + ")" : ""}
                        </ButtonNaked>
                    );
                }

                return (
                    <Button
                        key={i}
                        onClick={b.click}
                        variant={b.type === "primary" ? "contained" : "outlined"}
                        startIcon={b.type === "flag" ? <FlagIcon /> : undefined}
                        sx={{
                            width: direction === "row" ? "30%" : "100%",
                            fontWeight: 600,
                            borderRadius: "4px",
                            textTransform: "none",
                            paddingY: "12px",
                            fontSize: "17px",
                            whiteSpace: "nowrap",
                            ...(b.type === "primary" && {
                                bgcolor: "#0073E6",
                                color: "#fff",
                                "&:hover": { bgcolor: "#0066CC" }
                            }),
                            ...(b.type === "flag" && {
                                border: "2px solid #0073E6",
                                color: "#0073E6",
                                "&:hover": { bgcolor: "rgba(0,116,230,0.08)" }
                            }),
                            ...(b.type === "error" && {
                                border: "2px solid #D85757",
                                color: "#D85757",
                                "&:hover": { bgcolor: "rgba(217, 64, 37, 0.08)", color: "#D85757", borderColor: "#D85757" }
                            })
                        }}
                    >
                        {b.label} {size ? "(" + size.toString() + ")" : ""}
                    </Button>
                );
            })}
        </Box>
    );
};