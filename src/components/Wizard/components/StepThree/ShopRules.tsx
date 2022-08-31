import { Box, Button, Paper, Typography } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import { fetchTransactionRules } from '../../../../services/transactionRuleService';
import { ShopRulesModel } from '../../../../model/ShopRules';
import { useAppSelector } from '../../../../redux/hooks';
import {
  initiativeDaysOfWeekIntervalsSelector,
  initiativeMccFilterSelector,
  initiativeRewardLimitsSelector,
  initiativeRewardRuleSelector,
  initiativeThresholdSelector,
  initiativeTrxCountSelector,
} from '../../../../redux/slices/initiativeSlice';
import ShopRulesModal from './ShopRulesModal';
import PercentageRecognizedItem from './PercentageRecognizedItem';
import {
  checkDaysOfWeekIntervalsChecked,
  checkMccFilterChecked,
  checkRewardLimitsChecked,
  checkThresholdChecked,
  checkTrxCountChecked,
  mapResponse,
} from './helpers';
import SpendingLimitItem from './SpendingLimitItem';
import MCCItem from './MCCItem';
import TimeLimitItem from './TimeLimitItem';
import TransactionNumberItem from './TransactionNumberItem';
import TransactionTimeItem from './TransactionTimeItem';

interface Props {
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  //   currentStep: number;
  //   setCurrentStep: Dispatch<SetStateAction<number>>;
  setDisabledNext: Dispatch<SetStateAction<boolean>>;
}

