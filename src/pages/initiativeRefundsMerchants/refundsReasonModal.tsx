import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface Props {
    open: boolean;
    onClose: () => void;
    type: "suspend" | "reject";
    count: number;
    onConfirm: (reason: string) => void;
}

export default function RefundReasonModal({ open, onClose, type, count, onConfirm }: Props) {
    const [reason, setReason] = useState("");
    const [error, setError] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (!open) {
            setReason("");
            setError(false);
        }
    }, [open]);

    const handleSubmit = () => {
        if (!reason.trim()) {
            setError(true);
            return;
        }
        onConfirm(reason);
    };

    const title = t(`pages.initiativeMerchantsTransactions.modal.${type}Title`);

    const description = t(`pages.initiativeMerchantsTransactions.modal.${type}Description`);

    const subDesc = t(`pages.initiativeMerchantsTransactions.modal.${type}SubDesc`);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" disableScrollLock keepMounted>
            <DialogTitle sx={{ fontSize: 22, fontWeight: 700, mt: 2 }}>
                {title}
            </DialogTitle>

            <DialogContent>
                <Typography sx={{ mb: 2, color: "#17324D" }}>
                    {description}
                </Typography>

                <Typography sx={{ fontWeight: 600, mb: 2, color: "#17324D" }}>
                    {subDesc}
                </Typography>

                <TextField
                    label={t(`pages.initiativeMerchantsTransactions.drawer.note`)}
                    multiline
                    fullWidth
                    value={reason}
                    onChange={(e) => {
                        setReason(e.target.value);
                        if (error) { setError(false); };
                    }}
                    error={error && reason.trim().length === 0}
                    helperText={error ? t('validation.required') : ""}
                    inputProps={{ maxLength: 200 }}
                />

                <Typography sx={{ mt: 1, textAlign: "right", fontSize: 12, color: "#888" }}>
                    {reason.length}/200
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{ borderRadius: 1, textTransform: "none", px: 3, fontWeight: 600 }}
                >
                    {t(`pages.initiativeMerchantsTransactions.modal.cancel`)}
                </Button>

                {type === "reject" && (
                    <Button
                        onClick={() => handleSubmit()}
                        color="error"
                        variant="outlined"
                        sx={{
                            borderRadius: 1, textTransform: "none", px: 3, fontWeight: 600,
                            border: "2px solid #D85757", color: "#D85757",
                            "&:hover": { bgcolor: "rgba(217, 64, 37, 0.08)", color: "#D85757", borderColor: "#D85757" }
                        }}
                    >
                        {t(`pages.initiativeMerchantsTransactions.modal.${type}`)} ({count})
                    </Button>
                )}

                {type === "suspend" && (
                    <Button
                        onClick={() => handleSubmit()}
                        variant="contained"
                        sx={{
                            borderRadius: 1,
                            textTransform: "none",
                            px: 3,
                            fontWeight: 600,
                            bgcolor: "#0073E6",
                            "&:hover": { bgcolor: "#0066CC" }
                        }}
                        startIcon={<FlagIcon />}
                    >
                        {t(`pages.initiativeMerchantsTransactions.modal.${type}`)} ({count})
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}