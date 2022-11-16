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
    if (
      typeof initiative.generalInfo.rankingEndDate === 'object' &&
      typeof initiative.generalInfo.rankingStartDate === 'object'
    ) {
      const expirationDate =
        typeof initiative.generalInfo.rankingEndDate === 'object'
          ? initiative.generalInfo.rankingEndDate.getTime()
          : 0;
      const startDate =
        typeof initiative.generalInfo.rankingStartDate === 'object'
          ? initiative.generalInfo.rankingStartDate.getTime()
          : 0;
      return (expirationDate - startDate) / (1000 * 60 * 60 * 24);
    } else if (
      typeof initiative.generalInfo.endDate === 'object' &&
      typeof initiative.generalInfo.startDate === 'object'
    ) {
      const expirationDate =
        typeof initiative.generalInfo.endDate === 'object'
          ? initiative.generalInfo.endDate.getTime()
          : 0;
      const startDate =
        typeof initiative.generalInfo.startDate === 'object'
          ? initiative.generalInfo.startDate.getTime()
          : 0;
      return (expirationDate - startDate) / (1000 * 60 * 60 * 24);
    } else {
      return 0;
    }
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
        // return t('pages.initiativeOverview.info.otherinfo.start', {
        //   date: formatDate(initiative.generalInfo.startDate),
        // });
        return t('pages.initiativeOverview.info.otherinfo.expiration', {
          days: timeRemainingToJoin(initiative),
        });
      }
    }
  };

  const checkFuture = (date: Date | string | undefined) => {
    const now = new Date();
    if (typeof date === 'object') {
      return date.getTime() > now.getTime();
    }
    return true;
  };

  const chooseDateAndCheckFuture = (
    rankingStartDate: Date | string | undefined,
    startDate: Date | string | undefined
  ) => {
    const now = new Date();
    if (typeof rankingStartDate === 'object') {
      return rankingStartDate.getTime() > now.getTime();
    } else if (typeof startDate === 'object') {
      return startDate.getTime() > now.getTime();
    } else {
      return true;
    }
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
          {t('pages.initiativeOverview.info.otherinfo.title')}
        </Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 4' }}>
        <Typography variant="body2">
          {t('pages.initiativeOverview.info.otherinfo.adhesion')}
        </Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 1', textAlign: 'start' }}>
        {chooseDateAndCheckFuture(
          initiative.generalInfo.rankingStartDate,
          initiative.generalInfo.startDate
        ) ? (
          <AccessTimeFilledIcon color="action" sx={{ fontSize: '22px' }} />
        ) : (
          <HourglassTopIcon color="action" sx={{ fontSize: '22px' }} />
        )}
      </Box>
      <Box sx={{ gridColumn: 'span 7' }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }} data-testid="date-message-status">
          {dateMessageStatusApproved(initiative)}
        </Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 4' }}>
        <Typography variant="body2">
          {t('pages.initiativeOverview.info.otherinfo.spend')}
        </Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 1', textAlign: 'start' }}>
        {checkFuture(initiative.generalInfo.startDate) ? (
          <AccessTimeFilledIcon color="action" sx={{ fontSize: '22px' }} />
        ) : (
          <HourglassTopIcon color="action" sx={{ fontSize: '22px' }} />
        )}
      </Box>
      <Box sx={{ gridColumn: 'span 7' }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {t('pages.initiativeOverview.info.otherinfo.start', {
            date: formatDate(initiative.generalInfo.startDate),
          })}
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
          {t('pages.initiativeOverview.info.otherinfo.details')}
        </ButtonNaked>
      </Box>
    </Box>
  );
};

export default DateReference;
