import { Box } from "@mui/material";
import { TitleBox, useLoading } from "@pagopa/selfcare-common-frontend";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import { matchPath } from "react-router-dom";
import { initiativePagesBreadcrumbsContainerStyle } from "../../helpers";
import ROUTES from "../../routes";
import BreadcrumbsBox from "../components/BreadcrumbsBox";
import { initiativeSelector } from "../../redux/slices/initiativeSlice";
import { useAppSelector } from "../../redux/hooks";
import { useInitiative } from "../../hooks/useInitiative";
import ExportFiltersCard from "../../components/ExportFiltersCard/ExportFiltersCard";
import { generateReport, getMerchantList } from "../../services/merchantsService";
import { MerchantItem } from "../initiativeRefundsMerchants/initiativeRefundsMerchants";
import { useAlert } from "../../hooks/useAlert";
import ReportTableCard from "../../components/ReportTable/ReportTableCard";
import { ReportStatusEnum, ReportTypeEnum } from "../../api/generated/merchants/ReportDTO";
import { LOADING_TASK_INITIATIVE_EXPORT_REPORT } from "../../utils/constants";

const InitiativeExportReportPage = () => {
  const { t } = useTranslation();
  const initiativeSel = useAppSelector(initiativeSelector);
  useInitiative();
  const [businessNameList, setBusinessNameList] = useState<Array<MerchantItem>>([]);
  interface MatchParams {
    id: string;
  }
  const reportStatusAlertConfig = {
    [ReportStatusEnum.GENERATED]: {
      severity: 'success' as const,
      text: t('pages.initiativeExportReport.reportAlertMessage.generated')
    },
    [ReportStatusEnum.FAILED]: {
      severity: 'error' as const,
      text: t('pages.initiativeExportReport.reportAlertMessage.failed')
    },
    [ReportStatusEnum.INSERTED]: {
      severity: 'info' as const,
      text: t('pages.initiativeExportReport.reportAlertMessage.processing')
    },
    [ReportStatusEnum.IN_PROGRESS]: {
      severity: 'info' as const,
      text: t('pages.initiativeExportReport.reportAlertMessage.processing')
    }
  } as const;
  const setLoading = useLoading(LOADING_TASK_INITIATIVE_EXPORT_REPORT);
  const { setAlert } = useAlert();

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_EXPORT_REPORT],
    exact: true,
    strict: false,
  });
  const { id } = (match?.params as MatchParams) || {};

  useEffect(() => {
    getMerchantsList();
  }, []);

  const getMerchantsList = () => {
    getMerchantList(id, 0).then((res) => {
      if (res && res.content && res.content.length > 0) {
        setBusinessNameList(res.content as Array<MerchantItem>);
      }
    }).catch(() => {
      setAlert({ title: t('errors.title'), text: t('errors.getDataDescription'), isOpen: true, severity: 'error' });
    });
  };

  const handleGenerateReport = (data: { startDate: Date; endDate: Date; businessName: string }) => {
    const merchant = businessNameList.find(
      (m) => (m.businessName)?.trim().toLowerCase() === data.businessName.trim().toLowerCase()
    );
    setLoading(true);
    generateReport(id, merchant?.merchantId ?? "", data.startDate, data.endDate, ReportTypeEnum.MERCHANT_TRANSACTIONS)
      .then((res) => {
        if (res?.reportStatus) {
          const alertConfig = reportStatusAlertConfig[res.reportStatus];
          setAlert({ text: alertConfig.text, isOpen: true, severity: alertConfig.severity });
          // TODO get reportList
        }
      })
      .catch(() => {
        setAlert({ title: t('errors.title'), text: t('errors.getDataDescription'), isOpen: true, severity: 'error' });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box sx={{ width: '100%', pt: 2, px: 2 }}>
      <Box sx={initiativePagesBreadcrumbsContainerStyle}>
        <BreadcrumbsBox
          backUrl={ROUTES.HOME}
          backLabel={t('breadcrumbs.back')}
          items={[initiativeSel.initiativeName, t('breadcrumbs.exportReport')]}
        />

        <Box sx={{ display: 'grid', gridColumn: 'span 10', mt: 2 }}>
          <TitleBox
            title={t('pages.initiativeExportReport.title')}
            subTitle={t('pages.initiativeExportReport.subtitle')}
            mbTitle={2}
            mtTitle={2}
            mbSubTitle={5}
            variantTitle="h4"
            variantSubTitle="body1"
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 3, mt: 1, mb: 3, alignItems: 'center' }}>
        <ExportFiltersCard
          onGenerateReport={handleGenerateReport}
          businessList={businessNameList}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1, mb: 3 }}>
        <ReportTableCard />
      </Box>
    </Box>
  );
};

export default InitiativeExportReportPage;