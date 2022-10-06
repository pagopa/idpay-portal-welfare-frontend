import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { Initiative } from '../../../model/Initiative';

type Prop = {
  initiative: Initiative;
  handleViewDetails: any;
};

const DateReference = ({ initiative, handleViewDetails }: Prop) => {
  const { t } = useTranslation();

  const formatDate = (date: Date | undefined | string) =>
    typeof date === 'object' && date.toLocaleDateString('fr-BE');

  const timeRemainingToJoin = (initiative: Initiative) => {
    const expirationDate =
      typeof initiative.generalInfo.rankingEndDate === 'object'
        ? initiative.generalInfo.rankingEndDate.getTime()
        : 0;
    const startDate =
      typeof initiative.generalInfo.rankingStartDate === 'object'
        ? initiative.generalInfo.rankingStartDate.getTime()
        : 0;
    return (expirationDate - startDate) / (1000 * 60 * 60 * 24);
  };

  const chooseDateToFormat = (
    startDate: Date | undefined | string,
    rankingStart: Date | undefined | string
  ) => {
    if (typeof rankingStart === 'string' && rankingStart.length === 0) {
      return formatDate(startDate);
    } else {
      return formatDate(rankingStart);
    }
  };

  const dateMessageStatusApproved = (initiative: Initiative) => {
    if (initiative.status === 'APPROVED') {
      return t('pages.initiativeOverview.info.otherinfo.start', {
        date: chooseDateToFormat(
          initiative.generalInfo.startDate,
          initiative.generalInfo.rankingStartDate
        ),
      });
    } else {
      if (initiative.generalInfo.rankingStartDate && initiative.generalInfo.rankingEndDate) {
        if (timeRemainingToJoin(initiative) <= 0) {
          return t('pages.initiativeOverview.info.otherinfo.closed');
        } else {
          return t('pages.initiativeOverview.info.otherinfo.expiration', {
            days: timeRemainingToJoin(initiative),
          });
        }
      } else {
        return t('pages.initiativeOverview.info.otherinfo.start', {
          date: formatDate(initiative.generalInfo.startDate),
        });
      }
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        gridTemplateRows: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        rowGap: 3,
        alignContent: 'start',
      }}
    >
      <Divider sx={{ gridColumn: 'span 8' }} />
      <Box sx={{ gridColumn: 'span 8' }}>
        <Typography variant="subtitle1">
          {t('pages.initiativeOverview.info.otherinfo.title')}
        </Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 3' }}>
        {t('pages.initiativeOverview.info.otherinfo.adhesion')}
      </Box>
      <Box sx={{ gridColumn: 'span 1', textAlign: 'start' }}>
        {initiative.status === 'APPROVED' ? (
          <AccessTimeFilledIcon color="action" />
        ) : (
          <HourglassTopIcon color="action" />
        )}
      </Box>
      <Box sx={{ gridColumn: 'span 4', fontWeight: 600 }}>
        {dateMessageStatusApproved(initiative)}
      </Box>
      <Box sx={{ gridColumn: 'span 3' }}>{t('pages.initiativeOverview.info.otherinfo.spend')}</Box>
      <Box sx={{ gridColumn: 'span 1', textAlign: 'start' }}>
        <AccessTimeFilledIcon color="action" />
      </Box>
      <Box sx={{ gridColumn: 'span 4', fontWeight: 600 }}>
        {t('pages.initiativeOverview.info.otherinfo.start', {
          date: formatDate(initiative.generalInfo.startDate),
        })}
      </Box>
      <Box sx={{ gridColumn: 'span 3' }}>
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
          {t('pages.initiativeOverview.info.otherinfo.details')}
        </ButtonNaked>
      </Box>
    </Box>
  );
};

export default DateReference;