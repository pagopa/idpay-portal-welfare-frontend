import { Box, Button, Paper, Typography } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import Toast from '@pagopa/selfcare-common-frontend/components/Toast';
import { AvailableCriteria } from '../../../../model/AdmissionCriteria';
import { fetchAdmissionCriteria } from '../../../../services/admissionCriteriaService';
import {
  beneficiaryRuleSelector,
  initiativeIdSelector,
  // saveApiKeyClientId,
  // saveApiKeyClientAssertion,
  saveAutomatedCriteria,
  saveManualCriteria,
  stepTwoRankingEnabledSelector,
} from '../../../../redux/slices/initiativeSlice';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { ManualCriteriaItem } from '../../../../model/Initiative';
import {
  putBeneficiaryRuleService,
  putBeneficiaryRuleDraftService,
} from '../../../../services/intitativeService';
import { WIZARD_ACTIONS } from '../../../../utils/constants';
import TitleBoxWithHelpLink from '../../../TitleBoxWithHelpLink/TitleBoxWithHelpLink';
import AdmissionCriteriaModal from './AdmissionCriteriaModal';
import IseeCriteriaItem from './IseeCriteriaItem';
import {
  mapCriteriaToSend,
  mapResponse,
  updateInitialAutomatedCriteriaOnSelector,
} from './helpers';
import DateOdBirthCriteriaItem from './DateOfBirthCriteriaItem';
import ResidencyCriteriaItem from './ResidencyCriteriaItem';
import ManualCriteria from './ManualCriteria';
// import APIKeyConnectionItem from './APIKeyConnectionItem';

type Props = {
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setDisabledNext: Dispatch<SetStateAction<boolean>>;
};

