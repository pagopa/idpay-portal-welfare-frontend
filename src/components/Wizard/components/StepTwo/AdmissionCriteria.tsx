import { Box, Button, Paper, Typography } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AvailableCriteria } from '../../../../model/AdmissionCriteria';
import { fetchAdmissionCriteria } from '../../../../services/admissionCriteriaService';
import AdmissionCriteriaModal from './AdmissionCriteriaModal';
import IseeCriteriaItem from './IseeCriteriaItem';
import { mapResponse } from './helpers';
import DateOdBirthCriteriaItem from './DateOfBirthCriteriaItem';
import ResidencyCriteriaItem from './ResidencyCriteriaItem';

type Props = {
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
};

const AdmissionCriteria = ({ action, setAction, currentStep, setCurrentStep }: Props) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [availableCriteria, setAvailableCriteria] = useState(Array<AvailableCriteria>);
  const [criteriaToRender, setCriteriaToRender] = useState(Array<AvailableCriteria>);

  useEffect(() => {
    console.log(action);
    console.log(setAction);
    console.log(currentStep);
    console.log(setCurrentStep);

    fetchAdmissionCriteria()
      .then((response) => {
        const responseData = mapResponse(response);
        setAvailableCriteria([...responseData]);
        setCriteriaToRender([...responseData]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCloseModal = () => setOpenModal(false);

  const handleOpenModal = () => setOpenModal(true);

  const handleCriteriaAdded = () => {
    setOpenModal(false);
    setAvailableCriteria([...criteriaToRender]);
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
        {/* <Button variant="text" sx={{ gridArea: 'addButton' }} onClick={handleManualCriteriaAdded}>
            {t('components.wizard.stepTwo.chooseCriteria.addManually')}
          </Button> */}
      </Box>
      <Box>
        {availableCriteria.map((a) => {
          if (a.code === 'ISEE' && a.checked === true) {
            return (
              <IseeCriteriaItem
                key={a.code}
                formData={a}
                handleCriteriaRemoved={handleCriteriaRemoved}
                handleFieldValueChanged={handleFieldValueChanged}
              />
            );
          }
          if (a.code === 'BIRTHDATE' && a.checked === true) {
            return (
              <DateOdBirthCriteriaItem
                key={a.code}
                formData={a}
                handleCriteriaRemoved={handleCriteriaRemoved}
                handleFieldValueChanged={handleFieldValueChanged}
              />
            );
          }
          if (a.code === 'RESIDENCE' && a.checked === true) {
            return (
              <ResidencyCriteriaItem
                key={a.code}
                formData={a}
                handleCriteriaRemoved={handleCriteriaRemoved}
                handleFieldValueChanged={handleFieldValueChanged}
              />
            );
          }
          return null;
        })}
      </Box>
    </Paper>
  );
};

export default AdmissionCriteria;
