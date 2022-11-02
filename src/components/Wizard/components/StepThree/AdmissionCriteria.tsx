import { Box, Button, Paper, Typography } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { AvailableCriteria } from '../../../../model/AdmissionCriteria';
import { fetchAdmissionCriteria } from '../../../../services/admissionCriteriaService';
import {
  beneficiaryRuleSelector,
  initiativeIdSelector,
  saveAutomatedCriteria,
  saveManualCriteria,
} from '../../../../redux/slices/initiativeSlice';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { ManualCriteriaItem } from '../../../../model/Initiative';
import {
  putBeneficiaryRuleService,
  putBeneficiaryRuleDraftService,
} from '../../../../services/intitativeService';
import { WIZARD_ACTIONS } from '../../../../utils/constants';
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
  const [availableCriteria, setAvailableCriteria] = useState(Array<AvailableCriteria>);
  const [criteriaToRender, setCriteriaToRender] = useState(Array<AvailableCriteria>);
  const [criteriaToRenderNumber, setCriteriaToRenderNumber] = useState(0);
  const [manualCriteriaToRender, setManualCriteriaToRender] = useState(Array<ManualCriteriaItem>);
  const [criteriaToSubmit, setCriteriaToSubmit] = useState(
    Array<{ code: string | undefined; dispatched: boolean }>
  );
  const beneficiaryRule = useAppSelector(beneficiaryRuleSelector);
  const initiativeId = useAppSelector(initiativeIdSelector);
  const setLoading = useLoading('GET_ADMISSION_CRITERIA');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchAdmissionCriteria()
      .then((response) => {
        const responseData = mapResponse(response);
        setAvailableCriteria([...responseData]);
        setCriteriaToRender([...responseData]);

        const { automatedCriteria, selfDeclarationCriteria } = beneficiaryRule;
        const newCriteriaToSubmit: Array<{ code: string; dispatched: boolean }> = [];
        if (automatedCriteria.length > 0) {
          const updatedResponseData: Array<AvailableCriteria> =
            updateInitialAutomatedCriteriaOnSelector(automatedCriteria, responseData);
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

  const handleOpenModal = () => setOpenModal(true);

  const handleCriteriaAdded = () => {
    setOpenModal(false);
    setAvailableCriteria([...criteriaToRender]);
    const newCriteriaToSubmit: Array<{ code: string | undefined; dispatched: boolean }> = [];
    // eslint-disable-next-line sonarjs/no-identical-functions
    criteriaToRender.forEach((c) => {
      if (c.checked === true) {
        // eslint-disable-next-line functional/no-let
        let found = false;
        criteriaToSubmit.forEach((s) => {
          if (s.code === c.code) {
            found = true;
          }
        });
        if (!found) {
          // eslint-disable-next-line functional/immutable-data
          newCriteriaToSubmit.push({ code: c.code, dispatched: false });
        }
      }
    });
    setCriteriaToSubmit([...criteriaToSubmit, ...newCriteriaToSubmit]);
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
    setCriteriaToSubmit([...newCriteriaToSubmit]);
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

  useEffect(() => {
    // eslint-disable-next-line functional/no-let
    let toSubmit = true;
    if (criteriaToSubmit.length > 0) {
      setDisabledNext(false);
      criteriaToSubmit.forEach((c) => {
        toSubmit = toSubmit && c.dispatched;
      });
    } else {
      toSubmit = false;
      setDisabledNext(true);
    }
    if (toSubmit && typeof initiativeId === 'string') {
      const body = mapCriteriaToSend(criteriaToRender, manualCriteriaToRender);
      setLoading(true);
      putBeneficiaryRuleService(initiativeId, body)
        .then((_response) => {
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
    }

    if (action === WIZARD_ACTIONS.DRAFT && typeof initiativeId === 'string') {
      const body = mapCriteriaToSend(criteriaToRender, manualCriteriaToRender);
      setLoading(true);
      putBeneficiaryRuleDraftService(initiativeId, body)
        .then((_response) => {
          dispatch(saveAutomatedCriteria(body.automatedCriteria));
          dispatch(saveManualCriteria(manualCriteriaToRender));
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
  }, [action, criteriaToSubmit]);

  return (
    <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
      <Box sx={{ py: 3 }}>
        <Typography variant="h6">
          {t('components.wizard.stepThree.chooseCriteria.title')}
        </Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
        <Box sx={{ gridColumn: 'span 12' }}>
          <Typography variant="body1">
            {t('components.wizard.stepThree.chooseCriteria.subtitle')}
          </Typography>
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
              />
            );
          }
          return null;
        })}
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
    </Paper>
  );
};

export default AdmissionCriteria;
