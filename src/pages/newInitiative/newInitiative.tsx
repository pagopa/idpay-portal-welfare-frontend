import { Box, Breadcrumbs, Typography } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import { ButtonNaked } from '@pagopa/mui-italia';
import Wizard from '../../components/Wizard/Wizard';
import { useInitiative } from '../../hooks/useInitiative';
import ExitModal from '../../components/ExitModal/ExitModal';

const NewInitiative = () => {
  useInitiative();
  const [openExitModal, setOpenExitModal] = useState(false);
  const handleOpenExitModal = () => setOpenExitModal(true);
  const handleCloseExitModal = () => setOpenExitModal(false);

  const { t } = useTranslation();

  return (
    <Box width="100%" p={2}>
      <Breadcrumbs aria-label="breadcrumb">
        <ButtonNaked
          component="button"
          onClick={handleOpenExitModal}
          startIcon={<ArrowBackIcon />}
          sx={{ color: 'primary.main', fontSize: '1rem', marginBottom: '3px' }}
          weight="default"
          data-testid="exit-button-test"
        >
          {t('breadcrumbs.exit')}
        </ButtonNaked>
        <Typography color="text.primary" variant="body2">
          {t('breadcrumbs.initiatives')}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {t('breadcrumbs.createNew')}
        </Typography>
      </Breadcrumbs>
      <ExitModal
        title={t('components.exitModal.title')}
        subtitle={t('components.exitModal.body')}
        openExitModal={openExitModal}
        handleCloseExitModal={handleCloseExitModal}
      />
      <TitleBox
        title={t('pages.newInitiative.title')}
        subTitle={t('pages.newInitiative.subtitle')}
        mbTitle={2}
        mtTitle={2}
        mbSubTitle={5}
        variantTitle="h4"
        variantSubTitle="body1"
      />
      <Wizard handleOpenExitModal={handleOpenExitModal} />
    </Box>
  );
};
export default NewInitiative;
