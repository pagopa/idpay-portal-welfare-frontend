import { Box, Button, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchTransactionRules } from '../../../../services/transactionRuleService';
import { ShopRulesModel } from '../../../../model/ShopRules';
import ShopRulesModal from './ShopRulesModal';
import PercentageRecognizedItem from './PercentageRecognizedItem';
import { mapResponse } from './helpers';
import SpendingLimitItem from './SpendingLimitItem';
import MCCItem from './MCCItem';
import TimeLimitItem from './TimeLimitItem';
import TransactionNumberItem from './TransactionNumberItem';
import TransactionTimeItem from './TransactionTimeItem';

interface Props {
  action: string;
  // setAction: Function;
}

const ShopRules = ({ action }: Props) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [availableShopRules, setAvailableShopRules] = useState(Array<ShopRulesModel>);

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
      .then((response) => {
        const responseData = mapResponse(response);
        // console.log(responseData);
        setAvailableShopRules([...responseData]);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleCloseModal = () => setOpenModal(false);

  const handleOpenModal = () => setOpenModal(true);

  const handleShopListItemAdded = (code: string) => {
    const newAvailableShopRules: Array<ShopRulesModel> = [];
    availableShopRules.forEach((a) => {
      if (code === a.code && a.checked === false) {
        // eslint-disable-next-line functional/immutable-data
        newAvailableShopRules.push({ ...a, checked: true });
      } else {
        // eslint-disable-next-line functional/immutable-data
        newAvailableShopRules.push({ ...a });
      }
    });
    setAvailableShopRules([...newAvailableShopRules]);
    handleCloseModal();
  };

  const handleShopListItemRemoved = (code: string) => {
    const newAvailableShopRules: Array<ShopRulesModel> = [];
    availableShopRules.forEach((a) => {
      if (code === a.code) {
        // eslint-disable-next-line functional/immutable-data
        newAvailableShopRules.push({ ...a, checked: false });
      } else {
        // eslint-disable-next-line functional/immutable-data
        newAvailableShopRules.push({ ...a });
      }
    });
    setAvailableShopRules([...newAvailableShopRules]);
  };

  const validationSchema = Yup.object().shape({
    percentageRecognized: Yup.string().required(t('validation.required')),
    minSpeningLimit: Yup.string(),
    maxSpeningLimit: Yup.string(),
    maxTransactionNumber: Yup.string(),
    minTransactionNumber: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      percetageRecognized: '',
      minSpeningLimit: '',
      maxSpeningLimit: '',
      maxTransactionNumber: '',
      minTransactionNumber: '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

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
          mb: 3,
        }}
      >
        <Button
          variant="contained"
          sx={{ gridArea: 'trxButton' }}
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
          data-testid="criteria-button-test"
        >
          {t('components.wizard.stepThree.addNew')}
        </Button>
        <ShopRulesModal
          openModal={openModal}
          handleCloseModal={handleCloseModal}
          availableShopRules={availableShopRules}
          handleShopListItemAdded={handleShopListItemAdded}
          data-testid="shop-rules-modal-test"
        />
      </Box>
      <Box>
        <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: '700' }}>
          {t('components.wizard.stepThree.rulesAddedTitle')}
        </Typography>
        <PercentageRecognizedItem formik={formik} />
      </Box>

      {availableShopRules.map((a) => {
        if (a.code === 'THRESHOLD' && a.checked === true) {
          return (
            <SpendingLimitItem
              key={a.code}
              title={a.title}
              code={a.code}
              handleShopListItemRemoved={handleShopListItemRemoved}
              formik={formik}
            />
          );
        } else if (a.code === 'MCC' && a.checked === true) {
          return (
            <MCCItem
              key={a.code}
              title={a.title}
              code={a.code}
              handleShopListItemRemoved={handleShopListItemRemoved}
            />
          );
        } else if (a.code === 'TRXCOUNT' && a.checked === true) {
          return (
            <TransactionNumberItem
              key={a.code}
              title={a.title}
              code={a.code}
              handleShopListItemRemoved={handleShopListItemRemoved}
              formik={formik}
            />
          );
        } else if (a.code === 'REWARDLIMIT' && a.checked === true) {
          return (
            <TransactionTimeItem
              key={a.code}
              title={a.title}
              code={a.code}
              handleShopListItemRemoved={handleShopListItemRemoved}
            />
          );
        } else if (a.code === 'DAYHOURSWEEK' && a.checked === true) {
          return (
            <TimeLimitItem
              key={a.code}
              title={a.title}
              code={a.code}
              handleShopListItemRemoved={handleShopListItemRemoved}
            />
          );
        } else {
          return null;
        }
      })}
    </Paper>
  );
};

export default ShopRules;
