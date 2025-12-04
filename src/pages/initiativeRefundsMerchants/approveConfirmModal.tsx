import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
interface Props {
    open: boolean;
    onClose: () => void;
    count: number;
    onConfirm: () => void;
}

export default function ApproveConfirmModal({ open, onClose, onConfirm, count }: Props) {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" disableScrollLock keepMounted>
            <DialogTitle sx={{ fontSize: 22, fontWeight: 700, mt: 2, mx: 2 }}>
                {t('pages.initiativeMerchantsTransactions.modal.approveTitle')}
            </DialogTitle>

            <DialogContent>
                <Typography sx={{ color:"#17324D", m: 2 }}>
                    {t('pages.initiativeMerchantsTransactions.modal.approveDescription')}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p:3 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{ borderRadius:1, px:3, fontWeight:600, textTransform:"none" }}
                >
                    {t('pages.initiativeMerchantsTransactions.modal.cancel')}
                </Button>

                <Button
                    variant="contained"
                    sx={{
                        borderRadius:1, px:3, fontWeight:600, textTransform:"none",
                        bgcolor:"#0073E6", "&:hover":{ bgcolor:"#0066CC" }
                    }}
                    onClick={() => { onConfirm(); onClose(); }}
                >
                    {t('pages.initiativeMerchantsTransactions.modal.approve')} ({count})
                </Button>
            </DialogActions>
        </Dialog>
    );
}