const AdmissionCriteria = ({
  action,
  setAction,
  currentStep,
  setCurrentStep,
  setDisabledNext,
}: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const addError = useErrorDispatcher();
  const [openModal, setOpenModal] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState('');
  const [availableCriteria, setAvailableCriteria] = useState(Array<AvailableCriteria>);
  const [criteriaToRender, setCriteriaToRender] = useState(Array<AvailableCriteria>);
  const [criteriaToRenderNumber, setCriteriaToRenderNumber] = useState(0);
  const [manualCriteriaToRender, setManualCriteriaToRender] = useState(Array<ManualCriteriaItem>);
  const [criteriaToSubmit, setCriteriaToSubmit] = useState(
    Array<{ code: string | undefined; dispatched: boolean }>
  );
  const [showMandatoryIseeToast, setShowMandatoryIseeToast] = useState<boolean>(false);
  const beneficiaryRule = useAppSelector(beneficiaryRuleSelector);
  const initiativeId = useAppSelector(initiativeIdSelector);
  const rankingEnabled = useAppSelector(stepTwoRankingEnabledSelector);
  const setLoading = useLoading('GET_ADMISSION_CRITERIA');
  const [openDraftSavedToast, setOpenDraftSavedToast] = useState(false);
  // const [apiKeyClientId, setApiKeyClientId] = useState<string | undefined>(
  //   beneficiaryRule.apiKeyClientId
  // );
  // const [apiKeyClientAssertion, setApiKeyClientAssertion] = useState<string | undefined>(
  //   beneficiaryRule.apiKeyClientAssertion
  // );
  // const [apiKeyClientDispatched, setApiKeyClientDispatched] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    setLoading(true);
    fetchAdmissionCriteria()
      .then((response) => {
        // eslint-disable-next-line functional/no-let
        let responseT = [...response];
        if (typeof rankingEnabled === 'string' && rankingEnabled === 'true') {
          responseT = response.map((r) => {
            if (r.code !== 'ISEE') {
              return { ...r };
            } else {
              return { ...r, operator: 'GT' };
            }
          });
        }
        const responseData = mapResponse(responseT);
        setAvailableCriteria([...responseData]);
        setCriteriaToRender([...responseData]);

        const { automatedCriteria, selfDeclarationCriteria } = beneficiaryRule;
        const newCriteriaToSubmit: Array<{ code: string; dispatched: boolean }> = [];
        if (automatedCriteria.length > 0) {
          const updatedResponseData: Array<AvailableCriteria> =
            updateInitialAutomatedCriteriaOnSelector(
              automatedCriteria,
              responseData,
              rankingEnabled
            );
          setAvailableCriteria([...updatedResponseData]);
          setCriteriaToRender([...updatedResponseData]);
          updatedResponseData.forEach((c) => {
            if (c.checked === true) {
              // eslint-disable-next-line functional/immutable-data
              newCriteriaToSubmit.push({ code: c.code, dispatched: false });
            }
          });
        }
        if (selfDeclarationCriteria.length > 0) {
          setManualCriteriaToRender([...selfDeclarationCriteria]);
          selfDeclarationCriteria.forEach((s) => {
            // eslint-disable-next-line functional/immutable-data
            newCriteriaToSubmit.push({ code: s.code, dispatched: false });
          });
        }

        setCriteriaToSubmit([...newCriteriaToSubmit]);
      })
      .catch((error) => {
        addError({
          id: 'GET_ADMISSION_CRITERIA_LIST_ERROR',
          blocking: false,
          error,
          techDescription: 'An error occurred getting admission criteria list',
          displayableTitle: t('errors.title'),
          displayableDescription: t('errors.getDataDescription'),
          toNotify: true,
          component: 'Toast',
          showCloseIcon: true,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line functional/no-let
    let counter = 0;
    availableCriteria.forEach((c) => {
      if (c.checked === true) {
        counter = counter + 1;
      }
    });
    setCriteriaToRenderNumber(counter);
  }, [availableCriteria]);

  const handleCloseModal = () => setOpenModal(false);

  const handleOpenModal = () => {
    setOpenModal(true);
    setSearchCriteria('');
  };

  const handleCriteriaAdded = () => {
    setOpenModal(false);
    setAvailableCriteria([...criteriaToRender]);
    const criteriaFiltered = criteriaToRender.filter((c) => c.checked === true);
    const newCriteriaToSubmit = criteriaFiltered.map((c) => ({ code: c.code, dispatched: false }));
    const newManualCriteriaToSubmit = manualCriteriaToRender.map((m) => ({
      code: m.code,
      dispatched: false,
    }));
    setCriteriaToSubmit([...newCriteriaToSubmit, ...newManualCriteriaToSubmit]);
  };

  const handleCriteriaRemoved = (e: any) => {
    const elementCodeToDelete = e.target.dataset.id;
    const newCriteriaToRender = criteriaToRender.map((c) => {
      if (c.code === elementCodeToDelete) {
        return { ...c, checked: false, operator: 'EQ', value: '', value2: '' };
      } else {
        return { ...c };
      }
    });
    setCriteriaToRender([...newCriteriaToRender]);
    setAvailableCriteria([...newCriteriaToRender]);
    const newCriteriaToSubmit: Array<{ code: string; dispatched: boolean }> = [];
    // eslint-disable-next-line sonarjs/no-identical-functions
    newCriteriaToRender.forEach((c) => {
      if (c.checked === true) {
        // eslint-disable-next-line functional/immutable-data
        newCriteriaToSubmit.push({ code: c.code, dispatched: false });
      }
    });
    const newManualCriteriaToSubmit = manualCriteriaToRender.map((m) => ({
      code: m.code,
      dispatched: false,
    }));
    setCriteriaToSubmit([...newCriteriaToSubmit, ...newManualCriteriaToSubmit]);
  };

  const handleFieldValueChanged = (fieldValue: string, fieldKey: string, criteriaCode: string) => {
    const newCriteriaToRender: Array<AvailableCriteria> = [];
    criteriaToRender.forEach((c) => {
      if (c.code === criteriaCode) {
        // eslint-disable-next-line functional/immutable-data
        newCriteriaToRender.push({
          ...c,
          [fieldKey]: fieldValue,
        });
      } else {
        // eslint-disable-next-line functional/immutable-data
        newCriteriaToRender.push({ ...c });
      }
    });
    setCriteriaToRender([...newCriteriaToRender]);
    setAvailableCriteria([...newCriteriaToRender]);
  };

  const handleManualCriteriaAdded = () => {
    const newManualCriteriaIndex =
      manualCriteriaToRender.length > 0
        ? parseInt(manualCriteriaToRender[manualCriteriaToRender.length - 1].code, 10) + 1
        : 1;
    const newManualCriteriaCode = newManualCriteriaIndex.toString();
    setManualCriteriaToRender((prevManualCriteriaToRender) => [
      ...prevManualCriteriaToRender,
      {
        _type: 'boolean',
        description: '',
        boolValue: true,
        multiValue: [{ value: '' }, { value: '' }],
        code: newManualCriteriaCode,
      },
    ]);
    setCriteriaToSubmit((prevCriteriaToSubmit) => [
      ...prevCriteriaToSubmit,
      {
        code: newManualCriteriaCode,
        dispatched: false,
      },
    ]);
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const handleManualCriteriaRemoved = (e: any) => {
    if (typeof e.target.dataset.id !== undefined) {
      const codeToRemove = e.target.dataset.id;
      const newManualCriteriaToRender: Array<ManualCriteriaItem> = [];
      manualCriteriaToRender.forEach((m) => {
        if (m.code !== codeToRemove) {
          // eslint-disable-next-line functional/immutable-data
          newManualCriteriaToRender.push(m);
        }
      });
      const newManualCriteriaToRenderCodesUpdated: Array<ManualCriteriaItem> = [];
      newManualCriteriaToRender.forEach((n, i) => {
        const newCode = (i + 1).toString();
        // eslint-disable-next-line functional/immutable-data
        newManualCriteriaToRenderCodesUpdated.push({ ...n, code: newCode });
      });

      const newCriteriaToSubmit: Array<{ code: string | undefined; dispatched: boolean }> = [];
      criteriaToSubmit.forEach((c) => {
        const intCode = typeof c.code !== undefined ? parseInt(c.code || '1', 10) : NaN;
        if (isNaN(intCode)) {
          // eslint-disable-next-line functional/immutable-data
          newCriteriaToSubmit.push({ ...c });
        }
      });
      newManualCriteriaToRenderCodesUpdated.forEach((n) => {
        // eslint-disable-next-line functional/immutable-data
        newCriteriaToSubmit.push({ code: n.code, dispatched: false });
      });
      setManualCriteriaToRender([...newManualCriteriaToRenderCodesUpdated]);
      setCriteriaToSubmit([...newCriteriaToSubmit]);
    }
  };

  // const handleApyKeyClientIdChanged = (value: string | undefined) => {
  //   setApiKeyClientId(value);
  // };

  // const handleApyKeyClientAssertionChanged = (value: string | undefined) => {
  //   setApiKeyClientAssertion(value);
  // };

  // const handleApiKeyClientDispathed = (value: boolean) => {
  //   setApiKeyClientDispatched(value);
  // };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    // eslint-disable-next-line functional/no-let
    let toSubmit = true;
    if (criteriaToSubmit.length > 0) {
      setDisabledNext(false);
      criteriaToSubmit.forEach((c) => {
        toSubmit = toSubmit && c.dispatched;
      });
      // const automatedCriteriaChecked = criteriaToRender.map((c) => c.checked);
      // const almostOneCriteriaChecked =
      //   automatedCriteriaChecked.length > 0
      //     ? automatedCriteriaChecked.reduce((prev, curr) => prev || curr)
      //     : false;
      // if (almostOneCriteriaChecked) {
      //   toSubmit = toSubmit && apiKeyClientDispatched;
      // }
    } else {
      toSubmit = false;
      setDisabledNext(true);
    }
    if (toSubmit && typeof initiativeId === 'string') {
      // const body = mapCriteriaToSend(
      //   criteriaToRender,
      //   manualCriteriaToRender,
      //   rankingEnabled,
      //   apiKeyClientId,
      //   apiKeyClientAssertion
      // );

      const body = mapCriteriaToSend(criteriaToRender, manualCriteriaToRender, rankingEnabled);

      const automatedCriteriaCodes = body.automatedCriteria.map((c) => c.code);
      const iseeCriteriaPopulated = automatedCriteriaCodes.includes('ISEE');

      if ((rankingEnabled === 'true' && iseeCriteriaPopulated) || rankingEnabled === 'false') {
        setLoading(true);
        putBeneficiaryRuleService(initiativeId, body)
          .then((_response) => {
            // dispatch(saveApiKeyClientId(body.apiKeyClientId));
            // dispatch(saveApiKeyClientAssertion(body.apiKeyClientAssertion));
            dispatch(saveAutomatedCriteria(body.automatedCriteria));
            dispatch(saveManualCriteria(manualCriteriaToRender));
            setCurrentStep(currentStep + 1);
          })
          .catch((error) => {
            addError({
              id: 'EDIT_BENEFICIARY_RULE_SAVE_ERROR',
              blocking: false,
              error,
              techDescription: 'An error occurred editing initiative beneficiary rule',
              displayableTitle: t('errors.title'),
              displayableDescription: t('errors.invalidDataDescription'),
              toNotify: true,
              component: 'Toast',
              showCloseIcon: true,
            });
          })
          .finally(() => setLoading(false));
      } else {
        setShowMandatoryIseeToast(true);
      }
    }

    if (action === WIZARD_ACTIONS.DRAFT && typeof initiativeId === 'string') {
      // const body = mapCriteriaToSend(
      //   criteriaToRender,
      //   manualCriteriaToRender,
      //   rankingEnabled,
      //   apiKeyClientId,
      //   apiKeyClientAssertion
      // );

      const body = mapCriteriaToSend(criteriaToRender, manualCriteriaToRender, rankingEnabled);
      setLoading(true);
      putBeneficiaryRuleDraftService(initiativeId, body)
        .then((_response) => {
          // dispatch(saveApiKeyClientId(body.apiKeyClientId));
          // dispatch(saveApiKeyClientAssertion(body.apiKeyClientAssertion));
          dispatch(saveAutomatedCriteria(body.automatedCriteria));
          dispatch(saveManualCriteria(manualCriteriaToRender));
          setOpenDraftSavedToast(true);
        })
        .catch((error) => {
          addError({
            id: 'EDIT_BENEFICIARY_RULE_SAVE_DRAFT_ERROR',
            blocking: false,
            error,
            techDescription: 'An error occurred editing draft on initiative beneficiary rule',
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
    // }, [action, criteriaToSubmit, apiKeyClientDispatched]);
  }, [action, criteriaToSubmit]);

  return (
    <>
      <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
        <TitleBoxWithHelpLink
          title={t('components.wizard.stepThree.chooseCriteria.title')}
          subtitle={t('components.wizard.stepThree.chooseCriteria.subtitle')}
          helpLink={t('helpStaticUrls.wizard.admissionCriteria')}
          helpLabel={t('components.wizard.common.links.findOut')}
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            gridTemplateRows: 'auto',
            gridTemplateAreas: `"criteriaButton addButton .  "`,
            py: 2,
            mb: 3,
          }}
        >
          <Button
            variant="contained"
            sx={{ gridArea: 'criteriaButton' }}
            startIcon={<ListAltIcon />}
            onClick={handleOpenModal}
            data-testid="criteria-button-test"
          >
            {t('components.wizard.stepThree.chooseCriteria.browse')}
          </Button>
          <AdmissionCriteriaModal
            openModal={openModal}
            handleCloseModal={handleCloseModal}
            handleCriteriaAdded={handleCriteriaAdded}
            criteriaToRender={criteriaToRender}
            setCriteriaToRender={setCriteriaToRender}
            searchCriteria={searchCriteria}
            setSearchCriteria={setSearchCriteria}
            data-testid="modal-test"
          />
          <Button
            variant="text"
            sx={{ gridArea: 'addButton' }}
            onClick={handleManualCriteriaAdded}
            data-testid="add-manually-test"
          >
            {t('components.wizard.stepThree.chooseCriteria.addManually')}
          </Button>
        </Box>
        <Box>
          {criteriaToRenderNumber > 0 && (
            <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: '700' }}>
              {t('components.wizard.stepThree.chooseCriteria.admissionCriteriaAdded')}
            </Typography>
          )}
          {availableCriteria.map((a) => {
            if (a.code === 'BIRTHDATE' && a.checked === true) {
              return (
                <DateOdBirthCriteriaItem
                  key={a.code}
                  formData={a}
                  action={action}
                  handleCriteriaRemoved={handleCriteriaRemoved}
                  handleFieldValueChanged={handleFieldValueChanged}
                  criteriaToSubmit={criteriaToSubmit}
                  setCriteriaToSubmit={setCriteriaToSubmit}
                />
              );
            }
            if (a.code === 'RESIDENCE' && a.checked === true) {
              return (
                <ResidencyCriteriaItem
                  key={a.code}
                  formData={a}
                  action={action}
                  handleCriteriaRemoved={handleCriteriaRemoved}
                  handleFieldValueChanged={handleFieldValueChanged}
                  criteriaToSubmit={criteriaToSubmit}
                  setCriteriaToSubmit={setCriteriaToSubmit}
                />
              );
            }
            if (a.code === 'ISEE' && a.checked === true) {
              return (
                <IseeCriteriaItem
                  key={a.code}
                  formData={a}
                  action={action}
                  handleCriteriaRemoved={handleCriteriaRemoved}
                  handleFieldValueChanged={handleFieldValueChanged}
                  criteriaToSubmit={criteriaToSubmit}
                  setCriteriaToSubmit={setCriteriaToSubmit}
                  rankingEnabled={rankingEnabled}
                />
              );
            }
            return null;
          })}
          {showMandatoryIseeToast && (
            <Toast
              open={showMandatoryIseeToast}
              title={t(
                'components.wizard.stepThree.chooseCriteria.iseeNotPopulatedOnRankingErrorTitle'
              )}
              message={t(
                'components.wizard.stepThree.chooseCriteria.iseeNotPopulatedOnRankingErrorDescription'
              )}
              onCloseToast={() => {
                setShowMandatoryIseeToast(false);
              }}
              logo={InfoOutlinedIcon}
              leftBorderColor="#FE6666"
              toastColorIcon="#FE6666"
              showToastCloseIcon={true}
            />
          )}
        </Box>
        <Box>
          {manualCriteriaToRender.length > 0 && (
            <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: '700' }}>
              {t('components.wizard.stepThree.chooseCriteria.manualCriteriaAdded')}
            </Typography>
          )}
          {manualCriteriaToRender.map((m) => (
            <ManualCriteria
              key={m.code}
              data={m}
              action={action}
              handleCriteriaRemoved={handleManualCriteriaRemoved}
              manualCriteriaToRender={manualCriteriaToRender}
              setManualCriteriaToRender={setManualCriteriaToRender}
              criteriaToSubmit={criteriaToSubmit}
              setCriteriaToSubmit={setCriteriaToSubmit}
              data-testid="manually-added-test"
            />
          ))}
        </Box>
        {openDraftSavedToast && (
          <Toast
            open={openDraftSavedToast}
            title={t('components.wizard.common.draftSaved')}
            showToastCloseIcon={true}
            onCloseToast={() => setOpenDraftSavedToast(false)}
          />
        )}
      </Paper>
      {/* {criteriaToRenderNumber > 0 && (
        <APIKeyConnectionItem
          action={action}
          apiKeyClientId={apiKeyClientId}
          handleApyKeyClientIdChanged={handleApyKeyClientIdChanged}
          apiKeyClientAssertion={apiKeyClientAssertion}
          handleApyKeyClientAssertionChanged={handleApyKeyClientAssertionChanged}
          handleApiKeyClientDispathed={handleApiKeyClientDispathed}
        />
      )} */}
    </>
  );
};

export default AdmissionCriteria;
