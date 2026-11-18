import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CopyToClipboardButton } from "@pagopa/mui-italia";
import { ReasonDTO } from "../../../api/generated/merchants/apiClient";

type Props = {
    notesList: Array<ReasonDTO>;
    formatDate: (d?: string) => string;
    title: string
};

const ellipsisSx = {
    display: "block",
    maxWidth: "100%",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
} as const;

export const ReasonNotesField = ({ notesList, formatDate, title }: Props) => {
    const { t } = useTranslation();
    return <>
        <Typography
            sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#17324D",
                textTransform: "uppercase",
                mb: 1,
                letterSpacing: "0.5px"
            }}
        >
            {t(title)}
        </Typography>
        {notesList.map(({ reason, date }: ReasonDTO, i: number) => typeof reason === "string" && reason !== "-" &&
            <Box
                key={`${i}-${date}`}
                sx={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) auto",
                    alignItems: "center",
                    mb: 2
                }}
            >
                <Typography
                    sx={{
                        ...ellipsisSx,
                        gridColumn: 1,
                        fontSize: "14px",
                        color: "#6B7280",
                        mb: 0.5
                    }}
                >
                    {date ? formatDate(date.toString()) : '-'}
                </Typography>
                <Typography
                    sx={{
                        gridColumn: 1,
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#17324D",
                        lineHeight: "22px",
                    }}
                >
                    {reason}
                </Typography>
                <CopyToClipboardButton
                    value={reason}
                    sx={{ gridColumn: 2, gridRow: 2, ml: 2, p: 1 }}
                />
            </Box>
        )}
    </>;
};
