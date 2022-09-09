import { Box, Breadcrumbs, Button, Typography } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import Wizard from '../../components/Wizard/Wizard';
import { useInitiative } from '../../hooks/useInitiative';
import ExitModal from '../../components/Wizard/components/ExitModal/ExitModal';

const NewInitiative = () => {
  const { t } = useTranslation();
  const [openExitModal, setOpenExitModal] = useState(false);

  const handleCloseExitModal = () => setOpenExitModal(false);

  const handleOpenExitModal = () => setOpenExitModal(true);

  useInitiative();

  return (
    <Box width="100%" px={2}>
      <Breadcrumbs aria-label="breadcrumb">
        <Button
          sx={[
            {
              justifyContent: 'start',
              padding: 0,
            },
            {
              '&:hover': { backgroundColor: 'transparent' },
            },
          ]}
          id="open-exit-modal"
          size="small"
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={handleOpenExitModal}
          disableRipple={true}
          disableFocusRipple={true}
        >
          {t('breadcrumbs.exit')}
        </Button>

        <Typography color="text.primary">{t('breadcrumbs.initiatives')}</Typography>
        <Typography color="text.secondary">{t('breadcrumbs.createNew')}</Typography>
      </Breadcrumbs>
      <ExitModal openExitModal={openExitModal} handleCloseExitModal={handleCloseExitModal} />
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
