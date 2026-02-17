import { useEffect, useState } from "react";
import {
  Alert,
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
import SyncIcon from "@mui/icons-material/Sync";
import ErrorIcon from "@mui/icons-material/Error";
import { useLoading } from "@pagopa/selfcare-common-frontend";
import { getDownloadReport, getReportList } from "../../services/merchantsService";
import { ReportStatusEnum } from "../../api/generated/merchants/ReportDTO";
import { LOADING_TASK_INITIATIVE_EXPORT_REPORT } from "../../utils/constants";
import { downloadCsv } from "../../utils/fileViewer-utils";
import { useAlert } from "../../hooks/useAlert";

type ReportRow = {
  id: string;
  fileName: string;
  requestDate: string;
  generationDate: string;
  salesPoint: string;
  period: string;
  operator: string;
  downloadable: boolean;
  reportStatus: string;
};

const isInProgress = (s?: string) =>
  (s ?? "").toUpperCase() === ReportStatusEnum.INSERTED || (s ?? "").toUpperCase() === ReportStatusEnum.IN_PROGRESS;

const StatusCell = ({ status }: { status?: ReportStatusEnum | string }) => {
  const s = (status ?? "").toUpperCase();

  if (s === ReportStatusEnum.FAILED) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", pl: 1 }}>
        <ErrorIcon sx={{ fontSize: 22, color: "#FE6666" }} />
      </Box>
    );
  }

  if (isInProgress(s)) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", pl: 1 }}>
        <SyncIcon sx={{ fontSize: 22, color: "#6BCFFB" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", pl: 1 }}>
      <CheckCircleIcon sx={{ fontSize: 22, color: "#6CC66A" }} />
    </Box>
  );
};

const DownloadCell = ({ disabled, onClick, status }: { disabled: boolean; onClick: () => void; status: string }) => (
  <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 1 }}>
    <DownloadIcon
      onClick={disabled ? undefined : onClick}
      sx={{
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.3 : 1,
        fontSize: 26,
        color: isInProgress(status) ? "#A2ADB8" : "#0073E6"
      }}
    />
  </Box>
);

type ReportTableCardProps = {
  initiativeId: string;
  refreshToken: number;
};

function formatDateTime(value?: string | null): string {
  if (!value) { return "-"; }

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) { return String(value); }

  return d.toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPeriod(start?: string | null, end?: string | null): string {
  if (!start && !end) { return "-"; }
  const s = start ? new Date(start) : null;
  const e = end ? new Date(end) : null;

  const fmt = (d: Date) =>
    d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });

  return `${s && !Number.isNaN(s.getTime()) ? fmt(s) : start ?? "-"} - ${e && !Number.isNaN(e.getTime()) ? fmt(e) : end ?? "-"
    }`;
}

