import { Box, Button, Paper, Typography } from '@mui/material';
import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { AdmissionCriteriaModel } from '../../../../model/AdmissionCriteria';
import { fetchAdmissionCriteria } from '../../../../services/admissionCriteriaService';
import AdmissionCriteriaModal from './AdmissionCriteriaModal';
import AdmissionCriteriaItem from './AdmissionCriteriaItem';
type Props = {
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
};

const AdmissionCriteria = ({ action, setAction, currentStep, setCurrentStep }: Props) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [criteria, setCriteria] = useState(Array<AdmissionCriteriaModel>);
  const [criteriaChanged, setCriteriaChanged] = useState(false);
  const [criteriaToRender, setCriteriaToRender] = useState(Array<{ id: string; title: string }>);
  const [manualCriteriaNumber, setManualCriteriaNumber] = useState(0);
  const [manualCriteriaToRender, setManualCriteriaToRender] = useState(Array<number>);

  useEffect(() => {
    fetchAdmissionCriteria()
      .then((response) => {
        setCriteria([...response]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCloseModal = () => setOpenModal(false);

  const handleOpenModal = () => setOpenModal(true);

  const handleCriteriaAdded = () => {
    setOpenModal(false);
    setCriteriaChanged(!criteriaChanged);
  };

  const handleCriteriaRemoved = (e: any) => {
    const elementIdToDelete = e.target.dataset.id;
    const newCriteria = criteria.map((c) => {
      if (c.id === elementIdToDelete) {
        return { ...c, checked: false };
      } else {
        return { ...c };
      }
    });
    setCriteria([...newCriteria]);
    criteriaToRender.forEach((c, index) => {
      if (c.id === elementIdToDelete) {
        // eslint-disable-next-line functional/immutable-data
        setCriteriaToRender([...criteriaToRender.splice(index, 0)]);
        setCriteriaChanged(!criteriaChanged);
      }
    });
  };

  const handleManualCriteriaAdded = () => {
    setManualCriteriaNumber((prevManualCriteriaNumber) => prevManualCriteriaNumber + 1);
    setManualCriteriaToRender((prevManualCriteriaToRender) => [
      ...prevManualCriteriaToRender,
      manualCriteriaNumber,
    ]);
  };

  // eslint-disable-next-line arrow-body-style
  const handleManualCriteriaRemoved = (e: any) => {
    if (typeof e.target.dataset.id !== undefined) {
      const elementIdToDelete = parseInt(e.target.dataset.id, 10);
      const newManualCriteriaToRender: Array<number> = [];
      manualCriteriaToRender.forEach((m) => {
        if (m !== elementIdToDelete) {
          // eslint-disable-next-line functional/immutable-data
          newManualCriteriaToRender.push(m);
        }
      });
      setManualCriteriaToRender([...newManualCriteriaToRender]);
    }
  };

  useEffect(() => {
    /* eslint-disable functional/no-let */
    criteria.forEach((c) => {
      let i = 0;
      let notPrinted = true;
      while (notPrinted === true && i < criteriaToRender.length) {
        notPrinted = c.id !== criteriaToRender[i].id ? true : false;
        i++;
      }
      if (notPrinted === true && c.checked === true) {
        // eslint-disable-next-line functional/immutable-data
        setCriteriaToRender((prevCriteriaToRender) => [
          ...prevCriteriaToRender,
          { id: c.id, title: c.title },
        ]);
      }
    });
  }, [criteriaChanged]);

  return (
    <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
      <Box sx={{ py: 3 }}>
        <Typography variant="h6">{t('components.wizard.stepTwo.chooseCriteria.title')}</Typography>
      </Box>
      <form>
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
            criteria={criteria}
            setCriteria={setCriteria}
          />
          <Button variant="text" sx={{ gridArea: 'addButton' }} onClick={handleManualCriteriaAdded}>
            {t('components.wizard.stepTwo.chooseCriteria.addManually')}
          </Button>
        </Box>
        <Box>
          {criteriaToRender.map((c) => (
            <AdmissionCriteriaItem
              key={c.id}
              id={c.id}
              title={c.title}
              handleCriteriaRemoved={handleCriteriaRemoved}
              action={action}
              setAction={setAction}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          ))}
        </Box>
        <Box>
          {manualCriteriaToRender.map((m) => (
            <AdmissionCriteriaItem
              key={m}
              id={m}
              title={`${t('components.wizard.stepTwo.chooseCriteria.form.manual')} ${m + 1}`}
              handleCriteriaRemoved={handleManualCriteriaRemoved}
              action={action}
              setAction={setAction}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          ))}
        </Box>
      </form>
    </Paper>
  );
};

export default AdmissionCriteria;
