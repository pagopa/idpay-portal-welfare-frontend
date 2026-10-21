import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CopyToClipboardButton } from "@pagopa/mui-italia";
import { ReasonDTO } from "../../../api/generated/merchants/apiClient";

type Props = {
    notesList: Array<ReasonDTO>;
    formatDate: (d?: string) => string;
    title: string
};

export const ReasonNotesField = ({ notesList, formatDate, title }: Props) => {
    const { t } = useTranslation();
    return <>
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
            {t(title)}
        </Typography>
        {notesList.map(({ reason, date }: ReasonDTO, i: number) => typeof reason === "string" && reason !== "-" &&
            <Box
                key={`${i}-${date}`}
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    mb: 2
                }}
            >
                <Box sx={{ flex: 1 }}>
                    <Typography
                        sx={{
                            fontSize: "14px",
                            color: "#6B7280",
                            mb: 0.5
                        }}
                    >
                        {date ? formatDate(date.toString()) : '-'}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "18px",
                            fontWeight: 600,
                            color: "#17324D",
                            lineHeight: "22px",
                            whiteSpace: "pre-line",
                            wordBreak: "break-word"
                        }}
                    >
                        {reason}
                    </Typography>
                </Box>
                <CopyToClipboardButton
                    value={reason}
                    sx={{ ml: 2, p: 1 }}
                />
            </Box>
        )}
    </>;
};