/* eslint-disable complexity */
import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Initiative } from '../../../model/Initiative';

type Prop = {
  initiative: Initiative;
  handleViewDetails: any;
};

const DateReference = ({ initiative, handleViewDetails }: Prop) => {
  const { t } = useTranslation();

  const formatDate = (date: Date | undefined | string) =>
    typeof date === 'object' && date.toLocaleDateString('fr-BE');

  const renderTimeRangeIcon = (sD: string | Date | undefined, eD: string | Date | undefined) => {
    const now = new Date();
    if (typeof sD === 'object' && typeof eD === 'object') {
      eD.setHours(23, 59, 59);
      if (now > eD) {
        return <CheckCircleIcon color="action" sx={{ fontSize: '22px' }} />;
      }
      if (now >= sD && now <= eD) {
        return <HourglassTopIcon color="action" sx={{ fontSize: '22px' }} />;
      }
      if (now < sD) {
        return <AccessTimeFilledIcon color="action" sx={{ fontSize: '22px' }} />;
      }
    }
    return null;
  };

  const renderTimeRangeText = (sD: string | Date | undefined, eD: string | Date | undefined) => {
    const now = new Date();
    if (typeof sD === 'object' && typeof eD === 'object') {
      eD.setHours(23, 59, 59);
      if (now > eD) {
        return t('pages.initiativeOverview.info.otherInfo.closed');
      }
      if (now >= sD && now <= eD) {
        const eDTimestamp = eD.getTime();
        const nowTimestamp = now.getTime();
        const remainingDays = Math.ceil((eDTimestamp - nowTimestamp) / 86400000);
        if (remainingDays > 1) {
          return t('pages.initiativeOverview.info.otherInfo.expiration', {
            days: remainingDays,
          });
        } else {
          return t('pages.initiativeOverview.info.otherInfo.oneDayExpiration', {
            days: remainingDays,
          });
        }
      }
      if (now < sD) {
        return t('pages.initiativeOverview.info.otherInfo.start', {
          date: formatDate(sD),
        });
      }
    }
    return null;
  };

  return (
    <Box
      sx={{
        width: '100%',
        gridTemplateRows: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        rowGap: 2,
        alignContent: 'start',
      }}
    >
      <Divider sx={{ gridColumn: 'span 12' }} />
      <Box sx={{ gridColumn: 'span 12', pb: 1 }}>
        <Typography variant="subtitle1">
          {t('pages.initiativeOverview.info.otherInfo.title')}
        </Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 4' }}>
        <Typography variant="body2">
          {t('pages.initiativeOverview.info.otherInfo.adhesion')}
        </Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 1', textAlign: 'start' }}>
        {renderTimeRangeIcon(
          initiative.generalInfo.rankingStartDate,
          initiative.generalInfo.rankingEndDate
        )
          ? renderTimeRangeIcon(
              initiative.generalInfo.rankingStartDate,
              initiative.generalInfo.rankingEndDate
            )
          : renderTimeRangeIcon(initiative.generalInfo.startDate, initiative.generalInfo.endDate)}
      </Box>
      <Box sx={{ gridColumn: 'span 7' }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }} data-testid="date-message-status">
          {renderTimeRangeText(
            initiative.generalInfo.rankingStartDate,
            initiative.generalInfo.rankingEndDate
          )
            ? renderTimeRangeText(
                initiative.generalInfo.rankingStartDate,
                initiative.generalInfo.rankingEndDate
              )
            : renderTimeRangeText(initiative.generalInfo.startDate, initiative.generalInfo.endDate)}
        </Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 4' }}>
        <Typography variant="body2">
          {t('pages.initiativeOverview.info.otherInfo.spend')}
        </Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 1', textAlign: 'start' }}>
        {renderTimeRangeIcon(initiative.generalInfo.startDate, initiative.generalInfo.endDate)}
      </Box>
      <Box sx={{ gridColumn: 'span 7' }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {renderTimeRangeText(initiative.generalInfo.startDate, initiative.generalInfo.endDate)}
        </Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 4' }}>
        <ButtonNaked
          size="small"
          // eslint-disable-next-line sonarjs/no-identical-functions
          onClick={() => handleViewDetails(initiative.initiativeId)}
          startIcon={<AssignmentIcon />}
          sx={{ color: 'primary.main', padding: 0 }}
          weight="default"
          variant="contained"
          data-testid="view-datails-test"
        >
          {t('pages.initiativeOverview.info.otherInfo.details')}
        </ButtonNaked>
      </Box>
    </Box>
  );
};

export default DateReference;