const ShopRules = ({ action, setAction, setDisabledNext }: Props) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [availableShopRules, setAvailableShopRules] = useState(Array<ShopRulesModel>);
  const [shopRulesToSubmit, setShopRulesToSubmit] = useState<
    Array<{ code: string | undefined; dispatched: boolean }>
  >([{ code: 'PRCREC', dispatched: false }]);
  const rewardRule = useAppSelector(initiativeRewardRuleSelector);
  const mccFilter = useAppSelector(initiativeMccFilterSelector);
  const rewardLimits = useAppSelector(initiativeRewardLimitsSelector);
  const threshold = useAppSelector(initiativeThresholdSelector);
  const trxCount = useAppSelector(initiativeTrxCountSelector);
  const daysOfWeekIntervals = useAppSelector(initiativeDaysOfWeekIntervalsSelector);
  const [rewardRuleData, setRewardRuleData] = useState(rewardRule);
  const [mccFilterData, setMccFilterData] = useState(mccFilter);
  const [rewardLimitsData, setRewardLimitsData] = useState(rewardLimits);
  const [thresholdData, setThresholdData] = useState(threshold);
  const [trxCountData, setTrxCountData] = useState(trxCount);
  const [daysOfWeekIntervalsData, setDaysOfWeekIntervalsData] = useState(daysOfWeekIntervals);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    setDisabledNext(false);
    fetchTransactionRules()
      .then((response) => {
        const responseData = mapResponse(response);
        const newAvailableShopRules: Array<ShopRulesModel> = [];
        const newShopRulesToSubmit: Array<{ code: string | undefined; dispatched: boolean }> = [
          { code: 'PRCREC', dispatched: false },
        ];
        responseData.forEach((r) => {
          switch (r.code) {
            case 'THRESHOLD':
              const checkedTheshold = checkThresholdChecked(threshold);
              // eslint-disable-next-line functional/immutable-data
              newAvailableShopRules.push({ ...r, checked: checkedTheshold });
              if (checkedTheshold) {
                // eslint-disable-next-line functional/immutable-data
                newShopRulesToSubmit.push({ code: r.code, dispatched: false });
              }
              break;
            case 'MCC':
              const checkedMccFilter = checkMccFilterChecked(mccFilter);
              // eslint-disable-next-line functional/immutable-data
              newAvailableShopRules.push({ ...r, checked: checkedMccFilter });
              if (checkedMccFilter) {
                // eslint-disable-next-line functional/immutable-data
                newShopRulesToSubmit.push({ code: r.code, dispatched: false });
              }
              break;
            case 'ATECO':
              // eslint-disable-next-line functional/immutable-data
              newAvailableShopRules.push({ ...r });
              break;
            case 'TRXCOUNT':
              const trxCountChecked = checkTrxCountChecked(trxCount);
              // eslint-disable-next-line functional/immutable-data
              newAvailableShopRules.push({ ...r, checked: trxCountChecked });
              if (trxCountChecked) {
                // eslint-disable-next-line functional/immutable-data
                newShopRulesToSubmit.push({ code: r.code, dispatched: false });
              }
              break;
            case 'REWARDLIMIT':
              if (Array.isArray(rewardLimits)) {
                setRewardLimitsData([...rewardLimits]);
              } else {
                setRewardLimitsData([{ frequency: 'DAILY', rewardLimit: undefined }]);
              }
              const rewardLimitsChecked = checkRewardLimitsChecked(rewardLimits);
              // eslint-disable-next-line functional/immutable-data
              newAvailableShopRules.push({ ...r, checked: rewardLimitsChecked });
              if (rewardLimitsChecked) {
                // eslint-disable-next-line functional/immutable-data
                newShopRulesToSubmit.push({ code: r.code, dispatched: false });
              }
              break;
            case 'DAYHOURSWEEK':
              if (Array.isArray(daysOfWeekIntervals)) {
                setDaysOfWeekIntervalsData([...daysOfWeekIntervals]);
              } else {
                setDaysOfWeekIntervalsData([{ daysOfWeek: 'MONDAY', startTime: '', endTime: '' }]);
              }
              const daysOfWeekIntervalsChecked =
                checkDaysOfWeekIntervalsChecked(daysOfWeekIntervals);
              // eslint-disable-next-line functional/immutable-data
              newAvailableShopRules.push({
                ...r,
                checked: daysOfWeekIntervalsChecked,
              });
              if (daysOfWeekIntervalsChecked) {
                // eslint-disable-next-line functional/immutable-data
                newShopRulesToSubmit.push({ code: r.code, dispatched: false });
              }
              break;
            case 'GIS':
              // eslint-disable-next-line functional/immutable-data
              newAvailableShopRules.push({ ...r });
              break;
            default:
              // eslint-disable-next-line functional/immutable-data
              newAvailableShopRules.push({ ...r });
              break;
          }
        });

        setAvailableShopRules([...newAvailableShopRules]);
        setShopRulesToSubmit([...newShopRulesToSubmit]);
      })
      .catch((error) => console.log(error));
  }, [rewardRule, threshold, mccFilter, trxCount, rewardLimits, daysOfWeekIntervals]);

  const handleCloseModal = () => setOpenModal(false);

  const handleOpenModal = () => setOpenModal(true);

  const handleShopListItemAdded = (code: string) => {
    const newAvailableShopRules: Array<ShopRulesModel> = [];
    const newShopRulesToSubmit: Array<{ code: string | undefined; dispatched: boolean }> = [
      { code: 'PRCREC', dispatched: false },
    ];
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
    newAvailableShopRules.forEach((n) => {
      if (n.checked === true) {
        // eslint-disable-next-line functional/immutable-data
        newShopRulesToSubmit.push({ code: n.code, dispatched: false });
      }
    });
    setShopRulesToSubmit([...newShopRulesToSubmit]);
    handleCloseModal();
  };

  const handleShopListItemRemoved = (code: string) => {
    const newAvailableShopRules: Array<ShopRulesModel> = [];
    const newShopRulesToSubmit: Array<{ code: string | undefined; dispatched: boolean }> = [
      { code: 'PRCREC', dispatched: false },
    ];
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

    // eslint-disable-next-line sonarjs/no-identical-functions
    newAvailableShopRules.forEach((n) => {
      if (n.checked === true) {
        // eslint-disable-next-line functional/immutable-data
        newShopRulesToSubmit.push({ code: n.code, dispatched: false });
      }
    });
    setShopRulesToSubmit([...newShopRulesToSubmit]);

    resetStateOnItemRemoved(code);
  };

  const resetStateOnItemRemoved = (code: string) => {
    switch (code) {
      case 'THRESHOLD':
        if (typeof thresholdData !== undefined) {
          const resetThresholdData = {
            fromIncluded: typeof thresholdData === 'object' ? thresholdData.fromIncluded : true,
            from: undefined,
            toIncluded: typeof thresholdData === 'object' ? thresholdData.toIncluded : true,
            to: undefined,
          };
          setThresholdData({ ...resetThresholdData });
        }
        break;
      case 'MCC':
        console.log(mccFilterData);
        break;
      case 'ATECO':
        break;
      case 'TRXCOUNT':
        console.log(trxCountData);
        break;
      case 'REWARDLIMIT':
        console.log(rewardLimitsData);
        break;
      case 'DAYHOURSWEEK':
        console.log(daysOfWeekIntervalsData);
        break;
      case 'GIS':
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // eslint-disable-next-line functional/no-let
    let toSubmit = true;
    if (shopRulesToSubmit.length > 0) {
      shopRulesToSubmit.forEach((s) => {
        toSubmit = toSubmit && s.dispatched;
      });
    } else {
      toSubmit = false;
      setDisabledNext(true);
    }
    // TODO HANDLE SUBMIT
    setAction('');
    setDisabledNext(false);
  }, [action, shopRulesToSubmit]);

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
        <PercentageRecognizedItem
          code="PRCREC"
          action={action}
          shopRulesToSubmit={shopRulesToSubmit}
          setShopRulesToSubmit={setShopRulesToSubmit}
          data={rewardRuleData}
          setData={setRewardRuleData}
        />
      </Box>

      {availableShopRules.map((a) => {
        if (a.code === 'THRESHOLD' && a.checked === true) {
          return (
            <SpendingLimitItem
              key={a.code}
              title={a.title}
              code={a.code}
              handleShopListItemRemoved={handleShopListItemRemoved}
              action={action}
              shopRulesToSubmit={shopRulesToSubmit}
              setShopRulesToSubmit={setShopRulesToSubmit}
              data={thresholdData}
              setData={setThresholdData}
            />
          );
        } else if (a.code === 'MCC' && a.checked === true) {
          return (
            <MCCItem
              key={a.code}
              title={a.title}
              code={a.code}
              action={action}
              handleShopListItemRemoved={handleShopListItemRemoved}
              shopRulesToSubmit={shopRulesToSubmit}
              setShopRulesToSubmit={setShopRulesToSubmit}
              data={mccFilterData}
              setData={setMccFilterData}
            />
          );
        } else if (a.code === 'TRXCOUNT' && a.checked === true) {
          return (
            <TransactionNumberItem
              key={a.code}
              title={a.title}
              code={a.code}
              handleShopListItemRemoved={handleShopListItemRemoved}
              action={action}
              shopRulesToSubmit={shopRulesToSubmit}
              setShopRulesToSubmit={setShopRulesToSubmit}
              data={trxCountData}
              setData={setTrxCountData}
            />
          );
        } else if (a.code === 'REWARDLIMIT' && a.checked === true) {
          return (
            <TimeLimitItem
              key={a.code}
              title={a.title}
              code={a.code}
              handleShopListItemRemoved={handleShopListItemRemoved}
              action={action}
              shopRulesToSubmit={shopRulesToSubmit}
              setShopRulesToSubmit={setShopRulesToSubmit}
              data={rewardLimitsData}
              setData={setRewardLimitsData}
            />
          );
        } else if (a.code === 'DAYHOURSWEEK' && a.checked === true) {
          return (
            <TransactionTimeItem
              key={a.code}
              title={a.title}
              code={a.code}
              handleShopListItemRemoved={handleShopListItemRemoved}
              action={action}
              shopRulesToSubmit={shopRulesToSubmit}
              setShopRulesToSubmit={setShopRulesToSubmit}
              data={daysOfWeekIntervalsData}
              setData={setDaysOfWeekIntervalsData}
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
