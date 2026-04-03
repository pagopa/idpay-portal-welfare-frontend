import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";

interface Props {
    role: "L1" | "L2" | "L3";
    onClick: () => void;
}

export const RoleActionButton = ({ role, onClick }: Props) => {
    const { t } = useTranslation();

    const getLabel = () => {
        switch (role) {
            case "L1":
                return t(`pages.initiativeMerchantsTransactions.batchDetail.validate`);
            case "L2":
                return t(`pages.initiativeMerchantsTransactions.batchDetail.check`);
            case "L3":
                return t(`pages.initiativeMerchantsTransactions.batchDetail.approve`);
            default:
                return "";
        }
    };

    return (
        <Button
            variant="contained"
            onClick={onClick}
            sx={{
                whiteSpace: "nowrap",
            }}
        >
            {getLabel()} {t(`pages.initiativeMerchantsTransactions.batchDetail.batchLowerCase`)}
        </Button>
    );
};