const ReportTableCard = ({ initiativeId, refreshToken }: ReportTableCardProps) => {
  const { t } = useTranslation();
  const { setAlert } = useAlert();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [rows, setRows] = useState<Array<ReportRow>>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const setLoading = useLoading(LOADING_TASK_INITIATIVE_EXPORT_REPORT);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    // eslint-disable-next-line functional/no-let
    let cancelled = false;

    const fetchReports = async () => {
      setLoading(true);
      setError(null);

      try {

        const res = await getReportList(initiativeId, page, pageSize);

        const nextTotalElements =
          typeof (res as any)?.totalElements === "number" ? (res as any).totalElements : 0;
        const nextTotalPages =
          typeof (res as any)?.totalPages === "number" ? (res as any).totalPages : 1;

        setTotalElements(nextTotalElements);
        setTotalPages(Math.max(1, nextTotalPages));

        const reports = Array.isArray((res as any)?.reports) ? (res as any).reports : [];

        const mapped: Array<ReportRow> = reports.map((r: any) => ({
          id: String(r.id),
          fileName: String(r.fileName ?? "-"),
          requestDate: formatDateTime(r.requestDate),
          generationDate: formatDateTime(r.elaborationDate),
          salesPoint: String(r.businessName ?? "-"),
          period: formatPeriod(r.startPeriod, r.endPeriod),
          operator: String(r.operatorLevel ?? "-"),
          downloadable: (r.reportStatus ?? "").toUpperCase() === ReportStatusEnum.GENERATED,
          reportStatus: String(r.reportStatus),
        }));

        setRows(mapped);

      } catch (e) {
        if (cancelled) { return; }
        setRows([]);
        setTotalElements(0);
        setTotalPages(1);
        setError(t("errors.getDataDescription"));
      } finally {
        if (!cancelled) { setLoading(false); }
      }
    };

    fetchReports().then(() => {
    }).catch(() => {
      setLoading(false);
    }).finally(() => {
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [initiativeId, page, pageSize, t, refreshToken]);

  const start = totalElements === 0 ? 0 : page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalElements);

  const handleDownload = (row: ReportRow) => {
    if (row?.id) {
      setLoading(true);
      getDownloadReport(
        initiativeId,
        row.id
      )
        .then((res) => {
          const reportUrl = res?.reportUrl;
          if (!reportUrl) {
            throw new Error("Invoice URL not found");
          }
          const fileName = getFileNameFromAzureUrl(reportUrl, row);
          return downloadCsv(reportUrl, fileName);
        })
        .catch((_error) => {
          setAlert({ title: t('errors.title'), text: t('errors.getDataDescription'), isOpen: true, severity: 'error' });
        })
        .finally(() => setLoading(false));
    }
  };

  const getFileNameFromAzureUrl = (url: string, report: ReportRow): string => {
    try {
      const { pathname } = new URL(url);
      const rawFileName = pathname.substring(pathname.lastIndexOf("/") + 1);
      return decodeURIComponent(rawFileName);
    } catch {
      return `${report?.fileName}`;
    }
  };

  return (
    <>
      <Card sx={{ p: 2, backgroundColor: "#FFFFFF" }}>
        <Typography variant="h6" component="h6" fontWeight={"bold"} my={3} mx={3} color={"#17324D"}>
          {t("pages.initiativeExportReport.exportTable.title")}
        </Typography>

        {error && (
          <Box sx={{ px: 3, pb: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

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
          <Table
            sx={{
              mt: 1,
              width: "100%",
              tableLayout: "fixed",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 34, maxWidth: 34, minWidth: 34, pl: 0 }} />
                <TableCell sx={{ whiteSpace: { xxl: "nowrap", lg: "normal" }, width: "20%" }}>
                  {t("pages.initiativeExportReport.exportTable.columns.fileName")}
                </TableCell>
                <TableCell sx={{ whiteSpace: { xxl: "nowrap", lg: "normal" } }}>
                  {t("pages.initiativeExportReport.exportTable.columns.requestDate")}
                </TableCell>
                <TableCell sx={{ whiteSpace: { xxl: "nowrap", lg: "normal" } }}>
                  {t("pages.initiativeExportReport.exportTable.columns.generationDate")}
                </TableCell>
                <TableCell sx={{ whiteSpace: { xxl: "nowrap", lg: "normal" }, width: "15%" }}>
                  {t("pages.initiativeExportReport.exportTable.columns.salesPoint")}
                </TableCell>
                <TableCell sx={{ whiteSpace: { xxl: "nowrap", lg: "normal" }, width: "20%" }}>
                  {t("pages.initiativeExportReport.exportTable.columns.period")}
                </TableCell>
                <TableCell sx={{ whiteSpace: { xxl: "nowrap", lg: "normal" }, width: "7%" }}>
                  {t("pages.initiativeExportReport.exportTable.columns.operator")}
                </TableCell>
                <TableCell sx={{ width: "5%" }} />
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
                    <StatusCell status={row.reportStatus} />
                  </TableCell>

                  <TableCell>
                    <Tooltip title={row.fileName}>
                      <Box
                        sx={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          maxWidth: "100%",
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          wordBreak: "break-all",
                          color: "#17324D",
                          fontWeight: 600,
                          maxLines: 2,
                          WebkitLineClamp: 2,
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
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          maxWidth: "100%",
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "pre-wrap",
                          color: "#17324D",
                          fontWeight: 600,
                          maxLines: 2,
                          WebkitLineClamp: 2,
                        }}
                      >
                        {row.salesPoint}
                      </Box>
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    <Tooltip title={row.period}>
                      <Box sx={{
                        display: "block",
                        maxWidth: "100%",
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#17324D", fontWeight: 600
                      }}>
                        {row.period}
                      </Box>
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "inline-flex", color: "#17324D" }}>{row.operator}</Box>
                  </TableCell>

                  <TableCell sx={{ p: 0 }}>
                    {row.reportStatus !== ReportStatusEnum.FAILED &&
                      <DownloadCell disabled={!row.downloadable} status={row.reportStatus} onClick={() => handleDownload(row)} />
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {totalElements > 0 && (
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
        </Box>
      )}
    </>
  );
};

export default ReportTableCard;