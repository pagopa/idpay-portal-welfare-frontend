/* eslint-disable functional/no-let */
/* eslint-disable prefer-const */
import { Box, Button, Paper, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import Toast from '@pagopa/selfcare-common-frontend/components/Toast';
import { fetchTransactionRules } from '../../../../services/transactionRuleService';
import { ShopRulesModel } from '../../../../model/ShopRules';
import { useAppSelector, useAppDispatch } from '../../../../redux/hooks';
import {
  initiativeDaysOfWeekIntervalsSelector,
  initiativeIdSelector,
  initiativeMccFilterSelector,
  initiativeRewardLimitsSelector,
  initiativeRewardRuleSelector,
  initiativeRewardTypeSelector,
  initiativeThresholdSelector,
  initiativeTrxCountSelector,
  saveDaysOfWeekIntervals,
  saveMccFilter,
  saveRewardLimits,
  saveRewardRule,
  saveThreshold,
  saveTrxCount,
  setInitiativeRewardType,
} from '../../../../redux/slices/initiativeSlice';
import { WIZARD_ACTIONS } from '../../../../utils/constants';
import {
  putTrxAndRewardRules,
  putTrxAndRewardRulesDraft,
} from '../../../../services/intitativeService';
import TitleBoxWithHelpLink from '../../../TitleBoxWithHelpLink/TitleBoxWithHelpLink';
import { RewardValueTypeEnum } from '../../../../api/generated/initiative/InitiativeRewardRuleDTO';
import { InitiativeRewardTypeEnum } from '../../../../api/generated/initiative/InitiativeRewardAndTrxRulesDTO';
import ShopRulesModal from './ShopRulesModal';
import PercentageRecognizedItem from './PercentageRecognizedItem';
import {
  checkDaysOfWeekIntervalsChecked,
  checkMccFilterChecked,
  checkRewardLimitsChecked,
  checkThresholdChecked,
  checkTrxCountChecked,
  mapDataToSend,
  mapResponse,
} from './helpers';
import SpendingLimitItem from './SpendingLimitItem';
import MCCItem from './MCCItem';
import TimeLimitItem from './TimeLimitItem';
import TransactionNumberItem from './TransactionNumberItem';
import TransactionTimeItem from './TransactionTimeItem';
import RewardType from './RewardType';

interface Props {
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setDisabledNext: Dispatch<SetStateAction<boolean>>;
}

const ShopRules = ({ action, setAction, currentStep, setCurrentStep, setDisabledNext }: Props) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [availableShopRules, setAvailableShopRules] = useState(Array<ShopRulesModel>);
  const [shopRulesToSubmit, setShopRulesToSubmit] = useState<
    Array<{ code: string | undefined; dispatched: boolean }>
  >([
    { code: 'TYPE', dispatched: false },
    { code: 'PRCREC', dispatched: false },
  ]);
  const initiativeRewardTypeSel = useAppSelector(initiativeRewardTypeSelector);
  const rewardRule = useAppSelector(initiativeRewardRuleSelector);
  const mccFilter = useAppSelector(initiativeMccFilterSelector);
  const rewardLimits = useAppSelector(initiativeRewardLimitsSelector);
  const threshold = useAppSelector(initiativeThresholdSelector);
  const trxCount = useAppSelector(initiativeTrxCountSelector);
  const daysOfWeekIntervals = useAppSelector(initiativeDaysOfWeekIntervalsSelector);
  const initiativeId = useAppSelector(initiativeIdSelector);
  const [rewardRuleData, setRewardRuleData] = useState(rewardRule);
  const [mccFilterData, setMccFilterData] = useState(mccFilter);
  const [rewardLimitsData, setRewardLimitsData] = useState(rewardLimits);
  const [thresholdData, setThresholdData] = useState(threshold);
  const [trxCountData, setTrxCountData] = useState(trxCount);
  const [daysOfWeekIntervalsData, setDaysOfWeekIntervalsData] = useState(daysOfWeekIntervals);
  const dispatch = useAppDispatch();
  const addError = useErrorDispatcher();
  const [modalButtonVisible, setModalButtonVisible] = useState(true);
  const setLoading = useLoading('GET_TRANSACTION_RULES');
  const [openDraftSavedToast, setOpenDraftSavedToast] = useState(false);
  const [mandatoryTrxCountToast, setMandatoryTrxCountToast] = useState(false);
  const [rewardType, setRewardType] = useState<InitiativeRewardTypeEnum | undefined>(
    initiativeRewardTypeSel
  );

  useEffect(() => {
    // console.log(initiativeRewardTypeSel);
    window.scrollTo(0, 0);
  }, []);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    setLoading(true);
    setDisabledNext(false);
    fetchTransactionRules()
      .then((response) => {
        const responseData = mapResponse(response);
        const newAvailableShopRules: Array<ShopRulesModel> = [];
        const newShopRulesToSubmit: Array<{ code: string | undefined; dispatched: boolean }> = [
          { code: 'TYPE', dispatched: false },
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
      .catch((error) => {
        addError({
          id: 'GET_TRANSACTION_RULES_LIST_ERROR',
          blocking: false,
          error,
          techDescription: 'An error occurred getting transaction rules list',
          displayableTitle: t('errors.title'),
          displayableDescription: t('errors.getDataDescription'),
          toNotify: true,
          component: 'Toast',
          showCloseIcon: true,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCloseModal = () => setOpenModal(false);

  const handleOpenModal = () => setOpenModal(true);

  const handleShopListItemAdded = (code: string) => {
    const newAvailableShopRules: Array<ShopRulesModel> = [];
    const newShopRulesToSubmit: Array<{ code: string | undefined; dispatched: boolean }> = [
      { code: 'TYPE', dispatched: false },
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
      { code: 'TYPE', dispatched: false },
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
        const resetThresholdData = {
          fromIncluded: typeof thresholdData === 'object' ? thresholdData.fromIncluded : true,
          from: undefined,
          toIncluded: typeof thresholdData === 'object' ? thresholdData.toIncluded : true,
          to: undefined,
        };
        setThresholdData({ ...resetThresholdData });
        break;
      case 'MCC':
        const resetMccFilterData = { allowedList: true, values: [] };
        setMccFilterData({ ...resetMccFilterData });
        break;
      case 'ATECO':
        break;
      case 'TRXCOUNT':
        const resetTrxCountData = {
          fromIncluded: typeof trxCountData === 'object' ? trxCountData.fromIncluded : true,
          from: undefined,
          toIncluded: typeof trxCountData === 'object' ? trxCountData.toIncluded : true,
          to: undefined,
        };
        setTrxCountData({ ...resetTrxCountData });
        break;
      case 'REWARDLIMIT':
        const resetRewardLimitData = [{ frequency: 'DAILY', rewardLimit: undefined }];
        setRewardLimitsData([...resetRewardLimitData]);
        break;
      case 'DAYHOURSWEEK':
        const resetDaysOfWeekIntervalsData = [{ daysOfWeek: 'MONDAY', startTime: '', endTime: '' }];
        setDaysOfWeekIntervalsData([...resetDaysOfWeekIntervalsData]);
        break;
      case 'GIS':
        break;
      default:
        break;
    }
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    setDisabledNext(false);
    // eslint-disable-next-line functional/no-let
    let submit = true;
    if (shopRulesToSubmit.length > 0) {
      shopRulesToSubmit.forEach((s) => {
        submit = submit && s.dispatched;
      });
    } else {
      submit = false;
    }

    const shopRulesCodes = shopRulesToSubmit.map((s) => s.code);
    const trxCountPresent = shopRulesCodes.includes('THRESHOLD');
    const rewardValueTypeIsAbsolute =
      rewardRuleData.rewardValueType === RewardValueTypeEnum.ABSOLUTE;
    const trxCountIsOk = trxCountPresent && rewardValueTypeIsAbsolute;

    if (submit && typeof initiativeId === 'string') {
      if (trxCountIsOk || !rewardValueTypeIsAbsolute) {
        const body = {
          ...mapDataToSend(
            rewardType,
            rewardRuleData,
            mccFilterData,
            rewardLimitsData,
            thresholdData,
            trxCountData,
            daysOfWeekIntervalsData
          ),
        };
        setLoading(true);
        putTrxAndRewardRules(initiativeId, body)
          .then((_response) => {
            if (typeof rewardType !== 'undefined') {
              dispatch(setInitiativeRewardType(rewardType));
            }
            dispatch(saveRewardRule(rewardRuleData));
            if (typeof mccFilterData === 'object') {
              dispatch(saveMccFilter(mccFilterData));
            }
            if (Array.isArray(rewardLimitsData)) {
              dispatch(saveRewardLimits(rewardLimitsData));
            }
            if (typeof thresholdData === 'object') {
              dispatch(saveThreshold(thresholdData));
            }
            if (typeof trxCountData === 'object') {
              dispatch(saveTrxCount(trxCountData));
            }
            if (Array.isArray(daysOfWeekIntervalsData)) {
              dispatch(saveDaysOfWeekIntervals(daysOfWeekIntervalsData));
            }
            setCurrentStep(currentStep + 1);
          })
          .catch((error) => {
            addError({
              id: 'EDIT_TRANSACTION_RULES_SAVE_ERROR',
              blocking: false,
              error,
              techDescription: 'An error occurred editing initiative transaction rules',
              displayableTitle: t('errors.title'),
              displayableDescription: t('errors.invalidDataDescription'),
              toNotify: true,
              component: 'Toast',
              showCloseIcon: true,
            });
          })
          .finally(() => setLoading(false));
      } else {
        setMandatoryTrxCountToast(true);
      }
    }

    if (action === WIZARD_ACTIONS.DRAFT && typeof initiativeId === 'string') {
      const body = {
        ...mapDataToSend(
          rewardType,
          rewardRuleData,
          mccFilterData,
          rewardLimitsData,
          thresholdData,
          trxCountData,
          daysOfWeekIntervalsData
        ),
      };
      setLoading(true);
      putTrxAndRewardRulesDraft(initiativeId, body)
        // eslint-disable-next-line sonarjs/no-identical-functions
        .then((_response) => {
          setOpenDraftSavedToast(true);
          if (typeof rewardType !== 'undefined') {
            dispatch(setInitiativeRewardType(rewardType));
          }
          dispatch(saveRewardRule(rewardRuleData));
          if (typeof mccFilterData === 'object') {
            dispatch(saveMccFilter(mccFilterData));
          }
          if (Array.isArray(rewardLimitsData)) {
            dispatch(saveRewardLimits(rewardLimitsData));
          }
          if (typeof thresholdData === 'object') {
            dispatch(saveThreshold(thresholdData));
          }
          if (typeof trxCountData === 'object') {
            dispatch(saveTrxCount(trxCountData));
          }
          if (Array.isArray(daysOfWeekIntervalsData)) {
            dispatch(saveDaysOfWeekIntervals(daysOfWeekIntervalsData));
          }
        })
        .catch((error) => {
          addError({
            id: 'EDIT_TRANSACTION_RULES_SAVE_DRAFT_ERROR',
            blocking: false,
            error,
            techDescription: 'An error occurred editing draft initiative transaction rules',
            displayableTitle: t('errors.title'),
            displayableDescription: t('errors.invalidDataDescription'),
            toNotify: true,
            component: 'Toast',
            showCloseIcon: true,
          });
        })
        .finally(() => setLoading(false));
    }
    setAction('');
  }, [action, JSON.stringify(shopRulesToSubmit)]);

  useEffect(() => {
    let allChecked = true;
    availableShopRules.forEach((a) => {
      if (a.code !== 'ATECO' && a.code !== 'GIS') {
        allChecked = allChecked && a.checked;
      }
    });
    setModalButtonVisible(!allChecked);
  }, [availableShopRules]);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    let almostOnePopulated = false;
    if (typeof rewardRuleData === 'object') {
      almostOnePopulated = almostOnePopulated || typeof rewardRuleData.rewardValue === 'number';
    }
    if (typeof mccFilterData === 'object') {
      almostOnePopulated =
        almostOnePopulated ||
        (Array.isArray(mccFilterData.values) && mccFilterData.values?.length > 0);
    }
    if (Array.isArray(rewardLimitsData)) {
      rewardLimitsData.forEach((r) => {
        almostOnePopulated = almostOnePopulated || typeof r.rewardLimit === 'number';
      });
    }
    if (typeof thresholdData === 'object') {
      almostOnePopulated =
        almostOnePopulated ||
        typeof thresholdData.from === 'number' ||
        typeof thresholdData.to === 'number';
    }
    if (typeof trxCountData === 'object') {
      almostOnePopulated =
        almostOnePopulated ||
        typeof trxCountData.from === 'number' ||
        typeof trxCountData.to === 'number';
    }
    if (Array.isArray(daysOfWeekIntervalsData)) {
      daysOfWeekIntervalsData.forEach((d) => {
        almostOnePopulated = almostOnePopulated || d.startTime.length > 0 || d.endTime.length > 0;
      });
    }
    setDisabledNext(!almostOnePopulated);
  }, [
    rewardRuleData,
    mccFilterData,
    rewardLimitsData,
    thresholdData,
    trxCountData,
    daysOfWeekIntervalsData,
  ]);

  return (
    <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
      <TitleBoxWithHelpLink
        title={t('components.wizard.stepFour.title')}
        subtitle={t('components.wizard.stepFour.subtitle')}
        helpLink={t('helpStaticUrls.wizard.shopRules')}
        helpLabel={t('components.wizard.common.links.findOut')}
      />

      <RewardType
        code="TYPE"
        action={action}
        rewardType={rewardType}
        setRewardType={setRewardType}
        shopRulesToSubmit={shopRulesToSubmit}
        setShopRulesToSubmit={setShopRulesToSubmit}
      />

      {modalButtonVisible && (
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
            {t('components.wizard.stepFour.addNew')}
          </Button>

          <ShopRulesModal
            openModal={openModal}
            handleCloseModal={handleCloseModal}
            availableShopRules={availableShopRules}
            handleShopListItemAdded={handleShopListItemAdded}
            data-testid="shop-rules-modal-test"
          />
        </Box>
      )}
      <Box>
        <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: '700' }}>
          {t('components.wizard.stepFour.rulesAddedTitle')}
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
              rewardRuleData={rewardRuleData}
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
      {openDraftSavedToast && (
        <Toast
          open={openDraftSavedToast}
          title={t('components.wizard.common.draftSaved')}
          showToastCloseIcon={true}
          onCloseToast={() => setOpenDraftSavedToast(false)}
        />
      )}
      {mandatoryTrxCountToast && (
        <Toast
          open={mandatoryTrxCountToast}
          title={t('components.wizard.stepFour.form.trxCountNotPopulatedErrorTitle')}
          message={t('components.wizard.stepFour.form.trxCountNotPopulatedErrorDescription')}
          onCloseToast={() => {
            setMandatoryTrxCountToast(false);
          }}
          logo={InfoOutlinedIcon}
          leftBorderColor="#FE6666"
          toastColorIcon="#FE6666"
          showToastCloseIcon={true}
        />
      )}
    </Paper>
  );
};

export default ShopRules;
