import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Checkbox, FormControlLabel, Box } from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChecksErrorDTO } from "../../api/generated/merchants/ChecksErrorDTO";

interface Props {
    open: boolean;
    onClose: () => void;
    type: "suspend" | "reject";
    editMode?: boolean;
    activeErrors?: ChecksErrorDTO | undefined;
    count: number;
    onConfirm: (reason: string, checksError: ChecksErrorDTO) => void;
}

const defaultChecksError: ChecksErrorDTO = {
    cfError: false,
    productEligibilityError: false,
    disposalRaeeError: false,
    priceError: false,
    bonusError: false,
    sellerReferenceError: false,
    accountingDocumentError: false,
};

export default function RefundReasonModal({ open, onClose, type, count, onConfirm, activeErrors, editMode }: Props) {
    const [reason, setReason] = useState("");
    const [error, setError] = useState(false);
    const [checkboxErrorMessage, setCheckboxErrorMessage] = useState(false);
    const { t } = useTranslation();
    const [checksError, setChecksError] = useState<ChecksErrorDTO>(false);

    useEffect(() => {
        if (open && editMode && activeErrors) {
            setChecksError(activeErrors);
        } else {
            setReason("");
            setError(false);
            setCheckboxErrorMessage(false);
            setChecksError(defaultChecksError);
        }
    }, [open]);

    const handleCheckboxChange = (field: keyof ChecksErrorDTO) => {
        setChecksError(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
        if (checkboxErrorMessage) {
            setCheckboxErrorMessage(false);
        }
    };

    const isAnyCheckboxSelected = Object.values(checksError).some(value => value === true);

    const handleSubmit = () => {
        const hasError = !reason.trim();
        const hasCheckboxError = !isAnyCheckboxSelected;

        if (hasError || hasCheckboxError) {
            setError(hasError);
            setCheckboxErrorMessage(hasCheckboxError);
            return;
        }

        onConfirm(reason, checksError);
    };

    const isSingle = count === 1 ? "single" : "plural";

    const title = editMode ? t(`pages.initiativeMerchantsTransactions.modal.${isSingle}.${type}EditTitle`) : t(`pages.initiativeMerchantsTransactions.modal.${isSingle}.${type}Title`);
    const description = editMode ? t(`pages.initiativeMerchantsTransactions.modal.${isSingle}.${type}EditDescription`) : t(`pages.initiativeMerchantsTransactions.modal.${isSingle}.${type}Description`);
    const subDesc = editMode ? t(`pages.initiativeMerchantsTransactions.modal.${isSingle}.${type}EditSubDesc`) : t(`pages.initiativeMerchantsTransactions.modal.${isSingle}.${type}SubDesc`);
    const checkboxDescription = t(`pages.initiativeMerchantsTransactions.modal.${isSingle}.${type}CheckboxDescription`);

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
                    {checkboxDescription}
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checksError.cfError}
                                    onChange={() => handleCheckboxChange("cfError")}
                                />
                            }
                            label={t("pages.initiativeMerchantsTransactions.checksError.cfError")}
                            sx={{ margin: 0 }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checksError.bonusError}
                                    onChange={() => handleCheckboxChange("bonusError")}
                                />
                            }
                            label={t("pages.initiativeMerchantsTransactions.checksError.bonusError")}
                            sx={{ margin: 0 }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checksError.productEligibilityError}
                                    onChange={() => handleCheckboxChange("productEligibilityError")}
                                />
                            }
                            label={t("pages.initiativeMerchantsTransactions.checksError.productEligibilityError")}
                            sx={{ margin: 0 }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checksError.sellerReferenceError}
                                    onChange={() => handleCheckboxChange("sellerReferenceError")}
                                />
                            }
                            label={t("pages.initiativeMerchantsTransactions.checksError.sellerReferenceError")}
                            sx={{ margin: 0 }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checksError.disposalRaeeError}
                                    onChange={() => handleCheckboxChange("disposalRaeeError")}
                                />
                            }
                            label={t("pages.initiativeMerchantsTransactions.checksError.disposalRaeeError")}
                            sx={{ margin: 0 }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checksError.accountingDocumentError}
                                    onChange={() => handleCheckboxChange("accountingDocumentError")}
                                />
                            }
                            label={t("pages.initiativeMerchantsTransactions.checksError.accountingDocumentError")}
                            sx={{ margin: 0 }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checksError.priceError}
                                    onChange={() => handleCheckboxChange("priceError")}
                                />
                            }
                            label={t("pages.initiativeMerchantsTransactions.checksError.priceError")}
                            sx={{ margin: 0 }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checksError.priceError} // TODO
                                    onChange={() => handleCheckboxChange("priceError")} // TODO
                                />
                            }
                            label={t("pages.initiativeMerchantsTransactions.checksError.otherError")}
                            sx={{ margin: 0 }}
                        />
                    </Box>
                    {checkboxErrorMessage && (
                        <Typography sx={{ color: "#D85757", fontSize: 12, mt: 1, ml: 1.75, fontWeight: 600 }}>
                            {t('validation.selectAtLeastOne')}
                        </Typography>
                    )}
                </Box>

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

                {editMode && (
                    <Button
                        onClick={() => handleSubmit()}
                        variant="contained"
                        disabled={!isAnyCheckboxSelected}
                        sx={{
                            borderRadius: 1,
                            textTransform: "none",
                            px: 3,
                            fontWeight: 600,
                            bgcolor: "#0073E6",
                            "&:hover": { bgcolor: "#0066CC" }
                        }}
                    >
                        {t(`pages.initiativeMerchantsTransactions.modal.update`)}
                    </Button>
                )}

                {type === "reject" && !editMode && (
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

                {type === "suspend" && !editMode && (
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