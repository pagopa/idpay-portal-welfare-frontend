import { Box, Button, Paper, Typography } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { WIZARD_ACTIONS } from '../../../../utils/constants';
import { putBeneficiaryRuleService } from '../../../../services/intitativeService';
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
};

const AdmissionCriteria = ({ action, setAction, currentStep, setCurrentStep }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
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

  useEffect(() => {
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
        console.log(error);
      });
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
    const newCriteriaToSubmit: Array<{ code: string; dispatched: boolean }> = [];
    // eslint-disable-next-line sonarjs/no-identical-functions
    criteriaToRender.forEach((c) => {
      if (c.checked === true) {
        // eslint-disable-next-line functional/immutable-data
        newCriteriaToSubmit.push({ code: c.code, dispatched: false });
      }
    });
    setCriteriaToSubmit([...newCriteriaToSubmit]);
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
      manualCriteriaToRender.length > 0 ? manualCriteriaToRender.length + 1 : 1;
    const newManualCriteriaCode = newManualCriteriaIndex.toString();
    setManualCriteriaToRender((prevManualCriteriaToRender) => [
      ...prevManualCriteriaToRender,
      {
        _type: 'boolean',
        description: '',
        boolValue: true,
        multiValue: ['', ''],
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
      setManualCriteriaToRender([...newManualCriteriaToRender]);
      const newCriteriaToSubmit: Array<{ code: string | undefined; dispatched: boolean }> = [];
      criteriaToSubmit.forEach((c) => {
        if (c.code !== codeToRemove) {
          // eslint-disable-next-line functional/immutable-data
          newCriteriaToSubmit.push(c);
        }
      });
      setCriteriaToSubmit([...newCriteriaToSubmit]);
    }
  };

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      // eslint-disable-next-line functional/no-let
      let canBeSubmitted = true;
      if (criteriaToSubmit.length > 0) {
        criteriaToSubmit.forEach((c) => {
          canBeSubmitted = canBeSubmitted && c.dispatched;
        });
      } else {
        canBeSubmitted = false;
      }
      if (canBeSubmitted && typeof initiativeId === 'string') {
        const body = mapCriteriaToSend(criteriaToRender, manualCriteriaToRender);
        putBeneficiaryRuleService(initiativeId, body)
          .then((_response) => {
            dispatch(saveAutomatedCriteria(body.automatedCriteria));
            dispatch(saveManualCriteria(manualCriteriaToRender));
            setAction('');
            setCurrentStep(currentStep + 1);
          })
          .catch((error) => console.log(error));
      }
    } else if (action === WIZARD_ACTIONS.DRAFT) {
      return;
    }
  }, [criteriaToSubmit, action]);

  return (
    <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
      <Box sx={{ py: 3 }}>
        <Typography variant="h6">{t('components.wizard.stepTwo.chooseCriteria.title')}</Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
        <Box sx={{ gridColumn: 'span 12' }}>
          <Typography variant="body1">
            {t('components.wizard.stepTwo.chooseCriteria.subtitle')}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 12' }}>
          <Button size="small" href="" sx={{ p: 0 }}>
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
          gridTemplateAreas: `"criteriaButton addButton . . "`,
          py: 2,
          mb: 8,
        }}
      >
        <Button
          variant="contained"
          sx={{ gridArea: 'criteriaButton' }}
          startIcon={<ListAltIcon />}
          onClick={handleOpenModal}
        >
          {t('components.wizard.stepTwo.chooseCriteria.browse')}
        </Button>
        <AdmissionCriteriaModal
          openModal={openModal}
          handleCloseModal={handleCloseModal}
          handleCriteriaAdded={handleCriteriaAdded}
          criteriaToRender={criteriaToRender}
          setCriteriaToRender={setCriteriaToRender}
        />
        <Button variant="text" sx={{ gridArea: 'addButton' }} onClick={handleManualCriteriaAdded}>
          {t('components.wizard.stepTwo.chooseCriteria.addManually')}
        </Button>
      </Box>
      <Box>
        {criteriaToRenderNumber > 0 && (
          <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: '700' }}>
            {t('components.wizard.stepTwo.chooseCriteria.admissionCriteriaAdded')}
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
            {t('components.wizard.stepTwo.chooseCriteria.manualCriteriaAdded')}
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
          />
        ))}
      </Box>
    </Paper>
  );
};

export default AdmissionCriteria;
