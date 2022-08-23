import { Box, Button, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import { fetchTransactionRules } from '../../../../services/transactionRuleService';
import ShopRulesModal from './ShopRulesModal';

interface Props {
  action: string;
  // setAction: Function;
}

const ShopRules = ({ action }: Props) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (action === 'SUBMIT') {
      //   formik.handleSubmit();
    } else {
      return;
    }
    // setAction('');
  }, [action]);

  useEffect(() => {
    fetchTransactionRules()
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }, []);

  const handleCloseModal = () => setOpenModal(false);

  const handleOpenModal = () => setOpenModal(true);

  return (
    <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
      <Box sx={{ py: 3 }}>
        <Typography variant="h6">{t('components.wizard.stepThree.title')}</Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
        <Box sx={{ gridColumn: 'span 12' }}>
          <Typography variant="body1">{t('components.wizard.stepThree.subtitle')}</Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 12' }}>
          <Button size="small" sx={{ p: 0 }}>
            {t('components.wizard.common.links.findOut')}
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 3,
          gridTemplateRows: 'auto',
          gridTemplateAreas: `"trxButton . . . "`,
          py: 2,
          mb: 8,
        }}
      >
        <Button
          variant="contained"
          sx={{ gridArea: 'trxButton' }}
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
          data-testid="criteria-button-test"
        >
          {t('components.wizard.stepTwo.chooseCriteria.browse')}
        </Button>
        <ShopRulesModal
          openModal={openModal}
          handleCloseModal={handleCloseModal}
          data-testid="shop-rules-modal-test"
        />
      </Box>
    </Paper>
  );
};

export default ShopRules;
