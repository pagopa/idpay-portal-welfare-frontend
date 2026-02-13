import { useMemo, useState } from "react";
import {
  Box,
  Card,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";

type ReportRow = {
  id: string;
  fileName: string;
  requestDate: string;
  generationDate: string;
  salesPoint: string;
  period: string;
  operator: string;
  downloadable: boolean;
};

const StatusCell = () => (
  <Box sx={{ display: "flex", alignItems: "center", pl: 1 }}>
    <CheckCircleIcon sx={{ fontSize: 22, color: "#6CC66A" }} />
  </Box>
);

const DownloadCell = ({ disabled, onClick }: { disabled: boolean; onClick: () => void }) => (
  <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 1 }}>
    <DownloadIcon
      onClick={disabled ? undefined : onClick}
      sx={{
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.3 : 1,
        fontSize: 26,
        color: "#0073E6",
      }}
    />
  </Box>
);

const ReportTableCard = () => {
  const { t } = useTranslation();

  const rowsAll: Array<ReportRow> = useMemo(
    () => [
      {
        id: "1",
        fileName: "Report_300126.csv",
        requestDate: "30/01/2026, 11:11",
        generationDate: "30/01/2026, 11:11",
        salesPoint: "EURONICS DE RISI",
        period: "30/12/2025 - 30/01/2026",
        operator: "L1",
        downloadable: true,
      },
      {
        id: "1",
        fileName: "Report_300126.csv",
        requestDate: "30/01/2026, 11:11",
        generationDate: "30/01/2026, 11:11",
        salesPoint: "EURONICS DE RISI",
        period: "30/12/2025 - 30/01/2026",
        operator: "L1",
        downloadable: true,
      },
      {
        id: "1",
        fileName: "Report_300126.csv",
        requestDate: "30/01/2026, 11:11",
        generationDate: "30/01/2026, 11:11",
        salesPoint: "EURONICS DE RISI",
        period: "30/12/2025 - 30/01/2026",
        operator: "L1",
        downloadable: true,
      },
      {
        id: "1",
        fileName: "Report_300126.csv",
        requestDate: "30/01/2026, 11:11",
        generationDate: "30/01/2026, 11:11",
        salesPoint: "EURONICS DE RISI",
        period: "30/12/2025 - 30/01/2026",
        operator: "L1",
        downloadable: true,
      },
      {
        id: "1",
        fileName: "Report_300126.csv",
        requestDate: "30/01/2026, 11:11",
        generationDate: "30/01/2026, 11:11",
        salesPoint: "EURONICS DE RISI",
        period: "30/12/2025 - 30/01/2026",
        operator: "L1",
        downloadable: true,
      },
      {
        id: "1",
        fileName: "Report_300126.csv",
        requestDate: "30/01/2026, 11:11",
        generationDate: "30/01/2026, 11:11",
        salesPoint: "EURONICS DE RISI",
        period: "30/12/2025 - 30/01/2026",
        operator: "L1",
        downloadable: true,
      },
{
        id: "1",
        fileName: "Report_300126.csv",
        requestDate: "30/01/2026, 11:11",
        generationDate: "30/01/2026, 11:11",
        salesPoint: "EURONICS DE RISI",
        period: "30/12/2025 - 30/01/2026",
        operator: "L1",
        downloadable: true,
      },
      {
        id: "1",
        fileName: "Report_300126.csv",
        requestDate: "30/01/2026, 11:11",
        generationDate: "30/01/2026, 11:11",
        salesPoint: "EURONICS DE RISI",
        period: "30/12/2025 - 30/01/2026",
        operator: "L1",
        downloadable: true,
      },
      {
        id: "1",
        fileName: "Report_300126.csv",
        requestDate: "30/01/2026, 11:11",
        generationDate: "30/01/2026, 11:11",
        salesPoint: "EURONICS DE RISI",
        period: "30/12/2025 - 30/01/2026",
        operator: "L1",
        downloadable: true,
      },
      {
        id: "1",
        fileName: "Report_300126.csv",
        requestDate: "30/01/2026, 11:11",
        generationDate: "30/01/2026, 11:11",
        salesPoint: "EURONICS DE RISI",
        period: "30/12/2025 - 30/01/2026",
        operator: "L1",
        downloadable: true,
      },
      {
        id: "1",
        fileName: "Report_300126.csv",
        requestDate: "30/01/2026, 11:11",
        generationDate: "30/01/2026, 11:11",
        salesPoint: "EURONICS DE RISI",
        period: "30/12/2025 - 30/01/2026",
        operator: "L1",
        downloadable: true,
      },
      {
        id: "1",
        fileName: "Report_300126.csv",
        requestDate: "30/01/2026, 11:11",
        generationDate: "30/01/2026, 11:11",
        salesPoint: "EURONICS DE RISI",
        period: "30/12/2025 - 30/01/2026",
        operator: "L1",
        downloadable: true,
      },{
        id: "1",
        fileName: "Report_300126.csv",
        requestDate: "30/01/2026, 11:11",
        generationDate: "30/01/2026, 11:11",
        salesPoint: "EURONICS DE RISI",
        period: "30/12/2025 - 30/01/2026",
        operator: "L1",
        downloadable: true,
      },
      {
        id: "1",
        fileName: "Report_300126.csv",
        requestDate: "30/01/2026, 11:11",
        generationDate: "30/01/2026, 11:11",
        salesPoint: "EURONICS DE RISI",
        period: "30/12/2025 - 30/01/2026",
        operator: "L1",
        downloadable: true,
      },
      {
        id: "1",
        fileName: "Report_300126.csv",
        requestDate: "30/01/2026, 11:11",
        generationDate: "30/01/2026, 11:11",
        salesPoint: "EURONICS DE RISI",
        period: "30/12/2025 - 30/01/2026",
        operator: "L1",
        downloadable: true,
      },
      {
        id: "1",
        fileName: "Report_300126.csv",
        requestDate: "30/01/2026, 11:11",
        generationDate: "30/01/2026, 11:11",
        salesPoint: "EURONICS DE RISI",
        period: "30/12/2025 - 30/01/2026",
        operator: "L1",
        downloadable: true,
      },
      {
        id: "1",
        fileName: "Report_300126.csv",
        requestDate: "30/01/2026, 11:11",
        generationDate: "30/01/2026, 11:11",
        salesPoint: "EURONICS DE RISI",
        period: "30/12/2025 - 30/01/2026",
        operator: "L1",
        downloadable: true,
      },
      {
        id: "1",
        fileName: "Report_300126.csv",
        requestDate: "30/01/2026, 11:11",
        generationDate: "30/01/2026, 11:11",
        salesPoint: "EURONICS DE RISI",
        period: "30/12/2025 - 30/01/2026",
        operator: "L1",
        downloadable: true,
      },
    ],
    []
  );

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const totalElements = rowsAll.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));

  const start = totalElements === 0 ? 0 : page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalElements);

  const rows = useMemo(() => {
    const from = page * pageSize;
    const to = from + pageSize;
    return rowsAll.slice(from, to);
  }, [rowsAll, page, pageSize]);

  const handleDownload = (row: ReportRow) => {
    console.log("Download:", row.fileName);
  };

  return (
    <>
      <Card sx={{ p: 2, backgroundColor: "#FFFFFF" }}>
        <Typography variant="h6" component="h6" fontWeight={'bold'} my={3} mx={3} color={'#17324D'}>
          {t('pages.initiativeExportReport.exportTable.title')}
        </Typography>
        {totalElements === 0 ? (
          <Table sx={{ mt: 1, backgroundColor: "#FFFFFF" }}>
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={10}
                  sx={{
                    textAlign: "center",
                    py: 3,
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#5C6F82",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <Typography sx={{ color: "#17324D" }}>
                    {t("pages.initiativeExportReport.exportTable.emptyState")}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <>
            <Table
              sx={{
                mt: 1,
                width: "100%",
                tableLayout: "fixed",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      width: 34,
                      maxWidth: 34,
                      minWidth: 34,
                      pl: 0,
                    }}
                  />
                  <TableCell sx={{ whiteSpace: { xxl: "nowrap", lg: "normal" } }}>
                    {t("pages.initiativeExportReport.exportTable.columns.fileName")}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: { xxl: "nowrap", lg: "normal" } }}>
                    {t("pages.initiativeExportReport.exportTable.columns.requestDate")}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: { xxl: "nowrap", lg: "normal" } }}>
                    {t("pages.initiativeExportReport.exportTable.columns.generationDate")}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: { xxl: "nowrap", lg: "normal" } }}>
                    {t("pages.initiativeExportReport.exportTable.columns.salesPoint")}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: { xxl: "nowrap", lg: "normal" }, width: "20%" }}>
                    {t("pages.initiativeExportReport.exportTable.columns.period")}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: { xxl: "nowrap", lg: "normal" }, width: "10%" }}>
                    {t("pages.initiativeExportReport.exportTable.columns.operator")}
                  </TableCell>

                  <TableCell sx={{ width: "5%"}}/>
                </TableRow>
              </TableHead>
              <TableBody sx={{ backgroundColor: "#FFFFFF" }}>
                <TableRow>
                  <TableCell colSpan={8} sx={{ p: 0 }}>
                    <Divider variant="middle" sx={{ backgroundColor: "#E8EBF1", height: "1px" }} />
                  </TableCell>
                </TableRow>
                {rows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ pl: 2 }}>
                      <StatusCell />
                    </TableCell>
                    <TableCell>
                      <Tooltip title={row.fileName}>
                        <Box
                          sx={{
                            py: 0.5,
                            display: "inline-flex",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 260,
                            color: "#0B3A82",
                            fontWeight: 600,
                          }}
                        >
                          {row.fileName}
                        </Box>
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "inline-flex", color: "#5C6F82" }}>{row.requestDate}</Box>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "inline-flex", color: "#5C6F82" }}>{row.generationDate}</Box>
                    </TableCell>

                    <TableCell>
                      <Tooltip title={row.salesPoint}>
                        <Box
                          sx={{
                            display: "inline-flex",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 220,
                            color: "#17324D",
                            fontWeight: 600,
                          }}
                        >
                          {row.salesPoint}
                        </Box>
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ whiteSpace: "nowrap", color: "#17324D", fontWeight: 600 }}>
                        {row.period}
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "inline-flex", color: "#17324D" }}>{row.operator}</Box>
                    </TableCell>

                    <TableCell sx={{ p: 0 }}>
                      <DownloadCell disabled={!row.downloadable} onClick={() => handleDownload(row)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </Card>
      {totalElements > 0 &&
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 3,
            color: "#33485C",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <span>{t("pages.initiativeMerchantsRefunds.rowsPerPage")}</span>

            <FormControl size="small">
              <Select
                value={pageSize}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  setPageSize(next);
                  setPage(0);
                }}
                sx={{
                  height: 32,
                  "& .MuiSelect-select": { paddingY: "3px" },
                }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box>{`${start}–${end} di ${totalElements}`}</Box>

          <ChevronLeftIcon
            onClick={() => page > 0 && setPage(page - 1)}
            sx={{
              cursor: page > 0 ? "pointer" : "default",
              opacity: page > 0 ? 1 : 0.3,
              fontSize: 20,
            }}
          />

          <ChevronRightIcon
            onClick={() => page < totalPages - 1 && setPage(page + 1)}
            sx={{
              cursor: page < totalPages - 1 ? "pointer" : "default",
              opacity: page < totalPages - 1 ? 1 : 0.3,
              fontSize: 20,
            }}
          />
        </Box>}
    </>
  );
};

export default ReportTableCard;