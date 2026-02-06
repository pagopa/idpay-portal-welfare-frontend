import { Box, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { TitleBox } from "@pagopa/selfcare-common-frontend";
import { useTranslation } from 'react-i18next';
import { initiativePagesBreadcrumbsContainerStyle } from "../../helpers";
import ROUTES from "../../routes";
import BreadcrumbsBox from "../components/BreadcrumbsBox";
import { initiativeSelector } from "../../redux/slices/initiativeSlice";
import { useAppSelector } from "../../redux/hooks";
import { useInitiative } from "../../hooks/useInitiative";
import ExportFiltersCard from "../../components/ExportFiltersCard/ExportFiltersCard";


const InitiativeExportReportPage = () => {
    const { t } = useTranslation();
    const initiativeSel = useAppSelector(initiativeSelector);
    useInitiative();

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
                    onGenerateReport={() => console.log('button genera')}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1, mb: 3 }}>
                <Typography variant="h6" component="h6" fontWeight={'bold'} mt={1}>
                    {t('pages.initiativeExportReport.exportTable.title')}
                </Typography>

                <Table sx={{ backgroundColor: '#FFFFFF' }}>
                    <TableBody>
                        <TableRow>
                            <TableCell
                                colSpan={10}
                                sx={{
                                    textAlign: 'center',
                                    py: 4,
                                    fontSize: 16,
                                    fontWeight: 500,
                                    color: '#5C6F82',
                                    backgroundColor: '#FFFFFF'
                                }}
                            >
                                {t('pages.initiativeExportReport.exportTable.emptyState')}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
};

export default InitiativeExportReportPage;