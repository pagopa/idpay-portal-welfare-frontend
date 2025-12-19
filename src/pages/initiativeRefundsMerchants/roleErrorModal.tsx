import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface Props {
    open: boolean;
    onClose: () => void;
}

export const RoleErrorModal = ({
    open,
    onClose,
}: Props) => {
    const { t } = useTranslation();

    const getLabels = () => ({
        title: t("pages.initiativeMerchantsTransactions.batchModal.errorTitle"),
        description: t("pages.initiativeMerchantsTransactions.batchModal.errorDescription")
    });

    const { title, description } = getLabels();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            disableScrollLock keepMounted
            PaperProps={{
                sx: { padding: "8px 4px" }
            }}
        >
            <DialogTitle>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#17324D" }}>
                    {title}
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Typography
                    variant="body1"
                    sx={{ color: "#17324D", fontSize: "16px", marginTop: "4px", whiteSpace: "pre-line" }}
                >
                    {description}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ padding: "20px", gap: 2 }}>
                <Button
                    variant="contained"
                    onClick={onClose}
                    sx={{
                        fontWeight: 600,
                        paddingX: "24px",                        
                    }}
                >
                    {t("pages.initiativeMerchantsTransactions.modal.close")}
                </Button>

            </DialogActions>
        </Dialog>
    );
};