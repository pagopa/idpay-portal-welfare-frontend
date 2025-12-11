import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from "@mui/material";
import { useEffect } from "react";
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

    useEffect(() => {
        // eslint-disable-next-line functional/immutable-data
        if (open) { document.body.style.overflow = "hidden"; }
        // eslint-disable-next-line functional/immutable-data
        else { document.body.style.overflow = "auto"; }
    }, [open, onClose]);

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
                    sx={{ color: "#17324D", fontSize: "16px", marginTop: "4px" }}
                >
                    {description}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ padding: "20px", gap: 2 }}>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={{
                        borderColor: "#0073E6",
                        color: "#0073E6",
                        fontWeight: 600,
                        paddingX: "24px",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "rgba(0,115,230,0.08)" }
                    }}
                >
                    {t("pages.initiativeMerchantsTransactions.modal.cancel")}
                </Button>

            </DialogActions>
        </Dialog>
    );
};